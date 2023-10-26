import {
  Button,
  Dialog,
  Divider,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";
import writeXlsxFile from "write-excel-file";
const firstColumn = () => {
  const obj = {};
  obj.value = "№";
  obj.borderStyle = "thin";
  obj.height = 35;
  obj.align = "center";
  obj.alignVertical = "center";
  obj.fontWeight = "bold";

  return obj;
};
const firstRow = (index) => {
  const obj = {};
  obj.value = index;
  obj.borderStyle = "thin";

  return obj;
};

export async function HtmlTOExcel(columns, body, title) {
  try {
    const hasFirstRow = true;
    const data = [];
    const allWidth = hasFirstRow ? [[2]] : [];
    const header = hasFirstRow ? [firstColumn()] : [];

    columns.forEach((col) => {
      const obj = {};
      const translated = t(col.label);

      obj.value = translated;
      obj.borderStyle = "thin";
      obj.height = 35;
      obj.align = "center";
      obj.alignVertical = "center";
      obj.fontWeight = "bold";

      allWidth.push([translated.length]);

      header.push(obj);
    });

    data.push(header);

    const objects = body;
    objects.forEach((obj, index) => {
      const dataVal = [];
      if (hasFirstRow) {
        dataVal.push(firstRow(index + 1));
        allWidth[0].push((index + 1).toString().length);
      }

      let countCol = hasFirstRow ? 1 : 0;
      Object.keys(obj).forEach((item) => {
        if (!columns.find((c) => c.value == item)) return null;

        const manipulatedValue = Array.isArray(obj[item])
          ? obj[item]
              .map((o) => (typeof o === "object" ? o?.name : o))
              .join(",")
          : obj[item];

        const objectValue =
          typeof manipulatedValue === "object"
            ? manipulatedValue?.name
            : manipulatedValue;

        allWidth[countCol].push(manipulatedValue?.length ?? 0);
        countCol++;

        const obb = {};
        obb.value = objectValue;
        obb.borderStyle = "thin";

        dataVal.push(obb);
      });
      data.push(dataVal);
    });

    const columnsWidth = [];
    allWidth.forEach((widths) => {
      columnsWidth.push({ width: Math.max.apply(Math, widths) + 3 });
    });

    await writeXlsxFile(data, {
      columns: columnsWidth,
      fontSize: 11,
      fileName: (title ?? "export") + ".xlsx",
    });
  } catch (error) {
    console.log(error);
    // AppToaster({ message: error, intent: "danger" });
  }
}

const ExportTableForm = ({ columns, isOpen, rows, handleClose, title }) => {
  const currentCols = useRef(columns);
  const exportTable = async (e) => {
    e.preventDefault();

    await HtmlTOExcel(
      currentCols.current
        .filter((c) => c.checked ?? !c.hidden)
        .map((c) => ({ value: c.field, label: c.headerName })),
      rows,
      title
    );
    handleClose();
  };
  // useEffect(() => {
  //   if (!isOpen) return;
  //   // HtmlTOExcel(columns, body, title);
  // }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="auto">
      <form className="export-content" onSubmit={exportTable}>
        <div className="export-body">
          <h3>{t("columns")}</h3>
          <FormGroup
            onChange={({ target }) =>
              (currentCols.current = currentCols.current.map((c) => {
                if (c.field === target.value)
                  return {
                    ...c,
                    checked: target.checked,
                  };
                else
                  return {
                    ...c,
                    checked: c.checked ?? !c.hidden,
                  };
              }))
            }
            className="export-form"
          >
            {columns.map((c) => (
              <FormControlLabel
                key={c.field}
                value={c.field}
                control={<Switch defaultChecked={!c.hidden} />}
                label={t(c.headerName)}
              />
            ))}
          </FormGroup>
        </div>
        <Divider />
        <div className="modal-actions">
          <Button variant="text" onClick={handleClose}>
            {t("close")}
          </Button>
          <Button variant="contained" type="submit" intent="primary">
            {t("download")}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default ExportTableForm;
