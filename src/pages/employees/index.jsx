import React, { useEffect, useState } from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./employees.module.scss";
import DataTable from "./dataTable";
import { useSelector } from "react-redux";

export default function Employees() {
  return (
    <div className={styles.containers}>
      <DataTable />
    </div>
  );
}

export function useEmployees() {
  const { bkutData = {} } = useSelector((state) => state);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!bkutData?.employees?.length) return;
    setData(
      bkutData.employees.map((e) => ({
        label: `${e.employee.firstName} ${e.employee.lastName} ${e.employee.middleName}`,
        value: e.employee.id,
      }))
    );
  }, [bkutData]);

  return [data, bkutData];
}

Employees.layout = function (Component, t) {
  return (
    <HomeWrapper title={t("employees.title")} desc={t("profile-page.desc")}>
      {Component}
    </HomeWrapper>
  );
};
