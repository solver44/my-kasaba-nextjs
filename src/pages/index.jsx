import React from "react";
import styles from "./home/home.module.scss";
import HomeWrapper from "./home/wrapper";
import Reglament from "@/components/Reglament";
export default function Home() {
  return (
    <Reglament
      title="homePage.title"
      message="homePage.message"
      buttonText="homePage.send"
    />
  );
}

Home.layout = function (Component) {
  return (
    <HomeWrapper title="Bosh sahifa" desc="Bosh sahifa" noHeader>
      {Component}
    </HomeWrapper>
  );
};
