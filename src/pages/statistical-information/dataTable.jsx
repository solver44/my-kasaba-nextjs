import React, { useState }  from "react";
import { useTranslation } from "react-i18next";
import InDataTable from "@/components/InDataTable";

export default function DataTable() {
  const { t } = useTranslation();
  const [filteredRows, setFilteredRows] = useState(null);
  const columns = [
    { field: "id", headerName: "Kod", width: 1},
    { field: "date", headerName: t("statistical-information.date"), width: 102 },
    { field: "total", headerName: t("statistical-information.total"), minWidth: 200 },
    { field: "ku", headerName: t("statistical-information.ku"), minWidth: 79 },
    { field: "student", headerName: t("statistical-information.student"), minWidth: 150 },
    { field: "direktor", headerName: t("statistical-information.direktor"), minWidth: 130 },
    { field: "kuStudent", headerName: t("statistical-information.kuStudent"), minWidth: 130 },
    { field: "adr", headerName: t("statistical-information.adr"), minWidth: 110 },
    { field: "pesioners", headerName: t("statistical-information.pesioners"), minWidth: 244 },
    { field: "shtat", headerName: t("statistical-information.shtat"), minWidth: 133 },
  ];
  const handleSearch = (searchText) => {
    // Filter the rows based on the search text
    const filteredRows = rows.filter((row) => {
      // Customize this logic based on how you want to perform the search
      // For example, you can check if the 'name' field contains the search text
      return row.date.toLowerCase().includes(searchText.toLowerCase());
    });

    setFilteredRows(filteredRows);
  };
  const rows = [
    {
      id:1,
      date: "20.02.22",
      total: "21",
      ku: "1703",
      student: "32",
      direktor: "Mirzaev I.A.",
      kuStudent: "31",
      adr: "Navoiy",
      pesioners: "12345678",
      shtat: "4123847",

    },
    {
        id:2,
        date: "20.02.22",
        total: "21",
        ku: "1703",
        student: "32",
        direktor: "Mirzaev I.A.",
        kuStudent: "31",
        adr: "Navoiy",
        pesioners: "12345678",
        shtat: "4123847",
  
      },
      {
        id:3,
        date: "20.02.22",
        total: "21",
        ku: "1703",
        student: "32",
        direktor: "Mirzaev I.A.",
        kuStudent: "31",
        adr: "Navoiy",
        pesioners: "12345678",
        shtat: "4123847",
  
      },
      {
        id:4,
        date: "20.02.22",
        total: "21",
        ku: "1703",
        student: "32",
        direktor: "Mirzaev I.A.",
        kuStudent: "31",
        adr: "Navoiy",
        pesioners: "12345678",
        shtat: "4123847",
  
      },
      {
        id:5,
        date: "20.02.22",
        total: "21",
        ku: "1703",
        student: "32",
        direktor: "Mirzaev I.A.",
        kuStudent: "31",
        adr: "Navoiy",
        pesioners: "12345678",
        shtat: "4123847",
  
      },

   
  ];
  return <div>
     
      <InDataTable handle={handleSearch} columns={columns} rows={filteredRows !== null ? filteredRows : rows} />  
  </div> ;
}
