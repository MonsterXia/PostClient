import { useEffect, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import remarkGfm from "remark-gfm";
import { toc } from "mdast-util-toc";
import { visit } from "unist-util-visit";
import { Root } from "mdast";

import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";
import "./ServerRules.css"

function remarkTocPlugin() {
    return (tree: Root) => {
        visit(tree, "text", (node, index, parent) => {
            if (node.value === "[TOC]" && index !== undefined && parent) {
                const result = toc(tree, { maxDepth: 3 });

                if (result.map && parent.type === "paragraph") {
                    // Mark the TOC list so CSS can target it
                    result.map.data = {
                        ...result.map.data,
                        hProperties: {
                            ...result.map.data?.hProperties,
                            className: "toc-list",
                        },
                    };
                    const parentIndex = tree.children.indexOf(parent);
                    if (parentIndex >= 0) {
                        tree.children.splice(parentIndex, 1, result.map);
                    }
                }
            }
        });
    };
}

function remarkRemovePageBreak() {
    return (tree: Root) => {
        visit(tree, "html", (node, index, parent) => {
            if (
                typeof node.value === "string" &&
                node.value.trim() ===
                '<div style="page-break-after:always;"></div>' &&
                index !== undefined &&
                parent
            ) {
                parent.children.splice(index, 1);
            }
        });
    };
}

const components: Components = {
    pre: ({ children, ...props }) => {
        return <pre className="code-block" {...props}>{children}</pre>;
    },
    code: ({ children, className, ...props }) => {
        const isInline = !className;
        if (isInline) {
            return <code className="inline-code" {...props}>{children}</code>;
        }
        return <code className={className} {...props}>{children}</code>;
    }
};

function ServerRules() {
    const [markdown, setMarkdown] = useState<string>("")
    useEffect(() => {
        const loadMarkdown = async() => {
            try {
                const response = await fetch("/rules/rule.md")
                const text = await response.text()
                setMarkdown(text)
            } catch (error) {
                console.error(error)
            }
        }

        loadMarkdown()
    },[])

    return (
        <div className="server-rules">
            <ReactMarkdown
                rehypePlugins={[rehypeHighlight, rehypeSlug, rehypeKatex]}
                remarkPlugins={[remarkMath, remarkGfm, remarkTocPlugin, remarkRemovePageBreak]}
                components={components}
            >
                {markdown}
            </ReactMarkdown>
        </div>
    )
}

export default ServerRules
