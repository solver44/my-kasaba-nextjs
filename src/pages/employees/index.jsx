import React from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./employees.module.scss";
import DataTable from "./dataTable";

export default function Employees() {
  return (
    <div className={styles.containers}>
      <DataTable />
    </div>
  );
}

Employees.layout = function (Component, t) {
  return (
    <HomeWrapper title={t("employess.title")} desc={t("profile-page.desc")}>
      {Component}
    </HomeWrapper>
  );
};
