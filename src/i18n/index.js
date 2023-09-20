import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import uz from "./uz";
import ru from "./ru.json";
import { localStorage } from "@/utils/window";

// Translations for Russian language
const ruTranslations = ru;
// Translations for Uzbek language
const uzTranslations = uz;

// Initialize i18next with translations
i18n.use(initReactI18next).init({
  resources: {
    ru: ruTranslations,
    uz: uzTranslations,
  },
  lng: localStorage.getItem("selectedLanguage") || "uz",
  fallbackLng: "uz",
  interpolation: {
    escapeValue: false,
  },
});
