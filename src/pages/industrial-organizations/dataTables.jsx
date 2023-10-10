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

export default function InDataTable() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const { bkutData = {} } = useSelector((states) => states);
  const { enqueueSnackbar } = useSnackbar();

  const columns = [
    {
      field: "name",
      headerName: t("industrial-organizations.name"),
      minWidth: 400,
    },
    {
      field: "address",
      headerName: t("industrial-organizations.firstorg"),
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

  async function onSubmitModal(forms, hideModal) {
    const requestData = {
      bkut: {
        id: bkutData.id,
      },
      departmentType: "SEH",
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
      setRows((rows) => [
        ...rows,
        { id: rows[Math.max(rows.length - 1, 0)]?.id ?? 0, ...forms },
      ]);
      enqueueSnackbar(t("successfully-saved"), { variant: "success" });
    } else {
      enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
    }
    hideModal();
  }

  return (
    <DataTable
      columns={columns}
      rows={rows}
      onSubmitModal={onSubmitModal}
      isFormModal
      modal={(hideModal) => <ModalUI hideModal={hideModal} />}
    />
  );
}
function ModalUI({ hideModal }) {
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
    const soato = null;
    if (!soato) return;
    const provinceId = soato.slice(0, 4);
    const districtId = soato;
    handleProvince({ target: { value: provinceId } });
    setValues({ provinceId, districtId });
  }, []);

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

  return (
    <div className="modal-content">
      <Alert className="modal-alert" severity="info">
        "{bkutData?.eLegalEntity.name}"
      </Alert>
      <FinderSTIR onFetch={onFetchSTIR} />
      <FormInput
        name="name"
        required
        value={values.name}
        label={t("industrial-organizations.name")}
      />
      <div className="modal-row">
        <FormInput
          label={t("industrial-organizations.direktor")}
          name="director"
          dataSelect={employees}
          select
          required
        />
        <FormInput label={t("phone-number")} name="phoneNumber" required />
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
    </div>
  );
}
