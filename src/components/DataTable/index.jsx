import React, { useRef, useState } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
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
    setShow(true);
  };

  const handleDeleteClick = (id) => {
    currentId.current = id;
    toggleDeleteDialog();
  };

  function toggleModal(value) {
    if (dataModal) setDataModal();
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
    }
    return column;
  });

  function closeModal() {
    if (isChanged.current) {
      showYesNoDialog(
        t("are-you-sure-close"),
        () => {
          toggleModal(false);
          isChanged.current = false;
        },
        () => {},
        t,
        "close",
        "leave"
      );
      return;
    }
    toggleModal(false);
  }

  return (
    <React.Fragment>
      <div className={[styles.wrapper, min ? styles.mini : ""].join(" ")}>
        <div className={styles.control}>
          <BigButton onClick={() => toggleModal()} Icon={AddIcon}>
            {t("add")}
          </BigButton>
        </div>
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
      </div>
      <ModalUI
        onSubmit={(data) => onSubmitModal(data, closeModal, !!dataModal)}
        onChanged={(data) => {
          if (onChangedModal) onChangedModal(data);
          if (Object.keys(data).length < 1) return;
          if (!Object.values(data).find((d) => d)) isChanged.current = false;
          else isChanged.current = true;
        }}
        isForm={isFormModal}
        open={show}
        full={fullModal}
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
