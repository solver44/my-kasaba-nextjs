import React from "react";
import HomeWrapper from "../home/wrapper";
import { useTranslation } from "react-i18next";
import styles from "./profile.module.scss";
import BigButton from "../../components/BigButton";
import EditIcon from "@mui/icons-material/Edit";
import ChangableInput from "../../components/ChangableInput";
import Profile from "../../components/Profile";
import { useSelector } from "react-redux";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { bkutData = {} } = useSelector((states) => states);
  const { application = {} } = bkutData;

  return (
    <React.Fragment>
      <div className={styles.top}>
        <p className={styles.subtitle}>{t("profile-page.title1")}</p>
        <BigButton Icon={EditIcon}>{t("change")}</BigButton>
      </div>
      <div className={styles.grid}>
        <Profile imgOnly />
        <div className={styles.grid_column}>
          <ChangableInput
            label={t("first-name")}
            value={application.passport?.firstName}
          />
          <ChangableInput
            label={t("second-name")}
            value={application.passport?.lastName}
          />
          <ChangableInput
            label={t("third-name")}
            value={application.passport?.middleName}
          />
          <ChangableInput label={t("nationality")} value="O'zbek" />
        </div>
        <div className={styles.grid_column}>
          <ChangableInput label={t("birth-date")} value={application.passport?.birthDate } />
          <ChangableInput label={t("stir")} value={application.tin} />
          <ChangableInput label={t("birth-place")} value="O'zbekiston" />
        </div>
        <div className={styles.grid_column}>
          <p>{t("address")}</p>
          <ChangableInput label={t("province")} value="Toshkent shahar" />
          <ChangableInput label={t("district")} value="Chilonzor" />
        </div>
        <div className={styles.grid_column}>
          <p>{t("contact-info")}</p>
          <ChangableInput label={t("phone-number")} value={application.phone} />
          <ChangableInput label={t("email")} value={application.email} />
        </div>
        <div className={styles.grid_column}>
          <p>{t("job-status")}</p>
          <ChangableInput label={t("job-place")} value={bkutData.name} />
          <ChangableInput
            label={t("job-position")}
            value={t("employees.chairman")}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

ProfilePage.layout = function (Component, t) {
  return (
    <HomeWrapper title={t("profile-page.title")} desc={t("profile-page.desc")}>
      {Component}
    </HomeWrapper>
  );
};
