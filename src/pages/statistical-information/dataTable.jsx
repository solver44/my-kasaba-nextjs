import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FormInput from "@/components/FormInput";
import { useSnackbar } from "notistack";
import { Alert, Box } from "@mui/material";
import FinderSTIR from "@/components/FinderSTIR";
import { useSelector } from "react-redux";
import { sendDepartment } from "@/http/data";
import useActions from "@/hooks/useActions";
import Group from "@/components/Group";
import RadioGroup from "@/components/RadioGroup";

export default function InDataTable() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const { bkutData = {} } = useSelector((states) => states);
  const { enqueueSnackbar } = useSnackbar();
  const actions = useActions();

  const columns = [
    { field: "id", headerName: "Kod", width: 1 },
    {
      field: "date",
      headerName: t("statistical-information.date"),
      width: 102,
    },
    {
      field: "total",
      headerName: t("statistical-information.total"),
      minWidth: 200,
    },
    { field: "ku", headerName: t("statistical-information.ku"), minWidth: 79 },
    {
      field: "student",
      headerName: t("statistical-information.student"),
      minWidth: 150,
    },
    {
      field: "direktor",
      headerName: t("statistical-information.direktor"),
      minWidth: 130,
    },
    {
      field: "kuStudent",
      headerName: t("statistical-information.kuStudent"),
      minWidth: 130,
    },
    {
      field: "adr",
      headerName: t("statistical-information.adr"),
      minWidth: 110,
    },
    {
      field: "pesioners",
      headerName: t("statistical-information.pesioners"),
      minWidth: 244,
    },
    {
      field: "shtat",
      headerName: t("statistical-information.shtat"),
      minWidth: 133,
    },
  ];

  useEffect(() => {
    // if (!bkutData?.departments?.length) return;
    // setRows(
    //   bkutData.departments
    //     .filter((d) => d.departmentType == "SEH")
    //     .map((e) => {
    //       return {
    //         id: e.id,
    //         name: e.name,
    //         address: e.address,
    //       };
    //     })
    // );
  }, [bkutData]);

  async function onSubmitModal(forms, hideModal, isView) {
    // sendData(forms, hideModal);
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
      fullModal
      modal={(hideModal, dataModal) => (
        <ModalUI hideModal={hideModal} data={dataModal} />
      )}
    />
  );
}
function ModalUI({ hideModal, data }) {
  const { t } = useTranslation();
  const { tin } = data;

  const radioData = [
    {
      value: "1",
      label: t("yes"),
    },
    {
      value: "0",
      label: t("no"),
    },
  ];

  return (
    <div className="modal-content">
      <FormInput
        name="enterDate"
        required
        date
        label={t("statistical-information.signDate")}
      />
      <div className="modal-row">
        <Group title={t("statistical-information.group1")}>
          <div datatype="list">
            <FormInput
              name="group1-all"
              required
              value="0"
              type="number"
              label={t("statistical-information.all")}
            />
            <FormInput
              name="group1-women"
              required
              value="0"
              type="number"
              label={t("statistical-information.women")}
            />
            <FormInput
              name="group1-adults"
              required
              value="0"
              type="number"
              label={t("statistical-information.adults")}
            />
          </div>
        </Group>
        <Group title={t("statistical-information.group2")}>
          <div datatype="list">
            <FormInput
              name="group1-sub-all"
              required
              value="0"
              type="number"
              label={t("statistical-information.all")}
            />
            <FormInput
              name="group1-sub-women"
              required
              value="0"
              type="number"
              label={t("statistical-information.women")}
            />
            <FormInput
              name="group1-sub-adults"
              required
              value="0"
              type="number"
              label={t("statistical-information.adults")}
            />
          </div>
        </Group>
      </div>
      <div className="modal-row">
        <Group title={t("statistical-information.group3")}>
          <div datatype="list">
            <FormInput
              name="group3-all"
              required
              value="0"
              type="number"
              label={t("statistical-information.all")}
            />
            <FormInput
              name="group3-women"
              required
              value="0"
              type="number"
              label={t("statistical-information.women")}
            />
            <FormInput
              name="group3-adults"
              required
              value="0"
              type="number"
              label={t("statistical-information.adults")}
            />
          </div>
        </Group>
        <Group title={t("statistical-information.group2")}>
          <div datatype="list">
            <FormInput
              name="group3-sub-all"
              required
              value="0"
              type="number"
              label={t("statistical-information.all")}
            />
            <FormInput
              name="group3-sub-women"
              required
              value="0"
              type="number"
              label={t("statistical-information.women")}
            />
            <FormInput
              name="group3-sub-adults"
              required
              value="0"
              type="number"
              label={t("statistical-information.adults")}
            />
          </div>
        </Group>
      </div>

      <Group title={t("statistical-information.group4")}>
        <div datatype="list">
          <FormInput
            name="group4-all"
            required
            value="0"
            type="number"
            label={t("statistical-information.all")}
          />
        </div>
      </Group>
      <div className="modal-row">
        <Group title={t("statistical-information.group5")}>
          <div datatype="list">
            <FormInput
              name="group5-all"
              required
              value="0"
              type="number"
              label={t("statistical-information.all")}
            />
          </div>
        </Group>
        <Group title={t("statistical-information.group6")}>
          <div datatype="list">
            <FormInput
              name="group6-all"
              required
              value="0"
              type="number"
              label={t("statistical-information.all")}
            />
          </div>
        </Group>
      </div>
      <Group title={t("statistical-information.group7")}>
        <div datatype="list">
          <FormInput
            name="group7-1"
            required
            value="0"
            type="number"
            label={t("statistical-information.input1")}
          />
          <FormInput
            name="group7-2"
            required
            value="0"
            type="number"
            label={t("statistical-information.input2")}
          />
        </div>
        <div datatype="list">
          <FormInput
            name="group7-3"
            required
            value="0"
            type="number"
            label={t("statistical-information.input3")}
          />
          <FormInput
            name="group7-4"
            required
            value="0"
            type="number"
            label={t("statistical-information.input4")}
          />
        </div>
      </Group>
      <Group title={t("statistical-information.group8")}>
        <div datatype="list">
          <FormInput
            name="group8-1"
            required
            value="0"
            type="number"
            label={t("statistical-information.input5")}
          />
          <FormInput
            name="group8-2"
            required
            value="0"
            type="number"
            label={t("statistical-information.input6")}
          />
          <FormInput
            name="group8-3"
            required
            value="0"
            type="number"
            label={t("statistical-information.input7")}
          />
          <FormInput
            name="group8-4"
            required
            value="0"
            type="number"
            label={t("statistical-information.input8")}
          />
          <FormInput
            name="group8-5"
            required
            value="0"
            type="number"
            label={t("statistical-information.input9")}
          />
          <div style={{ marginTop: 20 }} className="modal-row radio">
            <RadioGroup
              value={0}
              name="group8-6"
              label={t("statistical-information.input10")}
              data={radioData}
            />
            <RadioGroup
              value={0}
              name="group8-7"
              label={t("statistical-information.input11")}
              data={radioData}
            />
          </div>
          <div className="modal-row radio">
            <RadioGroup
              value={0}
              name="group8-8"
              label={t("statistical-information.input12")}
              data={radioData}
            />
            <RadioGroup
              value={0}
              name="group8-9"
              label={t("statistical-information.input13")}
              data={radioData}
            />
          </div>
          <div className="modal-row radio">
            <RadioGroup
              value={0}
              name="group8-10"
              label={t("statistical-information.input14")}
              data={radioData}
            />
            <RadioGroup
              value={0}
              name="group8-11"
              label={t("statistical-information.input15")}
              data={radioData}
            />
          </div>
        </div>
      </Group>
    </div>
  );
}
