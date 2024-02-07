import DataTable from "@/components/DataTable";
import FormInput from "@/components/FormInput";
import useActions from "@/hooks/useActions";
import { deleteEntityRow, getEntityOfBKUT, sendBasicTools } from "@/http/data";
import { getFixedAssetType } from "@/http/handbooks";
import { getInstance } from "@/utils/data";
import { getDateFromYear } from "@/utils/date";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function Tab4({ organization }) {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  let { bkutData = {}, isOrganization } = useSelector((states) => states);
  bkutData = organization ?? bkutData;
  const { enqueueSnackbar } = useSnackbar();
  const actions = useActions();
  const entityName = "IMaterialWealth";
  const fetchPlan = undefined;

  const columns = [
    { field: "inventoryNumber", headerName: "basicTools.inventoryNumber" },
    { field: "name", headerName: "basicTools.name" },
    { field: "amount", headerName: "basicTools.amount" },
    { field: "unitOfMeasure", headerName: "basicTools.unitOfMeasure" },
    { field: "yearPurchase", headerName: "basicTools.yearPurchase" },
    { field: "invintialSheet", headerName: "basicTools.invintialSheet" },
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
          inventoryNumber: forms.inventoryNumber,
          name: forms.name,
          amount: forms.amount,
          yearPurchase: forms.yearPurchase,
          invintialSheet: forms.invintialSheet,
          unitOfMeasure: t(forms.unitOfMeasure),
        }))
      );
    }
    fetchData();
  }, [bkutData]);
  async function onSubmitModal(forms, hideModal) {
    try {
      setLoading(true);

      const requestData = {
        id: forms.id,
        inventoryNumber: forms.inventoryNumber,
        name: forms.name,
        amount: forms.amount,
        yearPurchase: forms.yearPurchase,
        invintialSheet: forms.invintialSheet,
        unitOfMeasure: forms.unitOfMeasure,
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
      <FormInput
        name="inventoryNumber"
        required
        value={data.inventoryNumber}
        label={t("basicTools.inventoryNumber")}
      />
      <FormInput
        name="name"
        required
        value={data.name}
        label={t("basicTools.name")}
      />
      <div className="modal-row">
        <FormInput
          name="unitOfMeasure"
          select
          dataSelect={[
            {
              value: "PIECE",
              label: "Dona",
              labelRu: "Штук",
            },
            {
              value: "COUPLE",
              label: "Juft",
              labelRu: "Пара",
            },
          ]}
          value={data.unitOfMeasure}
          label={t("basicTools.unitOfMeasure")}
        />
      </div>
      <div className="modal-row">
        <FormInput
          name="amount"
          type="number"
          value={data.amount}
          label={t("basicTools.amount")}
        />
        <FormInput
          name="yearPurchase"
          required
          date
          openTo="year"
          value={getDateFromYear(data.yearPurchase)}
          label={t("basicTools.yearPurchase")}
        />
        <FormInput
          name="invintialSheet"
          type="number"
          value={data.invintialSheet}
          label={t("basicTools.invintialSheet")}
        />
      </div>
    </div>
  );
}
