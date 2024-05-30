// utils/sanitizeHtml.ts
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

export const sanitizeHtml = (html: string) => {
  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(html);
  }
  return html;
};
