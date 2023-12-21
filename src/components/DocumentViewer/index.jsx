import { Button, CircularProgress } from "@mui/material";
import { saveAs } from "file-saver";
import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { CloudDownload, Download } from "@mui/icons-material";
import { downloadFile } from "@/http/data";
import { useSnackbar } from "notistack";
import useAnimation from "@/hooks/useAnimation";

const DocumentViewer = ({
  showNameFile,
  documentSrc,
  generateData,
  url,
  ignoreWidth = false,
  hideDownloadBtn,
  fileName = "output.docx",
}) => {
  const iframeRef = useRef();
  const dataForDownload = useRef();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      let data = null;
      if (documentSrc) {
        if (generateData) data = generateDoc();
      } else if (url) {
        data = await downloadFile(
          url,
          decodeURIComponent(url.split("=")[1]),
          true
        );
        if (!data) {
          setLoading(false);
          enqueueSnackbar(t("file-cannot-open"), { variant: "error" });
          return;
        }
      }
      await previewWordDoc(data);
      setLoading(false);
    }
    initData();
  }, [url, generateData]);
  return (
    <div className={styles.wrapper}>
      {!hideDownloadBtn && (
        <Button onClick={download} variant="outlined" className={styles.button}>
          {/* {t("download")} */}
          <CloudDownload />
        </Button>
      )}
      {loading && <CircularProgress className={styles.loader} />}
      <div ref={iframeRef}></div>
    </div>
  );
};

export default DocumentViewer;
