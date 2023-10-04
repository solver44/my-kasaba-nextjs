import React from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./passort-primary-organization.module.scss";
import { useTranslation } from "react-i18next";

export default function passortPrimaryOrganization() {
const { t } = useTranslation();
  return (
    <HomeWrapper title={t("passort-primary-organization.title")} desc={t("profile-page.desc")}>
      <div className={styles.containers}>
        <div className={styles.flex}>    
            <label>{t("passort-primary-organization.firstOrganizationName")}</label>
            <label style={{textAlign: 'left', fontWeight:"bold"}}>10002 Harbiy qism</label>
        </div>
        <div className={styles.flex} style={{background:"#F9F9F9"}}>    
            <label>{t("passort-primary-organization.firstOrganizationType")}</label>
            <label style={{textAlign: 'left'}}>Yuridik shaxs</label>
        </div>
        <div className={styles.flex}>    
            <label>{t("passort-primary-organization.firstOrganizationSTIR")}</label>
            <label style={{textAlign: 'left'}}>306358245</label>
        </div>
        <div className={styles.flex} style={{background:"#F9F9F9"}}>    
            <label>{t("passort-primary-organization.firstOrganizationNetwork")}</label>
            <label style={{textAlign: 'left'}}><a href="">Davlat muassasalari va jamoat xizmati xodimlari kasaba uyushmasi Respublika kengashi</a></label>
        </div>
        <div className={styles.flex}>    
            <label>{t("passort-primary-organization.firstOrganizationOrg")}</label>
            <label style={{textAlign: 'left'}}><a href="">Mirzo Ulug’bek tuman kengashi</a></label>
        </div>
        <div className={styles.flex} style={{background:"#F9F9F9"}}>    
            <label>{t("passort-primary-organization.firstOrganizationFirm")}</label>
            <label style={{textAlign: 'left'}}>(Aniqlanmagan)</label>
        </div>
        <div className={styles.flex}>    
            <label>{t("passort-primary-organization.firstOrganizationFirmSTIR")}</label>
            <label style={{textAlign: 'left'}}>(Aniqlanmagan)</label>
        </div>
        <div className={styles.flex} style={{background:"#F9F9F9"}}>    
            <label>{t("passort-primary-organization.firstOrganizationDirektor")}</label>
            <label style={{textAlign: 'left'}}>Mahitdinova Fatima Inomjonova</label>
        </div>
        <div className={styles.flex}>    
            <label>{t("passort-primary-organization.firstOrganizationSoato")}</label>
            <label style={{textAlign: 'left'}}>1726269 - Toshkent shahar, Mirzo Ulug’bek tumani</label>
        </div>
        <div className={styles.flex} style={{background:"#F9F9F9"}}>    
            <label>{t("passort-primary-organization.firstOrganizationAdr")}</label>
            <label style={{textAlign: 'left'}}>Toshkent shahar Butuk Ipak Yo’li</label>
        </div>
        <div className={styles.flex}>    
            <label>{t("passort-primary-organization.firstOrganizationTel")}</label>
            <label style={{textAlign: 'left'}}>(Aniqlanmagan)</label>
        </div>
        <div className={styles.flex} style={{background:"#F9F9F9"}}>    
            <label>{t("passort-primary-organization.firstOrganizationEmail")}</label>
            <label style={{textAlign: 'left'}}>(Aniqlanmagan)</label>
        </div>
        <div className={styles.flex}>    
            <label>{t("passort-primary-organization.firstOrganizationAgree")}</label>
            <label style={{textAlign: 'left'}}>ХА</label>
        </div>
        <div className={styles.flex} style={{background:"#F9F9F9"}}>    
            <label>{t("passort-primary-organization.firstOrganizationH")}</label>
            <label style={{textAlign: 'left'}}>(Aniqlanmagan)</label>
        </div>
      </div>
    </HomeWrapper>
  );
}