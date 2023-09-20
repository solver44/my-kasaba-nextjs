import React from "react";
import styles from "./homewrapper.module.scss";
import EmailIcon from "@mui/icons-material/Email";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Profile from "../Profile";

export default function HomeContentWrapper({ children, title, desc }) {
  return (
    <React.Fragment>
      <div className={styles.wrapper}>
        <div className={styles.col}>
          <div className={styles.title}>{title}</div>
          <div className={styles.desc}>{desc}</div>
        </div>
        <div className={styles.row}>
          <EmailIcon htmlColor="#E3E3E3" />
          <NotificationsIcon htmlColor="#E3E3E3" />
          <Profile mini />
        </div>
      </div>
      {children}
    </React.Fragment>
  );
}
