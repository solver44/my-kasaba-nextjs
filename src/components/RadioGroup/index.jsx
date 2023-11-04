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
  left,
  value: propValue,
  label,
  contained,
}) {
  const { control, setValue } = useFormContext() ?? { control: false };
  const { field } = !control
    ? { field: { value: propValue, name } }
    : useController({
        name: name ?? "",
        control,
        rules: { required: !!required },
      });

  useEffect(() => {
    if (typeof defaultValue === "undefined") return;
    if (onChange) onChange({ target: { value: defaultValue } }, name);
    if (field.onChange)
      field.onChange({ target: { value: defaultValue } }, name);
  }, [defaultValue]);

  function onChangeFunc(e) {
    if (contained) {
      const vl = e.target.checked ? e.target.value : defaultValue;
      e.target.value = vl;
    }
    if (onChange) onChange(e, name);
    if (field.onChange) field.onChange(e, name);
  }

  useEffect(() => {
    if (typeof propValue === "undefined") return;
    if (setValue) setValue(name, propValue);
    if (onChange) onChange({ target: { value: propValue } }, name);
    if (field.onChange) field.onChange({ target: { value: propValue } }, name);
  }, [propValue]);

  return (
    <div className={styles.wrapper}>
      {!contained && label && <label className={styles.label}>{label}</label>}
      <RadioGroup
        style={
          contained
            ? { gap: 15, flexWrap: "nowrap" }
            : { justifyContent: left ? "left" : "center", gap: 30 }
        }
        defaultValue={defaultValue}
        value={field.value ?? ""}
        row={row}
        onChange={onChangeFunc}
      >
        {data.map((radio) =>
          contained ? (
            <div key={radio.value} className={styles.containedRadio}>
              <input
                defaultChecked={radio.value == defaultValue}
                value={radio.value}
                onChange={onChangeFunc}
                name="radio"
                id={radio.value + "_radio"}
                type="radio"
              />
              <label htmlFor={radio.value + "_radio"}>{radio.label}</label>
            </div>
          ) : (
            <FormControlLabel
              key={radio.value}
              value={radio.value}
              control={<Radio />}
              className={styles.radioForm}
              label={radio.label}
            />
          )
        )}
      </RadioGroup>
    </div>
  );
}

export default React.memo(RadioGroups);
