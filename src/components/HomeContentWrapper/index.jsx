import React, { useState } from "react";
import styles from "./homewrapper.module.scss";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Profile from "../Profile";
import {
  Alert,
  AlertTitle,
  Badge,
  Collapse,
  Drawer,
  IconButton,
} from "@mui/material";
import { CloseRounded } from "@mui/icons-material";

export default function HomeContentWrapper({
  children,
  noHeader,
  title,
  desc,
}) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [open, setOpen] = useState(false);
  function openNotifications() {
    setOpenDrawer(true);
    setTimeout(() => {
      setOpen(true);
    }, 100);
  }

  return (
    <React.Fragment>
      {!noHeader && (
        <div className={styles.wrapper}>
          <div className={styles.col}>
            <div className={styles.title}>{title}</div>
            {/* <div className={styles.desc}>{desc}</div> */}
          </div>
          <div className={styles.row}>
            <Badge
              style={{ cursor: "pointer" }}
              color="primary"
              onClick={openNotifications}
              badgeContent={2}
              max={999}
            >
              <NotificationsIcon htmlColor="#858585" />
            </Badge>
          </div>
        </div>
      )}
      {children}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <div className={styles.drawer_content}>
          <h1 className={styles.drawer_title}>Xabarlar</h1>
          <Collapse in={open}>
            <Alert
              severity="success"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseRounded fontSize="inherit" />
                </IconButton>
              }
            >
              Murojaatingiz ko'rib chiqildi va tasdiqlandi.
            </Alert>
          </Collapse>
          <Collapse in={open}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseRounded fontSize="inherit" />
                </IconButton>
              }
            >
              <AlertTitle>Qaytarildi!</AlertTitle>
              Sizning BKUT haqidagi yuborgan ma'lumotlaringiz bekor qilindi.
              Tahrirlab qayta yuboring.
            </Alert>
          </Collapse>
        </div>
      </Drawer>
    </React.Fragment>
  );
}
