import DataTable from "@/components/DataTable";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useEmployees } from "../employees";
import FormInput from "@/components/FormInput";
import { deleteContracts, initFile, sendContracts } from "@/http/data";
import { useSnackbar } from "notistack";
import { getPresidentBKUT } from "@/utils/data";
import BigButton from "@/components/BigButton";
import AddIcon from "@mui/icons-material/Add";
import styles from "./team-contracts.module.scss";
import { Box, Button, Card } from "@mui/material";
import CurrentJSHTab from "./currentJSHTab";
import {
  convertStringToFormatted,
  getFormattedWithRestDay,
  getRestOfDays,
  isOutdated,
  isOutdatedReport,
} from "@/utils/date";
import {
  Add,
  CommentSharp,
  Description,
  InfoRounded,
  TopicRounded,
  Visibility,
} from "@mui/icons-material";
import { parseFile } from "../passort-primary-organization";
import useActions from "@/hooks/useActions";
import CircularStatus from "@/components/CircularStatus";
import ChipStatus from "@/components/ChipStatus";
import Tabs from "@/components/Tabs";
import Opinions from "./opinionsTab";
import MainTab from "./mainTab";
import JShDocument from "./jshDocumentTab";
import { LoadingButton } from "@mui/lab";

export default function InDataTable({ organization, filter }) {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  let {
    bkutData = {},
    isOrganization,
    settings = {},
  } = useSelector((states) => states);
  bkutData = organization ? organization : bkutData;
  const [isHideAddBtn, setIsHideAddBtn] = useState(true);
  const actions = useActions();
  const [loading, setLoading] = useState(false);

  async function getFile(file) {
    if (file && file.slice(0, 3) !== "fs:") {
      let responseFile = await initFile(file);
      if (!responseFile?.fileRef) {
        enqueueSnackbar(t("upload-file-error"), { variant: "error" });
        return;
      }
      return responseFile.fileRef;
    } else {
      return file;
    }
  }

  const columns = [
    {
      field: "projectSentDate",
      headerName: t("team-contracts.sentDate"),
    },
    {
      field: "contractNumber",
      headerName: t("team-contracts.contractNumber"),
    },
    {
      field: "contractDate",
      headerName: t("team-contracts.contractDate"),
    },
    {
      field: "statementNumber",
      headerName: t("team-contracts.applicationNumber"),
    },
    {
      field: "expertizeDate",
      headerName: t("team-contracts.expertizeDate"),
    },
    // {
    //   field: "createdDate",
    //   headerName: t("team-contracts.selectDate"),
    // },
    {
      field: "status",
      headerName: t("team-contracts.status"),
      type: "status",
    },
    {
      field: "contractEndDate",
      headerName: t("team-contracts.contractEndDate"),
    },
  ];

  useEffect(() => {
    if (!bkutData.id) return;
    if (!bkutData?.agreements?.length) {
      setIsHideAddBtn(false);
    } else setIsHideAddBtn(true);
    bkutData.agreements = bkutData.agreements || [];

    const isExpired = !!!bkutData.agreements.find(
      (e) =>
        e.status == "CONFIRMED" &&
        !isOutdatedReport(e.contractEndDate, settings.remainDayForShowJSH)
    );

    if (isExpired) setIsHideAddBtn(false);

    setRows(
      bkutData.agreements.filter(filter ? filter : () => true).map((e) => {
        const restDay =
          e?.contractEndDate &&
          getFormattedWithRestDay(e.contractEndDate, true);
        const restDayJSH = settings.remainDayForShowJSH;
        const isConsidered =
          e?.status == "CONSIDERED" ||
          e?.status == "CONFIRMED" ||
          e?.status == "TO_CONFIRM";
        const date =
          e?.status == "TO_CONFIRM"
            ? e.dateOfResent
            : isConsidered
            ? e.expertizeCompleteDate
            : e.expertizeStartDate;
        return {
          id: e.id,
          projectSentDate: convertStringToFormatted(e.expertizeStartDate),
          contractNumber: e.contractNo,
          currentJSH: e.status === "CURRENT_JSH",
          status: {
            value:
              restDay <= 0
                ? "EXPIRED"
                : restDay <= restDayJSH
                ? "NEAR_EXPIRED"
                : e.status,
            date,
            color:
              restDay <= 0
                ? "error"
                : restDay <= restDayJSH
                ? "warning"
                : undefined,
          },
          contractDate: convertStringToFormatted(e.contractDate),
          statementNumber: e.statementNo,
          contractEndDate:
            e?.status === "CONFIRMED" || e?.status === "CURRENT_JSH"
              ? getFormattedWithRestDay(e.contractEndDate)
              : "",
          expertizeDate: isConsidered
            ? convertStringToFormatted(e.expertizeCompleteDate)
            : getFormattedWithRestDay(e.expertizeEndDate),
        };
      })
    );
  }, [bkutData]);
  async function onSubmitModal(forms, hideModal, isView, dataModal = {}) {
    const isCurrentJSH = dataModal?.currentJSH;
    try {
      if (forms?.restDay && forms?.restDay < 0) {
        enqueueSnackbar(t("team-contracts.expired-current-jsh"), {
          variant: "error",
        });
        return;
      }
      setLoading(true);

      let project = await getFile(forms.applications);
      if (!forms.bkutId || !project) throw Error("error");
      const requestData = {
        collectiveAgreements: {
          applications: [
            {
              file: project,
            },
          ],
        },
      };

      if (isOrganization || organization)
        requestData.collectiveAgreements.eBkutOrganization = {
          id: bkutData.id,
        };
      else requestData.collectiveAgreements.bkut = { id: bkutData.id };

      let application = await getFile(forms.applications1);
      if (application || isCurrentJSH) {
        if (isCurrentJSH) {
          let expertizeFile = await getFile(forms.expertize);
          requestData.collectiveAgreements.status = "CURRENT_JSH";
          requestData.collectiveAgreements.approvedDate = forms.approvedDate;
          requestData.collectiveAgreements.contractDate = forms.contractDate;
          requestData.collectiveAgreements.opinionFile = expertizeFile;
        } else {
          requestData.collectiveAgreements.applications = [
            {
              file: application,
            },
          ];
          requestData.collectiveAgreements.id = dataModal.id;
        }
        requestData.collectiveAgreements.statementNo = forms.applicationNumber;
        requestData.collectiveAgreements.employer = forms.employer;
        requestData.collectiveAgreements.employerRepresentatives =
          forms.employeerRepresentatives;
        requestData.collectiveAgreements.employeesRepresentatives =
          forms.employeesRepresentatives;
      }

      const isJSh = requestData.collectiveAgreements.statementNo;
      const response = await sendContracts(
        requestData,
        dataModal?.status === "CONSIDERED"
      );

      if (response?.success) {
        const newId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 1;
        setRows((prevRows) => [...prevRows, { id: newId, ...forms }]);

        enqueueSnackbar(
          t(isJSh ? "team-contracts.jsh-sent" : "team-contracts.project-sent"),
          {
            variant: "success",
          }
        );
        actions.updateData();
      } else {
        if (
          response?.message ==
          "collective agreement for current bkut is already has been sent"
        )
          enqueueSnackbar(t("team-contracts.project-already-sent"), {
            variant: "error",
          });
        else if (
          response?.message == "collective agreement has not yet expired"
        )
          enqueueSnackbar(t("team-contracts.project-not-expired"), {
            variant: "error",
          });
        else enqueueSnackbar(t("send-data-error"), { variant: "error" });
      }

      if (hideModal) {
        hideModal();
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(t("send-data-error"), { variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function fetchData(id) {
    if (id === "currentJSH") return { currentJSH: true };
    const data = (bkutData.agreements ?? []).find((agr) => agr.id == id);
    return data;
  }

  return (
    <DataTable
      title={(data) => {
        const isAnalysis =
          data?.status == "INANALYSIS" || data?.status == "INEXECUTION";
        if (data?.currentJSH || (data?.status && !isAnalysis))
          return t("team-contracts.title");
        return t("team-contracts.title1");
      }}
      columns={columns}
      rows={rows}
      hideImport
      loading={loading}
      isHideAddBtn={isHideAddBtn}
      hideActions
      topButtons={(selectedRows, toggleModal) => {
        return (
          <React.Fragment>
            {!isHideAddBtn && (
              <BigButton
                green={"primary"}
                onClick={() => toggleModal(null, { id: "currentJSH" })}
                Icon={Add}
              >
                {t("jsh-add")}
              </BigButton>
            )}
            {!isHideAddBtn && (
              <BigButton
                green={"success"}
                onClick={() => toggleModal()}
                Icon={AddIcon}
              >
                {t("projectAdd")}
              </BigButton>
            )}
            <BigButton
              green={"success"}
              disabled={selectedRows.length != 1}
              onClick={() => toggleModal(null, selectedRows[0])}
              Icon={Visibility}
            >
              {t("watch")}
            </BigButton>
          </React.Fragment>
        );
      }}
      fullModal={(data) => {
        if (!data) return false;
        return (
          data?.status == "INANALYSIS" ||
          data?.status == "INEXECUTION" ||
          data?.status == "CONSIDERED" ||
          data?.status == "CONFIRMED" ||
          data?.status == "CURRENT_JSH" ||
          data?.status == "TO_CONFIRM"
        );
      }}
      hideFirstButton
      hideDelete
      bottomModal={(handleSubmit, handleClose, isView, _, __, data) => {
        const firstCond = !isView || data?.status == "CONSIDERED";
        const secondCond = data?.currentJSH;
        return (
          <div className={styles.row}>
            {(firstCond || secondCond) && (
              <LoadingButton
                loading={loading}
                onClick={handleSubmit}
                variant="contained"
              >
                {t(data?.status === "CONSIDERED" ? "to-register" : "send")}
              </LoadingButton>
            )}
            <Button onClick={handleClose}>{t("close")}</Button>
          </div>
        );
      }}
      hideExportImport
      bkutData={bkutData}
      onSubmitModal={onSubmitModal}
      isFormModal
      fetchData={fetchData}
      modal={(hideModal, dataModal, dataRow = {}) => {
        if (dataRow.status) dataModal.newStatus = dataRow.status.value;
        return (
          <ModalUI hideModal={hideModal} bkutData={bkutData} data={dataModal} />
        );
      }}
    />
  );
}

function ModalUI({ data, bkutData }) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    director: "",
  });
  const [files, setFiles] = useState({
    applications: { loading: true },
    applications1: { loading: true },
  });

  useEffect(() => {
    if (!bkutData.id) return;
    setFormData({ director: getPresidentBKUT(bkutData) });
  }, [bkutData]);
  useEffect(() => {
    if (!data.applications?.length) return;
    const fetchData = async () => {
      const apps = data.applications;
      const project = apps[0].file;
      let application = null;
      if (apps.length > 1) {
        application = apps[1].file;
        application = await parseFile(application);
      }
      let file1 = await parseFile(project);
      setFiles({
        applications: { name: file1[1], data: file1[0], url: project },
        applications1: !application
          ? {}
          : { name: application[1], data: application[0], url: apps[1].file },
      });
    };
    fetchData();
  }, [data]);

  const isCurrentJSH = data?.currentJSH;
  const isCurrentJSHOnly = data.status === "CURRENT_JSH";
  const isConsideredOnly = data.status == "CONSIDERED";
  const isToConfirm = data.status == "TO_CONFIRM";
  const isConfirmed = data.status == "CONFIRMED";
  const isConsidered =
    data.status == "CONSIDERED" ||
    data.status == "CONFIRMED" ||
    data.status == "TO_CONFIRM";
  const isAnalysis =
    data.status == "INANALYSIS" || data.status == "INEXECUTION";

  return (
    <div className="modal-content">
      <FormInput name="bkutId" value={bkutData.id} hidden />
      {isCurrentJSH ? (
        <CurrentJSHTab
          files={files}
          formData={formData}
          bkutData={bkutData}
          data={data}
        />
      ) : isConsidered || isAnalysis || isCurrentJSHOnly ? (
        <React.Fragment>
          <div className="modal-row fulldoc">
            {isAnalysis ? (
              <MainTab
                files={files}
                formData={formData}
                bkutData={bkutData}
                data={data}
              />
            ) : (
              <Tabs
                reverse={isConfirmed}
                tabs={
                  isCurrentJSHOnly
                    ? [
                        {
                          label: "to-register",
                          icon: <InfoRounded />,
                          children: (
                            <CurrentJSHTab
                              files={files}
                              formData={formData}
                              bkutData={bkutData}
                              data={data}
                            />
                          ),
                        },
                        {
                          label: "team-contracts.jsh-text",
                          icon: <Description />,
                          children: (
                            <JShDocument
                              formData={formData}
                              bkutData={bkutData}
                              data={data}
                            />
                          ),
                        },
                        {
                          label: "opinions",
                          icon: <CommentSharp />,
                          children: (
                            <Opinions
                              formData={formData}
                              bkutData={bkutData}
                              data={data}
                            />
                          ),
                        },
                      ]
                    : [
                        {
                          label: "opinions",
                          icon: <CommentSharp />,
                          children: (
                            <Opinions
                              formData={formData}
                              bkutData={bkutData}
                              data={data}
                            />
                          ),
                        },
                        {
                          label: "project-text",
                          icon: <Description />,
                          children: (
                            <JShDocument
                              formData={formData}
                              bkutData={bkutData}
                              data={data}
                            />
                          ),
                        },
                        {
                          label: "to-register",
                          icon: <InfoRounded />,
                          children: (
                            <MainTab
                              files={files}
                              formData={formData}
                              bkutData={bkutData}
                              data={data}
                            />
                          ),
                        },
                      ]
                }
              />
            )}
            <Card elevation={1} className="modal-sidebar">
              <ChipStatus
                isSidebar
                label={t("status-label")}
                colorValue={data.newStatus || data.status}
                value={t(`status.${data.newStatus || data.status}`)}
              />
              {isToConfirm || isConsideredOnly || isAnalysis ? (
                <React.Fragment>
                  <ChipStatus
                    isSidebar
                    label={t("team-contracts.expertizeStartDate")}
                    color="default"
                    value={convertStringToFormatted(data.expertizeStartDate)}
                  />
                  <ChipStatus
                    isSidebar
                    label={t(
                      isConsideredOnly || isToConfirm
                        ? "team-contracts.expertizeEndDate"
                        : "team-contracts.expertizeDate"
                    )}
                    color="default"
                    value={convertStringToFormatted(
                      isConsidered
                        ? data.expertizeCompleteDate
                        : data.expertizeEndDate
                    )}
                  />
                  {!isConsideredOnly && !isToConfirm && (
                    <CircularStatus
                      label={t("leave-day")}
                      value={getRestOfDays(data.expertizeEndDate, new Date())}
                      errorValue={0}
                      warningValue={5}
                    />
                  )}
                </React.Fragment>
              ) : isConfirmed || isCurrentJSHOnly ? (
                <React.Fragment>
                  <ChipStatus
                    isSidebar
                    label={t("team-contracts.approvedDate")}
                    color="default"
                    value={convertStringToFormatted(data.approvedDate)}
                  />
                  <ChipStatus
                    isSidebar
                    label={t("team-contracts.contractEndDate")}
                    color="default"
                    value={convertStringToFormatted(data.contractEndDate)}
                  />
                  <CircularStatus
                    label={t("leave-day")}
                    value={getRestOfDays(data.contractEndDate, new Date())}
                    errorValue={0}
                    warningValue={15}
                  />
                </React.Fragment>
              ) : null}
            </Card>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <FormInput
            name="bkutPpo"
            value={bkutData.name}
            disabled
            label={t("team-contracts.bkutPpo")}
          />
          <FormInput
            name="director"
            value={formData.director}
            disabled
            onChange={() => {}}
            label={t("team-contracts.director")}
          />
          <FormInput
            name="applications"
            required
            fileInput
            value={files.applications?.url}
            nameOfFile={files.applications?.name}
            label={t("team-contracts.application1")}
          />
        </React.Fragment>
      )}
    </div>
  );
}
