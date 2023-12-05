import React, { useRef, useState } from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./statistical-information.module.scss";
import DataTable from "./dataTable";
import RadioGroup from "@/components/RadioGroup";
import Group from "@/components/Group";
import FormInput from "@/components/FormInput";
import useAnimation from "@/hooks/useAnimation";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import { Close } from "@mui/icons-material";
import FormValidation from "@/components/FormValidation";
import areEqual from "@/utils/areEqual";
import CardUI from "@/components/Card";
import BarCharts from "@/components/Charts/Bar";
import PieCharts from "@/components/Charts/Pie";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import InDataTable from "./dataTable";
import { sendStatistics } from "@/http/data";
import { useSelector } from "react-redux";

export default function StatisticalInformation() {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const { bkutData = {} } = useSelector((states) => states);
  const [loadingEditMode, setLoadingEditMode] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const animRef = useAnimation();
  console.log(bkutData)
  const allText = t("statistical-information.all");
  // const employeesText = t("statistical-information.employees");
  const womenText = t("statistical-information.women");
  const adultsText = t("statistical-information.adults");
  
  const saveStatistics = async (forms) => {
    try {
      const requestData = {
        bkut: {
          id: "",
        },
        workersAdults: forms.workersAdults,
        workersFemale: forms.workersFemale,
        firedMembersAmount: forms.firedMembersAmount,
        staffingResponsibleWorkers: forms.staffingResponsibleWorkers,
        homemakerAmount: forms.homemakerAmount,
        isProvidedPC: forms.isProvidedPC,
        staffingTechnicalWorkers: forms.staffingTechnicalWorkers,
        isProvidedInternet: forms.isProvidedInternet,
        newMemebersAmount: forms.newMemebersAmount,
        pensionerAmount: forms.pensionerAmount,
        isProvidedPaidApparatus: forms.isProvidedPaidApparatus,
        studentsFemale: forms.studentsFemale,
        workersMembers: forms.workersMembers,
        isFiredFromMainJob: forms.isFiredFromMainJob,
        staffingWorkersAmount: forms.staffingWorkersAmount,
        isCollegialPresident: forms.isCollegialPresident,
        workersAmount: forms.workersAmount,
        membersProvidedTicket: forms.membersProvidedTicket,
        studentsAdultsMembers: forms.studentsAdultsMembers,
        studentsAmount: forms.studentsAmount,
        studentsAdults: forms.studentsAdults,
        studentsMembers: forms.studentsMembers,
        createdDate: dayjs().format("YYYY-MM-DD"),
        studentsFemaleMembers: forms.studentsFemaleMembers,
        invalidAmount: forms.invalidAmount,
        salaryByAgreements: forms.salaryByAgreements,
        spentAmount: forms.spentAmount,
        workersFemaleMembers: forms.workersFemaleMembers,
        workersAdultsMembers: forms.workersAdultsMembers,
        staffingAmount: forms.staffingAmount,
        staffingResponsibleWorkers: forms.staffingResponsibleWorkers,
        isProvidedPC: true,
        isProvidedInternet: true,
        isProvidedPaidApparatus: true,
        isFiredFromMainJob: true,
        isCollegialPresident: true,
        isProvidedPrivateRoom: true
      };

      const response = await sendStatistics(requestData);

      if (response?.id) {
        setFinished(true);
        actions.updateData();
      } else {
        enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
      }
    } catch (error) {
    }
  };
  
  
  const categories = [t("all"), t("statistical-information.group2")];
  const group1Data = [
    { name: allText, y: [100000, 50000] },
    { name: womenText, y: [20000, 5000] },
    { name: adultsText, y: [15000, 10000] },
  ];
  const group3Data = [
    { name: allText, y: [1100000, 500000] },
    { name: womenText, y: [500000, 30000] },
    { name: adultsText, y: [110000, 500000] },
  ];
  const group4Data = [{ name: allText, y: [100000] }];
  const group5Data = [{ name: allText, y: [20000] }];
  const group6Data = [{ name: allText, y: [10000] }];

  const group7Data = [
    { name: t("statistical-information.input1"), y: [100000] },
    { name: t("statistical-information.input2"), y: [50000] },
    { name: t("statistical-information.input3"), y: [30000] },
    { name: t("statistical-information.input4"), y: [10000] },
  ];
  const group8Data = [
    { name: t("statistical-information.input5"), y: [100000] },
    { name: t("statistical-information.input6"), y: [50000] },
    { name: t("statistical-information.input7"), y: [30000] },
    { name: t("statistical-information.input8"), y: [10000] },
    { name: t("statistical-information.input9"), y: [5000] },
  ];
  const handleSubmit = async (formData) => {
    try {
      setLoadingEditMode(true);
      await saveStatistics(formData); // Call the saveStatistics function with form data
      setLoadingEditMode(false);
      setIsChanged(false);
    } catch (error) {
      // Handle any errors here
    }
  };
  return (
    <FormValidation
      className={styles.form}
      onSubmit={handleSubmit} // Connect the onSubmit event to handleSubmit function
      onChanged={(data, oldData) => {
        if (areEqual(data, oldData)) setIsChanged(false);
        else setIsChanged(true);
      }}
    >
      <div ref={animRef} className={styles.containers}>
        <div className={styles.editBtn}>
          {editMode && (
            <Button
              variant="text"
              onClick={() => {
                setIsChanged(false);
                setEditMode(false);
              }}
              startIcon={<Close />}
              disabled={loadingEditMode}
              type="button"
            >
              {t("leave")}
            </Button>
          )}
          {!editMode ? (
            <Button onClick={() => setEditMode(true)} startIcon={<EditIcon />}>
              {t("change")}
            </Button>
          ) : (
            <LoadingButton
            variant="contained"
            type="submit"
            disabled={!isChanged}
            startIcon={<EditIcon />}
            loading={loadingEditMode}
          >
            {t("save")}
          </LoadingButton>
          )}
        </div>
        {!editMode ? (
          <div className={styles.grid}>
            <CardUI>
              <BarCharts
                categories={categories}
                title={t("statistical-information.group1")}
                data={group1Data}
              />
            </CardUI>
            <CardUI>
              <BarCharts
                categories={categories}
                title={t("statistical-information.group3")}
                data={group3Data}
              />
            </CardUI>
            <CardUI>
              <BarCharts
                title={t("statistical-information.group4")}
                data={group4Data}
              />
            </CardUI>
            <CardUI>
              <BarCharts
                title={t("statistical-information.group5")}
                data={group5Data}
              />
            </CardUI>
            <CardUI>
              <BarCharts
                title={t("statistical-information.group6")}
                data={group6Data}
              />
            </CardUI>
            <CardUI>
              <PieCharts
                title={t("statistical-information.group7")}
                data={group7Data}
              />
            </CardUI>
            <CardUI className="full-grid-item">
              <BarCharts
                width={1000}
                title={t("statistical-information.group8")}
                data={group8Data}
              />
            </CardUI>
            <CardUI
              value={<CheckedBox value={1} />}
              label={t("statistical-information.input10")}
            />
            <CardUI
              value={<CheckedBox value={1} />}
              label={t("statistical-information.input11")}
            />
            <CardUI
              value={<CheckedBox value={1} />}
              label={t("statistical-information.input12")}
            />
            <CardUI
              value={<CheckedBox value={0} />}
              label={t("statistical-information.input13")}
            />
            <CardUI
              value={<CheckedBox value={1} />}
              label={t("statistical-information.input14")}
            />
            <CardUI
              value={<CheckedBox value={0} />}
              label={t("statistical-information.input15")}
            />
          </div>
        ) : (
          <EditData />
        )}
      </div>
    </FormValidation>
  );
}

