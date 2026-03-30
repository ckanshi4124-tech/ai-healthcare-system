// src/utils/sanitize.js
export const sanitizeText = (text = "") =>
  text.replace(/[<>]/g, "").trim();

export const sanitizeObject = (obj = {}) => {
  const cleaned = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "string") {
      cleaned[key] = sanitizeText(value);
    } else {
      cleaned[key] = value;
    }
  });
  return cleaned;
};
