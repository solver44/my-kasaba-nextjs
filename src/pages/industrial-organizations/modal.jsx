import ModalUI from "@/components/ModalUI";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import React, { useState } from "react";
import EmployeeDataTable from "../employees/dataTable";
import MembersDataTable from "../members/dataTable";
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
      title={t("industrial-organizations.title")}
      open={!!isOpen}
      handleClose={handleClose}
      bottomModal={() => <></>}
    >
      <div className="view-full-modal">
        <Tabs
          tabs={[
            {
              label: "industrial-organizations.tab1",
              children: (
                <div className="colored-list">
                  <div className="flex">
                    <label>Seh tashkilot nomi</label>
                    <span style={{ textAlign: "left", fontWeight: "bold" }}>
                      {showOrNot(data.name)}
                    </span>
                  </div>
                  <div className="flex">
                    <label>Tashkilot STIR (INN) raqami</label>
                    <span style={{ textAlign: "left" }}>
                      {showOrNot(data.tin)}
                    </span>
                  </div>
                  <div className="flex">
                    <label>Tashkilot qarashli tarmoq</label>
                    <span style={{ textAlign: "left" }}>
                      {showOrNot(getLocalizationNames(bkutData.branch))}
                    </span>
                  </div>
                  <div className="flex">
                    <label>Yuqori tashkilot</label>
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
                    <label>Seh tashkilot tashkilotchisi</label>
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
                    <label>Tashkilot telefon raqami</label>
                    <span style={{ textAlign: "left" }}>
                      {showOrNot(data.phone)}
                    </span>
                  </div>
                  <div className="flex">
                    <label>Tashkilot elektron pochta manzili</label>
                    <span style={{ textAlign: "left" }}>
                      {showOrNot(data.email)}
                    </span>
                  </div>
                  <div className="flex">
                    <label>{t("decision-title")}</label>
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
                    <label>{t("decision-file")}</label>
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
              label: "organization.employees",
              children: <EmployeeDataTable onUpload={onUpload} />,
            },
            { label: "organization.members", children: <MembersDataTable /> },
            { label: "organization.statistic", children: <StatDataTable /> },
            { label: "teamContracts", children: "No content" },
          ]}
        />
      </div>
    </ModalUI>
  );
}
