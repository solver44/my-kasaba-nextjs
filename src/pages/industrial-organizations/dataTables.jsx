import React, { useState }  from "react";
import { useTranslation } from "react-i18next";
import DataTable from "../../components/DataTable";
import SearchButton from "@/components/SearchButton";
import InDataTable from "@/components/InDataTable";

export default function DataTables() {
  const { t } = useTranslation();
  const [filteredRows, setFilteredRows] = useState(null);
  const columns = [
    { field: "id", headerName: "Kod", width: 102 },
    { field: "name", headerName: t("industrial-organizations.name"), minWidth: 200 },
    { field: "worker", headerName: t("industrial-organizations.worker"), minWidth: 79 },
    { field: "statistic", headerName: t("industrial-organizations.statistic"), minWidth: 79 },
    { field: "direktor", headerName: t("industrial-organizations.direktor"), minWidth: 150 },
    { field: "firstorg", headerName: t("industrial-organizations.firstorg"), minWidth: 130 },
    { field: "tel", headerName: t("industrial-organizations.tel"), minWidth: 110 },
    { field: "soato", headerName: t("industrial-organizations.soato"), minWidth: 100 },
    { field: "adr", headerName: t("industrial-organizations.adr"), minWidth: 110 },
    { field: "okpo", headerName: t("industrial-organizations.okpo"), minWidth: 70 },
    { field: "type", headerName: t("industrial-organizations.type"), minWidth: 110 },
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
      id: 202314,
      name: "Madadkor qurilish korxonasi KU qo’mitasi",
      worker: "1703",
      statistic: "20",
      direktor: "Mirzaev I.A.",
      firstorg: "Adliya vazirligi",
      tel: "+998971234567",
      soato: "12345678",
      adr: "Navoiy ",
      okpo: "4123847",
      type: "",

    },
    {
        id: 202314,
        name: "Madadkor qurilish korxonasi KU qo’mitasi",
        worker: "1703",
        statistic: "20",
        direktor: "Mirzaev I.A.",
        firstorg: "Adliya vazirligi",
        tel: "+998971234567",
        soato: "12345678",
        adr: "Navoiy ",
        okpo: "4123847",
        type: "",
  
      },
      {
        id: 202314,
        name: "Madadkor qurilish korxonasi KU qo’mitasi",
        worker: "1703",
        statistic: "20",
        direktor: "Mirzaev I.A.",
        firstorg: "Adliya vazirligi",
        tel: "+998971234567",
        soato: "12345678",
        adr: "Navoiy ",
        okpo: "4123847",
        type: "",
  
      },
      {
        id: 202314,
        name: "Madadkor qurilish korxonasi KU qo’mitasi",
        worker: "1703",
        statistic: "20",
        direktor: "Mirzaev I.A.",
        firstorg: "Adliya vazirligi",
        tel: "+998971234567",
        soato: "12345678",
        adr: "Navoiy ",
        okpo: "4123847",
        type: "",
  
      },
      {
        id: 202314,
        name: "Madadkor qurilish korxonasi KU qo’mitasi",
        worker: "1703",
        statistic: "20",
        direktor: "Mirzaev I.A.",
        firstorg: "Adliya vazirligi",
        tel: "+998971234567",
        soato: "12345678",
        adr: "Navoiy ",
        okpo: "4123847",
        type: "",
  
      },
      {
        id: 202314,
        name: "Madadkor qurilish korxonasi KU qo’mitasi",
        worker: "1703",
        statistic: "20",
        direktor: "Mirzaev I.A.",
        firstorg: "Adliya vazirligi",
        tel: "+998971234567",
        soato: "12345678",
        adr: "Navoiy ",
        okpo: "4123847",
        type: "",
  
      },
      {
        id: 202314,
        name: "Madadkor qurilish korxonasi KU qo’mitasi",
        worker: "1703",
        statistic: "20",
        direktor: "Mirzaev I.A.",
        firstorg: "Adliya vazirligi",
        tel: "+998971234567",
        soato: "12345678",
        adr: "Navoiy ",
        okpo: "4123847",
        type: "",
  
      },
      {
        id: 202314,
        name: "Madadkor qurilish korxonasi KU qo’mitasi",
        worker: "1703",
        statistic: "20",
        direktor: "Mirzaev I.A.",
        firstorg: "Adliya vazirligi",
        tel: "+998971234567",
        soato: "12345678",
        adr: "Navoiy ",
        okpo: "4123847",
        type: "",
  
      },
      {
        id: 202314,
        name: "Madadkor qurilish korxonasi KU qo’mitasi",
        worker: "1703",
        statistic: "20",
        direktor: "Mirzaev I.A.",
        firstorg: "Adliya vazirligi",
        tel: "+998971234567",
        soato: "12345678",
        adr: "Navoiy ",
        okpo: "4123847",
        type: "",
  
      },
      {
        id: 202314,
        name: "Madadkor qurilish korxonasi KU qo’mitasi",
        worker: "1703",
        statistic: "20",
        direktor: "Mirzaev I.A.",
        firstorg: "Adliya vazirligi",
        tel: "+998971234567",
        soato: "12345678",
        adr: "Navoiy ",
        okpo: "4123847",
        type: "",
  
      },
  ];
  return <div>
     
      <InDataTable handle={handleSearch} columns={columns} rows={filteredRows !== null ? filteredRows : rows} />  
  </div> ;
}
