import React, { useEffect, useState } from "react";
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
import {
  Add,
  AddBox,
  CloseRounded,
  IndeterminateCheckBox,
  Refresh,
  Remove,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getNotifications, readAllNotifications } from "@/http/notifications";
import { convertStringToFormatted } from "@/utils/date";

export default function HomeContentWrapper({
  children,
  noTitle,
  noHeader,
  noMargin,
  title,
  desc,
}) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [messages, setMessages] = useState([]);
  const [countNotViewed, setCountNotViewed] = useState(0);
  const { bkutData = {} } = useSelector((state) => state);
  function openNotifications() {
    if (countNotViewed > 0)
      setTimeout(async () => {
        if (bkutData.id) {
          await readAllNotifications(bkutData.id);
          setCountNotViewed(0);
        }
      }, 100);
    setOpenDrawer(true);
  }

  useEffect(() => {
    const initData = async () => {
      if (!bkutData.id) return;
      const response = await getNotifications(bkutData.id);
      if (!response?.success) return;
      setCountNotViewed(response.countNotViewed);
      setMessages(response.data.reverse());
    };
    initData();
  }, [bkutData]);

  function changeFont(delta) {
    const root = document.querySelector(":root");
    setProps(root, "--menu-font-size", delta, 20);
    setProps(root, "--input-font-size", delta, 20);
    setProps(root, "--input-inside-font-size", delta, 18);
    setProps(root, "--table-font-size", delta, 20);
    setProps(root, "--table-row-font-size", delta, 18);
    setProps(root, "--badge-size", delta, 16);
    setProps(root, "--menu-icon-size", delta, 24);
    setProps(root, "--button-font-size", delta, undefined);
  }

  function setProps(root, name, delta, value) {
    if (!delta) {
      root.style.setProperty(name, value + "px");
      return;
    }
    const fs =
      +getComputedStyle(root).getPropertyValue(name).split("px")[0] || 18;
    root.style.setProperty(name, fs + delta + "px");
  }

  return (
    <React.Fragment>
      {!noHeader && (
        <div
          className={[styles.wrapper, noMargin ? styles.noMargin : ""].join(
            " "
          )}
          // style={noTitle ? { paddingBottom: 0, paddingTop: 0 } : {}}
        >
          <div className={styles.col}>
            {!noTitle && <div className={styles.title}>{title}</div>}
            {/* <div className={styles.desc}>{desc}</div> */}
          </div>
          <div className={styles.row}>
            <div className={styles.specialButtons}>
              <Add onClick={() => changeFont(1)} />
              <Refresh onClick={() => changeFont()} />
              <Remove onClick={() => changeFont(-1)} />
            </div>
            <Badge
              style={{ cursor: "pointer" }}
              color="primary"
              onClick={openNotifications}
              badgeContent={countNotViewed}
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
          {messages.map((message) => (
            <Notification
              key={message.id}
              title={message.title}
              description={message.message}
              type={message.type}
              date={message.createdDate}
            />
          ))}
        </div>
      </Drawer>
    </React.Fragment>
  );
}

const Notification = ({ title, description, type, date }) => {
  const [open, setOpen] = useState(true);

  // SUCCESS(0),
  //   INFO(1),
  //   WARNING(2),
  //   ERROR(3);
  const severity =
    type === "SUCCESS"
      ? "success"
      : type === "INFO"
      ? "info"
      : type === "WARNING"
      ? "warning"
      : type === "ERROR"
      ? "error"
      : null;

  return (
    <Collapse in={open}>
      <Alert
        elevation={2}
        variant="outlined"
        className={styles.notification}
        severity={severity}
        style={{ fontSize: 16 }}
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
        <AlertTitle style={{ fontWeight: "bold", fontSize: 18 }}>
          {title}
        </AlertTitle>
        {description}
        <span className={styles.timeNotification}>
          {convertStringToFormatted(date, true)}
        </span>
      </Alert>
    </Collapse>
  );
};
