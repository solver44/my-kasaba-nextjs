import React from 'react'
import HomeWrapper from '../home/wrapper'
import { useTranslation } from "react-i18next";
import styles from "./reports.module.scss";

export default function Reports() {
    const { t } = useTranslation();
  return (
    <HomeWrapper title={t("reportss.title")} desc={t("profile-page.desc")}>
        <div className={styles.containers}>
            <div>
                <h1 className={styles.text}>
                        {t("reportss.texts")}
                </h1>
                <div className={styles.flex} style={{background:"#F9F9F9"}}>    
                    <label>{t("reportss.nameKasaba")} </label>
                    <label style={{textAlign: 'left'}}>100 maktab</label>
                </div>
                <div className={styles.flex}>    
                    <label>{t("reportss.information")}</label>
                    <label style={{textAlign: 'left'}}>Pardayeva Holida</label>
                </div>
                <div className={styles.flex} style={{background:"#F9F9F9"}}>    
                    <label>{t("reportss.tel")}</label>
                    <label style={{textAlign: 'left'}}>91-957-24-61</label>
                </div>
                <div className={styles.flex}>    
                    <label>{t("reportss.works")}</label>
                    <label style={{textAlign: 'left'}}>(Aniqlanmagan)</label>
                </div>
                <div className={styles.flex} style={{background:"#F9F9F9"}}>    
                    <label>{t("reportss.pay")}</label>
                    <label style={{textAlign: 'left'}}>(Aniqlanmagan)</label>
                </div>
            </div>
           <div>
                <h1 className={styles.text} style={{padding:"1rem 6rem"}}>
                        {t("reportss.textss")}
                </h1>
           </div>
        </div>
    </HomeWrapper>
    
  )
}
