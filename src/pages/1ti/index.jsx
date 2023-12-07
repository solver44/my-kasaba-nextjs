import React, { useEffect, useRef, useState } from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./1ti.module.scss";
import { Button } from "@mui/material";
import { getImportViewer } from "@/utils/animation";
import { useSelector } from "react-redux";

export default function OneTI() {
  const viewer2 = useRef(null);
  const { bkutData = {} } = useSelector((states) => states);
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    async function initData() {
      if (!bkutData || !bkutData.employees || !bkutData.statistics) {
        // Exit early if bkutData is not yet available
        return;
      }

      const dateObj = new Date();
      const year = dateObj.getFullYear();
      const filteredEmployees = bkutData.employees
        .filter((employee) => employee.position?.id === 1)
        .map((employee) => employee._instanceName);

      const filteredEmployeesR = bkutData.employees
        .filter((employee) => employee.position?.id === 1)
        .map((employee) => employee.isPensioner);

      const filteredEmployeesString = filteredEmployeesR.join(", ");
      const result = filteredEmployeesString === 'false' ? `yo'q` : 'ha';
      const apparatus = bkutData.statistics?.isProvidedPaidApparatus === 'false' ? `yo'q` : 'ha'
      const tempJsonData = {
        CURRENTYEARS: year.toString(),
        BKUTNAME: bkutData.name,
        BKUTDIRECTOR: filteredEmployees.join(", "),
        PHONE: bkutData.phone,
        ISFIRED: result,
        ISAPPARATUS: apparatus,
        WORKERSAMOUNT: bkutData.statistics?.workersAmount?.toString(),
        WORKERSFEMALE:bkutData.statistics?.workersFemale?.toString(),
        WORKERSADULTS:bkutData.statistics?.workersAdults?.toString(),
        WORKERSMEMBERS:bkutData.statistics?.workersMembers?.toString(),
        WORKERSFEMALEMEMBERS:bkutData.statistics?.workersFemaleMembers?.toString(),
        WORKERSADULTSMEMBERS:bkutData.statistics?.workersAdultsMembers?.toString(),
        STUDENTSAMOUNT:bkutData.statistics?.studentsAmount?.toString(),
        STUDENTSFEMALE:bkutData.statistics?.studentsFemale?.toString(),
        STUDENTSADULTS:bkutData.statistics?.studentsAdults?.toString(),
        STUDENTSMEMBERS:bkutData.statistics?.studentsMembers?.toString(),
        STUDENTSFEMALEMEMBERS:bkutData.statistics?.studentsFemaleMembers?.toString(),
        STUDENTSADULTSMEMBERS:bkutData.statistics?.studentsAdultsMembers?.toString(),
        PENSIONERAMOUNT:bkutData.statistics?.pensionerAmount?.toString(),
        STAFFINGAMOUNT:bkutData.statistics?.staffingAmount?.toString(),
        STAFFINGWORKERSAMOUNT:bkutData.statistics?.staffingWorkersAmount?.toString(),
        STAFFINGRESPONSIBLEWORKERS:bkutData.statistics?.staffingResponsibleWorkers?.toString(),
        STAFFINGTECHNICALWORKERS:bkutData.statistics?.staffingTechnicalWorkers?.toString(),
        // ... other fields
      };

      setJsonData(tempJsonData); // Update state with JSON data

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
  return <HomeWrapper title="1TI hisobot shakli">{Component}</HomeWrapper>;
};
