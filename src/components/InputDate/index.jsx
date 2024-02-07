import React, { useEffect, useRef, useState } from "react";
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
  maxDate,
  minDate,
  openTo,
}) {
  const { t } = useTranslation();
  const onChangeFunc = (e) => {
    if (!e) return;
    const value = e
      ? e.format(openTo === "year" ? "YYYY" : "YYYY-MM-DD")
      : null;
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
          maxDate={maxDate}
          minDate={minDate}
          openTo={openTo}
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
      maxDate={maxDate}
      minDate={minDate}
      openTo={openTo}
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
  maxDate,
  minDate,
  openTo,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  useEffect(() => {
    setInternalValue(value);
  }, [value]);
  const mxDate =
    maxDate ?? (name.includes("birth") ? dayjs().add(-18, "year") : dayjs());

  const handleDateChange = (selectedDate) => {
    if (selectedDate && selectedDate.year() > 1000) {
      if (mxDate && selectedDate.isAfter(mxDate)) {
        setInternalValue(mxDate);
        onChangeFunc(mxDate);
        return;
      }
      if (minDate && selectedDate.isBefore(minDate)) {
        setInternalValue(undefined);
        onChangeFunc(undefined);
        return;
      }
    }
    onChangeFunc(selectedDate);
  };

  return (
    <DatePicker
      maxDate={mxDate}
      minDate={minDate}
      format={openTo === "year" ? "YYYY" : "DD.MM.YYYY"}
      views={openTo === "year" ? ["year"] : undefined}
      disabled={disabled}
      value={
        internalValue == "Invalid Date" || !internalValue ? null : internalValue
      }
      slotProps={{
        textField: {
          color: "error",
          error: true,
          helperText: invalid,
        },
      }}
      onChange={handleDateChange}
      className={[
        styles.input,
        className,
        invalid ? styles.invalid : "",
        disabled ? styles.disabled : "",
      ].join(" ")}
    />
  );
};
