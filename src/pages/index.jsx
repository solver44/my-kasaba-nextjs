import React from "react";
import styles from "./home/home.module.scss";
import HomeWrapper from "./home/wrapper";
import Reglament from "@/components/Reglament";
function Home() {
  return (
    <HomeWrapper title="Bosh sahifa" desc="Bosh sahifa" noHeader>
      <Reglament title="homePage.title" message="homePage.message" buttonText="homePage.send"/>
    </HomeWrapper>
  );
}

export default Home;
