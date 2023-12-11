import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import { t } from "i18next";
import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import { CloudDownload, Download } from "@mui/icons-material";

const DocumentViewer = ({
  documentSrc,
  generateData,
  ignoreWidth = false,
  hideDownloadBtn,
  fileName = "output.docx",
}) => {
  const iframeRef = useRef();
  const dataForDownload = useRef();

  function download() {
    if (!dataForDownload.current) return;
    saveAs(dataForDownload.current, fileName);
  }
  function getBinaryData(url) {
    return new Promise((resolve) => {
      window.PizZipUtils.getBinaryContent(url, (err, d) => {
        resolve(d);
      });
    });
  }

  async function generateDoc() {
    const fileData = await getBinaryData(documentSrc);
    const zip = new window.PizZip(fileData);
    const doc = new window.docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render(generateData);

    const blob = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      compression: "DEFLATE",
    });
    // Output the document using Data-URI
    dataForDownload.current = blob;
    return blob;
  }
  async function previewWordDoc(data) {
    let fileData = data;
    if (!data) {
      const response = await fetch(documentSrc);
      if (!response.ok) {
        console.error("Failed to fetch the file");
        return;
      }
      fileData = await response.blob();
      dataForDownload.current = fileData;
    }
    const docx = window.docx;

    if (fileData) {
      var docxOptions = Object.assign(docx.defaultOptions, {
        ignoreWidth,
        useMathMLPolyfill: true,
      });
      var container = iframeRef.current;
      docx.renderAsync(fileData, container, null, docxOptions);
    }
  }
  useEffect(() => {
    async function initData() {
      let data = null;
      if (generateData) data = generateDoc();
      previewWordDoc(data);
    }
    initData();
  }, []);
  return (
    <div className={styles.wrapper}>
      {!hideDownloadBtn && (
        <Button onClick={download} variant="outlined" className={styles.button}>
          {/* {t("download")} */}
          <CloudDownload />
        </Button>
      )}
      <div ref={iframeRef}></div>
    </div>
  );
};

export default DocumentViewer;