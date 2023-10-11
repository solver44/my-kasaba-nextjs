import React, { useEffect } from "react";
import Profile from "../../components/Profile";
import PartMenu from "../../components/Menu/part";
import styles from "./home.module.scss";
import logo from "public/kasaba-logo.svg";
import HomeContentWrapper from "../../components/HomeContentWrapper";
import Logout from "../../components/Logout";
import Image from "next/image";
import PrivateRoute from "@/utils/withAuth";
import AllMenu from "@/components/Menu/all";
import { useSelector } from "react-redux";
import { getBKUTData } from "@/http/data";
import useActions from "@/hooks/useActions";
import { useRouter } from "next/router";

const HomeWrapper = ({ children, noHeader, title, desc }) => {
  const { updateData, ...states } = useSelector((state) => state);
  const actions = useActions();
  const route = useRouter();

  useEffect(() => {
    if (!states.isLoggedIn) return;
    const fetchData = async () => {
      actions.showLoading(true);
      actions.dataLoading(true);
      const data = await getBKUTData();
      if (data?.response?.data?.error == "Invalid entity ID") {
        // enqueueSnackbar(t("successfully-saved"), { variant: "error" });
        actions.loginFailure();
        localStorage.removeItem("token");
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

  return (
    <PrivateRoute>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.top}>
            <Image className={styles.logo} src={logo} alt="logotip kasaba" />
            <Profile />
            {!states.isMember ? <PartMenu /> : <AllMenu />}
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
