import React from "react";
import styles from "./menu.module.scss";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { BusinessCenterOutlined, HomeOutlined } from "@mui/icons-material";

const menu = [
  { icon: HomeOutlined, title: "home", path: "/" },
  {
    icon: BusinessCenterOutlined,
    title: "register-bkut",
    path: "/register-bkut",
  },
];

export default function PartMenu({ collapsed }) {
  const { t } = useTranslation();
  const navigate = useRouter();

  const handleClick = (path) => {
    navigate.push(path);
  };

  return (
    <div
      className={[styles.wrapper, collapsed ? styles.collapsed : ""].join(" ")}
    >
      {menu.map((menu) => (
        <div
          key={menu.path}
          onClick={() => handleClick(menu.path)}
          className={[
            styles.menu_item,
            menu.path === navigate.pathname ? styles.selected : "",
          ].join(" ")}
        >
          <menu.icon />
          <span>{t(menu.title)}</span>
        </div>
      ))}
    </div>
  );
}
