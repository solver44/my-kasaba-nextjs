import React from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./group-organizations.module.scss";
import DataTable from "../industrial-organizations/dataTables";

export default function GroupOrganizations() {
  return (
    <div className={styles.containers}>
      <DataTable isGroup={true} />
    </div>
  );
}

GroupOrganizations.layout = function (Component, t) {
  return (
    <HomeWrapper
      title={t("groupOrganizations")}
      desc={t("profile-page.desc")}
    >
      {Component}
    </HomeWrapper>
  );
};
