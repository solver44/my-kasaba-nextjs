import React, { useEffect, useRef } from "react";
import styles from "./checkBoxGroup.module.scss";
import { FormControlLabel, Checkbox, FormGroup } from "@mui/material"; // Import Checkbox and FormGroup
import { useController, useFormContext } from "react-hook-form";

function CheckBoxGroup({
  onChange,
  defaultValue,
  row = true,
  data = [],
  name,
  required,
  value: propValue,
  label,
}) {
  const currentData = useRef(
    data.reduce((result, d) => {
      result[d.value] = false;
      return result;
    }, {})
  );
  const { control, setValue } = useFormContext() ?? { control: false };
  const { field } = !control
    ? { field: { value: propValue, name } }
    : useController({
        name: name ?? "",
        control,
        rules: { required: !!required },
      });

  function onChangeFunc(e, key) {
    currentData.current[key] = e.target.checked;
    if (onChange) onChange(currentData.current, name);
    if (field.onChange) field.onChange(currentData.current, name);
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
      <FormGroup
        style={{ gap: 30 }}
        defaultValue={defaultValue}
        value={field.value ?? ""}
        row={row}
      >
        {data.map((checkbox) => (
          <FormControlLabel
            onChange={(e) => onChangeFunc(e, checkbox.value)}
            key={checkbox.value}
            value={checkbox.value}
            control={<Checkbox />} // Use Checkbox component here
            label={checkbox.label}
          />
        ))}
      </FormGroup>
    </div>
  );
}

export default React.memo(CheckBoxGroup);
