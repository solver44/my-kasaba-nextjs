import areEqual from "@/utils/areEqual";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

function FormValidation({
  children,
  style = {},
  className,
  button,
  onSubmit,
  onChanged,
}) {
  const methods = useForm();
  const initialData = useRef();
  const timeOut = useRef();
  // methods.watch((d) => {
  //   clearTimeout(timeOut.current);
  //   timeOut.current = setTimeout(() => {
  //     if (Object.keys(d).length < 1) return;
  //     onChanged && onChanged(d);
  //   }, 40);
  // });
  useEffect(() => {
    let unsubscribe = () => {};
    setTimeout(() => {
      initialData.current = methods.getValues();
      const { unsubscribe: un } = methods.watch((d) => {
        clearTimeout(timeOut.current);
        timeOut.current = setTimeout(() => {
          onChanged && onChanged(d, initialData.current);
        }, 40);
      });
      unsubscribe = un;
    }, 100);
    return () => unsubscribe();
  }, [methods.watch]);

  const handleSubmitFunc = (data, t) => {
    if (!data) return;
    onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        className={className}
        onSubmit={button ? null : methods.handleSubmit(handleSubmitFunc)}
        style={style}
      >
        {button
          ? children(
              methods.handleSubmit(handleSubmitFunc),
              methods.getValues()
            )
          : children}
      </form>
    </FormProvider>
  );
}

export default React.memo(FormValidation, areEqual);
