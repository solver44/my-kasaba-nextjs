import areEqual from "@/utils/areEqual";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

function FormValidation({
  children,
  style = {},
  refresh,
  className,
  button,
  onSubmit,
  onChanged,
}) {
  const methods = useForm();
  const initialData = useRef();
  const timeOut = useRef();
  const useEffectTimeOut = useRef();

  useEffect(() => {
    let unsubscribe = () => {};
    clearTimeout(useEffectTimeOut.current);
    useEffectTimeOut.current = setTimeout(() => {
      initialData.current = methods.getValues();
      if (Object.keys(initialData.current).length < 1) return;
      onChanged && onChanged(initialData.current, initialData.current);
      const { unsubscribe: un } = methods.watch((d) => {
        clearTimeout(timeOut.current);
        timeOut.current = setTimeout(() => {
          onChanged && onChanged(d, initialData.current);
        }, 40);
      });
      unsubscribe = un;
    }, 500);
    return () => unsubscribe();
  }, [methods.watch, refresh]);

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
