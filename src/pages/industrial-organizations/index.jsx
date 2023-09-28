import React from 'react'
import HomeWrapper from '../home/wrapper'
import { useTranslation } from "react-i18next";
import styles from "./industrial-organizations.module.scss";
import DataTables from './dataTables';

export default function industrialOrganizations() {
    const { t } = useTranslation();
  return (
    <HomeWrapper title={t("industrial-organizations.title")} desc={t("profile-page.desc")}>
        <div className={styles.containers}>
            <DataTables/>
        </div>
    </HomeWrapper>
    
  )
}
