import type { Root } from 'mdast';
import type { PluggableList } from 'unified';
import { toc } from 'mdast-util-toc';

export function remarkToc() {
    return (tree: Root) => {
        const index = tree.children.findIndex((node) =>
            node.type === 'paragraph' && node.children.length === 1 &&
            node.children[0].type === 'text' && node.children[0].value === '[TOC]',
        );
        if (index < 0) return;
        const result = toc(tree, { maxDepth: 3 });
        if (result.map) {
            result.map.data = { ...result.map.data, hProperties: { className: 'toc-list' } };
            tree.children.splice(index, 1, result.map);
        }
    };
}

export async function loadPlugins(markdown: string) {
    const [{ default: gfm }, { default: slug }] = await Promise.all([
        import('remark-gfm'), import('rehype-slug'),
    ]);
    const remarkPlugins: PluggableList = [gfm, remarkToc];
    const rehypePlugins: PluggableList = [slug];
    // Load math support only for documents that can contain math.
    if (markdown.includes('$')) {
        const [{ default: math }, { default: katex }] = await Promise.all([
            import('remark-math'), import('rehype-katex'), import('katex/dist/katex.min.css'),
        ]);
        remarkPlugins.push(math);
        rehypePlugins.push(katex);
    }
    if (/^\s*(?:`{3,}|~{3,})(?!text\b|plain(?:text)?\b)[a-z][\w+-]*/im.test(markdown)) {
        const [{ default: highlight }] = await Promise.all([
            import('rehype-highlight'), import('highlight.js/styles/github.css'),
        ]);
        rehypePlugins.push([highlight, { ignoreMissing: true }]);
    }
    return { remarkPlugins, rehypePlugins };
}
