import React, { useEffect, useRef, useState } from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./1ti.module.scss";
import { Button } from "@mui/material";
import { getImportViewer } from "@/utils/animation";

export default function OneTI() {
  const viewer = useRef(null);
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
  useEffect(() => {
    async function initData() {
      const WebViewer = await getImportViewer();
      WebViewer(
        {
          path: "/webviewer/lib",
          initialDoc: "/report1ti.docx",
        },
        viewer.current
      ).then(async (instance) => {
        const { documentViewer } = instance.Core;

        documentViewer.addEventListener("documentLoaded", async () => {
          await documentViewer.getDocument().documentCompletePromise();
          documentViewer.updateView();

          // const doc = documentViewer.getDocument();
          // const keys = doc.getTemplateKeys();
          // console.log(keys);

          await documentViewer.getDocument().applyTemplateValues(jsonData);

          setTimeout(() => {
            const removeCanvasElements = () => {
              const canvasElements = document.querySelectorAll("canvas");
              console.log(document);
              canvasElements.forEach((canvas) => {
                canvas.remove();
              });
            };

            // Call the function to remove canvas elements when the component mounts
            removeCanvasElements();
          }, 1000);
        });
      });
    }
    initData();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.webviewer} ref={viewer}></div>
    </div>
  );
}

OneTI.layout = function (Component, t) {
  return <HomeWrapper title="1T shakli">{Component}</HomeWrapper>;
};
