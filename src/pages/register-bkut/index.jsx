import React, { useState } from "react";
import styles from "./registerBkut.module.scss";
import HomeWrapper from "../home/wrapper";
import { useTranslation } from "react-i18next";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import VerticalStepper from "@/components/VerticalStepper";
import SuccessRegisterBkut from "./success";

export default function RegisterBkut() {
  const { t } = useTranslation();
  const [isFinished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFinish = () => {
    setLoading(true);
    setTimeout(() => {
      setFinished(true);
      setLoading(false);
    }, 1000);
  };
  return (
    <div className={styles.wrapper}>
      {!isFinished && (
        <div className={styles.top}>
          <h1 className={styles.title}>"BUXGALTER" MChJ</h1>
          <p className={styles.desc}>
            Аxborot texnologiyalari va ommaviy kommunikatsiya xodimlari kasaba
            uyushmasi
          </p>
        </div>
      )}

      {!isFinished ? (
        <VerticalStepper
          onFinish={handleFinish}
          loading={loading}
          steps={[
            { label: t("register-bkut-page.step1"), children: <Step1 /> },
            { label: t("register-bkut-page.step2"), children: <Step2 /> },
            { label: t("register-bkut-page.step3"), children: <Step3 /> },
          ]}
        />
      ) : (
        <SuccessRegisterBkut />
      )}
    </div>
  );
}

RegisterBkut.layout = function (Component, t) {
  return (
    <HomeWrapper
      title={t("register-bkut-page.title")}
      desc={t("register-bkut-page.desc")}
    >
      {Component}
    </HomeWrapper>
  );
};
