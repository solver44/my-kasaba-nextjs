import React from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./industrial-organizations.module.scss";
import DataTables from "./dataTables";

export default function IndustrialOrganizations() {
  return (
    <div className={styles.containers}>
      <DataTables />
    </div>
  );
}

IndustrialOrganizations.layout = function (Component, t) {
  return (
    <HomeWrapper
      title={t("industrial-organizations.title")}
      desc={t("profile-page.desc")}
    >
      {Component}
    </HomeWrapper>
  );
};
