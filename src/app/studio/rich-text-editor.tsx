"use client";

import { useRef, useState } from "react";

type RichTextEditorProps = {
  name: string;
  defaultValue?: string;
};

const toolbarButtons: Array<{ label: string; command: string; value?: string }> = [
  { label: "B", command: "bold" },
  { label: "I", command: "italic" },
  { label: "H2", command: "formatBlock", value: "h2" },
  { label: "UL", command: "insertUnorderedList" },
  { label: "OL", command: "insertOrderedList" },
  { label: "Link", command: "createLink", value: "https://" }
];

export function RichTextEditor({ name, defaultValue = "" }: RichTextEditorProps) {
  const [value, setValue] = useState(defaultValue);
  const editorRef = useRef<HTMLDivElement>(null);

  const runCommand = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    if (command === "createLink") {
      const url = window.prompt("Enter URL", commandValue || "https://");
      if (!url) {
        return;
      }
      document.execCommand(command, false, url);
    } else {
      document.execCommand(command, false, commandValue);
    }
    setValue(editorRef.current?.innerHTML || "");
  };

  return (
    <div className="rich-editor">
      <div className="rich-editor-toolbar">
        {toolbarButtons.map((button) => (
          <button
            key={`${name}-${button.label}`}
            type="button"
            onClick={() => runCommand(button.command, button.value)}
          >
            {button.label}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        className="rich-editor-surface"
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: defaultValue }}
        onInput={() => setValue(editorRef.current?.innerHTML || "")}
      />
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
