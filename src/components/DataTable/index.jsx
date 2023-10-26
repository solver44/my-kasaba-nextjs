import React, { useEffect, useReducer, useRef, useState } from "react";
import styles from "./dataTable.module.scss";
import BigButton from "../BigButton";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import PrintIcon from "@mui/icons-material/Print";
import CustomNoRowsOverlay from "./noRows";
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
import { replaceValuesInArray } from "@/utils/data";
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

function DataTable({
  columns = [],
  onSubmitModal,
  onChangedModal,
  isFormModal,
  min,
  fullModal,
  title,
  modalWidth,
  loading,
  bottomModal,
  fetchData,
  handleDeleteClick: func2,
  onImportRow,
  onImportFinished,
  hideExportImport,
  hideImport,
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
  const [tableInstanse, setTableInstanse] = useState();
  const [dataModal, setDataModal] = useState();
  const [openDilaog, setOpenDialog] = useState(false);
  const tableInstanceRef = useRef();
  const dataModalRef = useRef();
  const isChanged = useRef(false);
  const currentId = useRef();

  useEffect(() => {
    if (!tableInstanceRef.current) return;
    setTableInstanse(tableInstanceRef.current);
  }, []);

  const toggleDeleteDialog = () => {
    setOpenDialog(!openDilaog);
  };

  const handleViewClick = async (id) => {
    const data = await fetchData(id);
    setDataModal(data);
    dataModalRef.current = data;
    setShow(true);
  };

  const handleDeleteClick = (id) => {
    currentId.current = id;
    toggleDeleteDialog();
  };

  function toggleModal(value) {
    if (dataModalRef.current) {
      setDataModal();
      dataModalRef.current = null;
    }
    if (value !== undefined) {
      setShow(value);
      return;
    }
    setShow(!show);
  }

  const modifiedColumns = columns
    .filter((c) => !c.hidden)
    .map((column) => {
      const temp = {
        size: column.size,
        accessorKey: column.field,
        header: t(column.headerName),
      };
      if (column.type === "boolean") {
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
        columns={columns}
        title={title}
        rows={rows}
        handleClose={() => setOpenExportModal(false)}
        isOpen={openExportModal}
      />
      <ImportTableForm
        onUpload={onImportData}
        columns={columns}
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
              <Box>
                <BigButton onClick={() => toggleModal()} Icon={AddIcon}>
                  {t("add")}
                </BigButton>
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
          rowNumberMode="static"
          localization={MRT_Localization_UZ}
          enableTopToolbar={false}
          initialState={{ showGlobalFilter: true }}
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
              "& tr:nth-of-type(odd)": {
                backgroundColor: "var(--row-color)",
              },
            }),
          }}
          muiTableHeadCellProps={{
            sx: {
              flex: "0 0 auto",
              fontSize: 18,
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              flex: "0 0 auto",
              fontSize: 18,
            },
          }}
          // className={[styles.dataTable, min ? styles.mini : ""].join(" ")}
          enableRowActions
          renderEmptyRowsFallback={CustomNoRowsOverlay}
          renderRowActions={({ row }) => {
            const id = row.original.id;
            return (
              <Box className={styles.row}>
                <IconButton onClick={() => handleViewClick(id)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          }}
        />
      </div>
      <ModalUI
        onSubmit={(data) => onSubmitModal(data, forceCloseModal, !!dataModal)}
        onChanged={(_isChanged, data) => {
          if (onChangedModal) onChangedModal(data);
          isChanged.current = _isChanged;
        }}
        bkutData={bkutData}
        isForm={isFormModal}
        open={show}
        full={fullModal}
        title={title}
        loading={loading}
        modalWidth={modalWidth}
        isView={!!dataModal}
        bottomModal={bottomModal}
        handleClose={closeModal}
      >
        {modal(closeModal, dataModal ?? {})}
      </ModalUI>
      <Dialog
        open={openDilaog}
        onClose={toggleDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t("delete-title")}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("are-you-sure-delete")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDeleteDialog}>{t("no")}</Button>
          <Button
            onClick={() => {
              func2 && func2(currentId.current);
              toggleDeleteDialog();
            }}
            autoFocus
          >
            {t("yes")}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default React.memo(DataTable, areEqual);
