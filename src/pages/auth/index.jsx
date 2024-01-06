import React, { useEffect, useRef, useState } from "react";
import styles from "./auth.module.scss";
import bg from "public/auth-bg.svg";
import logo from "public/kasaba-logo.svg";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/LanguageSelector";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import useActions from "../../hooks/useActions";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { localStorage } from "@/utils/window";
import Image from "next/image";
import Input from "@/components/Input";
import { validateEmpty } from "@/utils/validation";
import { useSnackbar } from "notistack";
import { getBKUTData, loginRest } from "@/http/data";
import Cookies from "universal-cookie";
import { getIsOrganization } from "@/utils/data";

export default function Auth() {
  const actions = useActions();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const navigate = useRouter();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [inputData, setInputData] = useState({ username: "", password: "" });
  const [inputErrors, setInputErrors] = useState({
    username: false,
    password: false,
  });

  const handleInput = (e, name) => {
    const value = e.target.value;
    setInputData((inputData) => ({ ...inputData, [name]: value }));
  };
  const login = async () => {
    let isInvalid = false;
    Object.values(inputData).map((isValid, index) => {
      const key = Object.keys(inputData)[index];
      if (!isValid) {
        setInputErrors((inputErrors) => ({ ...inputErrors, [key]: true }));
        isInvalid = true;
      }
    });
    if (isInvalid) {
      // Handle the case where there are input errors (e.g., display an error message)
      setInputErrors({ username: true, password: true });
      return;
    }
    actions.showLoading(true);

    const bkutData = await loginRest(inputData.username, inputData.password);
    if (bkutData?.success) {
      localStorage.setItem("token", bkutData.id);
      localStorage.setItem("type", bkutData.type);
      const isOrg = getIsOrganization(bkutData.type);
      const cookies = new Cookies();
      cookies.set("token", bkutData.id);
      cookies.set("type", bkutData.type);
      actions.loginSuccess();
      actions.setIsOrganization(isOrg);
      const resData = await getBKUTData(bkutData.id, isOrg);
      if (resData?.protocolFile || isOrg) {
        actions.isMember(true);
        await navigate.push("/");
      } else {
        actions.isMember(false);
        await navigate.push("/register-bkut");
      }
    } else {
      if (bkutData.message === "bkut is expelled")
        enqueueSnackbar(t("bkut-is-expelled"), { variant: "error" });
      else enqueueSnackbar(t("error-auth"), { variant: "error" });
    }
    actions.showLoading(false);
  };

  return (
    // <LoginRoute>
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.left_content}>
          <Image style={{ marginBottom: 20 }} src={logo} alt="kasaba logo" />
          <p className={styles.subtitle}>{t("login.title")}</p>
          <p className={styles.title}>{t("welcome")}</p>
        </div>
        <Image className={styles.bg} src={bg} alt="auth background" />
      </div>
      <div className={"wrapper " + styles.right}>
        <div className={styles.top}>
          <Link href="/check-status" className="unfocus-link">
            {t("checkStatusTitle")}
          </Link>
          <LanguageSelector />
        </div>
        <div className={styles.auth_content}>
          <p className={styles.auth_title}>{t("loginTitle")}</p>
          <Input
            id="standard-basic"
            label={t("email")}
            validation={validateEmpty}
            invalid={inputErrors.username}
            validationError="input-error.empty"
            // name="email"
            standart
            onChange={(e) => handleInput(e, "username")}
          />
          <Input
            id="standard-basic"
            label={t("password")}
            standart
            validationError="input-error.empty"
            validation={validateEmpty}
            invalid={inputErrors.password}
            onChange={(e) => handleInput(e, "password")}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" style={{ marginRight: 10 }}>
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={(event) => event.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
          <p className="unfocus t-center">- {t("or")} -</p>
          <div className="center">
            <Image
              style={{ cursor: "pointer" }}
              src={require("public/one_id.png")}
              height={45}
              width={85}
              alt="ONE ID"
            />
          </div>
          <button onClick={login} className={styles.button}>
            {t("loginTitle")}
          </button>
          <a href="#/auth" className="unfocus t-center small">
            {t("forgot-password")}
          </a>
          <div className="mt-2 row g-1 j-center">
            <span className="unfocus">{t("not-registered")}</span>
            <Link href="/request" className="unfocus-link">
              {t("registerTitle")}
            </Link>
          </div>
        </div>
      </div>
    </div>
    // </LoginRoute>
  );
}
