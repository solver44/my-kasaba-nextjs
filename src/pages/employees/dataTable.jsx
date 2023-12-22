import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FinderPINFL from "@/components/FinderPINFL";
import FormInput from "@/components/FormInput";
import dayjs from "dayjs";
import styles from "./employees.module.scss";
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";
import {
  getFIO,
  getLocalizationNames,
  splitEmployement,
  splitFIO,
} from "@/utils/data";
import { useSelector } from "react-redux";
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
import RadioGroup from "@/components/RadioGroup";
import {
  deleteEmployee,
  generateTicketMember,
  sendEmployee,
} from "@/http/employees";

export default function InDataTable({ filter, onUpload, min }) {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [zoomQRURL, setZoomQRURL] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);
  const { bkutData = {} } = useSelector((states) => states);
  const qrURL = useRef("");
  const individualId = useRef();
  const ticketCreated = useRef(false);
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
    if (onUpload) onUpload({ columns, rows });
  }, [rows]);
  useEffect(() => {
    bkutDataRef.current = bkutData;
    if (!bkutData?.id) return;
    setRows(
      bkutData.employees.filter(filter ? filter : () => true).map((e) => {
        return {
          id: e?.id,
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
  async function onSubmitModal(forms, hideModal, isView, _dataModal) {
    const {
      createdDate = "",
      lastModifiedDate = "",
      _entityName = "",
      _instanceName = "",
      ...dataModal
    } = _dataModal ?? {};
    if (
      !isView &&
      (bkutData?.employees ?? []).find((e) => e.individual.pinfl == forms.pinfl)
    ) {
      showYesNoDialog(
        t("rewrite-pinfl-member"),
        () => sendData({ forms, dataModal }, hideModal, true),
        () => {},
        t
      );
      return;
    }
    sendData({ forms, dataModal }, hideModal, isView);
  }

  function onFetchIndividual(data = {}) {
    individualId.current = data.id;
  }

  async function sendData(_data, hideModal, isView, noAlert = false) {
    const bkutData = bkutDataRef.current;

    const { forms, dataModal } = _data;
    const requestData = {
      // ...dataModal,
      id: dataModal.id,
      bkut: {
        id: bkutData.id,
      },
      individual: {
        pinfl: forms.pinfl,
        id: individualId.current,
        ...dataModal.individual,
        phone: forms.phone,
        email: forms.email,
      },
      isKasabaActive: forms.isKasabaActive,
      isMember: forms.isMember,
      isFired: forms.isFired,
      ...forms.personInfo,
      position: {
        id: forms.position,
      },
      memberJoinDate: forms.signDate,
    };
    const response = await sendEmployee(requestData);
    if (response?.success) {
      const newId = rows[Math.max(rows.length - 1, 0)]?.id ?? 0;
      setRows((rows) => [
        ...rows.filter((r) => r.id != newId),
        { id: newId, ...forms },
      ]);
      if (!noAlert) {
        enqueueSnackbar(t("successfully-saved"), { variant: "success" });
      } else {
        return true;
      }
      actions.updateData();
    } else {
      enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
    }
    if (noAlert) return false;
    if (hideModal) hideModal();
  }

  async function generateTicket(employee) {
    if (ticketCreated.current) {
      openBlankURL(qrURL.current);
      return;
    }
    setTicketLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await generateTicketMember(bkutData.id, employee.id);
      if (!response?.success) {
        enqueueSnackbar(t("error-generate-ticket"), { variant: "error" });
        setTicketLoading(false);
        return;
      }
      const queryId = response.code;
      const url = getUrlWithQuery("/ticket/" + queryId);
      qrURL.current = url;
      ticketCreated.current = true;
    } catch (error) {
      console.log(error);
      enqueueSnackbar(t("doc-create-error"), { variant: "error" });
    } finally {
      setTicketLoading(false);
    }
  }
  async function fetchData(id) {
    const data = (bkutData.employees ?? []).find((member) => member.id == id);
    return data;
  }
  async function deleteRow(id) {
    const res = await deleteEmployee(id);
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
      <SimpleDialog open={!!zoomQRURL} onClose={() => setZoomQRURL(false)}>
        {zoomQRURL && (
          <QRCode
            size={400}
            value={zoomQRURL}
            style={{ height: "auto" }}
            viewBox={`0 0 400 400`}
          />
        )}
      </SimpleDialog>
      <DataTable
        min={min}
        fetchData={fetchData}
        handleDeleteClick={deleteRow}
        columns={columns}
        rows={rows}
        bkutData={bkutData}
        onImportRow={onImportRow}
        onSubmitModal={onSubmitModal}
        isFormModal
        title={t("memberTitle")}
        loading={ticketLoading}
        modalWidth="80vw"
        bottomModal={(handleSubmit, handleClose, isView, _, data) => {
          if (data.ticketCode) {
            ticketCreated.current = true;
            qrURL.current = getUrlWithQuery("/ticket/" + data.ticketCode);
          }
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
                  style={ticketCreated.current ? { marginRight: 130 } : {}}
                  onClick={() => generateTicket(data)}
                  loading={ticketLoading}
                  variant="contained"
                  color="success"
                >
                  {ticketCreated.current && (
                    <VisibilityIcon style={{ marginRight: 5 }} />
                  )}
                  {ticketCreated.current ? t("showTicket") : t("createDoc")}
                </LoadingButton>
              )}
              {isView && ticketCreated.current && qrURL.current && (
                <React.Fragment>
                  <QRCode
                    onClick={() => setZoomQRURL(qrURL.current)}
                    size={100}
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      height: "auto",
                    }}
                    value={qrURL.current}
                    viewBox={`0 0 100 100`}
                  />
                </React.Fragment>
              )}
            </div>
          );
        }}
        modal={(hideModal, dataModal) => (
          <ModalUI
            onFetchIndividual={onFetchIndividual}
            data={dataModal}
            hideModal={hideModal}
          />
        )}
      />
    </React.Fragment>
  );
}

