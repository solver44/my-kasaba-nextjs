import React from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./group-organizations.module.scss";
import DataTable from "./dataTable";

export default function GroupOrganizations() {
  return (
    <div className={styles.containers}>
      <DataTable />
    </div>
  );
}

GroupOrganizations.layout = function (Component, t) {
  return (
    <HomeWrapper
      title={t("group-organizations.title")}
      desc={t("profile-page.desc")}
    >
      {Component}
    </HomeWrapper>
  );
};
