import React from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./team-contracts.module.scss";
import DataTable from "./dataTable";

export default function TermsContracts() {
  return (
    <div className={styles.containers}>
      <DataTable />
    </div>
  );
}

TermsContracts.layout = function (Component, t) {
  return (
    <HomeWrapper
      title={t("team-contracts.title")}
      desc={t("profile-page.desc")}
    >
      {Component}
    </HomeWrapper>
  );
};
