import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function FormValidation({ children, className, onSubmit }) {
  const methods = useForm();

  const handleSubmitFunc = (data, t) => {
    if (!data) return;
    onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        className={className}
        onSubmit={methods.handleSubmit(handleSubmitFunc)}
      >
        {children}
      </form>
    </FormProvider>
  );
}
