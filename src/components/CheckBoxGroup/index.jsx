import React, { useEffect } from "react";
import styles from "./checkBoxGroup.module.scss";
import { FormControlLabel, Checkbox, FormGroup } from "@mui/material";
import { useController, useFormContext } from "react-hook-form";
import areEqual from "@/utils/areEqual";

function CheckBoxGroup({
  onChange,
  row = true,
  data = [],
  name,
  vertical,
  required,
  multiple = false,
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

  useEffect(() => {
    if (typeof propValue !== "undefined") {
      setValue(name, propValue);
      if (onChange) onChange({ target: { value: propValue } }, name);
      if (field.onChange)
        field.onChange({ target: { value: propValue } }, name);
    }
  }, [propValue]);

  const handleCheckboxChange = (e, key) => {
    if (multiple) {
      // If multiple selections are allowed, toggle the selected state.
      field.onChange({
        target: {
          name,
          value: {
            ...field.value,
            [key]: e.target.checked,
          },
        },
      });
    } else {
      field.onChange({
        target: {
          name,
          value: { [key]: !field.value[key] },
        },
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <FormGroup
        style={{
          gap: vertical ? 0 : 20,
          flexDirection: vertical ? "column" : "row",
          maxHeight: vertical ? 100 : "auto",
        }}
        row={row}
      >
        {data.map((checkbox) => (
          <FormControlLabel
            onChange={(e) => handleCheckboxChange(e, checkbox.value)}
            key={checkbox.value}
            className={styles.controlLabel}
            control={
              <Checkbox
                size="large"
                className={styles.checkbox}
                checked={(field.value || {})[checkbox.value] || false}
              />
            }
            label={checkbox.label}
          />
        ))}
      </FormGroup>
    </div>
  );
}

export default React.memo(CheckBoxGroup, areEqual);
