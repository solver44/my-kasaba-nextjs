import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FormInput from "@/components/FormInput";
import { useSnackbar } from "notistack";
import { Alert, Box, Button } from "@mui/material";
import { getDistricts, getRegions } from "@/http/public";
import FinderSTIR from "@/components/FinderSTIR";
import { useEmployees } from "../employees";
import { useSelector } from "react-redux";
import {
  deleteDepartment,
  sendDepartment,
  initFile,
  getFile,
} from "@/http/data";
import useActions from "@/hooks/useActions";
import {
  getFIO,
  getPresidentBKUT,
  getPresidentId,
  splitFIO,
} from "@/utils/data";
import { showYesNoDialog } from "@/utils/dialog";
import Group from "@/components/Group";
import dayjs from "dayjs";
import ViewModal from "./modal";
import RadioGroup from "@/components/RadioGroup";
import FinderPINFL from "@/components/FinderPINFL";
import { getOrganizations } from "@/http/organization";

function getTranslation(isGroup) {
  return (key) =>
    isGroup ? `group-organizations.${key}` : `industrial-organizations.${key}`;
}

export default function InDataTable({ isGroup }) {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const { bkutData = {} } = useSelector((states) => states);
  const { enqueueSnackbar } = useSnackbar();
  const actions = useActions();
  const getLocal = getTranslation(isGroup);
  const individualId = useRef();

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
      hidden: true,
    },
    {
      field: "address",
      headerName: "address",
    },
    { field: "soato", headerName: "soatoFull" },
    {
      field: "email",
      headerName: "email",
      hidden: true,
    },
    {
      field: "phone",
      headerName: getLocal("phone"),
    },
  ];

  async function initOrgs() {
    setLoadingData(true);
    try {
      const data = await getOrganizations(bkutData.id);
      setOrganizations(data || []);
      setRows(
        (data || [])
          .filter((d) => d.organizationType == (isGroup ? "GURUH" : "SEH"))
          .map((e) => {
            return {
              id: e.id,
              name: e.name,
              bkut: bkutData.name,
              address: e.address,
              director: getPresidentBKUT(e),
              soato: e?.soato?._instanceName || e?.soato?.nameUz,
              email: e.email,
              phone: e.phone,
            };
          })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingData(false);
    }
  }
  useEffect(() => {
    if (!bkutData?.id) return;
    initOrgs();
  }, [bkutData]);

  async function onSubmitModal(forms, hideModal, isView) {
    const duplicate = organizations.find((e) => e.tin == forms.tin);
    if (!isView && duplicate) {
      const isAnother =
        duplicate.organizationType == (isGroup ? "SEH" : "GURUH");
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
    setLoadingData(true);
    try {
      let protocolFileRef = null;

      if (forms.decisionFile) {
        // Initiate file upload and retrieve file reference
        let responseFile = await initFile(forms.decisionFile);
        if (!responseFile?.fileRef) {
          enqueueSnackbar(t("upload-file-error"), { variant: "error" });
          return;
        }
        // File upload successful, assign file reference
        protocolFileRef = responseFile.fileRef;
      }

      const requestData = {
        bkut: {
          id: bkutData.id,
        },
        organizationType: isGroup ? "GURUH" : "SEH",
        tin: forms.tin,
        name: forms.name,
        phone: forms.phone,
        email: forms.email,
        soato: {
          id: forms.district,
        },
        address: forms.address,
        employees: [
          {
            isMember: true,
            isKasabaActive: true,
            position: {
              value: 1,
            },
            individual: {
              id: individualId.current,
            },
          },
        ],
        eLegalEntity: {
          id: bkutData.eLegalEntity.id,
        },
        isLegalEntity: forms.isLegalEntity,
        decisionNumber: forms.decisionNumber,
        decisionDate: forms.decisionDate,
        tin: forms.tinSenior,
      };
      // Include decisionFile reference in the request data if available
      if (protocolFileRef) {
        requestData.decisionFile = protocolFileRef;
      }

      if (duplicate) {
        requestData.employees[0].individual.id =
          getPresidentId(duplicate) || individualId.current;
        requestData.id = duplicate.id;
      }
      const response = await sendDepartment(requestData);
      if (response?.success) {
        const newId = rows[Math.max(rows.length - 1, 0)]?.id ?? 0;
        setRows((rows) => [
          ...rows.filter((r) => r.id !== newId),
          { id: newId, ...forms },
        ]);

        enqueueSnackbar(t("successfully-saved"), { variant: "success" });
        actions.updateData();
      } else {
        enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
      }

      if (hideModal) {
        hideModal();
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(t("send-data-error"), { variant: "error" });
      return;
    } finally {
      setLoadingData(false);
    }
  }

  function onFetchIndividual(data = {}) {
    individualId.current = data.id;
  }

  async function fetchData(id) {
    const data = organizations.find((ok) => ok.id == id);
    return data;
  }
  async function deleteRow(id, row) {
    const res = await deleteDepartment(id);
    if (res) {
      setRows((rows) => rows.filter((row) => row?.id != id));
      actions.updateData();
    } else enqueueSnackbar(t("delete-error"), { variant: "error" });
  }

  function toggleViewModal(row) {
    setViewModal(organizations.find((e) => e.id == row.id));
  }

  return (
    <React.Fragment>
      <DataTable
        hideView
        fetchData={fetchData}
        loading={loadingData}
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
          <ModalUI
            onFetchIndividual={onFetchIndividual}
            hideModal={hideModal}
            data={dataModal}
            isGroup={isGroup}
          />
        )}
      />
      <ViewModal isOpen={viewModal} handleClose={() => setViewModal(false)} />
    </React.Fragment>
  );
}
function ModalUI({ hideModal, data, isGroup, onFetchIndividual }) {
  const getLocal = getTranslation(isGroup);
  const { t } = useTranslation();
  const [employeess, bkutData] = useEmployees();
  const [formData, setFormData] = useState({
    fio: "",
    birthDate: "",
    gender: 1,
  });
  const [mode, setMode] = useState(0);
  const [provinces, setProvinces] = useState();
  const [districts, setDistricts] = useState();
  const [files, setFiles] = useState({
    decisionFile: { loading: true },
  });
  const [values, setValues] = useState({
    provinceId: "",
    districtId: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    decisionNumber: "",
    decisionDate: "",
    decisionFile: "",
  });

  async function parseFile(file) {
    if (!file) return [null, null];
    const res = await getFile(file);
    return [res, decodeURIComponent(file.split("=")[1]).replace(/\+/g, " ")];
  }
  useEffect(() => {
    const fetchData = async () => {
      let res3 = await parseFile(data.decisionFile);
      setFiles({
        decisionFile: { name: res3[1], data: res3[0] },
      });
    };
    fetchData();
  }, [data]);
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

  const {
    tin,
    email,
    soato = {},
    individual = {},
    isLegalEntity = false,
  } = data;
  useEffect(() => {
    const fetchData = async () => {
      if (!data?.id) return;
      const soatoId = (soato?.id ?? "").toString();
      const provinceId = soatoId.slice(0, 4);
      const districtId = soatoId;
      await handleProvince({ target: { value: provinceId } });
      setValues((values) => ({
        ...values,
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        decisionNumber: data.decisionNumber,
        decisionDate: data.decisionNumber,
        decisionFile: data.decisionFile,
        provinceId,
        districtId,
      }));
    };
    fetchData();
  }, [data]);

  function onFetchPINFL(data) {
    if (!data) return;
    onFetchIndividual(data);
    setFormData({
      fio: getFIO(data),
      birthDate: dayjs(data.birth_date),
      gender: data.gender,
    });
  }
  useEffect(() => {
    const FIO = getFIO(individual);
    if (!FIO) return;
    setFormData({
      fio: FIO,
      birthDate: individual.birthDate ? dayjs(individual.birthDate) : "",
      gender: individual.gender ?? formData.gender,
    });
  }, [data]);
  return (
    <div className="modal-content">
      <Alert className="modal-alert" severity="info">
        {t("bkut1")} - {`${bkutData?.name} (${bkutData.tin ?? t("no")})`}
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
              defaultValue={false}
              label={t("bkutType1")}
              left
              name="isLegalEntity"
              value={isLegalEntity ?? false}
              onChange={(e) => {
                setMode(JSON.parse(e.target.value));
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
            {mode && (
              <FormInput
                name="tinSenior"
                required
                label={t("stir")}
                // value={bkutData?.application?.tin}
              />
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
              value={values.phone}
              label={t(getLocal("phone"))}
              name="phone"
            />
            <FormInput label={t("email")} value={email} name="email" />
          </div>
        </div>
      </Group>
      <Group title={t(getLocal("direktor"))}>
        <div datatype="list">
          <FinderPINFL
            disablePINFL
            style={individual.pinfl ? { display: "none" } : {}}
            pinflValue={individual.pinfl}
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
                { value: 2, label: t("woman") },
              ]}
              label={t("gender")}
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
              value={values.decisionNumber}
            />
            <FormInput
              name="decisionDate"
              date
              label={t("date")}
              value={values.decisionDate}
            />
          </div>
          <FormInput
            name="decisionFile"
            fileInput
            label={t("decision-or-application-file")}
            value={files.decisionFile?.url}
            nameOfFile={files.decisionFile.name}
          />
        </div>
      </Group>
    </div>
  );
}
