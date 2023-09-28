import React from 'react'
import HomeWrapper from '../home/wrapper'
import { useTranslation } from "react-i18next";
import styles from "./team-contracts.module.scss";
import DataTable from './dataTable';

export default function industrialOrganizations() {
    const { t } = useTranslation();
  return (
    <HomeWrapper title={t("team-contracts.title")} desc={t("profile-page.desc")}>
        <div className={styles.containers}>
            <DataTable/>
        </div>
    </HomeWrapper>
    
  )
}
