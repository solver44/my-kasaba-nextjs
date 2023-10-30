import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FormInput from "@/components/FormInput";
import { useSnackbar } from "notistack";
import { Alert, Button } from "@mui/material";
import FinderSTIR from "@/components/FinderSTIR";
import { getDistricts, getRegions } from "@/http/public";
import { useEmployees } from "../employees";
import { deleteDepartment, sendDepartment } from "@/http/data";
import { useSelector } from "react-redux";
import useActions from "@/hooks/useActions";
import { showYesNoDialog } from "@/utils/dialog";
import { getFIO, splitFIO } from "@/utils/data";
import Group from "@/components/Group";
import RadioGroup from "@/components/RadioGroup";
import ViewModal from "./modal";

export default function InDataTable() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const { bkutData = {} } = useSelector((states) => states);
  const { enqueueSnackbar } = useSnackbar();
  const actions = useActions();

  const columns = [
    {
      field: "name",
      headerName: "group-organizations.name",
      size: 300,
    },
    {
      field: "address",
      headerName: "address",
    },
    {
      field: "director",
      headerName: "group-organizations.direktor",
      hidden: true,
    },
    { field: "soato", headerName: "soatoFull", hidden: true },
    {
      field: "email",
      headerName: "email",
      hidden: true,
    },
    {
      field: "phoneNumber",
      headerName: "group-organizations.phone",
      hidden: true,
    },
  ];

  useEffect(() => {
    if (!bkutData?.departments?.length) return;
    setRows(
      bkutData.departments
        .filter((d) => d.departmentType == "GURUH")
        .map((e) => {
          return {
            id: e.id,
            name: e.name,
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
      const isAnother = duplicate.departmentType == "SEH";
      showYesNoDialog(
        t(isAnother ? "found-on-industrion" : "rewrite-stir"),
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
      departmentType: "GURUH",
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
        id: forms.director,
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
    hideModal();
  }

  async function fetchData(id) {
    const data = (bkutData.departments ?? []).find((ok) => ok.id == id);
    return data;
  }
  async function deleteRow(id) {
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
      <ViewModal isOpen={viewModal} handleClose={() => setViewModal(false)} />
      <DataTable
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
        fetchData={fetchData}
        handleDeleteClick={deleteRow}
        title={t("group-organizations.title")}
        columns={columns}
        rows={rows}
        modalWidth="80vw"
        hideImport
        bkutData={bkutData}
        onSubmitModal={onSubmitModal}
        isFormModal
        modal={(hideModal, dataModal) => (
          <ModalUI hideModal={hideModal} data={dataModal} />
        )}
      />
    </React.Fragment>
  );
}
function ModalUI({ hideModal, data }) {
  const { t } = useTranslation();
  const [employees, bkutData] = useEmployees();

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
  }, [data]);

  console.log(data);
  return (
    <div className="modal-content">
      <Alert className="modal-alert" severity="info">
        "{bkutData?.eLegalEntity.name}"
      </Alert>
      <Group title={t("main-info")}>
        <div datatype="list">
          <RadioGroup
            defaultValue={1}
            contained
            name="orgType"
            onChange={(e) => {
              setMode(e.target.value);
            }}
            data={[
              {
                value: "1",
                label: t("orgType1"),
              },
              {
                value: "0",
                label: t("orgType2"),
              },
            ]}
          />
          {mode == 1 && <FinderSTIR stirValue={tin} onFetch={onFetchSTIR} />}
          <FormInput
            name="name"
            required
            value={values.name}
            label={t("group-organizations.name")}
          />
        </div>
      </Group>
      <Group title={t("group-organizations.direktor")}>
        <FormInput
          name="director"
          value={getFIO(employee)}
          required
          label={t("fio")}
        />
        <FormInput
          name="birthDate"
          date
          label={t("birth-date")}
          required
          value={employee.birthDate ? dayjs(employee.birthDate) : null}
        />
      </Group>
      <Group title={t("group-organizations.adr")}>
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
            <FormInput label={t("email")} value={email} name="email" />
            <FormInput
              value={phone}
              label={t("phone-number")}
              name="phoneNumber"
            />
          </div>
        </div>
      </Group>
      <Group title={t("industrial-organizations.files")}>
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
