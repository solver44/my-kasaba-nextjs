import readXlsxFile from "read-excel-file";
import writeXlsxFile from "write-excel-file";
import React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Dialog,
  Divider,
  Popover,
  Typography,
} from "@mui/material";
import DragAndDropFile from "@/components/DragAndDropFile";
import { t } from "i18next";
import { useSnackbar } from "notistack";
import LinearProgressWithLabel from "@/components/LinearProgress";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import { InfoOutlined } from "@mui/icons-material";

const Classes = {};

async function DownloadTempate(columns, title = "", requiredColumns) {
  try {
    const data = [];
    const header = [];
    const examples = [];
    const columnsWidth = [];

    columns.forEach((col) => {
      const obj = {};
      const translated = col.field + ` (${t(col.headerName)})`;

      obj.value = translated;
      obj.borderStyle = "thin";
      obj.height = 35;
      obj.align = "center";
      obj.alignVertical = "center";
      obj.fontWeight = "bold";
      obj.color = requiredColumns?.find((r) => r.field === col.field)
        ? "#000000"
        : "#9a9a9a";

      header.push(obj);

      let example = col.default;
      example =
        example ??
        (col.field.toLowerCase().includes("date") ? "yyyy-mm-dd" : "");
      examples.push({ borderStyle: "thin", value: example });
      columnsWidth.push({ width: translated.length + 4 });
    });

    data.push(header, examples);

    await writeXlsxFile(data, {
      columns: columnsWidth,
      fontSize: 11,
      fileName: `${title} (${t("template")}).xlsx`,
    });
  } catch (error) {
    // AppToaster({ message: error.message, intent: "danger" });
  }
}

async function ExcelToData(file, requiredColumns) {
  try {
    const rows = await readXlsxFile(file);

    if (rows.length <= 1) return t("data-not-found");

    const resultReq = rows[0].filter((i) =>
      checkRequiredColumn(i, requiredColumns)
    );
    if (resultReq.length !== requiredColumns?.length)
      return t("required-columns-did-not-match");

    const emptyRows = [];
    rows.forEach((row, index) => {
      if (index === 0) return;
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const cell = row[colIndex];
        if (!checkRequiredColumn(rows[0][colIndex], requiredColumns)) return;
        if (!cell) {
          emptyRows.push(index + 1);
          break;
        }
      }
    });

    return { data: rows, emptyRows };
  } catch (error) {
    if (error.message.includes("file or directory could not be found")) {
      return t("file-or-directory-not-found");
    } else {
      return error.message;
    }
  }
}

const nonRequired = [
  "givenDate",
  "passportDate",
  "phone",
  "phoneNumber",
  "email",
];
export function checkRequiredColumn(col, requiredColumns) {
  if (requiredColumns)
    return (
      !nonRequired.find((r) => col.includes(r)) &&
      requiredColumns.find((r) => col.includes(r.field))
    );
  else return !nonRequired.find((r) => col.includes(r));
}

export function getRequiredColumns(columns = []) {
  return [
    columns.filter((c) => !nonRequired.includes(c.field)),
    columns.filter((c) => nonRequired.includes(c.field)),
  ];
}

const ImportTableForm = ({ isOpen, handleClose, onUpload, columns, title }) => {
  const [currentFileRows, setCurrentFileRows] = useState(null);
  const [progress, setProgress] = useState({
    value: 0,
    max: 0,
    current: 0,
    finished: false,
  });

  function _setProgress(current) {
    setProgress((p) => ({
      ...p,
      value: Math.min(Math.round((current * 100) / p.max), 100),
      current,
    }));
  }

  const setDataTable = (e) => {
    e.preventDefault();
    if (!currentFileRows) return;
    setProgress({ max: currentFileRows?.length, value: 0, current: 0 });
    if (onUpload) onUpload(currentFileRows, _setProgress, onFinish);
  };

  const setCurrentRows = (rows) => {
    setCurrentFileRows(rows);
  };

  function onFinish() {
    setTimeout(() => {
      setProgress((p) => ({ ...p, finished: true }));
    }, 500);
  }

  const [requiredColumns, nonRequiredColumns] = getRequiredColumns(columns);

  const isProgress = progress.max > 0;

  return (
    <Dialog
      open={isOpen}
      maxWidth="auto"
      onClose={handleClose}
      title={t("import_from_excel")}
    >
      <form className="import-content" onSubmit={setDataTable}>
        <FormBody
          isProgress={isProgress}
          progress={progress}
          columns={columns}
          setCurrentRows={setCurrentRows}
          nonRequiredColumns={nonRequiredColumns}
          title={title}
          requiredColumns={requiredColumns}
        />
        <Divider />
        <FormFooter
          columns={columns}
          title={title}
          isProgress={isProgress}
          currentFileRows={currentFileRows}
          requiredColumns={requiredColumns}
          handleClose={handleClose}
        />
      </form>
    </Dialog>
  );
};

