import React, { useEffect, useRef, useState } from "react";
import styles from "./radioGroup.module.scss";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useController, useFormContext } from "react-hook-form";

function RadioGroups({
  onChange,
  defaultValue,
  row = true,
  data,
  name,
  required,
  value: propValue,
  label,
}) {
  const { control, setValue } = useFormContext() ?? { control: false };
  const { field } = !control
    ? { field: { value: propValue, name } }
    : useController({
        name: name ?? "",
        control,
        rules: { required: !!required },
      });

  function onChangeFunc(e) {
    if (onChange) onChange(e, name);
    if (field.onChange) field.onChange(e, name);
  }

  useEffect(() => {
    if (typeof propValue === undefined) return;
    setValue(name, propValue);
    if (onChange) onChange({ target: { value: propValue } }, name);
    if (field.onChange) field.onChange({ target: { value: propValue } }, name);
  }, [propValue]);

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      <RadioGroup
        style={{ justifyContent: "center", gap: 30 }}
        defaultValue={defaultValue}
        value={field.value ?? ""}
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

export default React.memo(RadioGroups);
