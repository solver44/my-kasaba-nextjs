import React, { useEffect, useRef, useState } from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./1ti.module.scss";
import { Button } from "@mui/material";
import { getImportViewer } from "@/utils/animation";
import Group from "@/components/Group";
import { t } from "i18next";
import FormInput from "@/components/FormInput";
import { useSelector } from "react-redux";
import RadioGroup from "@/components/RadioGroup";
import InDataTable from "../statistical-information/dataTable";

export default function OneTI() {
  const viewer = useRef(null);
  const { bkutData = {} } = useSelector((states) => states);
  console.log(bkutData)
  const [isKasabaActive, setIsKasabaActive] = useState(false);
  const jsonData = {
    COMPANYNAME: "PDFTron",
    CUSTOMERNAME: "Andrey Safonov",
    CompanyAddressLine1: "838 W Hastings St 5th floor",
    CompanyAddressLine2: "Vancouver, BC V6C 0A6",
    CustomerAddressLine1: "123 Main Street",
    CustomerAddressLine2: "Vancouver, BC V6A 2S5",
    Date: "Nov 5th, 2021",
    ExpiryDate: "Dec 5th, 2021",
    QuoteNumber: "134",
    WEBSITE: "www.pdftron.com",
    billed_items: {
      insert_rows: [
        ["Apples", "3", "$5.00", "$15.00"],
        ["Oranges", "2", "$5.00", "$10.00"],
      ],
    },
    days: "30",
    total: "$25.00",
  };
  return (
    <div className={styles.container}>
      <InDataTable/>
    </div>
  );
}

OneTI.layout = function (Component, t) {
  return <HomeWrapper title={t("1t-report")}>{Component}</HomeWrapper>;
};
