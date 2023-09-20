import { Button, CircularProgress } from "@mui/material";
import Input from "../Input";
import styles from "./inputButton.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";

export default function InputButton({
  titleText,
  buttonText,
  onChange,
  onClick,
  maxLength,
  request,
  onResponse,
  invalid: _invalid,
  name,
  validationError,
  fullWidth = false,
}) {
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(_invalid ?? false);
  const value = useRef("");
  useEffect(() => {
    setInvalid(_invalid ?? false);
  }, [_invalid]);
  async function onClickFunc() {
    if (onClick) onClick();
    if (!request) return;
    setLoading(true);
    const data = await request(value.current);
    if (!data?.data?.success) {
      setInvalid(data?.message || true);
    }
    setLoading(false);
    if (!onResponse) return;
    onResponse(data?.data || data, data?.status);
  }

  function onChangeFunc(e) {
    if (onChange) onChange(e, name);
    value.current = e.target.value;
  }

  return (
    <div className={styles.wrapper}>
      {titleText && <label className={styles.label}>{titleText}</label>}
      <div className={[styles.row, fullWidth ? styles.full : ""].join(" ")}>
        <Input
          maxLength={maxLength}
          name={name}
          onChange={onChangeFunc}
          validationError={validationError}
          invalid={invalid}
          className={styles.input}
        />
        <LoadingButton
          onClick={onClickFunc}
          // disabled={loading}
          disableElevation
          variant="contained"
          loading={loading}
          className={styles.button}
        >
          {buttonText}
        </LoadingButton>
      </div>
    </div>
  );
}
