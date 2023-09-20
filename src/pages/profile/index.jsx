import React from "react";
import HomeWrapper from "../Home/wrapper";
import { useTranslation } from "react-i18next";
import styles from "./profile.module.scss";
import BigButton from "../../components/BigButton";
import EditIcon from "@mui/icons-material/Edit";
import ChangableInput from "../../components/ChangableInput";
import Profile from "../../components/Profile";

export default function ProfilePage() {
  const { t } = useTranslation();
  return (
    <HomeWrapper title={t("profile-page.title")} desc={t("profile-page.desc")}>
      <div className={styles.top}>
        <p className={styles.subtitle}>{t("profile-page.title1")}</p>
        <BigButton Icon={EditIcon}>{t("change")}</BigButton>
      </div>
      <div className={styles.grid}>
        <Profile imgOnly />
        <div className={styles.grid_column}>
          <ChangableInput label={t("first-name")} value="Asqarbek" />
          <ChangableInput label={t("second-name")} value="Abdullayev" />
          <ChangableInput label={t("third-name")} value="Abdullayevich" />
          <ChangableInput label={t("nationality")} value="O'zbek" />
        </div>
        <div className={styles.grid_column}>
          <ChangableInput label={t("birth-date")} value="02.02.1900" />
          <ChangableInput label={t("stir")} value="123456789" />
          <ChangableInput label={t("birth-place")} value="O'zbekiston" />
        </div>
        <div className={styles.grid_column}>
          <p>{t("address")}</p>
          <ChangableInput label={t("province")} value="Toshkent shahar" />
          <ChangableInput label={t("district")} value="Chilonzor" />
        </div>
        <div className={styles.grid_column}>
          <p>{t("contact-info")}</p>
          <ChangableInput label={t("phone-number")} value="+1238944590" />
          <ChangableInput label={t("email")} value="admin@kasaba.uz" />
        </div>
        <div className={styles.grid_column}>
          <p>{t("job-status")}</p>
          <ChangableInput label={t("job-place")} value='"Ozbekneftgaz" MCHJ' />
          <ChangableInput label={t("job-position")} value="Mutaxassis" />
        </div>
      </div>
    </HomeWrapper>
  );
}
