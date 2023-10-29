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
  EmojiTransportation,
  PeopleAlt,
  Hail,
  Settings,
  Report,
} from "@mui/icons-material";
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
  },
  {
    icon: Group,
    title: "groupOrganizations",
    path: "/group-organizations",
  },
  {
    icon: PeopleAlt,
    title: "allEmployeesTitle",
    path: "/employees",
  },
  // {
  //   icon: Hail,
  //   title: "members",
  //   path: "/members",
  // },
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
  // {
  //   icon: LibraryBooks,
  //   title: "reports",
  //   path: "/reports",
  // },
  // {
  //   icon: EmojiTransportation,
  //   title: "basicTools",
  //   path: "/basic-tools",
  // },
];

export default function AllMenu({ collapsed }) {
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
