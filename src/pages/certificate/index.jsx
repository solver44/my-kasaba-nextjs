import React from 'react'
import HomeWrapper from '../home/wrapper'
import { useTranslation } from "react-i18next";

export default function Certificate({ formData }) {
  const { t } = useTranslation();
  return (
    <HomeWrapper title={t("certificate")} >
              <div>
      <h1>{t("Information Page")}</h1>
      <div>
        <p>
          {t("FIO")}: {formData.fio}
        </p>
        <p>
          {t("Birth Date")}: {formData.birthDate}
        </p>
        {/* Add more fields as needed */}
      </div>
    </div>
    </HomeWrapper>
   
  )
}