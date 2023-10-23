import React, { useState } from "react";
import styles from "./changableInput.module.scss";
import Input from "../Input";
import { Box, Chip, MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";
import InputDate from "../InputDate";
import { UploadRounded } from "@mui/icons-material";
import dayjs from "dayjs";

function getStyles(currentData, allData) {
  const isSelected = allData.find((a) => a?.value == currentData?.value);
  return {
    fontWeight: isSelected ? "600" : "normal",
    background: isSelected ? "aliceblue" : "white",
  };
}

export default function ChangableInput({
  editable = true,
  onChange,
  value: propValue,
  label,
  required,
  multiple,
  date,
  invalid,
  select,
  fileInput,
  nameOfFile,
  dataSelect = [],
  name,
  ...props
}) {
  let value = propValue || undefined;
  if (date && !dayjs.isDayjs(propValue) && value) value = dayjs(value);

  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [fileName, setFileName] = useState(nameOfFile ?? "");
  const [values, setValues] = useState([]);
  function onChangeFunc({ target }) {
    if (multiple) {
      const selectedValues = target.value || [];
      const currentValue =
        selectedValues.length > 1
          ? selectedValues[selectedValues.length - 1]
          : null;
      setValues(
        dataSelect.filter((d) => {
          let checkValue = selectedValues.find(
            (s) => s?.value == currentValue
          )?.value;

          if (d.value == checkValue) return false;
          else return selectedValues.find((s) => (s?.value || s) == d.value);
        })
      );
    }
    if (!onChange) return;
    onChange({ target }, name);
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
          multiple={!!multiple}
          onChange={onChangeFunc}
          displayEmpty
          value={propValue ?? (multiple ? values : -1)}
          className={[
            styles.select,
            props.disabled ? styles.disabled : "",
            invalid ? styles.invalid : "",
          ].join(" ")}
          renderValue={
            multiple &&
            ((selected) => {
              if (!selected?.length) return null;
              return (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected ?? []).map((t) => (
                    <Chip key={t.value} label={t.label} />
                  ))}
                </Box>
              );
            })
          }
          {...props}
        >
          {dataSelect.map((current) => (
            <MenuItem
              key={current.value}
              value={current.value}
              style={getStyles(current, values)}
            >
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
          <div className={styles.fileInput}>{fileName || nameOfFile}</div>
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
