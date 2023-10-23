import React, { useEffect, useRef, useState } from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./passort-primary-organization.module.scss";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getFIO, getLocalizationNames } from "@/utils/data";
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

export default function PassortPrimaryOrganization() {
  const { t, i18n } = useTranslation();
  const { bkutData = {} } = useSelector((states) => states);
  const [editMode, setEditMode] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const currentData = useRef();
  const [loadingEditMode, setLoadingEditMode] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [animRef] = useAutoAnimate();
  const actions = useActions();
  const [files, setFiles] = useState({
    applicationFile: { loading: true },
    protocolFile: { loading: true },
    decisionFile: { loading: true },
  });

  const director = (bkutData.employees ?? []).find(
    (e) => e?.position?.id == 1
  )?.employee;

  useEffect(() => {
    if (!bkutData?.protocolFile) return;
    const fetchData = async () => {
      let encodedFileName = bkutData.protocolFile.split("=")[1];
      let decodedFileName = decodeURIComponent(encodedFileName).replace(
        /\+/g,
        " "
      );
      encodedFileName = bkutData.applicationFile.split("=")[1];
      let decodedFileName1 = decodeURIComponent(encodedFileName).replace(
        /\+/g,
        " "
      );
      encodedFileName = bkutData.decisionFile.split("=")[1];
      let decodedFileName2 = decodeURIComponent(encodedFileName).replace(
        /\+/g,
        " "
      );
      let response = await getFile(bkutData.protocolFile);
      let response1 = await getFile(bkutData.applicationFile);
      let response2 = await getFile(bkutData.decisionFile);
      setFiles({
        protocolFile: { name: decodedFileName, data: response },
        applicationFile: { name: decodedFileName1, data: response1 },
        decisionFile: { name: decodedFileName2, data: response2 },
      });
    };
    fetchData();
  }, [bkutData]);

  async function saveBKUT(data) {
    if (!data) return;
    try {
      setLoadingEditMode(true);
      let applicationFileRef, protocolFileRef, responseFile;
      if (data.electronicFile.includes("fs://")) {
        protocolFileRef = data.electronicFile;
      } else {
        responseFile = await initFile(data.electronicFile);
        if (!responseFile?.fileRef) {
          enqueueSnackbar(t("upload-file-error"), { variant: "error" });
          return;
        }
        protocolFileRef = responseFile.fileRef;
      }
      if (data.application.includes("fs://")) {
        applicationFileRef = data.application;
      } else {
        responseFile = await initFile(data.application);
        if (!responseFile?.fileRef) {
          enqueueSnackbar(t("upload-file-error"), { variant: "error" });
          return;
        }
        applicationFileRef = responseFile.fileRef;
      }

      const requestData = {
        ...bkutData,
        id: bkutData.id,
        code: bkutData.code,
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
        inn: data.bkutSTIR || bkutData.application.tin,
        phone: data.phoneNumber,
        protocolDate: data.foundingDocDate,
        name: data.bkutName,
      };

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

  return (
    <FormValidation
      onSubmit={saveBKUT}
      onChanged={(data) => {
        if (!currentData.current) {
          currentData.current = data;
          return;
        }
        if (areEqual(data, currentData.current)) setIsChanged(false);
        else setIsChanged(true);
      }}
    >
      <div ref={animRef} className={styles.containers}>
        <div className={styles.editBtn}>
          {editMode && (
            <Button
              variant="text"
              onClick={() => {
                currentData.current = undefined;
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
          <div>
            <div className={styles.flex}>
              <label>
                {t("passort-primary-organization.firstOrganizationName")}
              </label>
              <label style={{ textAlign: "left", fontWeight: "bold" }}>
                {bkutData.name}
              </label>
            </div>
            <div className={styles.flex} style={{ background: "#F9F9F9" }}>
              <label>
                {t("passort-primary-organization.firstOrganizationType")}
              </label>
              <label style={{ textAlign: "left" }}>
                {t(bkutData.bkutType == 1 ? "legalEntity" : "physicalPerson")}
              </label>
            </div>
            <div className={styles.flex}>
              <label>
                {t("passort-primary-organization.firstOrganizationSTIR")}
              </label>
              <label style={{ textAlign: "left" }}>{bkutData.inn}</label>
            </div>
            <div className={styles.flex} style={{ background: "#F9F9F9" }}>
              <label>
                {t("passort-primary-organization.firstOrganizationNetwork")}
              </label>
              <label style={{ textAlign: "left" }}>
                {getLocalizationNames(bkutData.branch, i18n)}
              </label>
            </div>
            <div className={styles.flex}>
              <label>
                {t("passort-primary-organization.firstOrganizationOrg")}
              </label>
              <label style={{ textAlign: "left" }}>
                {getLocalizationNames(bkutData.parent, i18n)}
              </label>
            </div>
            <div className={styles.flex} style={{ background: "#F9F9F9" }}>
              <label>{t("soatoFull")}</label>
              <label style={{ textAlign: "left" }}>{`${getLocalizationNames(
                bkutData.eLegalEntity?.soatoRegion,
                i18n
              )}, ${getLocalizationNames(
                bkutData.eLegalEntity?.soatoDistrict,
                i18n
              )}`}</label>
            </div>
            <div className={styles.flex} style={{ background: "#F9F9F9" }}>
              <label>
                {t("passort-primary-organization.firstOrganizationDirektor")}
              </label>
              <label style={{ textAlign: "left" }}>{getFIO(director)}</label>
            </div>
            <div className={styles.flex} style={{ background: "#F9F9F9" }}>
              <label>
                {t("passort-primary-organization.firstOrganizationAdr")}
              </label>
              <label style={{ textAlign: "left" }}>{bkutData.adress}</label>
            </div>
            <div className={styles.flex}>
              <label>
                {t("passort-primary-organization.firstOrganizationTel")}
              </label>
              <label style={{ textAlign: "left" }}>{bkutData.phone}</label>
            </div>
            <div className={styles.flex} style={{ background: "#F9F9F9" }}>
              <label>
                {t("passort-primary-organization.firstOrganizationEmail")}
              </label>
              <label style={{ textAlign: "left" }}>{bkutData.email}</label>
            </div>
            <div className={styles.flex}>
              <label>{t("founding-doc-num")}</label>
              <label style={{ textAlign: "left" }}>
                {bkutData.protocolNumber}
              </label>
            </div>
            <div className={styles.flex}>
              <label>{t("founding-doc-date")}</label>
              <label style={{ textAlign: "left" }}>
                {convertStringToFormatted(bkutData.protocolDate)}
              </label>
            </div>
            <div className={styles.flex}>
              <label>{t("electronic-file")}</label>
              <DownloadLink
                loading={files.protocolFile.loading}
                style={{ textAlign: "left" }}
                fileName={files.protocolFile.name}
                binaryData={files.protocolFile.data}
              />
            </div>
            <div className={styles.flex}>
              <label>{t("application")}</label>
              <DownloadLink
                style={{ textAlign: "left" }}
                loading={files.applicationFile.loading}
                fileName={files.applicationFile.name}
                binaryData={files.applicationFile.data}
              />
            </div>
            <div className={styles.flex}>
              <label>{t("decision-title")}</label>
              <label style={{ textAlign: "left" }}>
                {bkutData.decisionNumber}
              </label>
            </div>
            <div className={styles.flex}>
              <label>{t("decision-date")}</label>
              <label style={{ textAlign: "left" }}>
                {convertStringToFormatted(bkutData.decisionDate)}
              </label>
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
                children: <Step1 canChange bkutData={bkutData} />,
              },
              {
                label: t("register-bkut-page.step3"),
                children: (
                  <Step3
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
