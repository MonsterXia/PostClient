import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug";

import remarkGfm from "remark-gfm";
import { toc } from "mdast-util-toc";
import { visit } from "unist-util-visit";
import { Root } from "mdast";

import "./ServerRules.css"

function remarkTocPlugin() {
    return (tree: Root) => {
        visit(tree, "text", (node:any, index, parent) => {
            if (node.value === "[TOC]") {
                const result = toc(tree, { maxDepth: 3 });

                if (result.map) {
                    if (parent.type === "paragraph") {
                        // 如果父节点是段落，将目录插入到父节点的外层
                        const grandParent = tree; // 假设父节点的父节点是根节点
                        const parentIndex = grandParent.children.indexOf(parent);
                        grandParent.children.splice(parentIndex, 1, result.map);
                    } else {
                        // 替换 [TOC] 节点为目录
                        parent.children.splice(index, 1, result.map);
                    }
                }
            }
        });
    };
}

function remarkRemovePageBreak() {
    return (tree: Root) => {
        visit(tree, "html", (node: any, index, parent) => {
            if (
                typeof node.value === "string" &&
                node.value.trim() ===
                '<div style="page-break-after:always;"></div>'
            ) {
                parent.children.splice(index, 1); // 删除该节点
            }
        });
    };
}

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
                rehypePlugins={[rehypeHighlight, rehypeSlug]}
                remarkPlugins={[remarkGfm, remarkTocPlugin, remarkRemovePageBreak]}
            >
                {markdown}
            </ReactMarkdown>
        </div>
    )
}

export default ServerRules