import React, { useEffect, useState } from "react";
import styles from "./ticket.module.scss";
import { useRouter } from "next/router";
import { CircularProgress, Paper } from "@mui/material";
import logo from "public/kasaba-logo.svg";
import Image from "next/image";
import { decryptData } from "@/utils/encryptdecrypt";
import { showOrNot } from "@/utils/data";
import QRCode from "react-qr-code";
import { enqueueSnackbar } from "notistack";
import { t } from "i18next";
import { getTicketMember } from "@/http/employees";
import { getUrlWithQuery } from "@/utils/window";

export default function TicketPage(p) {
  const router = useRouter();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = router.query;

  async function initData() {
    const response = await getTicketMember(id);
    if (!response.success) throw new Error("error");
    const url = getUrlWithQuery("/ticket/" + id);
    response.data.url = url;
    return response.data;
  }
  useEffect(() => {
    if (!id) return;

    initData()
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((e) => {
        setData({});
        setLoading(false);
        enqueueSnackbar(t("fetch-error1"), {
          variant: "error",
        });
      });
  }, [id]);

  return (
    <div className={styles.container}>
      <Paper elevation={2} variant="elevation" className={styles.content}>
        {loading ? (
          <div className={styles.loader}>
            <CircularProgress style={{ color: "#618597" }} />
          </div>
        ) : (
          <React.Fragment>
            <div className={styles.top}>
              <Image alt="kasaba-logo" className={styles.logo} src={logo} />
              <h1 className={styles.title}>
                A'zolik bileti raqami:{" "}
                <span className={styles.code}>{showOrNot(data.id)}</span>
              </h1>
            </div>
            <p className={styles.row}>
              <span>Familyasi:</span> <u>{showOrNot(data.lastName)}</u>
            </p>
            <p className={styles.row}>
              <span>Ismi:</span> <u>{showOrNot(data.firstName)}</u>
            </p>
            <p className={styles.row}>
              <span>Otasining ismi:</span> <u>{showOrNot(data.middleName)}</u>
            </p>
            <p className={styles.row}>
              <span>Tug'ilgan yili:</span> <u>{showOrNot(data.birthDate)}</u>
            </p>
            <p className={styles.row}>
              <span>Kasaba uyushmasiga a'zo bo'lgan yili:</span>{" "}
              <u>{showOrNot(data.joinDate)}</u>
            </p>
            <p className={styles.row}>
              <span>BKUT nomi:</span>{" "}
              <u className={styles.bold}>{showOrNot(data.bkutName)}</u>
            </p>
            <p className={styles.row}>
              <span>BKUT raisi:</span> <u>{showOrNot(data.director)}</u>
            </p>

            {data.url && (
              <QRCode
                size={80}
                className={styles.qrCode}
                value={data.url}
                viewBox={`0 0 80 80`}
              />
            )}

            {/* <img
          alt="qr code"
          height={90}
          src="https://www.qrstuff.com/images/default_qrcode.png"
        /> */}
            {/* <p role="sign" className={styles.row}>
              Shaxsiy imzo _______________
            </p> */}
          </React.Fragment>
        )}
      </Paper>
    </div>
  );
}
