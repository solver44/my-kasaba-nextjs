import React, { useEffect, useState } from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./employees.module.scss";
import ActiveEmployeeDT from "./dataTable";
import { useSelector } from "react-redux";
import { getFIO } from "@/utils/data";
import Tabs from "@/components/Tabs";
import MembersDT from "../members/dataTable";
import AllEmployeesDT from "../members/allEmployeesDataTable";

export default function Employees() {
  return (
    <div className={styles.containers}>
      <Tabs
        tabs={[
          { label: "not-member-employees", children: <AllEmployeesDT /> },
          { label: "employees.title1", children: <ActiveEmployeeDT /> },
          { label: "member-employees", children: <MembersDT /> },
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
        label: getFIO(e.employee),
        value: e.employee.id,
      }))
    );
  }, [bkutData]);

  return [data, bkutData];
}

Employees.layout = function (Component, t, bkutData = {}) {
  return (
    <HomeWrapper
      // noHeader
      title={bkutData.name}
      desc={t("profile-page.desc")}
    >
      {Component}
    </HomeWrapper>
  );
};
