"use client";

import React from "react";

type MarkdownProps = {
  content: string;
};

// Basic markdown to JSX parser
const parseMarkdown = (markdown: string): React.ReactNode[] => {
  const lines = markdown.split("\n");
  const elements: React.ReactNode[] = [];
  let listType: "ul" | "ol" | null = null;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      if (listType === "ul") {
        elements.push(<ul key={elements.length} className="list-disc pl-5 space-y-1">{listItems}</ul>);
      } else if (listType === "ol") {
        elements.push(<ol key={elements.length} className="list-decimal pl-5 space-y-1">{listItems}</ol>);
      }
      listItems = [];
      listType = null;
    }
  };

  lines.forEach((line, index) => {
    // Headers
    if (line.startsWith("# ")) {
      flushList();
      elements.push(<h1 key={index} className="text-2xl font-bold mt-4 mb-2">{line.substring(2)}</h1>);
      return;
    }
    if (line.startsWith("## ")) {
      flushList();
      elements.push(<h2 key={index} className="text-xl font-semibold mt-3 mb-1">{line.substring(3)}</h2>);
      return;
    }
    if (line.startsWith("### ")) {
      flushList();
      elements.push(<h3 key={index} className="text-lg font-semibold mt-2 mb-1">{line.substring(4)}</h3>);
      return;
    }

    // Unordered list
    if (line.startsWith("* ") || line.startsWith("- ")) {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      const itemContent = line.substring(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      listItems.push(<li key={index} dangerouslySetInnerHTML={{ __html: itemContent }}></li>);
      return;
    }

    // Ordered list
    if (line.match(/^\d+\.\s/)) {
        if (listType !== 'ol') {
            flushList();
            listType = 'ol';
        }
        const itemContent = line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        listItems.push(<li key={index} dangerouslySetInnerHTML={{ __html: itemContent }}></li>);
        return;
    }

    flushList();

    // Paragraphs and bold text
    if (line.trim() === "") {
      elements.push(<br key={index} />);
    } else {
      const paragraphContent = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      elements.push(<p key={index} dangerouslySetInnerHTML={{ __html: paragraphContent }}></p>);
    }
  });

  flushList();
  return elements;
};

export function Markdown({ content }: MarkdownProps) {
  const parsedContent = parseMarkdown(content);
  return <div className="space-y-2">{parsedContent}</div>;
}
