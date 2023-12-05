import DataTable from "@/components/DataTable";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useEmployees } from "../employees";
import FormInput from "@/components/FormInput";
import { deleteContracts, initFile, sendContracts } from "@/http/data";
import { useSnackbar } from "notistack";

export default function InDataTable() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { bkutData = {} } = useSelector((states) => states);
  
  const columns = [
    {
      field: "id",
      headerName: t("team-contracts.idNumber"),
      onlyShow: true,
    },
    {
      field: "contractNumber",
      headerName: t("team-contracts.contractNumber"),
    },
    {
      field: "status",
      headerName: t("team-contracts.status"),
      hidden: false,
    },
    {
      field: "createdDate",
      headerName: t("team-contracts.selectDate"),
    },
  ];
  useEffect(() => {
    if (!bkutData?.agreements?.length) return;
    
    setRows(
      bkutData.agreements.map((e) => {
        const translatedStatus = e.status === 'INANALYSIS' ? `Ko'rib chiqilmoqda` : e.status === 'CONFIRMED' ? 'Tasdiqlangan' : e.status;
        return {
          id: e.id.slice(0, 8),
          bkut: bkutData.name,
          contractNumber: e.contractNo,
          // director: filteredEmployees,
          status: translatedStatus,
          createdDate: e.approvedDate,
        };
      })
    );
  }, [bkutData]);
  async function onSubmitModal(forms, hideModal, isView) {
    const duplicate = (bkutData?.agreements ?? []).find(
      (e) => e.id == forms.id
    );
    if (!isView && duplicate) {
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
    try {
      let protocolFileRef = null;
  
      if (forms.applications) {
        // Initiate file upload and retrieve file reference
        let responseFile = await initFile(forms.applications);
        if (!responseFile?.fileRef) {
          enqueueSnackbar(t("upload-file-error"), { variant: "error" });
          return;
        }
        // File upload successful, assign file reference
        protocolFileRef = responseFile.fileRef;
      }
  
      // Prepare request data excluding the decisionFile if it's not present or uploaded
      const requestData = {
        collectiveAgreements: {
          bkut: {
            id: bkutData.id // BKUT id si yuboriladi
          },
          applications: [
            {
              file: protocolFileRef // Misol uchun fs://2023/20...
            },
          ]
        }
      };
      if (duplicate) {
        requestData.id = duplicate.id;
      }
  
      const response = await sendContracts(requestData);
    console.log(response);

    if (response && response.success) {
      const newId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 1;
      setRows((prevRows) => [
        ...prevRows,
        { id: newId, ...forms },
      ]);

      enqueueSnackbar(t("successfully-saved"), { variant: "success" });
      actions.updateData();
    } else if (response && !response.success) {
      enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
      if (hideModal) {
        hideModal();
      }
    } else {
      enqueueSnackbar(t("error-send-bkuts"), { variant: "error" });
    }
    } catch (error) {
      console.error("Error sending data:", error); // Log the specific error
      enqueueSnackbar(t("send-data-error"), { variant: "error" });
      // Handle error, e.g., display a snackbar message or perform specific actions
    }
  }
  async function fetchData(id) {
    const data = (bkutData.agreements ?? []).find((ok) => ok.id == id);
    return data;
  }
  return (
    <DataTable
      title={t("team-contracts.title")}
      columns={columns}
      rows={rows}
      hideImport
      showGreenBtn
      hideFirstButton
      hideDelete
      bkutData={bkutData}
      onSubmitModal={onSubmitModal}
      isFormModal
      fetchData={fetchData}
      modal={(hideModal, dataModal, hideBtn) => (
        <ModalUI hideModal={hideModal} data={dataModal} />
      )}
    />
  );
}

function ModalUI({ hideModal, data }) {
  const { t } = useTranslation();
  const [employees, bkutData] = useEmployees();
  const filteredEmployees = bkutData.employees
  .filter((employee) => employee.position?.id === 1)
  .map((employee) => employee._instanceName);

console.log(filteredEmployees);
  const [formData, setFormData] = useState({
    director: "",
    // Add other form input state values here
  });
  
  const [files, setFiles] = useState({
    applications: { loading: true },
    
  });
  async function parseFile(file) {
    if (!file) return [null, null];
    const res = await getFile(file);
    return [res, decodeURIComponent(file.split("=")[1]).replace(/\+/g, " ")];
  }
  console.log(data)
  useEffect(() => {
    const fetchData = async () => {
      let res3 = await parseFile(data.applications);
      setFiles({
        applications: { name: res3[1], data: res3[0] },
      });
    };
    fetchData();
  }, [data]);
  
  return (
    <div className="modal-content">
      {/* <div className="modal-row">
        <FormInput
          name="contractNumber"
          label={t("team-contracts.contractNumber")}
        />
        <FormInput
          name="contractDate"
          date
          label={t("team-contracts.contractDate")}
        />
      </div> */}
      <div className="modal-row">
        <FormInput
            name="bkutPpo"
            value={bkutData.name}
            required
            disabled
            label={t("team-contracts.bkutPpo")}
          />
        {/* <FormInput
          name="applicationNumber"
          required
          label={t("team-contracts.applicationNumber")}
        /> */}
      </div>
      {/* <FormInput
        name="companyName"
        required
        label={t("team-contracts.companyName")}
      /> */}
       {/* <div className="modal-row">
        <FormInput
          name="employer"
          required
          label={t("team-contracts.employer")}
        />
        <FormInput
          name="signDate"
          date
          label={t("team-contracts.signDate")}
        />
      </div> */}
      <div className="modal-row">
      <FormInput
        name="director"
        value={filteredEmployees}
        disabled
        onChange={() => {
          
        }}
        label={t("team-contracts.director")}
      />
         {/* <FormInput
          name="signDate1"
          date
          label={t("team-contracts.signDate")}
        /> */}
      </div> 
     
      <FormInput
        name="applications"
        required
        fileInput
        label={t("team-contracts.application")}
        value={files.applications?.url || ''} // Use files.applications.url if available
        nameOfFile={files.applications?.name || 'Faylni yuklash'} // Use files.applications.name if available
      />
    </div>
  );
}
