import React, { useMemo, useRef, useState } from "react";
import styles from "./dataTable.module.scss";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import BigButton from "../BigButton";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Paper,
} from "@mui/material";
import CustomNoRowsOverlay from "./noRows";
import { localizationTable } from "./localization";
import ModalUI from "../ModalUI";
import { replaceValuesInArray } from "@/utils/data";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import areEqual from "@/utils/areEqual";
import { showYesNoDialog } from "@/utils/dialog";
import MaterialReactTable from "material-react-table";

function CustomToolbar() {
  return (
    <GridToolbarContainer className={styles.toolbars}>
      <GridToolbarFilterButton className={styles.tool} variant="outlined" />
      <GridToolbarColumnsButton className={styles.tool} variant="outlined" />
      <GridToolbarDensitySelector className={styles.tool} variant="outlined" />
      <GridToolbarExport className={styles.tool} variant="outlined" />
    </GridToolbarContainer>
  );
}

function DataTable({
  columns = [],
  onSubmitModal,
  onChangedModal,
  isFormModal,
  min,
  fullModal,
  modalWidth,
  loading,
  bottomModal,
  fetchData,
  handleDeleteClick: func2,
  rows,
  modal = () => "",
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [dataModal, setDataModal] = useState();
  const dataModalRef = useRef();
  const { dataLoading } = useSelector((state) => state);
  const [openDilaog, setOpenDialog] = useState(false);
  const currentId = useRef();
  const isChanged = useRef(false);

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

  // Define a function to render boolean values as checkboxes
  function renderBooleanCell(params) {
    return <input type="checkbox" checked={params.value} readOnly />;
  }

  // Modify the columns definition to conditionally render checkboxes
  const modifiedColumns = [
    ...columns,
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => handleViewClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ].map((column) => {
    if (column.type === "boolean") {
      return {
        ...column,
        valueGetter: (params) => params.row[column.field], // Extract boolean value
        renderCell: renderBooleanCell, // Render as checkbox
      };
    } else if (column.type === "chip") {
      return {
        ...column,
        valueGetter: (params) => params.row[column.field], // Extract boolean value
        renderCell: (params) =>
          (params.value ?? []).map((p) => (
            <Chip
              color="primary"
              variant="outlined"
              clickable
              key={p}
              label={p}
            />
          )),
      };
    }
    return column;
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

  // const modColumns = useMemo(
  //   () =>
  //     modifiedColumns.map((c) => ({
  //       ...c,
  //       accessorKey: c.field,
  //       header: c.headerName,
  //     })),
  //   []
  // );

  return (
    <React.Fragment>
      <div className={[styles.wrapper, min ? styles.mini : ""].join(" ")}>
        <div className={styles.control}>
          <BigButton onClick={() => toggleModal()} Icon={AddIcon}>
            {t("add")}
          </BigButton>
        </div>
        {/* <MaterialReactTable
          data={rows}
          columns={modColumns}
          enableColumnResizing
          localization={localizationTable(t)}
          muiTableProps={{
            sx: {
              fontSize: 20,
            },
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
          className={[styles.dataTable, min ? styles.mini : ""].join(" ")}
          loading={loading || dataLoading}
          slots={{
            toolbar: CustomToolbar,
            loadingOverlay: LinearProgress,
            noRowsOverlay: CustomNoRowsOverlay,
          }}
        /> */}
        <Paper elevation={3} className={styles.paper}>
          <DataGrid
            rowSelection
            checkboxSelection={false}
            rows={replaceValuesInArray(rows)}
            columns={modifiedColumns} // Use the modified columns definition
            loading={loading || dataLoading}
            className={[styles.dataTable, min ? styles.mini : ""].join(" ")}
            slots={{
              toolbar: CustomToolbar,
              loadingOverlay: LinearProgress,
              noRowsOverlay: CustomNoRowsOverlay,
            }}
            localeText={localizationTable(t)}
          />
        </Paper>
      </div>
      <ModalUI
        onSubmit={(data) => onSubmitModal(data, forceCloseModal, !!dataModal)}
        onChanged={(_isChanged, data) => {
          if (onChangedModal) onChangedModal(data);
          isChanged.current = _isChanged;
        }}
        isForm={isFormModal}
        open={show}
        full={fullModal}
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
