import React from "react";
import styles from "./inputDate.module.scss";
import { DatePicker } from "@mui/x-date-pickers";
import { useTranslation } from "react-i18next";

export default function InputDate({
  titleText,
  className,
  onChange,
  value,
  containerStyle,
  invalid,
  validationError = "invalid-input",
  name,
  fullWidth,
}) {
  const { t } = useTranslation();
  const onChangeFunc = (e) => {
    if (!e) return;
    const value = e.format("YYYY-MM-DD");
    if (!onChange) return;
    onChange({ target: { value } }, name);
  };

  return titleText ? (
    <div style={containerStyle} className={styles.wrapper}>
      <label className={[styles.label, fullWidth ? styles.full : ""].join(" ")}>
        <span>{titleText}</span>
        <InsideInput
          value={value}
          invalid={invalid && t(validationError)}
          onChangeFunc={onChangeFunc}
          className={className}
        />
      </label>
    </div>
  ) : (
    <InsideInput
      value={value}
      invalid={invalid && t(validationError)}
      onChangeFunc={onChangeFunc}
      className={className}
    />
  );
}

const InsideInput = ({ value, onChangeFunc, invalid, className }) => (
  <DatePicker
    format="DD.MM.YYYY"
    value={value}
    slotProps={{
      textField: {
        color: "error",
        error: true,
        helperText: invalid,
      },
    }}
    onChange={onChangeFunc}
    className={[styles.input, className, invalid ? styles.invalid : ""].join(
      " "
    )}
  />
);
