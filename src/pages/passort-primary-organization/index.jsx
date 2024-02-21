import React, { useEffect, useRef, useState } from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./passort-primary-organization.module.scss";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  getFIO,
  getLocalizationNames,
  getPresidentBKUT,
  showOrNot,
} from "@/utils/data";
import { getFile, initFile, sendEBKUT } from "@/http/data";
import DownloadLink from "@/components/DownloadLink";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VerticalStepper from "@/components/VerticalStepper";
import Step1 from "../register-bkut/step1";
import Step3 from "../register-bkut/step3";
import FormValidation from "@/components/FormValidation";
import { useSnackbar } from "notistack";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Close } from "@mui/icons-material";
import { convertStringToFormatted } from "@/utils/date";
import { LoadingButton } from "@mui/lab";
import useActions from "@/hooks/useActions";
import areEqual from "@/utils/areEqual";

export async function parseFile(file) {
  if (!file) return [null, null];
  const res = await getFile(file);
  return [res, decodeURIComponent(file.split("=")[1]).replace(/\+/g, " ")];
}

export default function PassortPrimaryOrganization() {
  const { t, i18n } = useTranslation();
  const { bkutData = {}, isOrganization } = useSelector((states) => states);
  const [editMode, setEditMode] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [loadingEditMode, setLoadingEditMode] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [animRef] = useAutoAnimate();
  const actions = useActions();

  const [files, setFiles] = useState({
    applicationFile: { loading: true },
    protocolFile: { loading: true },
    decisionFile: { loading: true },
  });

  useEffect(() => {
    const fetchData = async () => {
      let res1 = await parseFile(bkutData.protocolFile);
      let res2 = await parseFile(bkutData.applicationFile);
      let res3 = await parseFile(bkutData.decisionFile);
      setFiles({
        protocolFile: { name: res1[1], data: res1[0] },
        applicationFile: { name: res2[1], data: res2[0] },
        decisionFile: { name: res3[1], data: res3[0] },
      });
    };
    fetchData();
  }, [bkutData]);

  async function saveBKUT(data) {
    if (!data) return;
    try {
      setLoadingEditMode(true);
      let applicationFileRef, protocolFileRef, responseFile, temp;
      if (!isOrganization) {
        temp = data.electronicFile;
        if (typeof temp === "string" && temp.includes("fs://")) {
          protocolFileRef = data.electronicFile;
        } else {
          responseFile = await initFile(data.electronicFile);
          if (!responseFile?.fileRef) {
            enqueueSnackbar(t("upload-file-error"), { variant: "error" });
            return;
          }
          protocolFileRef = responseFile.fileRef;
        }
        temp = data.application;
        if (typeof temp === "string" && temp.includes("fs://")) {
          applicationFileRef = data.application;
        } else {
          responseFile = await initFile(data.application);
          if (!responseFile?.fileRef) {
            enqueueSnackbar(t("upload-file-error"), { variant: "error" });
            return;
          }
          applicationFileRef = responseFile.fileRef;
        }
      }

      const requestData = {
        ...bkutData,
        id: bkutData.id,
        code: bkutData.code,
        soato: {
          id: data.district,
        },
        address: data.address,
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
        isLegalEntity: data.isLegalEntity,
        email: data.email,
        protocolFile: protocolFileRef,
        tin: data.bkutSTIR,
        phone: data.phoneNumber,
        protocolDate: data.foundingDocDate,
        name: data.bkutName,
      };
      if (isOrganization) {
        if (data.decisionFile) {
          temp = data.decisionFile;
          if (typeof temp === "string" && temp.includes("fs://")) {
            applicationFileRef = temp;
          } else {
            responseFile = await initFile(temp);
            if (!responseFile?.fileRef) {
              enqueueSnackbar(t("upload-file-error"), { variant: "error" });
              return;
            }
            applicationFileRef = responseFile.fileRef;
          }
          requestData.decisionFile = applicationFileRef;
        }
        requestData.decisionDate = data.decisionDate;
        requestData.decisionNumber = data.decisionNumber;
      }

      const response = await sendEBKUT(requestData);

      if (response?.id) {
        setEditMode(false);
        enqueueSnackbar(t("successfully-saved"), { variant: "success" });
        actions.updateData();
      } else {
        enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(t("error-send-application"), { variant: "error" });
    } finally {
      setLoadingEditMode(false);
    }
  }

  if (isOrganization) {
    bkutData.branch = bkutData.bkut.branch;
    bkutData.parent = bkutData.bkut.parent;
  }

  return (
    <FormValidation
      onSubmit={saveBKUT}
      refresh={editMode}
      onChanged={(newData, currentData) => {
        if (areEqual(newData, currentData)) setIsChanged(false);
        else setIsChanged(true);
      }}
    >
      <div ref={animRef} className={styles.containers}>
        <div className={styles.editBtn}>
          {editMode && (
            <Button
              variant="text"
              onClick={() => {
                setIsChanged(false);
                setEditMode(false);
              }}
              startIcon={<Close />}
              disabled={loadingEditMode}
              type="button"
            >
              {t("leave")}
            </Button>
          )}
          {!editMode ? (
            <Button onClick={() => setEditMode(true)} startIcon={<EditIcon />}>
              {t("change")}
            </Button>
          ) : (
            <LoadingButton
              variant="contained"
              type="submit"
              disabled={!isChanged}
              startIcon={<EditIcon />}
              loading={loadingEditMode}
            >
              {t("save")}
            </LoadingButton>
          )}
        </div>
        {!editMode ? (
          <div className={styles.colored}>
            {isOrganization && (
              <div className={styles.flex}>
                <label>{t("passort-primary-organization.bkut")}</label>
                <span style={{ textAlign: "left" }}>
                  {showOrNot(bkutData?.bkut?.name)}
                </span>
              </div>
            )}
            <div className={styles.flex}>
              <label>
                {t("passort-primary-organization.firstOrganizationName")}
              </label>
              <span style={{ textAlign: "left", fontWeight: "bold" }}>
                {showOrNot(bkutData.name)}
              </span>
            </div>
            <div className={styles.flex}>
              <label>
                {t("passort-primary-organization.firstOrganizationSTIR")}
              </label>
              <span style={{ textAlign: "left" }}>
                {showOrNot(bkutData?.eLegalEntity?.tin)}
              </span>
            </div>
            <div className={styles.flex}>
              <label>
                {t("passort-primary-organization.firstOrganizationNetwork")}
              </label>
              <span style={{ textAlign: "left" }}>
                {showOrNot(getLocalizationNames(bkutData.branch, i18n))}
              </span>
            </div>
            <div className={styles.flex}>
              <label>
                {t("passort-primary-organization.firstOrganizationOrg")}
              </label>
              <span style={{ textAlign: "left" }}>
                {showOrNot(bkutData?.parent?.legalEntity?.name)}
              </span>
            </div>
            <div className={styles.flex}>
              <label>{t("soatoFull")}</label>
              <span style={{ textAlign: "left" }}>
                {showOrNot(
                  `${getLocalizationNames(
                    bkutData?.soato?.parent
                  )}, ${getLocalizationNames(bkutData?.soato)}`
                )}
              </span>
            </div>
            <div className={styles.flex}>
              <label>
                {t("passort-primary-organization.firstOrganizationDirektor")}
              </label>
              <span style={{ textAlign: "left" }}>
                {showOrNot(getPresidentBKUT(bkutData))}
              </span>
            </div>
            <div className={styles.flex}>
              <label>
                {t("passort-primary-organization.firstOrganizationAdr")}
              </label>
              <span style={{ textAlign: "left" }}>
                {showOrNot(bkutData.address)}
              </span>
            </div>
            <div className={styles.flex}>
              <label>
                {t("passort-primary-organization.firstOrganizationTel")}
              </label>
              <span style={{ textAlign: "left" }}>
                {showOrNot(bkutData.phone)}
              </span>
            </div>
            <div className={styles.flex}>
              <label>
                {t("passort-primary-organization.firstOrganizationEmail")}
              </label>
              <span style={{ textAlign: "left" }}>
                {showOrNot(bkutData.email)}
              </span>
            </div>
            {!isOrganization && (
              <div className={styles.flex}>
                <label>{t("founding-doc-num")}</label>
                <span style={{ textAlign: "left" }}>
                  {showOrNot(bkutData.protocolNumber)}
                </span>
              </div>
            )}
            {!isOrganization && (
              <div className={styles.flex}>
                <label>{t("founding-doc-date")}</label>
                <span style={{ textAlign: "left" }}>
                  {showOrNot(convertStringToFormatted(bkutData.protocolDate))}
                </span>
              </div>
            )}
            {!isOrganization && (
              <div className={styles.flex}>
                <label>{t("electronic-file")}</label>
                <DownloadLink
                  loading={files.protocolFile.loading}
                  style={{ textAlign: "left" }}
                  fileName={files.protocolFile.name}
                  binaryData={files.protocolFile.data}
                />
              </div>
            )}
            {!isOrganization && (
              <div className={styles.flex}>
                <label>{t("application")}</label>
                <DownloadLink
                  style={{ textAlign: "left" }}
                  loading={files.applicationFile.loading}
                  fileName={files.applicationFile.name}
                  binaryData={files.applicationFile.data}
                />
              </div>
            )}
            <div className={styles.flex}>
              <label>{t("decision-title")}</label>
              <span style={{ textAlign: "left" }}>
                {showOrNot(bkutData.decisionNumber)}
              </span>
            </div>
            <div className={styles.flex}>
              <label>{t("decision-date")}</label>
              <span style={{ textAlign: "left" }}>
                {convertStringToFormatted(bkutData.decisionDate)}
              </span>
            </div>
            <div className={styles.flex}>
              <label>{t("decision-file")}</label>
              <DownloadLink
                style={{ textAlign: "left" }}
                loading={files.decisionFile.loading}
                fileName={files.decisionFile.name}
                binaryData={files.decisionFile.data}
              />
            </div>
          </div>
        ) : (
          <VerticalStepper
            validation
            noButton
            steps={[
              {
                label: t("register-bkut-page.step1"),
                children: (
                  <Step1
                    canChange
                    isOrganization={isOrganization}
                    bkutData={bkutData}
                  />
                ),
              },
              {
                label: t("register-bkut-page.step3"),
                children: (
                  <Step3
                    isOrganization={isOrganization}
                    filesNotRequired
                    files={{
                      first: {
                        name: files.protocolFile.name,
                        url: bkutData.protocolFile,
                      },
                      second: {
                        name: files.applicationFile.name,
                        url: bkutData.applicationFile,
                      },
                    }}
                    bkutData={bkutData}
                  />
                ),
              },
            ]}
          />
        )}
      </div>
    </FormValidation>
  );
}

PassortPrimaryOrganization.layout = function (Component, t) {
  return (
    <HomeWrapper
      title={t("passort-primary-organization.title")}
      desc={t("profile-page.desc")}
    >
      {Component}
    </HomeWrapper>
  );
};
