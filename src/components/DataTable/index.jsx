import React, { useEffect, useReducer, useRef, useState } from "react";
import styles from "./dataTable.module.scss";
import BigButton from "../BigButton";
import { useTranslation } from "react-i18next";
import PrintIcon from "@mui/icons-material/Print";
import CustomNoRowsOverlay from "./noRows";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import ModalUI from "../ModalUI";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import areEqual from "@/utils/areEqual";
import { showYesNoDialog } from "@/utils/dialog";
import MaterialReactTable, {
  MRT_FullScreenToggleButton,
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import { MRT_Localization_UZ } from "./uz";
import ArrowButton from "../ArrowButton";
import ExportTableForm from "@/utils/exportExcel";
import ImportTableForm from "@/utils/importExcel";
import { useSnackbar } from "notistack";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { getStatusColors } from "@/utils/data";
import { convertStringToFormatted } from "@/utils/date";

function DataTable({
  columns = [],
  onSubmitModal,
  onChangedModal,
  isFormModal,
  min,
  fullModal,
  topButtons,
  title,
  modalWidth,
  loading,
  bottomModal,
  fetchData,
  handleDeleteClick: func2,
  onImportRow,
  onImportFinished,
  hideExportImport,
  hideFirstButton,
  hideActions,
  hideImport,
  hideDelete,
  hides,
  bkutData,
  rows = [],
  modal = () => "",
}) {
  const { t } = useTranslation();
  const rerender = useReducer(() => ({}), {})[1];
  const [columnVisibility, setColumnVisibility] = useState({});
  const [density, setDensity] = useState("comfortable");
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { dataLoading } = useSelector((state) => state);

  const [show, setShow] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelection, _setRowSelection] = useState({});
  const rowSelectionRef = useRef({});
  const [tableInstanse, setTableInstanse] = useState();
  const [dataModal, setDataModal] = useState();
  const [openDilaog, setOpenDialog] = useState(false);
  const tableInstanceRef = useRef();
  const dataModalRef = useRef();
  const isChanged = useRef(false);
  const currentRow = useRef();

  const fullModalFunc = (data) =>
    typeof fullModal === "function" ? fullModal(data) : !!fullModal;

  function setRowSelection(func) {
    let value = func;
    if (typeof func === "function") value = func(rowSelectionRef.current);
    _setRowSelection(value);
    rowSelectionRef.current = value;
  }

  useEffect(() => {
    if (!tableInstanceRef.current) return;
    setTableInstanse(tableInstanceRef.current);
  }, []);

  const toggleDeleteDialog = () => {
    setOpenDialog(!openDilaog);
  };

  const handleViewClick = async (row) => {
    const data = await fetchData(row.id);
    setDataModal(data);
    dataModalRef.current = data;
    setShow(true);
  };

  const handleDeleteClick = (row) => {
    currentRow.current = row;
    toggleDeleteDialog();
  };

  function toggleModal(value, row) {
    if (row) {
      handleViewClick(row);
      return;
    }
    if (dataModalRef.current) {
      setDataModal();
      dataModalRef.current = null;
    }
    if (typeof value === "boolean") {
      setShow(value);
      return;
    }
    setShow(!show);
  }

  const importExportColumns = columns.filter((c) => !c?.onlyShow);
  const modifiedColumns = columns
    .filter((c) => !c.hidden)
    .map((column) => {
      const temp = {
        size: column.size,
        accessorKey: column.field,
        header: t(column.headerName),
      };
      if (column.type === "status") {
        return {
          ...temp,
          Cell: ({ cell }) => {
            const v = cell.getValue();
            const val = v?.value || v;
            const translateKey = t("status." + val);
            const color = v?.color ? v.color : getStatusColors(val);
            return (
              <div className={styles.statusChip}>
                <Chip label={translateKey} size="small" color={color} />
                {v?.date && <span>{convertStringToFormatted(v.date)}</span>}
              </div>
            );
          },
        };
      } else if (column.type === "boolean") {
        return {
          ...temp,
          Cell: ({ cell }) => <Checkbox defaultChecked={cell.getValue()} />,
        };
      } else if (column.type === "chip") {
        return {
          ...temp,
          Cell: ({ cell }) => {
            const val = cell.getValue();
            return (Array.isArray(val) ? val : []).map((p) => (
              <Chip
                color="primary"
                variant="outlined"
                clickable
                key={p}
                label={p}
              />
            ));
          },
        };
      }
      //  else if ((column.field ?? "").includes("Date")) {
      //   return {
      //     ...temp,
      //     Cell: ({ cell }) => convertStringToFormatted(cell.getValue()),
      //   };
      // }
      return temp;
    });

  function closeModal() {
    // const isView = !!dataModalRef.current;
    if (isChanged.current) {
      showYesNoDialog(
        t("are-you-sure-close"),
        () => {
          toggleModal(false);
          isChanged.current = false;
        },
        () => (isChanged.current = false),
        t,
        "close",
        "leave"
      );
      return;
    }
    toggleModal(false);
    isChanged.current = false;
  }
  function forceCloseModal() {
    toggleModal(false);
    isChanged.current = false;
  }

  function importExportClick(index) {
    if (index === 0) {
      setOpenExportModal((o) => !o);
    } else {
      setOpenImportModal((o) => !o);
    }
  }
  async function onImportData(data = [], setProgress, onFinish) {
    if (!onImportRow) return;
    let countError = 0;
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      await new Promise((res) => setTimeout(res, 1000));
      const result = await onImportRow(row);
      if (!result) countError++;
      setProgress(i + 1);
      if (countError > 3) {
        enqueueSnackbar(t("error-import-data"), { variant: "error" });
        break;
      }
    }
    if (onImportFinished) onImportFinished();
    onFinish();
  }

  return (
    <React.Fragment>
      <ExportTableForm
        columns={importExportColumns}
        title={title}
        rows={rows}
        handleClose={() => setOpenExportModal(false)}
        isOpen={openExportModal}
      />
      <ImportTableForm
        onUpload={onImportData}
        columns={importExportColumns}
        title={title}
        handleClose={() => setOpenImportModal(false)}
        isOpen={openImportModal}
      />
      <div className={[styles.wrapper, min ? styles.mini : ""].join(" ")}>
        <div className={styles.control}>
          {tableInstanse && (
            <React.Fragment>
              <Box className={styles.row}>
                <MRT_GlobalFilterTextField table={tableInstanse} />
                <MRT_ToggleFiltersButton table={tableInstanse} />
                <MRT_ShowHideColumnsButton table={tableInstanse} />
                <MRT_ToggleDensePaddingButton table={tableInstanse} />
                <Tooltip arrow title={t("print")}>
                  <IconButton onClick={() => window.print()}>
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
                <MRT_FullScreenToggleButton table={tableInstanse} />
                {!hideExportImport && (
                  <ArrowButton
                    disabled={rows.length < 1}
                    color="success"
                    onClick={importExportClick}
                    options={
                      hideImport
                        ? [t("export-to-excel")]
                        : [t("export-to-excel"), t("import-from-excel")]
                    }
                  />
                )}
              </Box>
              <Box sx={{ display: "flex", gap: "10px" }}>
                {topButtons && topButtons(selectedRows, toggleModal)}
                {!hideFirstButton && (
                  <BigButton onClick={() => toggleModal()} Icon={AddIcon}>
                    {t("add")}
                  </BigButton>
                )}
              </Box>
            </React.Fragment>
          )}
        </div>
        <MaterialReactTable
          tableInstanceRef={tableInstanceRef}
          data={rows}
          columns={modifiedColumns}
          enableColumnResizing
          enablePinning
          enableRowNumbers
          enableStickyHeader
          // enableMultiRowSelection={false}
          // enableRowSelection
          onRowSelectionChange={setRowSelection}
          muiTableBodyRowProps={({ row }) => {
            const isSelected = rowSelection[row.id];
            let rowStyles = { cursor: "pointer" };

            if (isSelected) {
              rowStyles = {
                ...rowStyles,
                backgroundColor: "var(--row-selected-color) !important",
              };
            }

            return {
              onClick: () => {
                let isSelected = false;
                setRowSelection((prev) => {
                  if (!isSelected) isSelected = !prev[row.id];
                  return {
                    // ...prev,
                    [row.id]: !prev[row.id],
                  };
                });
                setSelectedRows(isSelected ? [row.original] : []);
              },
              selected: isSelected,
              sx: rowStyles,
            };
          }}
          rowNumberMode="static"
          localization={MRT_Localization_UZ}
          enableTopToolbar={false}
          initialState={{ showGlobalFilter: true, showAlertBanner: true }}
          onColumnVisibilityChange={(updater) => {
            setColumnVisibility((prev) =>
              updater instanceof Function ? updater(prev) : updater
            );
            queueMicrotask(rerender); //hack to rerender after state update
          }}
          onDensityChange={(updater) => {
            setDensity((prev) =>
              updater instanceof Function ? updater(prev) : updater
            );
            queueMicrotask(rerender); //hack to rerender after state update
          }}
          onShowColumnFiltersChange={(updater) => {
            setShowColumnFilters((prev) =>
              updater instanceof Function ? updater(prev) : updater
            );
            queueMicrotask(rerender); //hack to rerender after state update
          }}
          state={{
            columnVisibility,
            density,
            showColumnFilters,
            isLoading: loading || dataLoading,
            rowSelection,
          }}
          muiTablePaperProps={{
            elevation: 0,
            sx: {
              height: "100%",
              border: "1px solid #e0e0e0",
              borderRadius: "var(--input-radius)",
            },
          }}
          muiTableContainerProps={{ sx: { height: "91%" } }}
          muiTableBodyProps={{
            sx: () => ({
              height: "100%",
              // "& tr:nth-of-type(odd)": {
              //   backgroundColor: "var(--row-color)",
              // },
            }),
          }}
          muiTableHeadCellProps={{
            sx: {
              flex: "0 0 auto",
              fontSize: "var(--table-font-size)",
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              flex: "0 0 auto",
              fontSize: "var(--table-row-font-size)",
            },
          }}
          // className={[styles.dataTable, min ? styles.mini : ""].join(" ")}
          enableRowActions={!hideActions}
          renderEmptyRowsFallback={CustomNoRowsOverlay}
          renderRowActions={({ row }) => {
            return (
              <Box className={styles.row}>
                <IconButton onClick={() => handleViewClick(row.original)}>
                  <VisibilityIcon />
                </IconButton>
                {!hideDelete && (
                  <IconButton onClick={() => handleDeleteClick(row.original)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            );
          }}
        />
      </div>
      <ModalUI
        onSubmit={(data) =>
          onSubmitModal(data, forceCloseModal, !!dataModal, dataModal)
        }
        onChanged={(_isChanged, data) => {
          if (onChangedModal) onChangedModal(data);
          isChanged.current = _isChanged;
        }}
        bkutData={bkutData}
        isForm={isFormModal}
        open={show}
        full={fullModalFunc(dataModal)}
        title={title}
        loading={loading}
        modalWidth={modalWidth}
        isView={!!dataModal}
        dataModal={dataModal}
        bottomModal={bottomModal}
        handleClose={closeModal}
        hideBtn={hides}
      >
        {modal(closeModal, dataModal ?? {})}
      </ModalUI>
      <Dialog
        open={openDilaog}
        onClose={toggleDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="row">
          <DeleteForeverIcon color="error" className={styles.deleteIcon} />
          <div>
            <DialogTitle className={styles.dialogTitle} id="alert-dialog-title">
              {t("delete-title")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t("are-you-sure-delete")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={toggleDeleteDialog}>{t("no")}</Button>
              <Button
                onClick={() => {
                  func2 && func2(currentRow.current.id, currentRow.current);
                  toggleDeleteDialog();
                }}
                autoFocus
                color="error"
              >
                {t("yes")}
              </Button>
            </DialogActions>
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
}

export default React.memo(DataTable, areEqual);
