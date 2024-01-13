import React, { useState } from "react";
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
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useSelector } from "react-redux";
import useAnimation from "@/hooks/useAnimation";

export default function AllMenu({ collapsed }) {
  const { t } = useTranslation();
  const navigate = useRouter();
  const { isOrganization } = useSelector((state) => state);
  const animRef = useAnimation();
  const [openedMenus, setOpenedMenus] = useState({});

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
      icon: HealthAndSafetyIcon,
      title: "labor-protection",
      path: "/labor-protection",
      children: [
        {
          icon: LibraryBooks,
          title: "labor.report",
          path: "/labor-protection/reports",
        },
        {
          icon: LibraryBooks,
          title: "labor.app3",
          path: "/labor-protection/app3",
        },
      ],
    },
    {
      icon: InsertChart,
      title: "statisticalInformation",
      path: "/statistical-information",
    },
    {
      icon: Diversity3,
      title: "teamContracts",
      path: "/team-contracts",
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

  const handleClick = (menu) => {
    if (menu.children) {
      setOpenedMenus((menus) => ({
        ...menus,
        [menu.title]: !!!menus[menu.title],
      }));
      return;
    }
    navigate.push(menu.path);
  };

  return (
    <div
      className={[styles.wrapper, collapsed ? styles.collapsed : ""].join(" ")}
    >
      {menu
        .filter((m) => !m.hidden)
        .map((menu) => {
          const isParent = menu.children;
          const isOpened = openedMenus[menu.title];
          const isExpanded =
            isParent &&
            menu.children.find((ch) => ch.path === navigate.pathname);
          return (
            <div
              key={menu.path}
              ref={isParent && animRef}
              className={styles.menu_wrapper}
            >
              <div
                onClick={() => handleClick(menu)}
                className={[
                  styles.menu_item,
                  menu.path === navigate.pathname ? styles.selected : "",
                ].join(" ")}
              >
                <menu.icon className={styles.icon} />
                <span>{t(menu.title)}</span>
                {isParent && (
                  <ArrowDropDownIcon
                    style={isOpened ? { transform: "rotateZ(180deg)" } : {}}
                    className={styles.caret}
                  />
                )}
              </div>
              {((isParent && isOpened) || isExpanded) && (
                <div className={styles.menu_children}>
                  {menu.children.map((menu) => (
                    <div
                      key={menu.path}
                      onClick={() => handleClick(menu)}
                      className={[
                        styles.menu_child,
                        styles.menu_item,
                        menu.path === navigate.pathname ? styles.selected : "",
                      ].join(" ")}
                    >
                      <menu.icon className={styles.icon} />
                      <span>{t(menu.title)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
