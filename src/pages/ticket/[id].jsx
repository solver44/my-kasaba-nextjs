import React, { useEffect, useState } from "react";
import styles from "./ticket.module.scss";
import { useRouter } from "next/router";
import { Paper } from "@mui/material";
import logo from "public/kasaba-logo.svg";
import Image from "next/image";
import { decryptData } from "@/utils/encryptdecrypt";
import { showOrNot } from "@/utils/data";
import QRCode from "react-qr-code";
import { enqueueSnackbar } from "notistack";

export default function TicketPage(p) {
  const router = useRouter();
  const [data, setData] = useState({
    id: "173T112211B-00000",
    firstName: "Zafar",
    lastName: "Nabiyev",
    middleName: "Irkinovich",
    birthDate: "13.03.1971",
    joinDate: "10.10.2000",
    bkutName: "СОВЕТ ФЕДЕРАЦИИ ПРОФСОЮЗА",
    director: "Jamshidbek Jamshidbekov Anvarovich",
    url: "",
  });
  //same name as name of your file, can be [slug].js; [specialId].js - any name you want
  const { id, d } = router.query;
  useEffect(() => {
    if (!d) return;
    try {
      setData({ ...decryptData(d), url: window.location.href });
    } catch (error) {
      setData({});
      enqueueSnackbar("Ma'lumotlarni yuklashda xatolik mavjud.", {
        variant: "error",
      });
    }
  }, [d]);

  return (
    <div className={styles.container}>
      <Paper elevation={2} variant="elevation" className={styles.content}>
        <div className={styles.top}>
          <Image className={styles.logo} src={logo} />
          <h1 className={styles.title}>
            A'zolik bileti raqami: {showOrNot(data.id.slice(0, 13))}
          </h1>
        </div>
        <p className={styles.row}>
          <span>Familyasi</span> <u>{showOrNot(data.lastName)}</u>
        </p>
        <p className={styles.row}>
          <span>Ismi</span> <u>{showOrNot(data.firstName)}</u>
        </p>
        <p className={styles.row}>
          <span>Otasining ismi</span> <u>{showOrNot(data.middleName)}</u>
        </p>
        <p className={styles.row}>
          <span>Tug'ilgan yili</span> <u>{showOrNot(data.birthDate)}</u>
        </p>
        <p className={styles.row}>
          <span>Kasaba uyushmasiga a'zo bo'lgan yili</span>{" "}
          <u>{showOrNot(data.joinDate)}</u>
        </p>
        <p className={styles.row}>
          <span>BKUT nomi</span> <u>{showOrNot(data.bkutName)}</u>
        </p>
        <p className={styles.row}>
          <span>BKUT raisi</span> <u>{showOrNot(data.director)}</u>
        </p>

        {data.url && (
          <QRCode
            size={120}
            className={styles.qrCode}
            value={data.url}
            viewBox={`0 0 120 120`}
          />
        )}

        {/* <img
          alt="qr code"
          height={90}
          src="https://www.qrstuff.com/images/default_qrcode.png"
        /> */}
        <p className={styles.row}>Shaxsiy imzo _______________</p>
      </Paper>
    </div>
  );
}
