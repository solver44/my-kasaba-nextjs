import React, { useRef, useState } from "react";
import styles from "./changableInput.module.scss";
import Input from "../Input";
import { MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";
import InputDate from "../InputDate";

export default function ChangableInput({
  editable = false,
  onChange,
  value,
  label,
  date,
  invalid,
  select,
  dataSelect = [],
  name,
  ...props
}) {
  const language = useTranslation().i18n.language;
  const [text, setText] = useState(value || null);
  function onChangeFunc({ target }) {
    if (!onChange) return;
    onChange({ target: { value: target.value } }, name);
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      {!editable ? (
        <span className={styles.content}>{text}</span>
      ) : date ? (
        <InputDate
          name={name}
          onChange={onChangeFunc}
          invalid={invalid}
          value={text}
          {...props}
        />
      ) : select ? (
        <Select
          name={name}
          onChange={onChangeFunc}
          displayEmpty
          value={value}
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
      ) : (
        <Input
          className={styles.input}
          onChange={(e) => {
            setText(e.target.value);
            if (onChange) onChange(e.target.value);
          }}
          invalid={invalid}
          value={text}
          name={name}
          {...props}
        />
      )}
    </div>
  );
}
