import React, { useEffect } from "react";
import styles from "./registerBkut.module.scss";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTranslation } from "react-i18next";
import useActions from "@/hooks/useActions";

export default function SuccessRegisterBkut() {
  const { t } = useTranslation();
  const actions = useActions();

  useEffect(() => {
    console.log("true");
    actions.isMember(true);
  }, [])
  

  return (
    <div className={styles.center_row}>
      <CheckCircleIcon className={styles.check} />
      <p>{t("sent-successfully-bkut")}</p>
    </div>
  );
}
