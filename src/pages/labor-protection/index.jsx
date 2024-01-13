import React from "react";
import HomeWrapper from "../home/wrapper";

export default function LaborProtectionPage() {
  return <div>LaborProtectionPage</div>;
}
LaborProtectionPage.layout = function (Component, t) {
  return <HomeWrapper title={t("labor-protection")}>{Component}</HomeWrapper>;
};
