import DataTable from "@/components/DataTable";
import FormInput from "@/components/FormInput";
import useActions from "@/hooks/useActions";
import { deleteEntityRow, getEntityOfBKUT, sendBasicTools } from "@/http/data";
import { getDistricts, getRegions } from "@/http/public";
import { getInstance } from "@/utils/data";
import { getDateFromYear } from "@/utils/date";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function Tab1({ organization }) {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  let { bkutData = {}, isOrganization } = useSelector((states) => states);
  bkutData = organization ?? bkutData;
  const { enqueueSnackbar } = useSnackbar();
  const actions = useActions();
  const entityName = "IBuildingsAndStructures";
  const fetchPlan = "iBuildingsAndStructures-fetch-plan";

  const columns = [
    { field: "seriesNumberBuild", headerName: "basicTools.seriesNumber" },
    { field: "buildName", headerName: "basicTools.buildName" },
    { field: "soato", headerName: "basicTools.soato" },
    { field: "buildYear", headerName: "basicTools.buildYear" },
    { field: "startDateBuild", headerName: "basicTools.startYear" },
    { field: "numberFloors", headerName: "basicTools.floors" },
    { field: "commonArea", headerName: "basicTools.commonArea" },
    { field: "initialStateValue", headerName: "basicTools.initial" },
  ];

  useEffect(() => {
    if (!bkutData?.id) return;
    async function fetchData() {
      const response = await getEntityOfBKUT(
        entityName,
        bkutData.id,
        fetchPlan
      );
      setData(response);
      setRows(
        response.map((e) => ({
          id: e.id,
          seriesNumberBuild: e.seriesNumberBuild,
          buildName: e.buildName,
          buildYear: e.buildYear,
          startDateBuild: e.startDateBuild,
          numberFloors: e.numberFloors,
          commonArea: e.commonArea,
          initialStateValue: e.initialStateValue,
          soato: getInstance(e.soato),
        }))
      );
    }
    fetchData();
  }, [bkutData]);
  async function onSubmitModal(forms, hideModal, isView, _dataModal) {
    try {
      setLoading(true);

      const requestData = {
        id: forms.id,
        seriesNumberBuild: forms.seriesNumber,
        buildName: forms.buildName,
        organization: { id: bkutData.eLegalEntity?.id },
        buildYear: forms.buildYear,
        startDateBuild: forms.startDateBuild,
        numberFloors: forms.numberFloors,
        commonArea: forms.commonArea,
        initialStateValue: forms.initialStateValue,
        soato: { id: (forms.district || forms.province || "") + "" },
      };
      if (isOrganization || organization?.id)
        requestData.eBkutOrganization = { id: bkutData.id };
      else requestData.eBKUT = { id: bkutData.id };

      const response = await sendBasicTools(requestData, entityName);
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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchData(id) {
    return data.find((d) => d.id === id);
  }
  async function deleteRow(id) {
    try {
      const res = await deleteEntityRow(entityName, id);
      if (res) {
        setRows((rows) => rows.filter((row) => row?.id != id));
        actions.updateData();
      } else enqueueSnackbar(t("delete-error"), { variant: "error" });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <DataTable
      fetchData={fetchData}
      handleDeleteClick={deleteRow}
      columns={columns}
      rows={rows}
      bkutData={bkutData}
      onSubmitModal={onSubmitModal}
      isFormModal
      title={t("basicTools.tab1")}
      loading={loading}
      modal={(hideModal, dataModal) => (
        <ModalUI data={dataModal} hideModal={hideModal} />
      )}
    />
  );
}

function ModalUI({ hideModal, data = {} }) {
  const { t } = useTranslation();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({ district: "", province: "" });

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

  useEffect(() => {
    if (!data.id || provinces.length < 1) return;
    async function fetchData() {
      handleProvince({
        target: { value: data.soato?.parent?.id || data.soato?.id },
      });
      const provinceId = data.soato?.parent?.id || data.soato?.id;
      const districtId = data.soato?.id;
      setFormData({ province: provinceId, district: districtId });
    }
    fetchData();
  }, [provinces, data]);

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

  return (
    <div className="modal-content">
      <FormInput hidden name="id" value={data.id} />
      <FormInput
        required
        label={t("basicTools.seriesNumber1")}
        name="seriesNumber"
        value={data.seriesNumberBuild}
      />
      <FormInput
        required
        label={t("basicTools.buildName")}
        value={data.buildName}
        name="buildName"
      />
      <div className="modal-row">
        <FormInput
          required
          select
          dataSelect={provinces}
          name="province"
          value={formData.province}
          onChange={handleProvince}
          label={t("province")}
        />
        <FormInput
          required
          select
          dataSelect={districts}
          value={formData.district}
          name="district"
          label={t("district")}
        />
      </div>
      <FormInput
        date
        openTo="year"
        label={t("basicTools.buildYear")}
        value={getDateFromYear(data.buildYear)}
        name="buildYear"
      />
      <FormInput
        date
        openTo="year"
        required
        label={t("basicTools.startYear")}
        value={getDateFromYear(data.startDateBuild)}
        name="startDateBuild"
      />
      <FormInput
        label={t("basicTools.floors")}
        value={data.numberFloors}
        name="numberFloors"
        type="number"
      />
      <FormInput
        label={t("basicTools.commonArea")}
        value={data.commonArea}
        name="commonArea"
        type="number"
      />
      <FormInput
        label={t("basicTools.initial")}
        value={data.initialStateValue}
        name="initialStateValue"
        type="number"
      />
    </div>
  );
}
