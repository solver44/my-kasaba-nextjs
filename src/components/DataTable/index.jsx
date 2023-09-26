import React from "react";
import styles from "./dataTable.module.scss";
import { DataGrid } from "@mui/x-data-grid";
import BigButton from "../BigButton";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";

export default function DataTable({ columns, rows }) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.control}>
        <BigButton Icon={AddIcon}>{t("add")}</BigButton>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        className={styles.dataTable}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}
