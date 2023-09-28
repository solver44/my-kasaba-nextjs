import React from 'react'
import HomeWrapper from '../home/wrapper'
import { useTranslation } from "react-i18next";

export default function index() {
  const { t } = useTranslation();
  return (
    <HomeWrapper title={t("basic-tools.title")}>
             <div>index</div>
    </HomeWrapper>
   
  )
}
