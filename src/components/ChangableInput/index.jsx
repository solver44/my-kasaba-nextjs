import React, { useState } from "react";
import styles from "./changableInput.module.scss";
import Input from "../Input";
import {
  Autocomplete,
  Box,
  Chip,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTranslation } from "react-i18next";
import InputDate from "../InputDate";
import { UploadRounded } from "@mui/icons-material";
import dayjs from "dayjs";
import { downloadFile } from "@/http/data";

function getStyles(currentData, multipleValues = []) {
  const isSelected = !Array.isArray(multipleValues)
    ? currentData?.value == multipleValues
    : multipleValues.find((a) => a == currentData?.value);
  return {
    fontWeight: isSelected ? "600" : "normal",
    background: isSelected ? "aliceblue" : "white",
  };
}

export default function ChangableInput({
  editable = true,
  onChange,
  value: propValue,
  label,
  required,
  multiple,
  date,
  invalid,
  select,
  autocomplete,
  fileInput,
  nameOfFile,
  options = [],
  dataSelect = [],
  name,
  style = {},
  ...props
}) {
  let value = propValue || undefined;
  if (date && !dayjs.isDayjs(propValue) && value) value = dayjs(value);

  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [fileName, setFileName] = useState(nameOfFile ?? "");
  function onChangeFunc({ target }) {
    let result = null;
    if (multiple) {
      const selectedValues = target.value || [];
      const currentValue =
        selectedValues.length > 1
          ? selectedValues[selectedValues.length - 1]
          : null;
      result = dataSelect
        .filter((d) => {
          let checkValue = selectedValues.find(
            (s) => s?.value == currentValue
          )?.value;

          if (d.value == checkValue) return false;
          else return selectedValues.find((s) => (s?.value || s) == d.value);
        })
        .reduce((old, current) => {
          return { ...old, [current.value]: true };
        }, {});
    }
    if (!onChange) return;
    onChange(result ? { target: { value: result } } : { target }, name);
  }

  function handleFileInputChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    const nameOfFile = file.name ? file.name : "NOT SUPPORTED";
    setFileName(nameOfFile);
    // Pass the selected file to the onChange function
    if (!onChange) return;
    onChange(file, name);
  }

  async function openFile(e) {
    e.stopPropagation();
    e.preventDefault();
    if (value.slice(0, 3) === "fs:") {
      const result = await downloadFile(value, nameOfFile);
    }
  }

  const multipleValues = Object.keys(propValue ?? {}).filter(
    (p) => propValue[p]
  );

  const validationError =
    typeof invalid === "string" ? validationError : "invalid-input";

  return (
    <div style={style} className={styles.wrapper}>
      <label className={styles.label}>
        {label}
        {required ? <span className={styles.requiredMark}>*</span> : ""}
      </label>
      {!editable ? (
        <span className={styles.content}>{value}</span>
      ) : date ? (
        <InputDate
          name={name}
          onChange={onChangeFunc}
          invalid={invalid}
          value={value}
          {...props}
        />
      ) : autocomplete ? (
        <Autocomplete
          id={name + "_autocomplete"}
          autoHighlight
          freeSolo
          inputValue={propValue ?? ""}
          onChange={(event, value) => {
            onChangeFunc({ target: { value: value?.label ?? "" } });
          }}
          options={options}
          className={[
            styles.autocomplete,
            props.disabled ? styles.disabled : "",
            invalid ? styles.invalid : "",
          ].join(" ")}
          getOptionLabel={(current) =>
            language === "uz" ? current.label : current?.labelRu
          }
          renderInput={(params) => {
            return (
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
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
              />
            );
          }}
        />
      ) : select ? (
        <FormControl>
          <Select
            name={name}
            multiple={!!multiple}
            onChange={onChangeFunc}
            displayEmpty
            value={
              !!multiple
                ? multipleValues
                : dataSelect.find((d) => d.value == propValue)?.label ?? ""
            }
            className={[
              styles.select,
              !!multiple ? styles.multipleSelect : "",
              props.disabled ? styles.disabled : "",
              invalid ? styles.invalid : "",
            ].join(" ")}
            renderValue={
              multiple
                ? (selected) => {
                    if (!selected?.length) return null;
                    return (
                      <Box
                        sx={{
                          marginTop: "-4px",
                          marginBottom: "-4px",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                        }}
                      >
                        {(selected ?? []).map((t) => {
                          const current = dataSelect.find((d) => d.value == t);
                          return (
                            <Chip key={current.value} label={current.label} />
                          );
                        })}
                      </Box>
                    );
                  }
                : (selected) => {
                    if (!selected) return "";
                    return selected;
                  }
            }
            {...props}
          >
            {dataSelect.map((current) => (
              <MenuItem
                key={current.value}
                value={current.value}
                style={getStyles(
                  current,
                  !!multiple ? multipleValues : propValue
                )}
              >
                {language === "uz" ? current.label : current?.labelRu}
              </MenuItem>
            ))}
          </Select>
          {invalid && (
            <FormHelperText error>{t(validationError)}</FormHelperText>
          )}
        </FormControl>
      ) : fileInput ? (
        <label
          className={[
            styles.fileInputLabel,
            invalid ? styles.invalid : "",
            props.disabled ? styles.disabled : "",
          ].join(" ")}
        >
          <input
            type="file"
            disabled={props.disabled}
            accept=".doc, .docx, .pdf"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />
          <div className={styles.fileInput}>{fileName || nameOfFile}</div>
          <div className={styles.fileActions}>
            <VisibilityIcon
              onClick={(e) => openFile(e)}
              style={{ cursor: "pointer" }}
            />
            {!props.disabled && <UploadRounded style={{ cursor: "pointer" }} />}
          </div>
          {invalid && (
            <div className={styles.invalid_title}>{t("invalid-input")}</div>
          )}
        </label>
      ) : (
        <Input
          className={styles.input}
          onChange={(e) => {
            if (onChange) onChange(e, name);
          }}
          invalid={invalid}
          value={value}
          name={name}
          {...props}
        />
      )}
    </div>
  );
}
