import React from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./statistical-information.module.scss";
import DataTable from "./dataTable";

export default function StatisticalInformation() {
  return (
    <div className={styles.containers}>
      <DataTable />
    </div>
  );
}

StatisticalInformation.layout = function (Component, t) {
  return (
    <HomeWrapper
      title={t("statistical-information.title")}
      desc={t("profile-page.desc")}
    >
      {Component}
    </HomeWrapper>
  );
};
