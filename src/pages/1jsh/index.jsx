import React, { useEffect, useState } from "react";
import HomeWrapper from "../home/wrapper";
import DocumentViewer from "@/components/DocumentViewer";

export default function JSH1() {
  const [Iframe, setIframe] = useState();
  useEffect(() => {
    setIframe(
      <DocumentViewer documentSrc="/report1ti.docx" />
    );
  }, []);
  return <div>{Iframe}</div>;
}
JSH1.layout = function (Component, t) {
  return <HomeWrapper title="1JSH hisoboti">{Component}</HomeWrapper>;
};
