import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import styles from "./changableInput.module.scss"; // Assuming the same styles are applicable
import { useTranslation } from "react-i18next";

export default function AutocompleteInput({
  name,
  value,
  options,
  onChangeFunc,
  invalid,
  validationError,
  disabled,
  ...props
}) {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  return (
    <Autocomplete
      id={name + "_autocomplete"}
      autoHighlight
      inputValue={value?.label || value}
      onChange={(event, value) => onChangeFunc({ target: { value } })}
      options={options}
      className={[
        styles.autocomplete,
        disabled ? styles.disabled : "",
        invalid ? styles.invalid : "",
      ].join(" ")}
      getOptionLabel={(current) =>
        language === "uz" ? current.label : current?.labelRu
      }
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          error={!!invalid}
          helperText={invalid ? t(validationError) : false}
          className={[
            styles.autocomplete_input,
            !!invalid ? styles.invalid : "",
          ].join(" ")}
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password",
          }}
        />
      )}
      {...props}
    />
  );
}
