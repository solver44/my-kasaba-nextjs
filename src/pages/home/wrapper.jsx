import React from "react";
import Profile from "../../components/Profile";
import PartMenu from "../../components/Menu/part";
import styles from "./home.module.scss";
import logo from "public/kasaba-logo.svg";
import HomeContentWrapper from "../../components/HomeContentWrapper";
import Logout from "../../components/Logout";
import Image from "next/image";
import PrivateRoute from "@/utils/withAuth";

const HomeWrapper = ({ children, noHeader, title, desc }) => {
  return (
    <PrivateRoute>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.top}>
            <Image className={styles.logo} src={logo} alt="logotip kasaba" />
            <Profile title="Asqarbek Abdullayev" />
            <PartMenu />
          </div>
          <div className={styles.bottom}>
            <Logout />
          </div>
        </div>
        <div className={"wrapper " + styles.right}>
          <HomeContentWrapper noHeader={noHeader} title={title} desc={desc}>
            {children}
          </HomeContentWrapper>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default HomeWrapper;
