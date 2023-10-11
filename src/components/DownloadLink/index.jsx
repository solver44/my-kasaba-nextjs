import { CircularProgress } from "@mui/material";
import React, { useEffect, useRef } from "react";

export default function DownloadLink({ binaryData, fileName, style = {} }) {
  const element = useRef();
  const createDownloadLink = () => {
    const blob = new Blob([binaryData], { type: "octet/stream" });
    const url = URL.createObjectURL(blob);

    const a = element.current;
    a.href = url;
    a.download = fileName;

    a.innerHTML = fileName;

    // URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!binaryData) return;
    createDownloadLink();
  }, [binaryData]);

  return <a style={style} ref={element}><CircularProgress size={25} /></a>;
}
