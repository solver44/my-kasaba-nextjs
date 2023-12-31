import React from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./team-contracts.module.scss";
import DataTable from "./dataTable";
import Tabs from "@/components/Tabs";
import useQueryPage from "@/hooks/useQueryPage";

export default function TermsContracts() {
  const { searchParams, addQueryToCurrentURL } = useQueryPage({
    tab: 1,
  });

  function onChangeTabs(index) {
    addQueryToCurrentURL({ tab: +index + 1 });
  }
  return (
    <div className={styles.containers}>
      <Tabs
        onChange={onChangeTabs}
        value={(searchParams.get("tab") ?? 1) - 1}
        tabs={[
          { label: "all", children: <DataTable /> },
          {
            label: "inanalysis",
            children: (
              <DataTable
                filter={(item) =>
                  item.status == "INANALYSIS" ||
                  item.status === "INEXECUTION" ||
                  item.status === "TO_CONFIRM"
                }
              />
            ),
          },
          {
            label: "considired",
            children: (
              <DataTable filter={(item) => item.status == "CONSIDERED"} />
            ),
          },
          {
            label: "confirmed",
            children: (
              <DataTable filter={(item) => item.status == "CONFIRMED"} />
            ),
          },
        ]}
      />
    </div>
  );
}

TermsContracts.layout = function (Component, t, bkutData) {
  return (
    <HomeWrapper title={bkutData?.name} desc={t("profile-page.desc")}>
      {Component}
    </HomeWrapper>
  );
};
