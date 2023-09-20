import React, { useState } from "react";
import styles from "./registerBkut.module.scss";
import HomeWrapper from "../Home/wrapper";
import { useTranslation } from "react-i18next";
import LinearStepper from "../../components/Stepper";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";

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
  }
  return (
    <HomeWrapper
      title={t("register-bkut-page.title")}
      desc={t("register-bkut-page.desc")}
    >
      <div className={styles.wrapper}>
        {!isFinished ? (
          <LinearStepper
            onFinish={handleFinish}
            loading={loading}
            steps={[
              { label: t("register-bkut-page.step1"), children: <Step1 /> },
              { label: t("register-bkut-page.step2"), children: <Step2 /> },
              { label: t("register-bkut-page.step3"), children: <Step3 /> },
            ]}
          />
        ) : (
          <div className={styles.center_row}>
            <CheckCircleIcon className={styles.check} />
            <p>{t("sent-successfully")}</p>
          </div>
        )}
      </div>
    </HomeWrapper>
  );
}
