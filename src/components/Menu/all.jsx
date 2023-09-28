import React from "react";
import styles from "./menu.module.scss";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { HomeOutlined, Apartment, Business, Group, InsertChart, Diversity3, LibraryBooks, EmojiTransportation, PeopleAlt, Hail, Settings} from "@mui/icons-material";
const menu = [
  { icon: HomeOutlined, title: "home", path: "/" },
  {
    icon: Apartment,
    title: "passortPrimaryOrganization", 
    path: "/passort-primary-organization"
  },
  {
    icon: Business,
    title: "industrialOrganizations", 
    path: "/industrial-organizations"
  },
  {
    icon: Group,
    title: "groupOrganizations", 
    path: "/profile"
  },
  {
    icon: InsertChart,
    title: "statisticalInformation", 
    path: "/profile"
  },
  {
    icon: Diversity3,
    title: "teamContracts", 
    path: "/profile"
  },
  {
    icon: LibraryBooks,
    title: "reports", 
    path: "/profile"
  },
  {
    icon: EmojiTransportation,
    title: "basicTools", 
    path: "/profile"
  },
  {
    icon: PeopleAlt,
    title: "employees", 
    path: "/profile"
  },
  {
    icon: Hail,
    title: "members", 
    path: "/profile"
  },
  {
    icon: Settings,
    title: "settings", 
    path: "/profile"
  },
];

export default function AllMenu() {
  const { t } = useTranslation();
  const navigate = useRouter();

  const handleClick = (path) => {
    navigate.push(path);
  };

  return (
    <div className={styles.wrapper}>
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
          {t(menu.title)}
        </div>
      ))}
    </div>
  );
}

