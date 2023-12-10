import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FinderPINFL from "@/components/FinderPINFL";
import FormInput from "@/components/FormInput";
import dayjs from "dayjs";
import styles from "./members.module.scss";
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";
import { getFIO, getLocalizationNames, splitEmployement, splitFIO } from "@/utils/data";
import { useSelector } from "react-redux";
import { deleteMember, sendMember } from "@/http/data";
import CheckBoxGroup from "@/components/CheckBoxGroup";
import useActions from "@/hooks/useActions";
import { showYesNoDialog } from "@/utils/dialog";
import { LoadingButton } from "@mui/lab";
import VisibilityIcon from "@mui/icons-material/Visibility";
import useDynamicData from "@/hooks/useDynamicData";
import { generateTicketData } from "@/utils/encryptdecrypt";
import { getUrlWithQuery, openBlankURL } from "@/utils/window";
import SimpleDialog from "@/components/SimpleDialog";
import QRCode from "react-qr-code";
import { convertStringToFormatted } from "@/utils/date";
import { i18n } from "../../../next.config";
import useAnimation from "@/hooks/useAnimation";

export default function InDataTable() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [qrURL, setQRURL] = useState("");
  const [isZoomQR, setIsZoomQR] = useState(false);
  const [ticketCreated, setTickedCreated] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [positions] = useDynamicData({ positions: true });
  const { bkutData = {} } = useSelector((states) => states);
  const bkutDataRef = useRef(bkutData);
  const { enqueueSnackbar } = useSnackbar();
  const actions = useActions();

  const columns = [
    { field: "fio", headerName: "employees.fio", size: 280 },
    { field: "signDate", headerName: "join-date" },
    {
      field: "employment",
      type: "chip",
      headerName: "employment",
      default: [
        t("isHomemaker"),
        t("isInvalid"),
        t("isPensioner"),
        t("isStudent"),
      ].join(", "),
    },
    { field: "pinfl", headerName: "pinfl", hidden: true },
    { field: "position", headerName: "job-position", hidden: true },
    { field: "birthDate", headerName: "birth-date", hidden: true },
    { field: "phoneNumber", headerName: "phone-number" },
    {
      field: "email",
      headerName: "email",
    },
  ];

  function getEmployeement(member) {
    let result = [];
    if (member.isHomemaker) result.push(t("isHomemaker"));
    if (member.isInvalid) result.push(t("isInvalid"));
    if (member.isPensioner) result.push(t("isPensioner"));
    if (member.isStudent) result.push(t("isStudent"));

    return result;
  }

  useEffect(() => {
    if (!bkutData?.employees?.length) return;
    setRows(
      bkutData?.employees.map((e) => {
        return {
          id: e?.individual?.id,
          fio: getFIO(e.individual),
          signDate: e.memberJoinDate,
          employment: getEmployeement(e),
          birthDate: convertStringToFormatted(e.individual?.birthDate),
          position: getLocalizationNames(e.position, i18n),
          phoneNumber: e.individual.phone,
          email: e.individual.email,
        };
      })
    );
  }, [bkutData]);
  async function onSubmitModal(forms, hideModal, isView) {
    if (
      !isView &&
      (bkutData?.members ?? []).find((e) => e.member.pinfl == forms.pinfl)
    ) {
      showYesNoDialog(
        t("rewrite-pinfl-member"),
        () => sendData(forms, hideModal, true),
        () => {},
        t
      );
      return;
    }
    sendData(forms, hideModal, isView);
  }

  async function sendData(forms, hideModal, isView, noAlert) {
    const fio = splitFIO(forms.fio);
    const isMemberValue = forms.isMember === "true";
    const isKasabaActives = forms.isKasabaActive === "true";
    const isFired = forms.isPensioner === "true";
    const requestData = {
      bkutId: bkutData.id,
      pinfl: forms.pinfl,
      fio: forms.fio,
      firstName: fio[0],
      lastName: fio[1],
      middleName: fio[2],
      phone: forms.phoneNumber,
      email: forms.email,
      birthDate: forms.birthDate,
      position: forms.position,
      isStudent: forms.employment.isStudent,
      isHomemaker: forms.employment.isHomemaker,
      isPensioner: isFired,
      isInvalid: forms.employment.isInvalid,
      isMember: isMemberValue,
      isKasabaActive: isKasabaActives,
      memberJoinDate: forms.signDate,
    };
    
    const employees = (bkutData.employees ?? []).filter((e) =>
      isView ? e.individual.pinfl != forms.pinfl : true
    );
    const response = await sendEmployee(requestData, employees);
    if (response?.success) {
      const newId = rows[Math.max(rows.length - 1, 0)]?.id ?? 0;
      setRows((rows) => [
        ...rows.filter((r) => r.id != newId),
        { id: newId, ...forms },
      ]);
      if (!noAlert) {
        if (forms.isMember == 1) await sendData(forms);
        else await deleteEmployee(forms);
        enqueueSnackbar(t("successfully-saved"), { variant: "success" });
      } else return true;

      actions.updateData();
    } else {
      enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
    }
    if (noAlert) return false;
    if (hideModal) hideModal();
  }

  async function generateDoc(_data) {
    if (ticketCreated) {
      openBlankURL(qrURL);
      return;
    }
  
    setTicketLoading(true); // Set loading state when generating the ticket
  
    try {
      // Generate the ticket data
      const data = bkutData.employees.find((m) => m.individual.pinfl == _data.pinfl);
      const filteredEmployees = bkutData.employees
      .filter((employee) => employee.position?.id === 1)
      .map((employee) => employee._instanceName);
      const query = generateTicketData({
        ...data,
        id: data.id,
        bkutName: bkutData.name,
        firstName: data.individual.firstName,
        lastName: data.individual.lastName,
        middleName: data.individual.middleName,
        birthDate: data.individual.birthDate,
        memberJoinDate: data.memberJoinDate,
        direktor: filteredEmployees.join(", "),
      });
      console.log(data)
      const url = getUrlWithQuery("/ticket/0", { d: query });
      setQRURL(url);
  
      // Simulate a delay for demonstration (replace this with actual ticket generation)
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      setTickedCreated(true); // Set ticket created to true
    } catch (error) {
      console.log(error);
      enqueueSnackbar(t("doc-create-error"), { variant: "error" });
    } finally {
      setTicketLoading(false); // Set loading state to false after generating the ticket
    }
  }
  
  async function fetchData(id) {
    const individual = (bkutData.employees ?? []).find(
      (e) => e.individual.id == id
    );
    const currentMember = (bkutData.employees ?? []).find(
      (e) => e.individual.pinfl == individual.pinfl
    );
    const data = {
      ...(currentMember ?? {}),
      ...individual,
    };
    data.employment = {
      isHomemaker: !!data.isHomemaker,
      isInvalid: !!data.isInvalid,
      isStudent: !!data.isStudent,
    };
    return data;
  }
  async function deleteRow(id) {
    const res = await deleteMember(id);
    if (res) {
      setRows((rows) => rows.filter((row) => row?.id != id));
      actions.updateData();
    } else enqueueSnackbar(t("delete-error"), { variant: "error" });
  }
  async function onImportRow(rowData) {
    const forms = {
      ...rowData,
      personInfo: splitEmployement(rowData.employment),
    };
    return await sendData(forms, null, false, true);
  }

  return (
    <React.Fragment>
      <SimpleDialog open={isZoomQR} onClose={() => setIsZoomQR(false)}>
        <QRCode
          size={400}
          value={qrURL}
          style={{ height: "auto" }}
          viewBox={`0 0 400 400`}
        />
      </SimpleDialog>
      <DataTable
        fetchData={fetchData}
        handleDeleteClick={deleteRow}
        columns={columns}
        rows={rows}
        bkutData={bkutData}
        onImportRow={onImportRow}
        onSubmitModal={onSubmitModal}
        isFormModal
        hideFirstButton
        title={t("memberTitle")}
        loading={ticketLoading}
        modalWidth="80vw"
        bottomModal={(handleSubmit, handleClose, isView, _, data) => {
          return (
            <div className={styles.bottom} style={{ position: "relative" }}>
              <div className={styles.row}>
                <Button onClick={handleSubmit} variant="contained">
                  {t("save")}
                </Button>
                <Button onClick={handleClose}>{t("close")}</Button>
              </div>
              {isView && (
                <LoadingButton
                  style={ticketCreated ? { marginRight: 130 } : {}}
                  onClick={() => generateDoc(data)}
                  loading={ticketLoading}
                  variant="contained"
                  color="success"
                >
                  {ticketCreated && (
                    <VisibilityIcon style={{ marginRight: 5 }} />
                  )}
                  {ticketCreated ? t("showTicket") : t("createDoc")}
                </LoadingButton>
              )}
              {ticketCreated && qrURL && (
                <React.Fragment>
                  <QRCode
                    onClick={() => setIsZoomQR(true)}
                    size={100}
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      height: "auto",
                    }}
                    value={qrURL}
                    viewBox={`0 0 100 100`}
                  />
                </React.Fragment>
              )}
            </div>
          );
        }}
        modal={(hideModal, dataModal) => (
          <ModalUI positions={positions} data={dataModal}  hideModal={hideModal} />
        )}
      />
    </React.Fragment>
  );
}

