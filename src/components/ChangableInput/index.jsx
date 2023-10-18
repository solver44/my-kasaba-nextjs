import React, { useState } from "react";
import styles from "./changableInput.module.scss";
import Input from "../Input";
import { MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";
import InputDate from "../InputDate";
import { UploadRounded } from "@mui/icons-material";

export default function ChangableInput({
  editable = true,
  onChange,
  value: propValue,
  label,
  required,
  date,
  invalid,
  select,
  fileInput,
  dataSelect = [],
  name,
  ...props
}) {
  const value = propValue || undefined;
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [fileName, setFileName] = useState("");
  function onChangeFunc({ target }) {
    if (!onChange) return;
    onChange({ target: { value: target.value } }, name);
  }

  function handleFileInputChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    const nameOfFile = file.name ? file.name : "NOT SUPPORTED";
    setFileName(nameOfFile);
    // Pass the selected file to the onChange function
    if (!onChange) return;
    onChange(file, name);
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        {label}
        {required ? <span className="red"> *</span> : ""}
      </label>
      {!editable ? (
        <span className={styles.content}>{value}</span>
      ) : date ? (
        <InputDate
          name={name}
          onChange={onChangeFunc}
          invalid={invalid}
          value={value}
          {...props}
        />
      ) : select ? (
        <Select
          name={name}
          onChange={onChangeFunc}
          displayEmpty
          value={propValue ?? -1}
          className={[
            styles.select,
            props.disabled ? styles.disabled : "",
            invalid ? styles.invalid : "",
          ].join(" ")}
          {...props}
        >
          {dataSelect.map((current) => (
            <MenuItem key={current.value} value={current.value}>
              {language === "uz" ? current.label : current?.labelRu}
            </MenuItem>
          ))}
        </Select>
      ) : fileInput ? (
        <label
          className={[
            styles.fileInputLabel,
            invalid ? styles.invalid : "",
          ].join(" ")}
        >
          <input
            type="file"
            accept="*/*"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />
          <div className={styles.fileInput}>{fileName}</div>
          <UploadRounded
            style={{ cursor: "pointer" }}
            className={styles.cloudIcon}
          />
          {invalid && (
            <div className={styles.invalid_title}>{t("invalid-input")}</div>
          )}
        </label>
      ) : (
        <Input
          className={styles.input}
          onChange={(e) => {
            if (onChange) onChange(e, name);
          }}
          invalid={invalid}
          value={value}
          name={name}
          {...props}
        />
      )}
    </div>
  );
}
