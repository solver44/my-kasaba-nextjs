import DataTable from "@/components/DataTable";
import FormInput from "@/components/FormInput";
import useActions from "@/hooks/useActions";
import { deleteEntityRow, getEntityOfBKUT, sendBasicTools } from "@/http/data";
import { getDistricts, getRegions } from "@/http/public";
import { getInstance } from "@/utils/data";
import { getDateFromYear } from "@/utils/date";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function Tab2({ organization }) {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  let { bkutData = {}, isOrganization } = useSelector((states) => states);
  bkutData = organization ?? bkutData;
  const { enqueueSnackbar } = useSnackbar();
  const actions = useActions();
  const entityName = "IVhicles";
  const fetchPlan = undefined;

  const columns = [
    { field: "stateNumber", headerName: "basicTools.stateNumber" },
    { field: "modelVhicle", headerName: "basicTools.modelVhicle" },
    { field: "yearMade", headerName: "basicTools.yearMade" },
    { field: "yearPurchase", headerName: "basicTools.yearPurchase" },
    { field: "initialBalance", headerName: "basicTools.initialBalance" },
    { field: "color", headerName: "basicTools.color" },
    { field: "engineNumber", headerName: "basicTools.engineNumber" },
    { field: "bodyNumber", headerName: "basicTools.bodyNumber" },
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
        response.map((forms) => ({
          id: forms.id,
          stateNumber: forms.stateNumber,
          modelVhicle: forms.modelVhicle,
          yearMade: forms.yearMade,
          yearPurchase: forms.yearPurchase,
          initialBalance: forms.initialBalance,
          color: forms.color,
          engineNumber: forms.engineNumber,
          bodyNumber: forms.bodyNumber,
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
        stateNumber: forms.stateNumber,
        modelVhicle: forms.modelVhicle,
        yearMade: forms.yearMade,
        yearPurchase: forms.yearPurchase,
        initialBalance: forms.initialBalance,
        color: forms.color,
        engineNumber: forms.engineNumber,
        bodyNumber: forms.bodyNumber,
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

  return (
    <div className="modal-content">
      <FormInput hidden name="id" value={data.id} />
      <div className="modal-row">
        <FormInput
          name="stateNumber"
          required
          value={data.stateNumber}
          label={t("basicTools.stateNumber")}
        />
        <FormInput
          name="modelVhicle"
          required
          value={data.modelVhicle}
          label={t("basicTools.modelVhicle")}
        />
      </div>
      <div className="modal-row">
        <FormInput
          name="yearMade"
          date
          openTo="year"
          value={getDateFromYear(data.yearMade)}
          label={t("basicTools.yearMade")}
        />
        <FormInput
          name="yearPurchase"
          required
          date
          openTo="year"
          value={getDateFromYear(data.yearPurchase)}
          label={t("basicTools.yearPurchase")}
        />
      </div>
      <FormInput
        name="initialBalance"
        value={data.initialBalance}
        label={t("basicTools.initialBalance")}
      />
      <FormInput
        name="color"
        value={data.color}
        label={t("basicTools.color")}
      />
      <FormInput
        name="engineNumber"
        value={data.engineNumber}
        label={t("basicTools.engineNumber")}
      />
      <FormInput
        name="bodyNumber"
        value={data.bodyNumber}
        label={t("basicTools.bodyNumber")}
      />
    </div>
  );
}
