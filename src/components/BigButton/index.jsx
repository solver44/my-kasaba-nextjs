import React from "react";
import styles from "./button.module.scss";
import { Button } from "@mui/material";

export default function BigButton({
  Icon,
  disabled,
  children,
  onClick,
  green,
}) {
  return (
    <Button
      disabled={disabled}
      disableElevation
      className={styles.wrapper}
      variant="contained"
      color={green}
      onClick={onClick}
    >
      {Icon && <Icon htmlColor="white" />}
      {children}
    </Button>
    // <div onClick={onClick} className={styles.wrapper}>
    //   {Icon && <Icon htmlColor="var(--button-color)" />}
    //   {children}
    // </div>
  );
}
