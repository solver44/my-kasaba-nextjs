import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTranslation } from "react-i18next";
import useActions from "../../hooks/useActions";
import { useRouter } from "next/router";
import { localStorage } from "@/utils/window";

export default function Logout({ collapsed }) {
  const { t } = useTranslation();
  const actions = useActions();
  const navigate = useRouter();
  const handleClick = () => {
    actions.loginFailure();
    localStorage.removeItem("token");
    navigate.push("/auth");
  };

  return (
    <div
      onClick={handleClick}
      style={{ cursor: "pointer" }}
      className={"row g-3 a-center " + (collapsed ? "j-center" : "")}
    >
      <LogoutIcon />
      {!collapsed && <p>{t("logout")}</p>}
    </div>
  );
}