function ModalUI({ hideModal, positions, data = {} }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fio: "",
    birthDate: "",
    gender: 1,
    phoneNumber: "",
    email: "",
    signDate: "",

  });
  const {
    individual = {},
    position = {},
    employment = {},
  } = data;
  const animRef = useAnimation();
  function onFetchPINFL(data) {
    if (!data) return;

    setFormData({
      fio: getFIO(data.profile),
      birthDate: dayjs(data.profile.birth_date),
      gender: data.profile.gender != 1 ? 0 : 1,
    });
  }
  useEffect(() => {
    const FIO = getFIO(individual);
    if (!FIO) return;
    setFormData({
      fio: FIO,
      birthDate: individual.birthDate ? dayjs(individual.birthDate) : "",
      gender: individual.gender ?? formData.gender,
      phoneNumber: individual.phone,
      email: individual.email,
      signDate: data.memberJoinDate,
    });
  }, [data]);

  function onFetchPINFL(data) {
    if (!data) return;

    setFormData({
      fio: getFIO(data.profile),
      birthDate: dayjs(data.profile.birth_date),
      gender: data.profile.gender != 1 ? 0 : 1,
    });
  }
  return (
    <div ref={animRef} className="modal-content">
      <FinderPINFL
        disablePINFL
        pinflValue={individual.pinfl}
        onFetch={onFetchPINFL}
      />
      <div className="modal-row">
        <FormInput
          disabled
          required
          label={t("fio")}
          name="fio"
          value={formData.fio}
        />
        <FormInput
          select
          required
          value="1"
          disabled
          name="gender"
          dataSelect={[
            { value: 1, label: t("man") },
            { value: 0, label: t("woman") },
          ]}
          label={t("gender")}
        />
      </div>
      <div className="modal-row">
        <FormInput
          date
          disabled
          label={t("birth-date")}
          required
          name="birthDate"
          value={formData.birthDate}
        />
        <FormInput
          select
          value={position.id}
          name="position"
          dataSelect={positions}
          label={t("job-position")}
        />
      </div>
      <div className="modal-row">
        <FormInput value={formData.phoneNumber} label={t("phone-number")} name="phoneNumber" />
        <FormInput value={formData.email} label={t("employees.email")} name="email" />
      </div>
        <div className="modal-row">
        <CheckBoxGroup
          name="employment"
          value={employment}
          data={[
            {
              value: "isStudent",
              label: t("isStudent"),
            },
            {
              value: "isHomemaker",
              label: t("isHomemaker"),
            },
            {
              value: "isInvalid",
              label: t("isInvalid"),
            },
          ]}
        />
        </div>
    </div>
  );
}