function FormBody({
  setCurrentRows,
  columns,
  requiredColumns,
  isProgress,
  progress,
  nonRequiredColumns,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [emptyRows, setEmptyRows] = useState();

  return (
    <div style={{ padding: "20px" }}>
      <DragAndDropFile
        handleFile={async (file) => {
          let data = await ExcelToData(file, requiredColumns);
          let emptyRows = [];
          if (typeof data === "string") {
            enqueueSnackbar(data, { variant: "error" });
            return;
          }
          emptyRows = data.emptyRows;
          data = data.data;

          if (emptyRows.length) {
            setEmptyRows(emptyRows);
          } else {
            setEmptyRows();
          }
          if (data.length - emptyRows.length - 1 > 0) {
            enqueueSnackbar(
              t("data-is-ready-to-set", {
                count: data.length - emptyRows.length - 1,
              })
            );
            const result = data
              .map((row, i) => {
                if (i === 0) return;
                const resultRow = row.reduce((old, current, colIndex) => {
                  const key = columns.find((c) =>
                    data[0][colIndex].includes(c.field)
                  )?.field;
                  if (!key) return;
                  return { ...old, [key]: current };
                }, {});
                return resultRow;
              })
              .filter((r) => r);
            setCurrentRows(result);
          }
        }}
      >
        {progress.finished ? (
          <div className="import-loader" style={{ flexDirection: "column" }}>
            <CloudDoneIcon color="success" style={{ fontSize: 60 }} />
            <Typography variant="h5" color="text.secondary">
              {t("success-done")}
            </Typography>
          </div>
        ) : (
          isProgress && (
            <div className="import-loader">
              <LinearProgressWithLabel
                value={progress.value}
                label={t("import-label", {
                  max: progress.max,
                  value: progress.current,
                })}
              />
            </div>
          )
        )}
      </DragAndDropFile>
      {!!emptyRows?.length && (
        <Alert style={{ marginTop: 10, marginBottom: -30 }} severity="error">
          {t("empty-rows", {
            rows: emptyRows.join(", "),
          })}
        </Alert>
      )}
      <div style={{ marginTop: "30px" }} className="d-flex">
        <div className="columns-parametrs">
          <h3>{t("required-columns")}</h3>
          {requiredColumns?.map((col, index) => (
            <Badge key={index} column={col} />
          ))}
        </div>
        {!!nonRequiredColumns?.length && (
          <div className="columns-parametrs">
            <h3>{t("additional-columns")}</h3>
            {nonRequiredColumns.map((col, index) => (
              <Badge key={index} column={col} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const Badge = ({ column, color = "default" }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handlePopoverOpen = (event) => {
    if (!column.tooltip) return;
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <React.Fragment>
      <Chip
        style={{ margin: "0 5px 5px 0", fontSize: 16 }}
        color={column.tooltip ? "info" : color}
        label={t(column.headerName)}
        icon={column.tooltip && <InfoOutlined fontSize="small" />}
        variant="outlined"
        clickable
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography whiteSpace="pre" fontSize="20px" sx={{ p: 1 }}>
          {column.tooltip}
        </Typography>
      </Popover>
    </React.Fragment>
  );
};

function FormFooter({
  columns,
  title,
  requiredColumns,
  isProgress,
  handleClose,
  currentFileRows,
}) {
  return (
    <div style={{ marginTop: 20 }} className={Classes.DIALOG_FOOTER}>
      <div className="import-bottom">
        <Button
          className="abs left-pos"
          variant="outlined"
          color="inherit"
          onClick={() => DownloadTempate(columns, title, requiredColumns)}
        >
          {t("download-template")}
        </Button>

        <div>
          <Button style={{ marginRight: 10 }} onClick={handleClose}>
            {t("close")}
          </Button>
          <Button
            disabled={!currentFileRows || isProgress}
            type="submit"
            variant="contained"
            color="success"
          >
            {t("add")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ImportTableForm;
