import Cookies from "js-cookie";
import i18n from "./i18n";

export const toInputDate = (value?: string) => {
  if (!value) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

export const formatDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleDateString("de-DE");
};

export const changeTranslation = () => {
  const clientLng = i18n.language;

  if (clientLng === "en") {
    i18n.changeLanguage("de");
    Cookies.set("language", "de");
  } else if (clientLng === "de") {
    i18n.changeLanguage("en");
    Cookies.set("language", "en");
  } else {
    alert("Cannot change language.");
  }
};
