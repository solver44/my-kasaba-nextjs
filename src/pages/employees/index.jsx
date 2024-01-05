import React, { useEffect, useState } from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./employees.module.scss";
import { useSelector } from "react-redux";
import { getFIO } from "@/utils/data";
import Tabs from "@/components/Tabs";
import DataTable from "./dataTable";
import useQueryPage from "@/hooks/useQueryPage";

export default function Employees() {
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
          { label: "all-employees", children: <DataTable /> },
          { label: "member-employees", children: <DataTable filter={(data) => data.isMember} /> },
          { label: "employees.title1", children: <DataTable filter={(data) => data.isKasabaActive} /> },
        ]}
      />
    </div>
  );
}

export function useEmployees() {
  const { bkutData = {} } = useSelector((state) => state);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!bkutData?.employees?.length) return;
    setData(
      bkutData.employees.map((e) => ({
        label: getFIO(e.individual),
        value: e.individual.id,
      }))
    );
  }, [bkutData]);

  return [data, bkutData];
}

Employees.layout = function (Component, t, bkutData = {}) {
  return (
    <HomeWrapper title={bkutData.name} desc={t("profile-page.desc")}>
      {Component}
    </HomeWrapper>
  );
};
