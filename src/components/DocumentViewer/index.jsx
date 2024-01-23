import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { saveAs } from "file-saver";
import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { CloudDownload, Download, Refresh } from "@mui/icons-material";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPdf, setIsPdf] = useState(false);
  const [currentFileName, setFileName] = useState(fileName);

  let workBook = null;
  let excelGrid = null;
  let activeSheet = "";
  let sheets = [];
  let excelButtons = null;
  let buttons = [];

  const b64toBlob = (base64, type = "application/octet-stream") =>
    fetch(`data:${type};base64,${base64}`).then((res) => res.blob());
  async function download() {
    if (!dataForDownload.current) return;
    if (typeof dataForDownload.current === "string")
      saveAs(await b64toBlob(dataForDownload.current), currentFileName);
    else saveAs(dataForDownload.current, currentFileName);
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
  async function previewPdf(_data) {
    let pdfDoc = null;
    const data = atob(_data);
    var container = iframeRef.current;
    if (!container) return;
    container.style = "padding: 10px 0";
    container.innerHTML = "";
    pdfjsLib.getDocument({ data }).promise.then((pdfDoc_) => {
      pdfDoc = pdfDoc_;
      renderAllPages(pdfDoc);
    });

    function renderAllPages(pdf) {
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        pdf.getPage(pageNum).then((page) => {
          let scale = 1;
          var desiredWidth = 800;
          let viewport = page.getViewport({ scale: scale });
          scale = desiredWidth / viewport.width;
          viewport = page.getViewport({ scale: scale });
          let canvas = document.createElement("canvas");
          let context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          let renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          container.appendChild(canvas);
          page.render(renderContext);
        });
      }
    }
  }
  function clearAll() {
    var viewer = iframeRef.current;
    if (!viewer) return;
    viewer.innerHTML = "";
    workBook = null;
    excelGrid = null;
    sheets = [];
    excelButtons = null;
    buttons = [];
  }
  async function previewExcel() {
    clearAll();
    const data = await getBinaryData(documentSrc);
    var viewer = iframeRef.current;
    if (!viewer) return;
    workBook = XLSX.read(data, { type: "binary" });
    sheets = workBook.SheetNames;
    workBook.SheetNames.forEach(function (sheetName) {
      var headers = [];
      var sheet = workBook.Sheets[sheetName];
      var range = XLSX.utils.decode_range(sheet["!ref"]);
      var C = range.s.r;
      var R = range.s.r;
      for (C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
        var hdr = "NIPUN";
        if (cell && cell.t) {
          hdr = XLSX.utils.format_cell(cell);
        }
        headers.push(hdr);
      }
      var roa = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
      if (roa.length > 0) {
        roa.forEach(function (row) {
          headers.forEach(function (hd) {
            if (row[hd] === undefined) {
              row[hd] = "";
            }
          });
        });
      }
    });
    excelGrid = document.createElement("table");
    excelGrid.classList.add("table");
    excelGrid.classList.add("table-bordered");
    excelGrid.classList.add("table-responsive");
    excelGrid.classList.add("excel-table");
    excelButtons = document.createElement("div");
    excelButtons.classList.add("excelButtons");
    for (var i = 0; i < sheets.length; i++) {
      let button = document.createElement("button");
      button.classList.add("sheetBtn");
      button.innerText = sheets[i];
      button.addEventListener("click", (e) => {
        showSheet(e.target);
      });
      excelButtons.appendChild(button);
      buttons.push(button);
    }
    let container = document.createElement("div");
    container.classList.add("excel-container");
    container.appendChild(excelGrid);
    viewer.innerHTML = "";
    viewer.appendChild(container);
    viewer.appendChild(excelButtons);
    const el = buttons[0];
    var workSheet = workBook.Sheets[el.innerText];
    excelGrid.innerHTML = XLSX.utils.sheet_to_html(workSheet);
    activeSheet = el.innerText;
  }

  async function initData() {
    setLoading(true);
    setError(null);
    let data = null;
    let extension = "";

    if (documentSrc) {
      if (generateData) data = generateDoc();
      extension = documentSrc.split(".").pop();
    } else if (url) {
      const name = decodeURIComponent(url.split("=")[1]);
      extension = name && name.split(".").pop();
      setFileName(extension ? name.replaceAll("+", " ") : fileName);
      if (
        extension !== "docx" &&
        extension !== "pdf" &&
        extension !== "xlsx" &&
        extension !== "xls"
      ) {
        await new Promise((res) => setTimeout(res, 500));
        setLoading(false);
        setError(t("file-should-be-docx"));
        iframeRef.current.innerHTML = "";
        return;
      }
      data = await downloadFile(url, name, true, extension === "pdf");
      dataForDownload.current = data;
      if (!data) {
        setLoading(false);
        setError(t("file-cannot-open"));
        iframeRef.current.innerHTML = "";
        return;
      }
    }
    if (extension === "pdf") {
      setIsPdf(true);
      await previewPdf(data);
    } else if (extension === "xlsx" || extension === "xls")
      await previewExcel(data);
    else await previewWordDoc(data);
    setLoading(false);
  }
  useEffect(() => {
    initData();
  }, [url, generateData]);
  return (
    <div className={[styles.wrapper].join(" ")}>
      {!hideDownloadBtn && (
        <Tooltip
          title={<p style={{ fontSize: 18, margin: 2 }}>{t("download")}</p>}
        >
          <Button
            onClick={download}
            variant="outlined"
            className={styles.button}
          >
            {/* {t("download")} */}

            <CloudDownload />
          </Button>
        </Tooltip>
      )}
      {loading && <CircularProgress className={styles.loader} />}
      {error && (
        <div className={styles.errorWrapper}>
          <Alert
            action={
              <IconButton onClick={initData} color="inherit" size="small">
                <Refresh />
              </IconButton>
            }
            severity="error"
            className={styles.error}
          >
            {error}
          </Alert>
        </div>
      )}
      <div
        className={[
          styles.previewer,
          isPdf ? styles.pdf : "",
          ignoreWidth ? styles.full : "",
        ].join(" ")}
        ref={iframeRef}
      ></div>
    </div>
  );
};

export default DocumentViewer;
