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
          <span>Familyasi</span> <u>Anvar</u>
        </p>
        <p className={styles.row}>
          <span>Ismi</span> <u>Anvarov</u>
        </p>
        <p className={styles.row}>
          <span>Otasining ismi</span> <u>Anvarovich</u>
        </p>
        <p className={styles.row}>
          <span>Tug'ilgan yili</span> <u>10.02.1986</u>
        </p>
        <p className={styles.row}>
          <span>Kasaba uyushmasiga a'zo bo'lgan yili</span> <u>19.01.2005</u>
        </p>
        <p className={styles.row}>
          <span>BKUT nomi</span> <u>"Buxgalter" MCHJ</u>
        </p>
        <p className={styles.row}>
          <span>BKUT raisi</span> <u>Jamshidbek Jamshidbekov Anvarovich</u>
        </p>
        <p className={styles.row}>Shaxsiy imzo _______________</p>
      </Paper>
    </div>
  );
}
