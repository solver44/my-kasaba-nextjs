import ModalUI from "@/components/ModalUI";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import React, { useState } from "react";
import EmployeeDataTable from "../employees/dataTable";
import { getFIO, getLocalizationNames, showOrNot } from "@/utils/data";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import StatDataTable from "../statistical-information/dataTable";
import Tabs from "@/components/Tabs";
import { convertStringToFormatted } from "@/utils/date";
import DownloadLink from "@/components/DownloadLink";

export default function ViewModal({ isOpen, handleClose }) {
  const { t } = useTranslation();
  const { bkutData = {} } = useSelector((state) => state);
  const [files, setFiles] = useState({
    decisionFile: { loading: false },
  });
  const data = isOpen ?? {};

  function onUpload() {}
  //   console.log(data);

  return (
    <ModalUI
      isForm={false}
      full={true}
      title={t("group-organizations.title")}
      open={!!isOpen}
      wrapperClass="viewModal-wrapper"
      handleClose={handleClose}
      bottomModal={() => <></>}
    >
      <div className="view-full-modal">
        <Tabs
          appBar
          contentPadding
          tabs={[
            {
              label: "group-organizations.tab1",
              children: (
                <div className="colored-list">
                  <div className="flex">
                    <label>{t("group-organizations.name")}</label>
                    <span style={{ textAlign: "left", fontWeight: "bold" }}>
                      {showOrNot(data.name)}
                    </span>
                  </div>
                  <div className="flex">
                    <label>{t("organization.stir")}</label>
                    <span style={{ textAlign: "left" }}>
                      {showOrNot(data.tin)}
                    </span>
                  </div>
                  <div className="flex">
                    <label>{t("organization.network")}</label>
                    <span style={{ textAlign: "left" }}>
                      {showOrNot(getLocalizationNames(bkutData.branch))}
                    </span>
                  </div>
                  <div className="flex">
                    <label>{t("senior-organization")}</label>
                    <span style={{ textAlign: "left" }}>
                      {showOrNot(getLocalizationNames(bkutData.parent))}
                    </span>
                  </div>
                  <div className="flex">
                    <label>{t("soatoFull")}</label>
                    <span style={{ textAlign: "left" }}>
                      {showOrNot(data.soato?._instanceName)}
                    </span>
                  </div>
                  <div className="flex">
                    <label>{t("group-organizations.direktor")}</label>
                    <span style={{ textAlign: "left" }}>
                      {showOrNot(getFIO(data?.employee))}
                    </span>
                  </div>
                  <div className="flex">
                    <label>{t("address")}</label>
                    <span style={{ textAlign: "left" }}>
                      {showOrNot(data.address)}
                    </span>
                  </div>
                  <div className="flex">
                    <label>{t("organization.phone")}</label>
                    <span style={{ textAlign: "left" }}>
                      {showOrNot(data.phone)}
                    </span>
                  </div>
                  <div className="flex">
                    <label>{t("organization.email")}</label>
                    <span style={{ textAlign: "left" }}>
                      {showOrNot(data.email)}
                    </span>
                  </div>
                  <div className="flex">
                    <label>{t("decision-or-application-title")}</label>
                    <span style={{ textAlign: "left" }}>
                      {showOrNot(bkutData.decisionNumber)}
                    </span>
                  </div>
                  <div className="flex">
                    <label>{t("decision-date")}</label>
                    <span style={{ textAlign: "left" }}>
                      {convertStringToFormatted(bkutData.decisionDate)}
                    </span>
                  </div>
                  <div className="flex">
                    <label>{t("decision-or-application-file")}</label>
                    <DownloadLink
                      style={{ textAlign: "left" }}
                      loading={files.decisionFile.loading}
                      fileName={files.decisionFile.name}
                      binaryData={files.decisionFile.data}
                    />
                  </div>
                </div>
              ),
            },
            {
              label: "employeesTitle",
              children: (
                <Tabs
                  color="secondary"
                  tabs={[
                    { label: "all-employees", children: <EmployeeDataTable /> },
                    {
                      label: "member-employees",
                      children: (
                        <EmployeeDataTable filter={(data) => data.isMember} />
                      ),
                    },
                    {
                      label: "employees.title1",
                      children: (
                        <EmployeeDataTable
                          filter={(data) => data.isKasabaActive}
                        />
                      ),
                    },
                  ]}
                />
              ),
            },
            { label: "organization.statistic", children: <StatDataTable /> },
            { label: "teamContracts", children: "No content" },
          ]}
        />
      </div>
    </ModalUI>
  );
}
