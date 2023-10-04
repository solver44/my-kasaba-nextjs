import React from "react";
import styles from "./dataTable2.module.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import SearchButton from "../SearchButton";
import {FilterAlt, Launch} from '@mui/icons-material';

export default function InDataTable({ columns, rows, handle }) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.control}>
        <SearchButton onSearch={handle} />
        <div>
            <Launch className={styles.icn}/>
            <FilterAlt className={styles.icn}/>
            
        </div>
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
