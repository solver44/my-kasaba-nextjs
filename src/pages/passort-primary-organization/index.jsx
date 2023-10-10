import React from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./passort-primary-organization.module.scss";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getLocalizationNames } from "@/utils/data";

export default function PassortPrimaryOrganization() {
  const { t, i18n } = useTranslation();
  const { bkutData = {} } = useSelector((states) => states);
  console.log(bkutData);

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
        <label style={{ textAlign: "left" }}>Yuridik shaxs</label>
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
          {getLocalizationNames(bkutData.soato, i18n)}
        </label>
      </div>
      <div className={styles.flex} style={{ background: "#F9F9F9" }}>
        <label>{t("passort-primary-organization.firstOrganizationFirm")}</label>
        <label style={{ textAlign: "left" }}>(Aniqlanmagan)</label>
      </div>
      <div className={styles.flex}>
        <label>
          {t("passort-primary-organization.firstOrganizationFirmSTIR")}
        </label>
        <label style={{ textAlign: "left" }}>(Aniqlanmagan)</label>
      </div>
      <div className={styles.flex} style={{ background: "#F9F9F9" }}>
        <label>
          {t("passort-primary-organization.firstOrganizationDirektor")}
        </label>
        <label style={{ textAlign: "left" }}>
          Mahitdinova Fatima Inomjonova
        </label>
      </div>
      <div className={styles.flex}>
        <label>
          {t("passort-primary-organization.firstOrganizationSoato")}
        </label>
        <label style={{ textAlign: "left" }}>
          {bkutData.soato?._instanceName}
        </label>
      </div>
      <div className={styles.flex} style={{ background: "#F9F9F9" }}>
        <label>{t("passort-primary-organization.firstOrganizationAdr")}</label>
        <label style={{ textAlign: "left" }}>{bkutData.adress}</label>
      </div>
      <div className={styles.flex}>
        <label>{t("passort-primary-organization.firstOrganizationTel")}</label>
        <label style={{ textAlign: "left" }}>(Aniqlanmagan)</label>
      </div>
      <div className={styles.flex} style={{ background: "#F9F9F9" }}>
        <label>
          {t("passort-primary-organization.firstOrganizationEmail")}
        </label>
        <label style={{ textAlign: "left" }}>(Aniqlanmagan)</label>
      </div>
      <div className={styles.flex}>
        <label>
          {t("passort-primary-organization.firstOrganizationAgree")}
        </label>
        <label style={{ textAlign: "left" }}>ХА</label>
      </div>
      <div className={styles.flex} style={{ background: "#F9F9F9" }}>
        <label>{t("passort-primary-organization.firstOrganizationH")}</label>
        <label style={{ textAlign: "left" }}>(Aniqlanmagan)</label>
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
