import { useEffect } from "react";

/**
 * Sets document.title and the meta[name="description"] tag for the current page.
 * Restores previous values on unmount.
 */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    return () => {
      document.title = prev;
    };
  }, [title]);

  useEffect(() => {
    if (!description) return;
    let tag = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;
    const created = !tag;
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    const prev = tag.content;
    tag.content = description;
    return () => {
      if (created) {
        tag?.remove();
      } else if (tag) {
        tag.content = prev;
      }
    };
  }, [description]);
}
