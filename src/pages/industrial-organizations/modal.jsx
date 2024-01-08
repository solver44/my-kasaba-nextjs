import ModalUI from "@/components/ModalUI";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Tab } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getFile } from "@/http/data";
import EmployeeDataTable from "../employees/dataTable";
import {
  getFIO,
  getLocalizationNames,
  getPresidentBKUT,
  showOrNot,
} from "@/utils/data";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Tabs from "@/components/Tabs";
import { convertStringToFormatted } from "@/utils/date";
import DownloadLink from "@/components/DownloadLink";
import JSHDataTable from "../team-contracts/dataTable";
import StatisticalInformation from "../statistical-information";
import {
  Assessment,
  BadgeRounded,
  Diversity3,
  Handshake,
  LibraryBooks,
  PeopleAlt,
  Person,
  PlaylistAddCheck,
} from "@mui/icons-material";
import Popup from "@/components/Popup";
import { getUserOrganization } from "@/http/organization";
import { useSnackbar } from "notistack";
import styles from "./industrial-organizations.module.scss";
import Employees from "../employees";

export default function ViewModal({ isOpen, handleClose }) {
  const { t } = useTranslation();
  const { bkutData = {} } = useSelector((state) => state);
  const [user, setUser] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  const [files, setFiles] = useState({
    decisionFile: { loading: false },
  });
  async function parseFile(file) {
    if (!file) return [null, null];
    const res = await getFile(file);
    return [res, decodeURIComponent(file.split("=")[1]).replace(/\+/g, " ")];
  }
  const data = isOpen ?? {};
  useEffect(() => {
    const fetchData = async () => {
      let res3 = await parseFile(data.decisionFile);
      setFiles({
        decisionFile: { name: res3[1], data: res3[0] },
      });
    };
    fetchData();
  }, [data]);
  async function getUserHandle(setOpen, isOpen) {
    setOpen((o) => !o);
    if (isOpen || user.user) return;
    const response = await getUserOrganization(data.id);
    if (!response.success) {
      enqueueSnackbar(t("error-get-user-organization"), { variant: "error" });
      return;
    }
    setUser(response.data);
  }

  return (
    <ModalUI
      isForm={false}
      full={true}
      title={data.name + " " + t("industrial-organizations.title")}
      open={!!isOpen}
      wrapperClass="viewModal-wrapper"
      handleClose={handleClose}
      bottomModal={() => <></>}
    >
      <div className="view-full-modal">
        <Tabs
          appBar
          contentPadding
          scrollContent
          tabs={[
            {
              label: "industrial-organizations.tab1",
              icon: <LibraryBooks />,
              children: (
                <React.Fragment>
                  <Popup
                    placement="bottom-start"
                    returnButton={(setAnchor, setOpen, open) => (
                      <Button
                        type="button"
                        ref={setAnchor}
                        style={{ position: "absolute" }}
                        color="info"
                        size="medium"
                        onClick={() => getUserHandle(setOpen, open)}
                        variant="contained"
                        startIcon={<Person />}
                      >
                        {t("user-open")}
                      </Button>
                    )}
                  >
                    <div className={styles.col}>
                      <div className={styles.textRow}>
                        <span>{t("username")}:</span>
                        <span>{user.user}</span>
                      </div>
                      <div className={styles.textRow}>
                        <span>{t("password")}:</span>
                        <span>{user.password}</span>
                      </div>
                      <div className={styles.textRow}>
                        <span>{t("last-login-time")}:</span>
                        <span>{user.lastLoginTime}</span>
                      </div>
                    </div>
                  </Popup>
                  <div className="colored-list">
                    <div className="flex">
                      <label>{t("industrial-organizations.name")}</label>
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
                        {showOrNot(bkutData?.parent?._instanceName)}
                      </span>
                    </div>
                    <div className="flex">
                      <label>{t("soatoFull")}</label>
                      <span style={{ textAlign: "left" }}>
                        {showOrNot(data.soato?._instanceName)}
                      </span>
                    </div>
                    <div className="flex">
                      <label>{t("industrial-organizations.direktor")}</label>
                      <span style={{ textAlign: "left" }}>
                        {showOrNot(getPresidentBKUT(data))}
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
                        {showOrNot(data.decisionNumber)}
                      </span>
                    </div>
                    <div className="flex">
                      <label>{t("decision-date")}</label>
                      <span style={{ textAlign: "left" }}>
                        {convertStringToFormatted(data.decisionDate)}
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
                </React.Fragment>
              ),
            },
            {
              label: "employeesTitle",
              disableAnimation: true,
              icon: <PeopleAlt />,
              children: <Employees organization={data} />,
            },
            {
              label: "organization.statistic",
              icon: <Assessment />,
              children: <StatisticalInformation organization={data} />,
            },
            {
              label: "teamContracts",
              icon: <Diversity3 />,
              children: <JSHDataTable organization={data} />,
            },
          ]}
        />
      </div>
    </ModalUI>
  );
}
