import React, { useEffect, useRef, useState } from "react";
import Profile from "../../components/Profile";
import PartMenu from "../../components/Menu/part";
import styles from "./home.module.scss";
import logo from "public/kasaba-logo.svg";
import HomeContentWrapper from "../../components/HomeContentWrapper";
import Logout from "../../components/Logout";
import Image from "next/image";
import AllMenu from "@/components/Menu/all";
import { useSelector } from "react-redux";
import { getBKUTData } from "@/http/data";
import useActions from "@/hooks/useActions";
import { useRouter } from "next/router";
import MenuIcon from "@mui/icons-material/Menu";
import { getAnimation } from "@/utils/animation";
import Cookies from "universal-cookie";

const HomeWrapper = ({ children, noTitle, noHeader, title, desc }) => {
  const { updateData, ...states } = useSelector((state) => state);
  const actions = useActions();
  const route = useRouter();
  const [collapsed, setCollapsed] = useState();
  const animRef = useRef();

  useEffect(() => {
    animRef.current &&
      getAnimation().then((func) => {
        func(animRef.current);
      });

    if (!states.isLoggedIn) return;
    const fetchData = async () => {
      actions.showLoading(true);
      actions.dataLoading(true);
      const data = await getBKUTData();
      const resError = data?.response?.data?.error;
      if (resError == "Entity not found" || resError == "Invalid entity ID") {
        actions.loginFailure();
        localStorage.removeItem("token");
        const cookies = new Cookies();
        cookies.remove("token");
        actions.showLoading(false);
        actions.dataLoading(false);
        route.replace("/auth");
        return;
      }
      actions.bkutData(data);
      if (data?.protocolFile) {
        actions.isMember(true);
      }
      actions.dataLoading(false);
      actions.showLoading(false);
    };
    fetchData();
  }, [updateData]);

  function toggleMenu() {
    setCollapsed(!collapsed);
  }

  return (
    // <PrivateRoute>
    <div className={styles.container}>
      <div
        className={[styles.left, collapsed ? styles.collapsed : ""].join(" ")}
      >
        <div className={styles.top}>
          <MenuIcon
            className={styles.collapseBtn}
            onClick={toggleMenu}
          ></MenuIcon>
          <Image className={styles.logo} src={logo} alt="logotip kasaba" />
          <Profile collapsed={collapsed} />
          {/* {!states.isMember ? (
            <PartMenu collapsed={collapsed} />
          ) : ( */}
          <Logout collapsed={collapsed} />
          <AllMenu collapsed={collapsed} />
          {/* )} */}
        </div>
      </div>
      <div ref={animRef} className={"wrapper " + styles.right}>
        <HomeContentWrapper
          noHeader={noHeader}
          noTitle={noTitle}
          title={title}
          desc={desc}
        >
          {children}
        </HomeContentWrapper>
      </div>
    </div>
    // </PrivateRoute>
  );
};

export default HomeWrapper;
