import React from "react";
import styles from "./ticket.module.scss";
import { useRouter } from "next/router";
import { Paper } from "@mui/material";
import logo from "public/kasaba-logo.svg";
import Image from "next/image";

export default function TicketPage(p) {
  const router = useRouter();
  //same name as name of your file, can be [slug].js; [specialId].js - any name you want
  const { id } = router.query;
  return (
    <div className={styles.container}>
      <Paper elevation={3} variant="outlined" className={styles.content}>
        <div className={styles.top}>
          <Image className={styles.logo} src={logo} />
          <h1 className={styles.title}>
            A'zolik bileti raqami: 173T112211B-00000
          </h1>
        </div>
        <p className={styles.row}>
          <span>Familyasi</span> <u>Nabiyev</u>
        </p>
        <p className={styles.row}>
          <span>Ismi</span> <u>Zafar</u>
        </p>
        <p className={styles.row}>
          <span>Otasining ismi</span> <u>Irkinovich</u>
        </p>
        <p className={styles.row}>
          <span>Tug'ilgan yili</span> <u>13.03.1971</u>
        </p>
        <p className={styles.row}>
          <span>Kasaba uyushmasiga a'zo bo'lgan yili</span> <u>10.10.2000</u>
        </p>
        <p className={styles.row}>
          <span>BKUT nomi</span> <u>СОВЕТ ФЕДЕРАЦИИ ПРОФСОЮЗА</u>
        </p>
        <p className={styles.row}>
          <span>BKUT raisi</span> <u>Jamshidbek Jamshidbekov Anvarovich</u>
        </p>
        <p className={styles.row}>Shaxsiy imzo _______________</p>
      </Paper>
    </div>
  );
}
