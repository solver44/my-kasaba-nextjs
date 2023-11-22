import DataTable from "@/components/DataTable";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useEmployees } from "../employees";
import FormInput from "@/components/FormInput";

export default function InDataTable() {
  const { t } = useTranslation();
  const { bkutData = {} } = useSelector((states) => states);
  const [rows, setRows] = useState([
    {
      id: 1,
      contractNumber: "20.02.22",
      agreeDate: "02.02.2023",
      sign: "Mirzaev I.A.",
      signK: "Navoiy",
    },
    {
      id: 2,
      contractNumber: "20.02.22",
      agreeDate: "02.02.2023",
      sign: "Mirzaev I.A.",
      signK: "Navoiy",
    },
  ]);
  const columns = [
    { field: "contractNumber", headerName: t("team-contracts.contractNumber") },
    { field: "agreeDate", headerName: t("team-contracts.agreeDate") },
    { field: "sign", headerName: t("team-contracts.sign") },
    { field: "signK", headerName: t("team-contracts.signK") },
  ];

  async function onSubmitModal(forms, hideModal, isView) {
    // const duplicate = (bkutData?.organizations ?? []).find(
    //   (e) => e.tin == forms.tin
    // );
    // if (!isView && duplicate) {
    //   const isAnother = duplicate.organizationType == "SEH";
    //   showYesNoDialog(
    //     t(isAnother ? "found-on-industrion" : "rewrite-stir"),
    //     isAnother ? null : () => sendData(forms, hideModal),
    //     () => {},
    //     t
    //   );
    //   return;
    // }
    // sendData(forms, hideModal);
  }

  async function sendData(forms, hideModal) {
    const requestData = {
      bkut: {
        id: bkutData.id,
      },
      organizationType: "GURUH",
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
    // const data = (bkutData.organizations ?? []).find((ok) => ok.id == id);
    // return data;
  }
  function deleteRow(id) {
    setRows((rows) => rows.filter((row) => row?.id != id));
  }

  return (
    <DataTable
      fetchData={fetchData}
      handleDeleteClick={deleteRow}
      title={t("team-contracts.title")}
      columns={columns}
      rows={rows}
      hideImport
      bkutData={bkutData}
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
  const [values, setValues] = useState({
    name: "",
    address: "",
  });

  useEffect(() => {
    const fetchData = async () => {};
    fetchData();
  }, []);

  return (
    <div className="modal-content">
      <div className="modal-row">
        <FormInput
          name="contractNumber"
          label={t("team-contracts.contractNumber")}
        />
        <FormInput
          name="contractDate"
          date
          label={t("team-contracts.contractDate")}
        />
      </div>
      <FormInput
        name="applicationNumber"
        required
        label={t("team-contracts.applicationNumber")}
      />
      <FormInput
        name="employer"
        required
        label={t("team-contracts.employer")}
      />
      <FormInput
        name="director"
        required
        label={t("team-contracts.director")}
      />
      <FormInput
        name="application"
        required
        fileInput
        label={t("team-contracts.application")}
      />
    </div>
  );
}
