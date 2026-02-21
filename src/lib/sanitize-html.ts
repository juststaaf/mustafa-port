import sanitizeHtml from "sanitize-html";

const SAFE_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a"
];

export function sanitizeRichHtml(content: string) {
  return sanitizeHtml(content, {
    allowedTags: SAFE_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel"]
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {},
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href || "";
        const safeHref =
          href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")
            ? href
            : "#";

        return {
          tagName,
          attribs: {
            href: safeHref,
            target: "_blank",
            rel: "noopener noreferrer"
          }
        };
      }
    }
  });
}
