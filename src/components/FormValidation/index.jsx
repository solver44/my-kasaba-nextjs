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
  const timeOut = useRef();
  methods.watch((d) => {
    clearTimeout(timeOut.current);
    timeOut.current = setTimeout(() => {
      onChanged && onChanged(d);
    }, 20);
  });

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
        {button ? children(methods.handleSubmit(handleSubmitFunc)) : children}
      </form>
    </FormProvider>
  );
}

export default React.memo(FormValidation, areEqual);
