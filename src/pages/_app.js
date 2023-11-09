import React from "react";
import "../styles/globals.scss";
import "../styles/app.scss";
import "../styles/drag&drop.scss";
import "../styles/modal.scss";
import "../i18n";
import { Provider, useSelector } from "react-redux";
import { store } from "../store";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/uz-latn";
import "dayjs/locale/ru";
import { useTranslation } from "react-i18next";
import Loader from "@/components/Loader";
import { SnackbarProvider } from "notistack";
import Head from "next/head";
import App from "next/app";
import { readJSONFile } from "@/utils/jsonUtils";
import TOKENS from "@/utils/config";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function _app(props) {
  return (
    <Provider store={store}>
      <MyApp {...props} />
    </Provider>
  );
}

function saveTokens(tokens) {
  if (!tokens?.accessToken) return;
  TOKENS.ACCESS_TOKEN = tokens.accessToken;
  TOKENS.REFRESH_TOKEN = tokens.refreshToken;
}

const MyApp = ({ Component, pageProps, tokens }) => {
  const layout = Component?.layout || ((page) => page);
  const { i18n, t } = useTranslation();
  const { showLoading, bkutData } = useSelector((state) => state);
  saveTokens(tokens);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={i18n.language === "uz" ? "uz-latn" : "ru"}
    >
      <Head>
        <title>Shaxsiy Kabinet | My Kasaba</title>
        <script
          src="https://www.google.com/recaptcha/api.js"
          async
          defer
        ></script>
        <link rel="shortcut icon" href="/icon.png" />
      </Head>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={8000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {showLoading && <Loader />}
        {layout(<Component {...pageProps} />, t, bkutData)}
      </SnackbarProvider>
    </LocalizationProvider>
  );
};

_app.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  var tokens = null;
  if (typeof window === "undefined") tokens = await readJSONFile();

  return {
    pageProps: {
      ...appProps.pageProps,
    },
    tokens,
  };
};
