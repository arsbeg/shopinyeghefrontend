import { useLang } from "../context/LanguageContext";
import { translations } from "./translations";

export const useTranslate = () => {
  const { lang } = useLang();

  const t = (key) => translations[lang][key] || key;

  return t;
};
