import React, { useState } from "react";
import DataTable from "../employees/dataTable";

export default function Step2({ onUpload }) {
  return <DataTable onUpload={onUpload} />;
}
