export const tField = (obj, field, lang) =>
  lang === "hy" ? obj[`${field}_arm`] : obj[`${field}`];
