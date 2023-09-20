import { MenuItem, Select } from "@mui/material";
import styles from "./dropDown.module.scss";
import React from "react";
import { useTranslation } from "react-i18next";

export default function DropDown({
  titleText,
  loading,
  onChange,
  name,
  invalid,
  value,
  validationError = "invalid-input",
  fullWidth = false,
  data = [],
}) {
  const language = useTranslation().i18n.language;
  function onChangeFunc({ target }) {
    if (!onChange) return;
    onChange({ target: { value: target.value } }, name);
  }

  return (
    <div className={styles.wrapper}>
      {titleText && <label className={styles.label}>{titleText}</label>}
      <div className={[styles.row, fullWidth ? styles.full : ""].join(" ")}>
        <Select
          name={name}
          onChange={onChangeFunc}
          displayEmpty
          value={value}
          className={[styles.input, invalid ? styles.invalid : ""].join(" ")}
        >
          {data.map((current) => (
            <MenuItem key={current.value} value={current.value}>
              {language === "uz" ? current.label : current?.labelRu}
            </MenuItem>
          ))}
        </Select>
      </div>
    </div>
  );
}
