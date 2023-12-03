import React from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./team-contracts.module.scss";
import DataTable from "./allTeam";
import Tabs from "@/components/Tabs";
import useQueryPage from "@/hooks/useQueryPage";
import InDataTable from "./showTeam";
import Confirmed from "./confirmedTeam";
import ReturnTeam from "./returnTeam";

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
          { label: "all-team", children: <DataTable /> },
          { label: "show-team", children: <InDataTable/> },
          { label: "return-team", children: <ReturnTeam/> },
          { label: "accept-team", children: <Confirmed/> },
          { label: "onejshTeam", children: "Qaytarilgan" },
        ]}
      />
      
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
