import styles from "./input.module.scss";
import React, { useEffect, useRef, useState } from "react";
import ReactInputMask from "react-input-mask";
import areEqual from "../../utils/areEqual";
import { useTranslation } from "react-i18next";
import { TextField, styled } from "@mui/material";
import NumberInput from "../NumberInput";

function Input({
  titleText,
  textarea,
  containerStyle = {},
  fullWidth,
  name = "",
  className,
  maxLength,
  value,
  useMask,
  mask = "+998 xx xxx xx xx",
  emailRequired,
  standart,
  validation,
  invalid = false,
  validationError = "invalid-input",
  onChange,
  ...props
}) {
  const [isMask, setMask] = useState(useMask);
  const isEmail = useRef(emailRequired);
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  useEffect(() => {
    if (invalid) {
      setError(t(validationError));
    } else {
      setError(null);
    }
  }, [invalid]);

  useEffect(() => {
    setCurrentValue(value ?? "");
  }, [value]);

  useEffect(() => {
    if (typeof value !== "undefined") {
      if (!onChange) return;
      onChange({ target: { value } }, name);
    }
    if (name.toLowerCase().includes("phone")) {
      setMask(true);
    }
    if (name.toLowerCase().includes("email")) {
      isEmail.current = true;
    }
  }, []);

  const onChangeFunc = (e) => {
    const inputValue = e.target.value;
    if (maxLength && inputValue.length > maxLength) return;

    setCurrentValue(inputValue);
    // Email validation
    if (validation && !validation(inputValue)) {
      setError(t(validationError));
      return;
    } else if (isEmail.current && !validateEmail(inputValue)) {
      setError(t("invalid-email"));
      return;
    }
    setError(false);
    if (!onChange) return;
    onChange(e, name);
  };

  return titleText ? (
    <div style={containerStyle} className={styles.wrapper}>
      <label
        className={[
          styles.label,
          textarea ? styles.textarea : "",
          fullWidth ? styles.full : "",
        ].join(" ")}
      >
        <span>{titleText}</span>
        <InsideInput
          textarea={textarea}
          onChangeFunc={onChangeFunc}
          maxLength={maxLength}
          className={className}
          value={currentValue}
          standart={standart}
          mask={isMask ? mask : ""}
          name={name.toLowerCase()}
          invalid={invalid ? t(validationError) : error}
          {...props}
        />
      </label>
    </div>
  ) : (
    <InsideInput
      textarea={textarea}
      onChangeFunc={onChangeFunc}
      maxLength={maxLength}
      className={className}
      value={currentValue}
      standart={standart}
      mask={isMask ? mask : ""}
      invalid={invalid ? t(validationError) : error}
      name={name.toLowerCase()}
      {...props}
    />
  );
}

function convertMask(mask) {
  const convertedMask = mask
    .replace(/9/g, "\\9") // Replace all "9" with "\9"
    .replace(/x/g, "9"); // Replace all "x" with "9"

  return convertedMask;
}
const validateEmail = (email) => {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const InsideInput = React.memo(
  ({
    textarea,
    onChangeFunc,
    maxLength,
    className,
    value,
    mask,
    invalid,
    standart,
    disabled,
    name,
    maxValue,
    minValue = 0,
    type,
    end,
    ...props
  }) => {
    const formattedMask = mask ? convertMask(mask) : mask; // Convert the mask
    const numberValue =
      typeof value === "undefined" ? 0 : type === "number" ? +value : 0;

    function getType(name) {
      if (name.includes("phone")) return "phone";
      else if (name.includes("email")) return "email";
      return "text";
    }
    return type === "number" ? (
      <NumberInput
        value={numberValue}
        onChange={onChangeFunc}
        max={maxValue}
        min={minValue}
        disabled={disabled}
        end={end}
      />
    ) : !textarea ? (
      <ReactInputMask
        mask={formattedMask}
        value={value}
        onChange={onChangeFunc}
        disabled={disabled}
        type={getType(name)}
      >
        {(inputProps) => (
          <TextField
            id="outlined-basic"
            variant={standart ? "standard" : "outlined"}
            onChange={onChangeFunc}
            className={[
              className,
              styles.input,
              disabled ? styles.disabled : "",
              !!invalid ? styles.invalid : "",
            ].join(" ")}
            {...inputProps}
            error={!!invalid}
            helperText={invalid}
            maxLength={maxLength}
            value={value}
            disabled={disabled}
            {...props}
          />
        )}
      </ReactInputMask>
    ) : (
      <textarea
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        onChange={onChangeFunc}
        className={[styles.input, className, styles.textarea_input].join(" ")}
        rows={7}
      />
    );
  },
  areEqual
);

export default React.memo(Input, areEqual);
