import React from "react";
import styles from "./registerBkut.module.scss";
import { useTranslation } from "react-i18next";
import DataTable from "../../components/DataTable";

export default function Step2() {
  const { t } = useTranslation();

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "fio", headerName: t("fio"), minWidth: 180 },
    { field: "position", headerName: t("job-position") },
    { field: "phoneNumber", headerName: t("phone-number"), minWidth: 120 },
    { field: "email", headerName: t("email"), minWidth: 200 },
  ];

  const rows = [
    {
      id: 1,
      fio: "Toshbolta Xotamov",
      position: "Mutaxassis",
      phoneNumber: "+123456789",
      email: "musaffo@osmon.com",
    },
    {
      id: 2,
      fio: "Qalandar Ochildiyev",
      position: "Mutaxassis",
      phoneNumber: "+123456789",
      email: "musaffo@osmon.com",
    },
    {
      id: 3,
      fio: "Teshavoy O'rmonov",
      position: "Buxgalter",
      phoneNumber: "+123456789",
      email: "musaffo@osmon.com",
    },
  ];
  return <DataTable columns={columns} rows={rows} />;
}
