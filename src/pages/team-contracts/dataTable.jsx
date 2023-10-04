import React, { useState }  from "react";
import { useTranslation } from "react-i18next";
import InDataTable from "@/components/InDataTable";

export default function DataTable() {
  const { t } = useTranslation();
  const [filteredRows, setFilteredRows] = useState(null);
  const columns = [
    { field: "id", headerName: "Kod", width: 1},
    { field: "contractDate", headerName: t("team-contracts.contractDate"), width: 179 },
    { field: "firstOrganization", headerName: t("team-contracts.firstOrganization"), minWidth: 395 },
    { field: "agreeDate", headerName: t("team-contracts.agreeDate"), minWidth: 230 },
    { field: "sign", headerName: t("team-contracts.sign"), minWidth: 267 },
    { field: "signK", headerName: t("team-contracts.signK"), minWidth: 255 },
   
  ];
  const handleSearch = (searchText) => {
    // Filter the rows based on the search text
    const filteredRows = rows.filter((row) => {
      // Customize this logic based on how you want to perform the search
      // For example, you can check if the 'name' field contains the search text
      return row.contractDate.toLowerCase().includes(searchText.toLowerCase());
    });

    setFilteredRows(filteredRows);
  };
  const rows = [
    {
      id:1,
      contractDate: "20.02.22",
      firstOrganization: "1703",
      agreeDate: "02.02.2023",
      sign: "Mirzaev I.A.",
      signK: "Navoiy",

    },
    {
        id:2,
        contractDate: "20.02.22",
        firstOrganization: "1703",
        agreeDate: "02.02.2023",
        sign: "Mirzaev I.A.",
        signK: "Navoiy",
  
      },
      {
        id:3,
        contractDate: "20.02.22",
        firstOrganization: "1703",
        agreeDate: "02.02.2023",
        sign: "Mirzaev I.A.",
        signK: "Navoiy",
  
      },
      {
        id:4,
        contractDate: "20.02.22",
        firstOrganization: "1703",
        agreeDate: "02.02.2023",
        sign: "Mirzaev I.A.",
        signK: "Navoiy",
  
      },
      {
        id:5,
        contractDate: "20.02.22",
        firstOrganization: "1703",
        agreeDate: "02.02.2023",
        sign: "Mirzaev I.A.",
        signK: "Navoiy",
  
      },
  

   
  ];
  return <div>
     
      <InDataTable handle={handleSearch} columns={columns} rows={filteredRows !== null ? filteredRows : rows} />  
  </div> ;
}
