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

  useEffect(() => {
    if (typeof propValue !== "undefined") {
      setValue(name, propValue);
      if (onChange) onChange({ target: { value: propValue } }, name);
      if (field.onChange)
        field.onChange({ target: { value: propValue } }, name);
    }
  }, [propValue]);

  const handleCheckboxChange = (e, key) => {
    field.onChange({
      target: { name, value: { ...field.value, [key]: e.target.checked } },
    });
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      <FormGroup style={{ gap: 30 }} row={row}>
        {data.map((checkbox) => (
          <FormControlLabel
            onChange={(e) => handleCheckboxChange(e, checkbox.value)}
            key={checkbox.value}
            control={
              <Checkbox
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
