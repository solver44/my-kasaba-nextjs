import React from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./members.module.scss";
import DataTable from "./dataTable";

export default function Members() {
  return (
    <div className={styles.containers}>
      <DataTable />
    </div>
  );
}

Members.layout = function (Component, t) {
  return (
    <HomeWrapper title={t("memberss.title")} desc={t("profile-page.desc")}>
      {Component}
    </HomeWrapper>
  );
};
