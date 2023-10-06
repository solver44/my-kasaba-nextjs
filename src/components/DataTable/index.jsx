import React, { useState } from "react";
import styles from "./dataTable.module.scss";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import BigButton from "../BigButton";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { LinearProgress } from "@mui/material";
import CustomNoRowsOverlay from "./noRows";
import { localizationTable } from "./localization";
import ModalUI from "../ModalUI";

export default function DataTable({
  columns,
  onSubmitModal,
  isFormModal,
  loading,
  rows,
  modal = () => "",
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  function toggleModal(value) {
    if (value !== undefined) {
      setShow(value);
      return;
    }
    setShow(!show);
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer className={styles.toolbars}>
        <GridToolbarFilterButton className={styles.tool} variant="outlined" />
        <GridToolbarColumnsButton className={styles.tool} variant="outlined" />
        <GridToolbarDensitySelector
          className={styles.tool}
          variant="outlined"
        />
        <GridToolbarExport className={styles.tool} variant="outlined" />
      </GridToolbarContainer>
    );
  }

  return (
    <React.Fragment>
      <div className={styles.wrapper}>
        <div className={styles.control}>
          <BigButton onClick={() => toggleModal()} Icon={AddIcon}>
            {t("add")}
          </BigButton>
        </div>
        <DataGrid
          checkboxSelection
          disableRowSelectionOnClick
          rows={rows}
          // autoPageSize
          disableColumnMenu
          columns={columns}
          loading={loading}
          className={styles.dataTable}
          // pageSizeOptions={[5, 10, 25]}
          slots={{
            toolbar: CustomToolbar,
            loadingOverlay: LinearProgress,
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          localeText={localizationTable(t)}
        />
      </div>
      <ModalUI
        onSubmit={(data) => onSubmitModal(data, () => toggleModal(false))}
        isForm={isFormModal}
        open={show}
        handleClose={() => toggleModal(false)}
      >
        {modal(() => toggleModal(false))}
      </ModalUI>
    </React.Fragment>
  );
}
