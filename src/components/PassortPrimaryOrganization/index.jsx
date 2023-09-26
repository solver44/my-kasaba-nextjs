import React from "react";
import styles from "./profile.module.scss";
import PersonIcon from "@mui/icons-material/Person";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

export default function passortPrimaryOrganization({ mini }) {
  const { t } = useTranslation();
  const navigate = useRouter();
  const isSelected = !mini && navigate.pathname === "/passortPrimaryOrganization";

  const handleClick = () => {
    navigate.push("/passortPrimaryOrganization");
  };
  return (
    
    <div>
      asdasdasdsa
    </div>
  );
}