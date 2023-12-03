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
  const getRowClassName = (params) => {
    const status = params.row.status;
  
    if (status === 'CONFIRMED') {
      return 'confirmed-row';
    }
  
    return ''; // If no specific class needs to be applied
  };
  

  useEffect(() => {
    if (!bkutData?.agreements?.length) return;
    setRows(
        bkutData?.agreements
        .filter((e) => e.status === 'INANALYSIS') // Filter out rows where isKasabaActive is false
        .map((e) => {
        const translatedStatus = e.status === 'INANALYSIS' ? `Ko'rib chiqilmoqda` : e.status === 'CONFIRMED' ? 'Tasdiqlangan' : e.status;
        return {
          id: e.id.slice(0, 8),
          bkut: bkutData.name,
          contractNumber: e.contractNo,
          director: bkutData?.employees[0]?._instanceName,
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
          director: forms.director,
          applications: [
            {
              file: protocolFileRef // Misol uchun fs://2023/20...
            },
          ]
        }
      };
      // Include decisionFile reference in the request data if available
     
      // Include ID for an existing entry
      if (duplicate) {
        requestData.id = duplicate.id;
      }
      const response = await sendContracts(requestData);
      console.log(bkutData)
      if (response?.success) {
        const newId = rows[Math.max(rows.length - 1, 0)]?.id ?? 0;
        setRows((rows) => [
          ...rows.filter((r) => r.id !== newId),
          { id: newId, ...forms },
        ]);
  
        enqueueSnackbar(t("successfully-saved"), { variant: "success" });
        actions.updateData();
      }if(response.success == false){
        enqueueSnackbar(t("error-send-bkuts"), { variant: "error" });
      }
       else {
        enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
      }
  
      if (hideModal) {
        hideModal();
      }
    }  catch (error) {
      console.error("Error sending data:", error); // Log the specific error
      enqueueSnackbar(t("send-data-error"), { variant: "error" });
      return;
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
      hideFirstButton
      hideDelete
      bkutData={bkutData}
      onSubmitModal={onSubmitModal}
      isFormModal
      fetchData={fetchData}
      getRowClassName={getRowClassName} 
      modal={(hideModal, dataModal) => (
        <ModalUI hideModal={hideModal} data={dataModal} />
      )}
    />
  );
}

function ModalUI({ hideModal, data }) {
  const { t } = useTranslation();
  const [employees, bkutData] = useEmployees();
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
        value={bkutData?.employees[0]?._instanceName}
        disabled
        onChange={() => {
          if (bkutData && bkutData.employees && Array.isArray(bkutData.employees)) {
            const employeePositionOne = bkutData.employees.find(employee => employee.position === 1);
          
            if (employeePositionOne) {
              const directorValueFromEmployees = employeePositionOne.individual?._instanceName || '';
              console.log(directorValueFromEmployees); // Log the director's name
          
              // Further processing or usage of directorValueFromEmployees
            }
          } else {
            // Handle cases where bkutData or its employees property are missing or not properly structured
            console.log('Invalid data structure or missing employees data');
          }
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
