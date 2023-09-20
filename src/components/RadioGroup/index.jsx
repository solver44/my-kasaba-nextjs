import React, { useRef, useState } from "react";
import styles from "./radioGroup.module.scss";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

export default function RadioGroups({
  onChange,
  defaultValue,
  row = true,
  data,
  name,
  label,
}) {
  function onChangeFunc(e) {
    if (!onChange) return;
    onChange(e, name);
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      <RadioGroup
        style={{ justifyContent: "center", gap: 30 }}
        defaultValue={defaultValue}
        row={row}
        onChange={onChangeFunc}
      >
        {data.map((radio) => (
          <FormControlLabel
            key={radio.value}
            value={radio.value}
            control={<Radio />}
            label={radio.label}
          />
        ))}
      </RadioGroup>
    </div>
  );
}
