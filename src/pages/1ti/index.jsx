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
  const result = filteredEmployeesString === "false" ? `yo'q` : "ha";

  console.log(filteredEmployees);
  const jsonData = {
    CURRENTYEARS: year.toString(),
    BKUTNAME: bkutData.name,
    BKUTDIRECTOR: filteredEmployees.join(", "),
    PHONE: bkutData.phone,
    ISFIRED: result,
  };

  useEffect(() => {
    async function initData() {
      const WebViewer = await getImportViewer();

      const webViewer2 = WebViewer(
        {
          path: "/webviewer/lib",
          initialDoc: "/report1ti.docx",
        },
        viewer2.current
      );

      webViewer2.then(async (instance) => {
        const { documentViewer } = instance.Core;

        documentViewer.addEventListener("documentLoaded", async () => {
          await documentViewer.getDocument().documentCompletePromise();
          documentViewer.updateView();
          await documentViewer.getDocument().applyTemplateValues(jsonData);
        });
      });
    }
    initData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.webviewer} ref={viewer2}></div>
    </div>
  );
}

OneTI.layout = function (Component, t) {
  return <HomeWrapper title="1T hisoboti">{Component}</HomeWrapper>;
};
