import assert from 'node:assert/strict';
import test from 'node:test';
import type { Root } from 'mdast';
import { remarkToc } from '../src/pages/rules/markdown.ts';

const heading = (depth: 1 | 2 | 3 | 4, value: string) => ({
    type: 'heading' as const, depth, children: [{ type: 'text' as const, value }],
});
const marker = () => ({ type: 'paragraph' as const, children: [{ type: 'text' as const, value: '[TOC]' }] });

test('directory links use heading slugs and omit fourth-level headings', () => {
    const tree: Root = { type: 'root', children: [heading(1, '规则'), marker(), heading(2, '七、弹劾'), heading(3, '条件'), heading(4, '案例')] };
    remarkToc()(tree);
    const directory = tree.children[1];
    assert.equal(directory.type, 'list');
    assert.deepEqual(directory.data?.hProperties, { className: 'toc-list' });
    const serialized = JSON.stringify(directory);
    assert(serialized.includes('#七弹劾'));
    assert(serialized.includes('#条件'));
    assert(!serialized.includes('案例'));
    assert.equal(tree.children.length, 5);
});

test('embedded TOC text remains ordinary paragraph content', () => {
    const tree: Root = { type: 'root', children: [heading(1, '规则'), {
        type: 'paragraph', children: [{ type: 'text', value: '[TOC]' }, { type: 'emphasis', children: [{ type: 'text', value: '说明' }] }],
    }, heading(2, '章节')] };
    const before = structuredClone(tree);
    remarkToc()(tree);
    assert.deepEqual(tree, before);
});

test('documents without a directory marker remain unchanged', () => {
    const tree: Root = { type: 'root', children: [heading(1, '规则'), heading(2, '章节')] };
    const before = structuredClone(tree);
    remarkToc()(tree);
    assert.deepEqual(tree, before);
});

test('empty documents are supported', () => {
    const tree: Root = { type: 'root', children: [] };
    remarkToc()(tree);
    assert.deepEqual(tree.children, []);
});
