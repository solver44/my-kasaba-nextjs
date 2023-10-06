import React from "react";
import styles from "./homewrapper.module.scss";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Profile from "../Profile";

export default function HomeContentWrapper({ children, noHeader, title, desc }) {
  return (
    <React.Fragment>
      {!noHeader && <div className={styles.wrapper}>
        <div className={styles.col}>
          <div className={styles.title}>{title}</div>
          {/* <div className={styles.desc}>{desc}</div> */}
        </div>
        <div className={styles.row}>
          <NotificationsIcon htmlColor="#858585" />
        </div>
      </div>}
      {children}
    </React.Fragment>
  );
}
