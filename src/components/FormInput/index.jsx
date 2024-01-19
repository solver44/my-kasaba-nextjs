import { useController, useForm, useFormContext } from "react-hook-form";
import ChangableInput from "../ChangableInput";
import React, { useEffect, useState } from "react";
import { getEmptyValue } from "@/utils/data";
import areEqual from "@/utils/areEqual";

function FormInput({
  required,
  name,
  onChange,
  value,
  hidden,
  invalid,
  autoComplete,
  maxInput,
  ...props
}) {
  const { control, setValue, watch, getValues } = useFormContext() ?? {
    control: false,
  };
  const [maxValue, setMaxValue] = useState(
    typeof maxInput === "undefined" ? undefined : getValues()[maxInput] || 0
  );
  useEffect(() => {
    if (!maxInput) return;
    watch((d) => {
      setMaxValue(d[maxInput] || 0);
    });
  }, [watch]);

  const {
    field,
    fieldState: { invalid: invalidProps },
  } = !control
    ? { field: { value, name }, fieldState: { invalid } }
    : useController({
        name: name ?? "",
        control,
        rules: {
          required: !!required,
        },
      });

  useEffect(() => {
    if (setValue) setValue(name, getEmptyValue(value));
  }, [value]);

  function onChangeFunc(e, name) {
    if (onChange) onChange(e, name);
    if (field.onChange) field.onChange(e, name);
  }

  if (hidden) return null;

  return (
    <ChangableInput
      {...props}
      name={field.name}
      maxValue={maxValue}
      required={required}
      invalid={invalidProps || invalid}
      onChange={onChangeFunc} // send value to hook form
      value={field.value} // input value
    />
  );
}

export default React.memo(FormInput, areEqual);
