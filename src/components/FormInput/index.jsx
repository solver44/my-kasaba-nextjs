import { useController, useFormContext } from "react-hook-form";
import ChangableInput from "../ChangableInput";
import { useEffect } from "react";

export default function FormInput({
  required,
  name,
  onChange,
  value,
  invalid,
  ...props
}) {
  const { control, setValue } = useFormContext() ?? { control: false };
  const {
    field,
    fieldState: { invalid: invalidProps },
  } = !control
    ? { field: { value, name }, fieldState: { invalid } }
    : useController({
        name: name ?? "",
        control,
        rules: { required: !!required },
      });

  useEffect(() => {
    setValue(name, value);
  }, [value]);

  function onChangeFunc(e, name) {
    if (onChange) onChange(e, name);
    if (field.onChange) field.onChange(e, name);
  }

  return (
    <ChangableInput
      {...props}
      name={field.name}
      invalid={invalidProps || invalid}
      onChange={onChangeFunc} // send value to hook form
      value={field.value} // input value
    />
  );
}
