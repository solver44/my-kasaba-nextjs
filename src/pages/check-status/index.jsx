import React, { useEffect, useRef, useState } from "react";
import styles from "./checkstatus.module.scss";
import { useTranslation } from "react-i18next";
import Input from "../../components/Input";
import useActions from "../../hooks/useActions";
import Table from "../../components/Table";
import { useSearchParams } from "next/navigation";
import { WrapperRequest } from "../request";
import { useSelector } from "react-redux";
import { validateEmpty } from "@/utils/validation";
import { useSnackbar } from "notistack";
import { checkStatusApplication } from "@/http/public";
import { convertStringToFormatted } from "@/utils/date";
import { getFIO, showOrNot } from "@/utils/data";

export default function CheckStatus() {
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
  const [currentID, setCurrentID] = useState(searchParams.get("id") || "");
  const actions = useActions();
  const { caches: state } = useSelector((state) => state);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setCurrentID(searchParams.get("id") || "");
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!currentID) {
      enqueueSnackbar(t("input-error.fill"), { variant: "error" });
      return;
    }
    actions.showLoading(true);
    let data = await checkStatusApplication(currentID);
    if (!data?.success) {
      enqueueSnackbar(t("input-error.applicationId"), { variant: "error" });
      actions.showLoading(false);
      return;
    }
    data = data.application;
    let dataTable = {
      id: currentID,
      status: "wait",
      statusText: data.status[i18n.language === "uz" ? "nameUz" : "nameRu"],
      data: [
        {
          title: "requestGivenDate",
          value: convertStringToFormatted(data.createdDate, true),
        },
        {
          title: "applicationSender",
          value: getFIO(data.passport, true),
        },
        {
          title: "applicationSenderPhone",
          value: showOrNot(data.passport?.phone || data.phone),
        },
        {
          title: "applicationSenderEmail",
          value: showOrNot(data.passport?.email || data.email),
        },
        {
          title: "legalEntity",
          value: showOrNot(data?.legalEntity?.name),
        },
        {
          title: "network",
          value: showOrNot(
            (data?.branch || {})[i18n.language === "uz" ? "nameUz" : "nameRu"]
          ),
        },
        {
          title: "address",
          value: showOrNot(
            data.soato[i18n.language === "uz" ? "nameUz" : "nameRu"]
          ),
        },
        data.status.nameUz == "Qaytarilgan" && {
          title: "reject-message",
          value: showOrNot(data?.rejectReason || data?.status?.rejectReason),
        },
      ],
    };
    actions.caches(dataTable);

    actions.showLoading(false);
  };
  return (
    <WrapperRequest noReglament>
      <div className={styles.wrapper}>
        <div className="card full" style={{boxShadow:"18px 7px 24px 24px rgb(0 0 0 / 4%)"}}>
          <p style={{ paddingBottom: 30, color:"#197bbd" }} className="title bold start">
            {t("check-status.title")}
          </p>
          <Input
            onChange={(e) => setCurrentID(e.target.value)}
            validation={validateEmpty}
            validationError={"input-error.empty"}
            containerStyle={{ paddingLeft: "40px" }}
            fullWidth
            value={currentID}
            titleText={t("check-status.label")}
          />
          <div className={styles.bottom}>
            <button onClick={handleSubmit} className="primary-btn">
              {t("check")}
            </button>
          </div>
        </div>
        {state?.id && (
          <Table
            topComponent={
              <div className={styles.top}>
                <div className="row g-4 a-center">
                  <p className="title bold start" style={{color:"#197bbd"}}>{t("check-status.title1")}</p>
                  <div className={"status " + state.status}>
                  {state.statusText || t("inspection")}
                </div>
                </div>
               
                <p className="unselected" style={{color:"#197bbd"}}>ID: {state.id}</p>
                
              </div>
            }
            data={state.data}
          />
        )}
      </div>
    </WrapperRequest>
  );
}
