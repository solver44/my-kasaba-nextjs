import ModalUI from "@/components/ModalUI";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import EmployeeDataTable from "../employees/dataTable";
import MembersDataTable from "../members/dataTable";
import { getFIO, getLocalizationNames, showOrNot } from "@/utils/data";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import StatDataTable from "../statistical-information/dataTable";

export default function ViewModal({ isOpen, handleClose }) {
  const { t } = useTranslation();
  const { bkutData = {} } = useSelector((state) => state);
  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                variant="scrollable"
                className="tab-main"
              >
                <Tab label={t("industrial-organizations.tab1")} value="1" />
                <Tab label={t("employeesTitle")} value="2" />
                <Tab label={t("members")} value="3" />
                <Tab label={t("statisticalInformation")} value="4" />
                <Tab label={t("teamContracts")} value="5" />
              </TabList>
            </Box>
            <TabPanel value="1">
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
              </div>
            </TabPanel>
            <TabPanel value="2">
              <EmployeeDataTable onUpload={onUpload} />
            </TabPanel>
            <TabPanel value="3">
              <MembersDataTable />
            </TabPanel>
            <TabPanel value="4">
              <StatDataTable />
            </TabPanel>
            <TabPanel value="5">Item Three</TabPanel>
          </TabContext>
        </Box>
      </div>
    </ModalUI>
  );
}
