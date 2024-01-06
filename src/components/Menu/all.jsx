import React from "react";
import styles from "./menu.module.scss";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import {
  HomeOutlined,
  Apartment,
  Business,
  Group,
  InsertChart,
  Diversity3,
  LibraryBooks,
  PeopleAlt,
} from "@mui/icons-material";
import { useSelector } from "react-redux";

export default function AllMenu({ collapsed }) {
  const { t } = useTranslation();
  const navigate = useRouter();
  const { isOrganization } = useSelector((state) => state);

  const menu = [
    { icon: HomeOutlined, title: "home", path: "/" },
    {
      icon: Apartment,
      title: "passortPrimaryOrganization",
      path: "/passort-primary-organization",
    },
    {
      icon: Business,
      title: "industrialOrganizations",
      path: "/industrial-organizations",
      hidden: isOrganization,
    },
    {
      icon: Group,
      title: "groupOrganizations",
      path: "/group-organizations",
      hidden: isOrganization,
    },
    {
      icon: PeopleAlt,
      title: "employeesTitle",
      path: "/employees",
    },
    {
      icon: Diversity3,
      title: "teamContracts",
      path: "/team-contracts",
    },
    {
      icon: InsertChart,
      title: "statisticalInformation",
      path: "/statistical-information",
    },
    {
      icon: LibraryBooks,
      title: "1ti",
      path: "/1ti",
    },
    {
      icon: LibraryBooks,
      title: "1jsh-report",
      path: "/1jsh",
    },
  ];

  const handleClick = (path) => {
    navigate.push(path);
  };

  return (
    <div
      className={[styles.wrapper, collapsed ? styles.collapsed : ""].join(" ")}
    >
      {menu
        .filter((m) => !m.hidden)
        .map((menu) => (
          <div
            key={menu.path}
            onClick={() => handleClick(menu.path)}
            className={[
              styles.menu_item,
              menu.path === navigate.pathname ? styles.selected : "",
            ].join(" ")}
          >
            <menu.icon className={styles.icon} />
            <span>{t(menu.title)}</span>
          </div>
        ))}
    </div>
  );
}