function ModalUI({ hideModal, data = {}, onFetchIndividual }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fio: "",
    birthDate: "",
  });
  const [positions] = useDynamicData({ positions: true });
  const [isMemberValue, setIsMember] = useState(false);
  const {
    id,
    position,
    individual = {},
    isFired,
    isKasabaActive,
    isMember,
    memberJoinDate,
    _entityName,
    _instanceName,
    ...inData
  } = data;
  const phone = individual.phone;
  const email = individual.email;

  useEffect(() => {
    const FIO = getFIO(individual);
    if (!FIO) return;
    setFormData({
      fio: FIO,
      birthDate: individual.birthDate ? dayjs(individual.birthDate) : "",
    });
  }, [data]);

  function onFetchPINFL(data) {
    if (!data) return;
    onFetchIndividual(data);

    setFormData({
      fio: getFIO(data),
      birthDate: dayjs(data.birth_date),
    });
  }

  return (
    <div className="modal-content">
      <FormInput hidden name="id" value={data.id} />
      <FormInput hidden name="ticketCode" value={data.ticketCode} />
      <div className="modal-row">
        <FinderPINFL
          disablePINFL
          style={individual.pinfl ? { display: "none" } : {}}
          pinflValue={individual.pinfl}
          onFetch={onFetchPINFL}
        />
      </div>
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
          value={position?.id}
          name="position"
          dataSelect={positions}
          label={t("employees.position")}
        />
      </div>
      <div className="modal-row">
        <FormInput value={phone} label={t("phone-number")} name="phone" />
        <FormInput value={email} label={t("employees.email")} name="email" />
      </div>
      <div className="modal-row">
        <RadioGroup
          label={t("isMember")}
          left
          name="isMember"
          value={isMember}
          defaultValue={true}
          onChange={(e) => {
            const val = e.target.value;
            setIsMember(val === "false" || !val ? false : true);
          }}
          data={[
            {
              value: true,
              label: t("yes"),
            },
            {
              value: false,
              label: t("no"),
            },
          ]}
        />
        {isMemberValue && (
          <FormInput
            date
            label={t("employees.dateSign")}
            value={memberJoinDate ? dayjs(memberJoinDate) : null}
            required
            name="signDate"
          />
        )}
      </div>
      <div style={{ marginTop: 10 }} className="modal-row">
        <div className="modal-col">
          <RadioGroup
            defaultValue={false}
            label={t("isKasabaActive")}
            left
            name="isKasabaActive"
            value={isKasabaActive}
            data={[
              {
                value: true,
                label: t("yes"),
              },
              {
                value: false,
                label: t("no"),
              },
            ]}
          />
          <RadioGroup
            defaultValue={false}
            label={t("isFired")}
            left
            name="isFired"
            value={isFired}
            data={[
              {
                value: true,
                label: t("yes"),
              },
              {
                value: false,
                label: t("no"),
              },
            ]}
          />
        </div>
        <CheckBoxGroup
          vertical
          name="personInfo"
          value={inData}
          data={[
            {
              value: "isStudent",
              label: t("isStudent"),
            },
            {
              value: "isPensioner",
              label: t("isPensioner"),
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
