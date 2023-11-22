import React from "react";
import styles from "./home/home.module.scss";
import HomeWrapper from "./home/wrapper";
import Card from "@/components/Card";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Alert, AlertTitle } from "@mui/material";

export default function Home() {
  const { bkutData = {} } = useSelector((states) => states);
  const { t } = useTranslation();
  const { members = [] } = bkutData;
  console.log(bkutData);

  const studentCount = members.filter((m) => m.isStudent).length;
  const pensionerCount = members.filter((m) => m.isPensioner).length;
  const homemakerCount = members.filter((m) => m.isHomemaker).length;
  const invalidCount = members.filter((m) => m.isInvalid).length;

  const data = [
    {
      isPensioner: pensionerCount,
    },
    {
      isStudent: studentCount,
    },
    {
      isHomemaker: homemakerCount,
    },
    {
      isInvalid: invalidCount,
    },
  ];

  return (
    <React.Fragment>
      {bkutData?.status == 4 && bkutData?.rejectReason && (
        <Alert style={{ width: "100%" }} severity="error">
          <AlertTitle>Qaytarildi</AlertTitle>
          {bkutData.rejectReason}
        </Alert>
      )}
      <h1 className={styles.titleHome}>{bkutData.name}</h1>
      <div className={styles.grid}>
        <Card
          value={bkutData.employees?.length ?? 0}
          label={t("allEmployeesTitle")}
        />
        <Card value={bkutData.members?.length ?? 0} label={t("members")} />
        <Card
          value={
            (bkutData.organizations ?? []).filter(
              (d) => d.organizationType == "SEH"
            )?.length
          }
          label={t("industrialOrganizations")}
        />
        <Card
          value={
            (bkutData.organizations ?? []).filter(
              (d) => d.organizationType == "GURUH"
            )?.length
          }
          label={t("groupOrganizations")}
        />
        <ResponsiveContainer width="100%" height="75%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={"isPensioner"}
              name={t("isPensioner")}
              stackId="a"
              fill="#8884d8"
            />
            <Bar
              dataKey={"isStudent"}
              name={t("isStudent")}
              stackId="b"
              fill="#82ca9d"
            />
            <Bar
              dataKey={"isHomemaker"}
              name={t("isHomemaker")}
              stackId="c"
              fill="#ff9a00"
            />
            <Bar
              dataKey={"isInvalid"}
              name={t("isInvalid")}
              stackId="d"
              fill="#1976d2"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </React.Fragment>
  );
}

Home.layout = function (Component) {
  return (
    <HomeWrapper title="Bosh sahifa" desc="Bosh sahifa">
      {Component}
    </HomeWrapper>
  );
};
