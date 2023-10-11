import React, { useEffect, useState } from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./passort-primary-organization.module.scss";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getLocalizationNames } from "@/utils/data";
import { getFile } from "@/http/data";
import DownloadLink from "@/components/DownloadLink";

export default function PassortPrimaryOrganization() {
  const { t, i18n } = useTranslation();
  const { bkutData = {} } = useSelector((states) => states);
  const [files, setFiles] = useState({
    applicationFile: {},
    protocolFile: {},
  });
  console.log(bkutData);
  const director = (bkutData.employees ?? []).find(
    (e) => e?.position?.id == 1
  )?.employee;

  useEffect(() => {
    if (!bkutData?.protocolFile) return;
    const fetchData = async () => {
      let encodedFileName = bkutData.protocolFile.split("=")[1];
      let decodedFileName = decodeURIComponent(encodedFileName).replace(
        /\+/g,
        " "
      );
      encodedFileName = bkutData.applicationFile.split("=")[1];
      let decodedFileName1 = decodeURIComponent(encodedFileName).replace(
        /\+/g,
        " "
      );
      let response = await getFile(bkutData.protocolFile);
      let response1 = await getFile(bkutData.applicationFile);
      setFiles({
        protocolFile: { name: decodedFileName, data: response },
        applicationFile: { name: decodedFileName1, data: response1 },
      });
    };
    fetchData();
  }, [bkutData]);

  return (
    <div className={styles.containers}>
      <div className={styles.flex}>
        <label>{t("passort-primary-organization.firstOrganizationName")}</label>
        <label style={{ textAlign: "left", fontWeight: "bold" }}>
          {bkutData.name}
        </label>
      </div>
      <div className={styles.flex} style={{ background: "#F9F9F9" }}>
        <label>{t("passort-primary-organization.firstOrganizationType")}</label>
        <label style={{ textAlign: "left" }}>
          {t(bkutData.bkutType == 1 ? "legalEntity" : "physicalPerson")}
        </label>
      </div>
      <div className={styles.flex}>
        <label>{t("passort-primary-organization.firstOrganizationSTIR")}</label>
        <label style={{ textAlign: "left" }}>{bkutData.inn}</label>
      </div>
      <div className={styles.flex} style={{ background: "#F9F9F9" }}>
        <label>
          {t("passort-primary-organization.firstOrganizationNetwork")}
        </label>
        <label style={{ textAlign: "left" }}>
          <a href="">{getLocalizationNames(bkutData.branch, i18n)}</a>
        </label>
      </div>
      <div className={styles.flex}>
        <label>{t("passort-primary-organization.firstOrganizationOrg")}</label>
        <label style={{ textAlign: "left" }}>
          {getLocalizationNames(bkutData.parent, i18n)}
        </label>
      </div>
      <div className={styles.flex} style={{ background: "#F9F9F9" }}>
        <label>{t("soatoFull")}</label>
        <label style={{ textAlign: "left" }}>{`${getLocalizationNames(
          bkutData.eLegalEntity?.soatoRegion,
          i18n
        )}, ${getLocalizationNames(
          bkutData.eLegalEntity?.soatoDistrict,
          i18n
        )}`}</label>
      </div>
      <div className={styles.flex} style={{ background: "#F9F9F9" }}>
        <label>
          {t("passort-primary-organization.firstOrganizationDirektor")}
        </label>
        <label
          style={{ textAlign: "left" }}
        >{`${director?.firstName} ${director?.lastName} ${director?.middleName}`}</label>
      </div>
      <div className={styles.flex} style={{ background: "#F9F9F9" }}>
        <label>{t("passort-primary-organization.firstOrganizationAdr")}</label>
        <label style={{ textAlign: "left" }}>{bkutData.adress}</label>
      </div>
      <div className={styles.flex}>
        <label>{t("passort-primary-organization.firstOrganizationTel")}</label>
        <label style={{ textAlign: "left" }}>{bkutData.phone}</label>
      </div>
      <div className={styles.flex} style={{ background: "#F9F9F9" }}>
        <label>
          {t("passort-primary-organization.firstOrganizationEmail")}
        </label>
        <label style={{ textAlign: "left" }}>{bkutData.email}</label>
      </div>
      <div className={styles.flex}>
        <label>{t("founding-doc-num")}</label>
        <label style={{ textAlign: "left" }}>{bkutData.protocolNumber}</label>
      </div>
      <div className={styles.flex}>
        <label>{t("founding-doc-date")}</label>
        <label style={{ textAlign: "left" }}>{bkutData.protocolDate}</label>
      </div>{" "}
      <div className={styles.flex}>
        <label>{t("electronic-file")}</label>
        <DownloadLink
          style={{ textAlign: "left" }}
          fileName={files.protocolFile.name}
          binaryData={files.protocolFile.data}
        />
      </div>
      <div className={styles.flex}>
        <label>{t("application")}</label>
        <DownloadLink
          style={{ textAlign: "left" }}
          fileName={files.applicationFile.name}
          binaryData={files.applicationFile.data}
        />
      </div>
    </div>
  );
}

PassortPrimaryOrganization.layout = function (Component, t) {
  return (
    <HomeWrapper
      title={t("passort-primary-organization.title")}
      desc={t("profile-page.desc")}
    >
      {Component}
    </HomeWrapper>
  );
};
