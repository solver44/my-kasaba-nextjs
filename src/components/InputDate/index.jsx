import React, { useEffect } from "react";
import styles from "./inputDate.module.scss";
import { DatePicker } from "@mui/x-date-pickers";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

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
  disabled,
}) {
  const { t } = useTranslation();
  const onChangeFunc = (e) => {
    if (!e) return;
    const value = e.format("YYYY-MM-DD");
    if (!onChange) return;
    onChange({ target: { value } }, name);
  };

  useEffect(() => {
    if (!dayjs.isDayjs(value)) return;
    onChangeFunc(value);
  }, [value]);

  return titleText ? (
    <div style={containerStyle} className={styles.wrapper}>
      <label className={[styles.label, fullWidth ? styles.full : ""].join(" ")}>
        <span>{titleText}</span>
        <InsideInput
          value={value}
          name={name}
          disabled={disabled}
          invalid={invalid && t(validationError)}
          onChangeFunc={onChangeFunc}
          className={className}
        />
      </label>
    </div>
  ) : (
    <InsideInput
      value={value}
      disabled={disabled}
      name={name}
      invalid={invalid && t(validationError)}
      onChangeFunc={onChangeFunc}
      className={className}
    />
  );
}

const InsideInput = ({
  value,
  onChangeFunc,
  disabled,
  name,
  invalid,
  className,
}) => (
  <DatePicker
    maxDate={name.includes("birth") ? dayjs().add(-18, "year") : null}
    format="DD.MM.YYYY"
    disabled={disabled}
    value={value == "Invalid Date" || !value ? null : value}
    slotProps={{
      textField: {
        color: "error",
        error: true,
        helperText: invalid,
      },
    }}
    onChange={onChangeFunc}
    className={[
      styles.input,
      className,
      invalid ? styles.invalid : "",
      disabled ? styles.disabled : "",
    ].join(" ")}
  />
);
