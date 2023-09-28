import React, { useState }  from "react";
import { useTranslation } from "react-i18next";
import InDataTable from "@/components/InDataTable";
import BigButton from "@/components/BigButton";
import styles from "./members.module.scss";
import AddIcon from "@mui/icons-material/Add";

export default function DataTable() {
  const { t } = useTranslation();
  const [filteredRows, setFilteredRows] = useState(null);
  const columns = [
    { field: "id", headerName: "Kod", width: 1},
    { field: "fio", headerName: t("employess.fio"), width: 394 },
    { field: "position", headerName: t("employess.position"), minWidth: 395 },
    { field: "tel", headerName: t("employess.tel"), minWidth: 230 },
    { field: "email", headerName: t("employess.email"), minWidth: 267 },
   
  ];
  const handleSearch = (searchText) => {
    // Filter the rows based on the search text
    const filteredRows = rows.filter((row) => {
      // Customize this logic based on how you want to perform the search
      // For example, you can check if the 'name' field contains the search text
      return row.name.toLowerCase().includes(searchText.toLowerCase());
    });

    setFilteredRows(filteredRows);
  };
  const rows = [
    {
      id:1,
      fio: "Jo’rayeva Nafisa",
      position: "Buxgalter",
      tel: "+998971234567",
      email: "Buxgalter@gmail.com",
    },
    {
        id:2,
        fio: "Jo’rayeva Nafisa",
        position: "Buxgalter",
        tel: "+998971234567",
        email: "Buxgalter@gmail.com",
      },
      {
        id:3,
        fio: "Jo’rayeva Nafisa",
        position: "Buxgalter",
        tel: "+998971234567",
        email: "Buxgalter@gmail.com",
      },
      {
        id:4,
        fio: "Jo’rayeva Nafisa",
        position: "Buxgalter",
        tel: "+998971234567",
        email: "Buxgalter@gmail.com",
      },
      {
        id:5,
        fio: "Jo’rayeva Nafisa",
        position: "Buxgalter",
        tel: "+998971234567",
        email: "Buxgalter@gmail.com",
      },
  

   
  ];
  return <div>
        <div className={styles.control}>
            <div className={styles.btn}>
                <BigButton Icon={AddIcon}>{t("add")}</BigButton>
            </div>
        </div>
        
      <InDataTable handle={handleSearch} columns={columns} rows={filteredRows !== null ? filteredRows : rows} />
  </div> ;
}
