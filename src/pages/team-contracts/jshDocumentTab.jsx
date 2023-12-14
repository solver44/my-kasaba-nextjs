import { Chip } from "@mui/material";
import React, { useState } from "react";
import styles from "./team-contracts.module.scss";
import { AddCircle, Check, CheckCircle } from "@mui/icons-material";
import DocumentViewer from "@/components/DocumentViewer";

export default function JShDocument({ data, bkutData }) {
  const { applications = [] } = data;
  const [selectedDoc, setSelectedDoc] = useState(0);
  const currentFile =
    applications?.length > 0 ? applications[selectedDoc].file : "";

  function handleDoc(index) {
    setSelectedDoc(index);
  }

  function newAdd() {}

  console.log(data);
  return (
    <div>
      <div className={styles.topDocs}>
        {applications.map((app, index) => (
          <Chip
            style={{ fontSize: 18, height: "auto", padding: "2px 1px" }}
            onClick={() => handleDoc(index)}
            clickable
            icon={selectedDoc == index ? <CheckCircle /> : ""}
            color={selectedDoc == index ? "primary" : "default"}
            variant={"outlined"}
            label={app.file.split("=")[1]}
          />
        ))}
        {/* <Chip
          style={{ fontSize: 18, height: "auto", padding: "2px 1px" }}
          onClick={() => newAdd()}
          clickable
          color="default"
          variant={"outlined"}
          label={<AddCircle />}
        /> */}
      </div>
      <DocumentViewer url={currentFile} />
    </div>
  );
}
