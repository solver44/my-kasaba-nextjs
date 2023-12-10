import React from 'react'

import styles from "./profile.module.scss";
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChangableInput from '@/components/ChangableInput';
import Profile from '@/components/Profile';

export default function EditProfile() {
    const { t } = useTranslation();
    const { bkutData = {} } = useSelector((states) => states);
    const { application = {} } = bkutData;
    const [values, setValues] = useState({
      FirstName: application.passport?.firstName,
      LastName: application.passport?.lastName,
      MiddleName: application.passport?.middleName,
      BirthDate: application.passport?.birthDate,
      Tin: application.tin,
      Phone: application.phone,
      Email: application.email,
      Name: bkutData.name,
    });
    const radioData = [
      {
        value: 'true',
        label: t("yes"),
      },
      {
        value: 'false',
        label: t("no"),
      },
    ];
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    };
    return (
        <div className={styles.grid}>
        {/* <Profile imgOnly /> */}
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
          <ChangableInput label={t("birth-date")} value={application.passport?.birthDate } />
          {/* <ChangableInput label={t("stir")} value={application.tin} /> */}
          <ChangableInput label={t("birth-place")} value="O'zbekiston" />
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
    );
}
