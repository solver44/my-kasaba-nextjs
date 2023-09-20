import React from "react";
import styles from "./profile.module.scss";
import PersonIcon from "@mui/icons-material/Person";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

export default function Profile({ img, title, imgOnly, mini }) {
  const { t } = useTranslation();
  const navigate = useRouter();
  const isSelected = !mini && navigate.pathname === "/profile";

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
      ].join(" ")}
    >
      {img ? (
        <img className={styles.image} src={img} alt="person" />
      ) : (
        <PersonIcon className={styles.image} />
      )}
      <div className={styles.col}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{t("member")}</p>
      </div>
    </div>
  );
}