function CheckedBox({ value }) {
  return value ? (
    <CheckBoxIcon className="big-icon" />
  ) : (
    <CheckBoxOutlineBlankIcon className="big-icon" />
  );
}

function EditData() {
  const { t } = useTranslation();
  const [values, setValues] = useState({
    workersAdults: "",
    workersFemale: "",
    firedMembersAmount: "",
    staffingResponsibleWorkers: "",
    homemakerAmount: "",
    staffingTechnicalWorkers: "",
    newMemebersAmount: "",
    pensionerAmount: "",
    studentsFemale:"",
    workersMembers: "",
    staffingWorkersAmount: "",
    workersAmount: "",
    membersProvidedTicket:"",
    studentsAdultsMembers: "",
    studentsAmount:"",
    studentsAdults: "",
    studentsMembers: "",
    studentsFemaleMembers: "", 
    invalidAmount:"",
    salaryByAgreements:"",
    spentAmount: "",
    workersFemaleMembers: "",
    workersAdultsMembers: "",
    staffingAmount:"",
  });
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
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
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
              name="workersAmount"
              required
              value={values.workersAmount}
              type="number"
              label={t("statistical-information.all")}
              onChange={handleInputChange}
            />
            <FormInput
              name="workersFemale"
              required
              value={values.workersFemale}
              type="number"
              label={t("statistical-information.women")}
              onChange={handleInputChange}
            />
            <FormInput
              name="workersAdults"
              required
              value={values.workersAdults}
              type="number"
              label={t("statistical-information.adults")}
              onChange={handleInputChange}
            />
          </div>
        </Group>
        
        <Group title={t("statistical-information.group2")}>
          <div datatype="list">
            <FormInput
              name="workersMembers"
              required
              value={values.workersMembers}
              type="number"
              label={t("statistical-information.all")}
              onChange={handleInputChange}
            />
            <FormInput
              name="workersFemaleMembers"
              required
              value={values.workersFemaleMembers}
              type="number"
              label={t("statistical-information.women")}
              onChange={handleInputChange}
            />
            <FormInput
              name="workersAdultsMembers"
              required
              value={values.workersAdultsMembers}
              type="number"
              label={t("statistical-information.adults")}
              onChange={handleInputChange}
            />
          </div>
        </Group>
      </div>
      <div className="modal-row">
        <Group title={t("statistical-information.group3")}>
          <div datatype="list">
            <FormInput
              name="studentsAmount"
              required
              value={values.studentsAmount}
              type="number"
              label={t("statistical-information.all")}
              onChange={handleInputChange}
            />
            <FormInput
              name="studentsFemale"
              required
              value={values.studentsFemale}
              type="number"
              label={t("statistical-information.women")}
              onChange={handleInputChange}
            />
            <FormInput
              name="studentsAdults"
              required
              value={values.studentsAdults}
              type="number"
              label={t("statistical-information.adults")}
              onChange={handleInputChange}
            />
          </div>
        </Group>
        <Group title={t("statistical-information.group2")}>
          <div datatype="list">
            <FormInput
              name="studentsMembers"
              required
              value={values.studentsMembers}
              type="number"
              label={t("statistical-information.all")}
              onChange={handleInputChange}
            />
            <FormInput
              name="studentsFemaleMembers"
              required
              value={values.studentsFemaleMembers}
              type="number"
              label={t("statistical-information.women")}v
              onChange={handleInputChange}
            />
            <FormInput
              name="studentsAdultsMembers"
              required
              value={values.studentsAdultsMembers}
              type="number"
              label={t("statistical-information.adults")}
              onChange={handleInputChange}
            />
          </div>
        </Group>
      </div>

      <Group title={t("statistical-information.group4")}>
        <div datatype="list">
          <FormInput
            name="pensionerAmount"
            required
            value={values.pensionerAmount}
            type="number"
            label={t("statistical-information.all")}
            onChange={handleInputChange}
          />
        </div>
      </Group>
      <div className="modal-row">
        <Group title={t("statistical-information.group5")}>
          <div datatype="list">
            <FormInput
              name="homemakerAmount"
              required
              value={values.homemakerAmount}
              type="number"
              label={t("statistical-information.all")}
              onChange={handleInputChange}
            />
          </div>
        </Group>
        <Group title={t("statistical-information.group6")}>
          <div datatype="list">
            <FormInput
              name="invalidAmount"
              required
              value={values.invalidAmount}
              type="number"
              label={t("statistical-information.all")}
              onChange={handleInputChange}
            />
          </div>
        </Group>
      </div>
      <Group title={t("statistical-information.group7")}>
        <div datatype="list">
          <FormInput
            name="staffingAmount"
            required
            value={values.staffingAmount}
            type="number"
            label={t("statistical-information.input1")}
            onChange={handleInputChange}
          />
          <FormInput
            name="staffingResponsibleWorkers"
            required
            value={values.staffingResponsibleWorkers}
            type="number"
            label={t("statistical-information.input2")}
            onChange={handleInputChange}
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

StatisticalInformation.layout = function (Component, t) {
  return (
    <HomeWrapper
      title={t("statistical-information.title")}
      desc={t("profile-page.desc")}
    >
      {Component}
    </HomeWrapper>
  );
};
