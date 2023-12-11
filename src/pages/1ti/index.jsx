import React, { useEffect, useRef, useState } from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./1ti.module.scss";
import { Button } from "@mui/material";
import { getImportViewer } from "@/utils/animation";
import { useSelector } from "react-redux";

export default function OneTI() {
  const viewer2 = useRef(null);
  const { bkutData = {} } = useSelector((states) => states);
  const dateObj = new Date();
  const year = dateObj.getFullYear(); // Extract the year
  const filteredEmployees = bkutData?.employees
  ? bkutData.employees
      .filter((employee) => employee.position?.id === 1)
      .map((employee) => employee._instanceName)
  : [];
  const filteredEmployeesR = bkutData?.employees
  ? bkutData.employees
      .filter((employee) => employee.position?.id === 1)
      .map((employee) => employee.isPensioner)
  : [];
  const filteredEmployeesString = filteredEmployeesR.join(", ");
  const result = filteredEmployeesString === 'false' ? `yo'q` : 'ha';

console.log(filteredEmployees);
  const jsonData = {
    CURRENTYEARS: year.toString(),
    BKUTNAME: bkutData.name,
    BKUTDIRECTOR: filteredEmployees.join(", "),
    PHONE: bkutData.phone,
    ISFIRED: result
    

  };

  useEffect(() => {
    async function initData() {
      const WebViewer = await getImportViewer();

      const webViewer2 = WebViewer(
        {
          path: "/webviewer/lib",
          licenseKey: "1701864402215:7cbc3f6f03000000000921ffb5b85a7c096bda9959ddf65e04d4d12cc6",
          initialDoc: "/report1ti.docx",
        },
        viewer2.current
      );

      webViewer2.then(async (instance) => {
        const { documentViewer } = instance.Core;

        documentViewer.addEventListener("documentLoaded", async () => {
          await documentViewer.getDocument().documentCompletePromise();
          documentViewer.updateView();
          console.log('jsonData:', tempJsonData);
          await documentViewer.getDocument().applyTemplateValues(tempJsonData);
        });
      });
    }

    initData();
  }, [bkutData]);

  return (
    <div className={styles.container}>
      <div className={styles.webviewer} ref={viewer2}></div>
    </div>
  );
}

OneTI.layout = function (Component, t) {
  return <HomeWrapper title="1T shakli">{Component}</HomeWrapper>;
};
