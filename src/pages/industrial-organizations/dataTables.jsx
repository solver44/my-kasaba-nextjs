import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FormInput from "@/components/FormInput";
import { useSnackbar } from "notistack";
import { Alert, Box, Button } from "@mui/material";
import { getDistricts, getRegions } from "@/http/public";
import FinderSTIR from "@/components/FinderSTIR";
import { useEmployees } from "../employees";
import { useSelector } from "react-redux";
import { deleteDepartment, sendDepartment } from "@/http/data";
import useActions from "@/hooks/useActions";
import { getFIO, splitFIO } from "@/utils/data";
import { showYesNoDialog } from "@/utils/dialog";
import Group from "@/components/Group";
import dayjs from "dayjs";
import ViewModal from "./modal";
import RadioGroup from "@/components/RadioGroup";
import FinderPINFL from "@/components/FinderPINFL";

function getTranslation(isGroup) {
  return (key) =>
    isGroup ? `group-organizations.${key}` : `industrial-organizations.${key}`;
}

export default function InDataTable({ isGroup }) {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const { bkutData = {} } = useSelector((states) => states);
  const { enqueueSnackbar } = useSnackbar();
  const actions = useActions();
  const getLocal = getTranslation(isGroup);

  const columns = [
    {
      field: "name",
      headerName: getLocal("name"),
      size: 300,
    },
    {
      field: "director",
      headerName: getLocal("direktor1"),
      hidden: false,
    },
    {
      field: "bkut",
      headerName: "bkut1",
      onlyShow: true,
    },
    {
      field: "address",
      headerName: "address",
    },
    { field: "soato", headerName: "soatoFull", hidden: true },
    {
      field: "email",
      headerName: "email",
      hidden: true,
    },
    {
      field: "phoneNumber",
      headerName: getLocal("phone"),
      hidden: true,
    },
  ];

  useEffect(() => {
    if (!bkutData?.departments?.length) return;
    setRows(
      bkutData.departments
        .filter((d) => d.departmentType == (isGroup ? "GURUH" : "SEH"))
        .map((e) => {
          return {
            id: e.id,
            name: e.name,
            bkut: bkutData.name,
            address: e.address,
            director: getFIO(e.employee),
            soato: e.soato._instanceName,
            email: e.email,
            phoneNumber: e.phoneNumber,
          };
        })
    );
  }, [bkutData]);

  async function onSubmitModal(forms, hideModal, isView) {
    const duplicate = (bkutData?.departments ?? []).find(
      (e) => e.tin == forms.tin
    );
    if (!isView && duplicate) {
      const isAnother = duplicate.departmentType == (isGroup ? "SEH" : "GURUH");
      showYesNoDialog(
        t(
          isAnother
            ? isGroup
              ? "found-on-industrion"
              : "found-on-group"
            : "rewrite-stir"
        ),
        isAnother ? null : () => sendData(forms, hideModal, duplicate),
        () => {},
        t
      );
      return;
    }
    sendData(forms, hideModal, duplicate);
  }

  async function sendData(forms, hideModal, duplicate) {
    const fio = splitFIO(forms.director);
    const requestData = {
      bkut: {
        id: bkutData.id,
      },
      departmentType: isGroup ? "GURUH" : "SEH",
      tin: forms.tin,
      name: forms.name,
      phone: forms.phone,
      email: forms.email,
      soato: {
        id: forms.district,
      },
      address: forms.address,
      director: {
        firstName: fio[0],
        lastName: fio[1],
        middleName: fio[2],
        birthDate: forms.birthDate,
      },
      employee: {
        id: "?",
      },
      legalEntity: {
        id: bkutData.eLegalEntity.id,
      },
    };
    if (duplicate) requestData.id = duplicate.id;
    const response = await sendDepartment(requestData);
    if (response?.success) {
      const newId = rows[Math.max(rows.length - 1, 0)]?.id ?? 0;
      setRows((rows) => [
        ...rows.filter((r) => r.id != newId),
        { id: newId, ...forms },
      ]);

      enqueueSnackbar(t("successfully-saved"), { variant: "success" });
      actions.updateData();
    } else {
      enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
    }
    if (hideModal) hideModal();
  }

  async function fetchData(id) {
    const data = (bkutData.departments ?? []).find((ok) => ok.id == id);
    return data;
  }
  async function deleteRow(id, row) {
    console.log(id, row);
    const res = await deleteDepartment(id);
    if (res) {
      setRows((rows) => rows.filter((row) => row?.id != id));
      actions.updateData();
    } else enqueueSnackbar(t("delete-error"), { variant: "error" });
  }

  function toggleViewModal(row) {
    setViewModal((bkutData?.departments ?? []).find((e) => e.id == row.id));
  }

  return (
    <React.Fragment>
      <DataTable
        fetchData={fetchData}
        handleDeleteClick={deleteRow}
        topButtons={(selectedRows) => {
          const isEmpty = selectedRows?.length < 1;
          return (
            <Button
              variant="contained"
              color="success"
              disableElevation
              disabled={isEmpty}
              onClick={() => toggleViewModal(selectedRows[0])}
            >
              {t("passport")}
            </Button>
          );
        }}
        title={t(getLocal("title"))}
        columns={columns}
        rows={rows}
        hideImport
        modalWidth="80vw"
        bkutData={bkutData}
        onSubmitModal={onSubmitModal}
        isFormModal
        modal={(hideModal, dataModal) => (
          <ModalUI hideModal={hideModal} data={dataModal} isGroup={isGroup} />
        )}
      />
      <ViewModal isOpen={viewModal} handleClose={() => setViewModal(false)} />
    </React.Fragment>
  );
}
function ModalUI({ hideModal, data, isGroup }) {
  const getLocal = getTranslation(isGroup);
  const { t } = useTranslation();
  const [employees, bkutData] = useEmployees();
  const [formData, setFormData] = useState({
    fio: "",
    birthDate: "",
    gender: 1,
  });
  const [mode, setMode] = useState(1);
  const [provinces, setProvinces] = useState();
  const [districts, setDistricts] = useState();
  const [values, setValues] = useState({
    provinceId: "",
    districtId: "",
    name: "",
    address: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      let dataProvinces = await getRegions();
      setProvinces(
        (dataProvinces || []).map((current) => ({
          value: current.id,
          label: current.nameUz,
          labelRu: current.nameRu,
        }))
      );
    };
    fetchData();
  }, []);

  const handleProvince = async (e) => {
    const regionId = e.target.value;
    if (!regionId) return;
    const data = await getDistricts(regionId);
    setDistricts(
      data.map((current) => ({
        value: current.id,
        label: current.nameUz,
        labelRu: current.nameRu,
      }))
    );
  };

  async function onFetchSTIR(entityData) {
    if (!entityData) return;

    let soato = entityData.companyBillingAddress.soato;
    if (soato) {
      soato = soato + "";
      const provinceId = soato.slice(0, 4);
      const districtId = soato;
      await handleProvince({ target: { value: provinceId } });
      setValues((formData) => ({
        ...formData,
        provinceId,
        districtId,
      }));
    }
    setValues((formData) => ({
      ...formData,
      name: entityData.company.name,
      address: entityData.companyBillingAddress.streetName,
    }));
  }

  const { phone, tin, email, soato = {}, employee = {} } = data;
  useEffect(() => {
    const fetchData = async () => {
      if (!data?.id) return;
      let soatoId = soato.id ?? "";
      const provinceId = soatoId.slice(0, 4);
      const districtId = soatoId;
      await handleProvince({ target: { value: provinceId } });
      setValues((values) => ({
        ...values,
        name: data.name,
        address: data.address,
        provinceId,
        districtId,
      }));
    };
    fetchData();

    if (employee.birthDate) var birthDate = dayjs(employee.birthDate);
    if (employee?.firstName) var fio = getFIO(employee);
    if (employee?.gender) var gender = employee.gender;

    setFormData({ fio, birthDate, gender });
  }, [data]);

  function onFetchPINFL(data) {
    if (!data) return;

    setFormData({
      fio: getFIO(data),
      birthDate: dayjs(data.birth_date),
      gender: data.gender != 1 ? 0 : 1,
    });
  }
  return (
    <div className="modal-content">
      <Alert className="modal-alert" severity="info">
        {t("bkut1")} - {`${bkutData?.eLegalEntity.name} (${bkutData.inn})`}
      </Alert>
      <Group title={t("main-info")}>
        <div datatype="list">
          <FinderSTIR
            label={t(getLocal("stir"))}
            stirValue={tin}
            onFetch={onFetchSTIR}
          />
          <FormInput
            name="name"
            required
            value={values.name}
            label={t(getLocal("name"))}
          />
          <div className="modal-row">
            <RadioGroup
              defaultValue={1}
              label={t("bkutType1")}
              left
              name="orgType"
              onChange={(e) => {
                setMode(e.target.value);
              }}
              data={[
                {
                  value: "1",
                  label: t("yes"),
                },
                {
                  value: "0",
                  label: t("no"),
                },
              ]}
            />
            {mode == 1 && (
              <FormInput name="tinSenior" required label={t("stir")} />
            )}
          </div>
        </div>
      </Group>
      <Group title={t(getLocal("adr"))}>
        <div datatype="list">
          <FormInput
            label={t("address")}
            required
            value={values.address}
            name="address"
          />
          <div className="row g-3 full-children">
            <FormInput
              required
              select
              dataSelect={provinces}
              name="province"
              value={values.provinceId}
              onChange={handleProvince}
              label={t("province")}
              editable
            />
            <FormInput
              required
              select
              dataSelect={districts}
              value={values.districtId}
              name="district"
              label={t("district")}
              editable
            />
          </div>
          <div className="modal-row">
            <FormInput
              value={phone}
              label={t(getLocal("phone"))}
              name="phoneNumber"
            />
            <FormInput label={t("email")} value={email} name="email" />
          </div>
        </div>
      </Group>
      <Group title={t(getLocal("direktor"))}>
        <div datatype="list">
          <FinderPINFL
            disablePINFL
            pinflValue={employee.pinfl}
            onFetch={onFetchPINFL}
          />
          <div className="modal-row">
            <FormInput
              name="director"
              required
              disabled
              label={t("fio")}
              value={formData.fio}
            />
            <FormInput
              name="birthDate"
              disabled
              date
              label={t("birth-date")}
              required
              value={formData.birthDate}
            />
          </div>
          <div className="modal-row">
            <FormInput
              select
              required
              value={formData.gender}
              disabled
              name="gender"
              dataSelect={[
                { value: 1, label: t("man") },
                { value: 0, label: t("woman") },
              ]}
              label={t("gender")}
            />
            <FormInput
              value={employee.phone}
              label={t("phone-number")}
              name="directorPhone"
            />
            <FormInput
              value={employee.email}
              label={t("employees.email")}
              name="directorEmail"
            />
          </div>
        </div>
      </Group>
      <Group title={t(getLocal("files"))}>
        <div datatype="list">
          <div className="modal-row">
            <FormInput
              label={t("decision-or-application-title")}
              name="decisionNumber"
            />
            <FormInput name="decisionDate" date label={t("date")} />
          </div>
          <FormInput
            name="decisionFile"
            fileInput
            label={t("decision-or-application-file")}
          />
        </div>
      </Group>
    </div>
  );
}
