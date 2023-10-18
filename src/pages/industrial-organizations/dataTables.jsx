import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FormInput from "@/components/FormInput";
import { useSnackbar } from "notistack";
import { Alert, Box } from "@mui/material";
import { getDistricts, getRegions } from "@/http/public";
import FinderSTIR from "@/components/FinderSTIR";
import { useEmployees } from "../employees";
import { useSelector } from "react-redux";
import { sendDepartment } from "@/http/data";
import useActions from "@/hooks/useActions";

export default function InDataTable() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const { bkutData = {} } = useSelector((states) => states);
  const { enqueueSnackbar } = useSnackbar();
  const actions = useActions();

  const columns = [
    {
      field: "name",
      headerName: t("industrial-organizations.name"),
      minWidth: 400,
    },
    {
      field: "address",
      headerName: t("address"),
      minWidth: 200,
    },
  ];

  useEffect(() => {
    if (!bkutData?.departments?.length) return;
    setRows(
      bkutData.departments
        .filter((d) => d.departmentType == "SEH")
        .map((e) => {
          return {
            id: e.id,
            name: e.name,
            address: e.address,
          };
        })
    );
  }, [bkutData]);

  async function onSubmitModal(forms, hideModal, isView) {
    const duplicate = (bkutData?.departments ?? []).find(
      (e) => e.tin == forms.tin
    );
    if (!isView && duplicate) {
      const isAnother = duplicate.departmentType == "GURUH";
      showYesNoDialog(
        t(isAnother ? "found-on-group" : "rewrite-stir"),
        isAnother ? null : () => sendData(forms, hideModal),
        () => {},
        t
      );
      return;
    }
    sendData(forms, hideModal);
  }

  async function sendData(forms, hideModal) {
    const requestData = {
      bkut: {
        id: bkutData.id,
      },
      departmentType: "SEH",
      tin: forms.tin,
      name: forms.name,
      phone: forms.phone,
      email: forms.email,
      soato: {
        id: forms.district,
      },
      address: forms.address,
      employee: {
        id: forms.director,
      },
      legalEntity: {
        id: bkutData.eLegalEntity.id,
      },
    };
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
  function deleteRow(id) {
    setRows((rows) => rows.filter((row) => row?.id != id));
  }

  return (
    <DataTable
      fetchData={fetchData}
      handleDeleteClick={deleteRow}
      columns={columns}
      rows={rows}
      onSubmitModal={onSubmitModal}
      isFormModal
      modal={(hideModal, dataModal) => (
        <ModalUI hideModal={hideModal} data={dataModal} />
      )}
    />
  );
}
function ModalUI({ hideModal, data }) {
  const { t } = useTranslation();
  const [employees, bkutData] = useEmployees();

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

  return (
    <div className="modal-content">
      <Alert className="modal-alert" severity="info">
        "{bkutData?.eLegalEntity.name}"
      </Alert>
      <FinderSTIR stirValue={tin} onFetch={onFetchSTIR} />
      <div className="modal-row">
        <FormInput
          name="name"
          required
          value={values.name}
          label={t("industrial-organizations.name")}
        />
        <FormInput
          label={t("industrial-organizations.direktor")}
          name="director"
          value={employee.id}
          dataSelect={employees}
          select
          required
        />
      </div>
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
          label={t("industrial-organizations.adr")}
          required
          value={values.address}
          name="address"
        />
      </div>
      <div className="modal-row">
        <FormInput label={t("email")} value={email} name="email" />
        <FormInput value={phone} label={t("phone-number")} name="phoneNumber" />
      </div>
    </div>
  );
}
