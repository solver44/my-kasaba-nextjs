import React, { useEffect, useState } from "react";
import HomeWrapper from "../home/wrapper";
import DocumentViewer from "@/components/DocumentViewer";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { getLocalizationNames, getPresidentBKUT } from "@/utils/data";

export default function JSH1() {
  const [Iframe, setIframe] = useState();
  const { bkutData = {} } = useSelector((state) => state);
  useEffect(() => {
    setIframe(
      <DocumentViewer
        generateData={{
          year: dayjs().year(),
          organization_name: bkutData.name,
          organization_address: bkutData.address,
          organization_ownership: getLocalizationNames(
            bkutData.eLegalEntity?.ownership
          ),
          organization_president: getPresidentBKUT(bkutData),
        }}
        documentSrc="/1jsh.docx"
        fileName={bkutData.name + " 1jsh hisoboti"}
      />
    );
  }, []);
  return <div>{Iframe}</div>;
}
JSH1.layout = function (Component, t) {
  return <HomeWrapper title="1JSH hisoboti">{Component}</HomeWrapper>;
};
