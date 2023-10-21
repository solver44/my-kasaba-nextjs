import areEqual from "@/utils/areEqual";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

function FormValidation({ children, className, button, onSubmit, onChanged }) {
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
      >
        {button ? children(methods.handleSubmit(handleSubmitFunc)) : children}
      </form>
    </FormProvider>
  );
}

export default React.memo(FormValidation, areEqual);
