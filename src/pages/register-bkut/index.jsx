import React, { useEffect, useRef, useState } from "react";
import styles from "./registerBkut.module.scss";
import HomeWrapper from "../home/wrapper";
import { useTranslation } from "react-i18next";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import VerticalStepper from "@/components/VerticalStepper";
import SuccessRegisterBkut from "./success";
import { initFile, sendEBKUT } from "@/http/data";
import { getLocalizationNames } from "@/utils/data";
import FormValidation from "@/components/FormValidation";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import useActions from "@/hooks/useActions";

export default function RegisterBkut() {
  const { t, i18n } = useTranslation();
  const { bkutData = {} } = useSelector((states) => states);
  const [isFinished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const employees = useRef({});
  const { enqueueSnackbar } = useSnackbar();
  const actions = useActions();

  const handleFinish = async (data) => {
    try {
      setLoading(true);
      if (employees.current?.rows?.length < 1) {
        enqueueSnackbar(t("employees.empty"), { variant: "error" });
        return;
      }
      const employeesRequest = employees.current.rows.map((e) => ({
        position: {
          id: e.position.value,
        },
        employee: {
          id: e.id,
        },
        bkut: {
          id: bkutData.id,
        },
      }));
      let applicationFileRef, protocolFileRef;
      let responseFile = await initFile(data.electronicFile);
      if (!responseFile?.fileRef) {
        enqueueSnackbar(t("upload-file-error"), { variant: "error" });
        return;
      }
      protocolFileRef = responseFile.fileRef;
      responseFile = await initFile(data.application);
      if (!responseFile?.fileRef) {
        enqueueSnackbar(t("upload-file-error"), { variant: "error" });
        return;
      }
      applicationFileRef = responseFile.fileRef;

      const requestData = {
        id: bkutData.id,
        code: "1111",
        employees: employeesRequest,
        soato: {
          id: data.district,
        },
        adress: data.address,
        branch: {
          id: data.network,
        },
        eLegalEntity: {
          id: bkutData.eLegalEntity.id,
        },
        parent: {
          id: bkutData.parent.id,
        },
        applicationFile: applicationFileRef,
        protocolNumber: data.foundingDocNum,
        bkutType: data.bkutType,
        email: data.email,
        protocolFile: protocolFileRef,
        inn: bkutData.application.tin,
        phone: data.phoneNumber,
        protocolDate: data.foundingDocDate,
        name: data.bkutName,
        decisionDate: dayjs().format("YYYY-MM-DD"),
      };

      const response = await sendEBKUT(requestData);

      if (response?.id) {
        setFinished(true);
        actions.updateData();
      } else {
        enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.wrapper}>
      {!isFinished && (
        <div className={styles.top}>
          <h1 className={styles.title}>{bkutData.name}</h1>
          <p className={styles.desc}>
            {getLocalizationNames(bkutData.branch, i18n)}
          </p>
        </div>
      )}

      <FormValidation onSubmit={handleFinish}>
        {!isFinished ? (
          <VerticalStepper
            loading={loading}
            validation
            steps={[
              {
                label: t("register-bkut-page.step1"),
                children: <Step1 bkutData={bkutData} />,
              },
              {
                label: t("register-bkut-page.step2"),
                children: (
                  <Step2
                    onUpload={(data) => (employees.current = data)}
                    bkutData={bkutData}
                  />
                ),
              },
              {
                label: t("register-bkut-page.step3"),
                children: <Step3 bkutData={bkutData} />,
              },
            ]}
          />
        ) : (
          <SuccessRegisterBkut />
        )}
      </FormValidation>
    </div>
  );
}

RegisterBkut.layout = function (Component, t) {
  return (
    <HomeWrapper
      title={t("register-bkut-page.title")}
      desc={t("register-bkut-page.desc")}
    >
      {Component}
    </HomeWrapper>
  );
};
