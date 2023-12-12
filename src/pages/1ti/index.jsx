import React, { useEffect, useState } from "react";
import HomeWrapper from "../home/wrapper";
import DocumentViewer from "@/components/DocumentViewer";
import { useSelector } from "react-redux";

export default function OneTI() {
  const { bkutData = {} } = useSelector((states) => states);
  const [Iframe, setIframe] = useState();

  useEffect(() => {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    let filteredEmployees = [];
    let filteredEmployeesR = [];
    if (bkutData && bkutData.employees) {
      filteredEmployees = bkutData.employees
        .filter((employee) => employee.position?.id === 1)
        .map((employee) => employee._instanceName);

      filteredEmployeesR = bkutData.employees
        .filter((employee) => employee.position?.id === 1)
        .map((employee) => employee.isPensioner);
    } else {
    }
    console.log(bkutData.statistics?.studentsFemale?.toString())
    const filteredEmployeesString = filteredEmployeesR.join(", ");
    const result = filteredEmployeesString === 'false' ? `yo'q` : 'ha';
    const tempJsonData = {
      CURRENTYEARS: year.toString(),
      BKUTNAME: bkutData.name,
      BKUTDIRECTOR: filteredEmployees.join(", "),
      PHONE: bkutData.phone,
      ISFIRED: result,
      ISAPPARATUS: bkutData.statistics?.isProvidedPaidApparatus === false ? "yo'q" : 'ha',
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
    };

    setIframe(
      <DocumentViewer
        documentSrc="/report1ti.docx"
        generateData={tempJsonData}
      />
    );
  }, [bkutData]);

  return <div>{Iframe}</div>;
}

OneTI.layout = function (Component, t) {
  return <HomeWrapper title="1TI shakli">{Component}</HomeWrapper>;
};