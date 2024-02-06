import React from "react";
import HomeWrapper from "../home/wrapper";
import { useTranslation } from "react-i18next";
import useQueryPage from "@/hooks/useQueryPage";
import Tabs from "@/components/Tabs";
import Tab1 from "./tab1";
import Tab2 from "./tab2";
import Tab3 from "./tab3";
import Tab4 from "./tab4";

export default function BasicToolsPage() {
  const { t } = useTranslation();
  const { searchParams, addQueryToCurrentURL } = useQueryPage({
    tab: 1,
  });

  function onChangeTabs(index) {
    addQueryToCurrentURL({ tab: +index + 1 });
  }

  return (
    <Tabs
      color={"primary"}
      onChange={onChangeTabs}
      value={(searchParams.get("tab") ?? 1) - 1}
      tabs={[
        {
          label: "basicTools.tab1",
          children: <Tab1 />,
        },
        {
          label: "basicTools.tab2",
          children: <Tab2 />,
        },
        {
          label: "basicTools.tab3",
          children: <Tab3 />,
        },
        {
          label: "basicTools.tab4",
          children: <Tab4 />,
        },
      ]}
    />
  );
}

BasicToolsPage.layout = function (Component, t, bkutData = {}) {
  return (
    <HomeWrapper title={t("basicTools.title")} desc={t("profile-page.desc")}>
      {Component}
    </HomeWrapper>
  );
};
