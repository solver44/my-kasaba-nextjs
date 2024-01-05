import React from "react";
import styles from "./profile.module.scss";
import PersonIcon from "@mui/icons-material/Person";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { getFIO, getPresidentBKUT } from "@/utils/data";

export default function Profile({ img, collapsed, imgOnly, mini }) {
  const { t } = useTranslation();
  const navigate = useRouter();
  const isSelected = !mini && navigate.pathname === "/profile";
  const { isMember, bkutData = {} } = useSelector((states) => states);

  const handleClick = () => {
    navigate.push("/profile");
  };
  return imgOnly ? (
    img ? (
      <img className={styles.recImage} src={img} alt="avatar" />
    ) : (
      <PersonIcon className={styles.recImage} />
    )
  ) : (
    <div
      onClick={handleClick}
      className={[
        styles.wrapper,
        isSelected ? styles.selected : "",
        mini ? styles.mini : "",
        collapsed ? styles.collapsed : "",
      ].join(" ")}
    >
      {img ? (
        <img className={styles.image} src={img} alt="person" />
      ) : (
        <PersonIcon className={styles.image} />
      )}
      <div className={styles.col}>
        <p className={styles.title}>
          {getFIO(bkutData?.application?.passport) ||
            getPresidentBKUT(bkutData) ||
            bkutData?.name}
        </p>
        <p
          className={[
            styles.description,
            bkutData?.status == 4 ? styles.red : "",
            bkutData?.status == 3 ? styles.yellow : "",
            bkutData?.status == 1 ? styles.primary : "",
          ].join(" ")}
        >
          {bkutData.status == 1
            ? t("registered")
            : bkutData.status == 2
            ? t("data-full")
            : bkutData.status == 3
            ? t("data-not-full")
            : t("rejected")}
        </p>
      </div>
    </div>
  );
}
