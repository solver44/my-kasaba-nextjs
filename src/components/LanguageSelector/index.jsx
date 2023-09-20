// LanguageSelector.js
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSelector.module.scss";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { localStorage } from "@/utils/window";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem("selectedLanguage") || i18n.language
  );

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage, i18n]);

  const handleChangeLanguage = (_lang) => {
    let newLanguage = _lang.value;
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
    localStorage.setItem("selectedLanguage", newLanguage);
  };

  const languageOptions = [
    { value: "uz", label: "O'zbekcha" },
    { value: "ru", label: "Русский" },
  ];

  return (
    <Dropdown
      controlClassName={styles.languageSelector}
      value={currentLanguage}
      onChange={handleChangeLanguage}
      options={languageOptions}
    />
  );
};

export default LanguageSelector;
