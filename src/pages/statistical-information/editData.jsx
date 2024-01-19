import React, { useEffect } from "react";
import RadioGroup from "@/components/RadioGroup";
import Group from "@/components/Group";
import FormInput from "@/components/FormInput";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function EditData({ currentReport = {} }) {
  const { t } = useTranslation();
  const [values, setValues] = useState({});

  useEffect(() => {
    const st = currentReport;
    setValues({
      workersAdults: st.workersAdults ?? 0,
      workersFemale: st.workersFemale ?? 0,
      firedMembersAmount: st.firedMembersAmount ?? 0,
      staffingResponsibleWorkers: st.staffingResponsibleWorkers ?? 0,
      homemakerAmount: st.homemakerAmount ?? 0,
      staffingTechnicalWorkers: st.staffingTechnicalWorkers ?? 0,
      newMemebersAmount: st.newMemebersAmount ?? 0,
      pensionerAmount: st.pensionerAmount ?? 0,
      studentsFemale: st.studentsFemale ?? 0,
      workersMembers: st.workersMembers ?? 0,
      staffingWorkersAmount: st.staffingWorkersAmount ?? 0,
      workersAmount: st.workersAmount ?? 0,
      membersProvidedTicket: st.membersProvidedTicket ?? 0,
      studentsAdultsMembers: st.studentsAdultsMembers ?? 0,
      studentsAmount: st.studentsAmount ?? 0,
      studentsAdults: st.studentsAdults ?? 0,
      studentsMembers: st.studentsMembers ?? 0,
      studentsFemaleMembers: st.studentsFemaleMembers ?? 0,
      invalidAmount: st.invalidAmount ?? 0,
      salaryByAgreements: st.salaryByAgreements ?? 0,
      spentAmount: st.spentAmount ?? 0,
      workersFemaleMembers: st.workersFemaleMembers ?? 0,
      workersAdultsMembers: st.workersAdultsMembers ?? 0,
      staffingAmount: st.staffingAmount ?? 0,
      isProvidedPC: st.isProvidedPC ?? false,
      isProvidedInternet: st.isProvidedInternet ?? false,
      isProvidedPaidApparatus: st.isProvidedPaidApparatus ?? false,
      isFiredFromMainJob: st.isFiredFromMainJob ?? false,
      isCollegialPresident: st.isCollegialPresident ?? false,
      isProvidedPrivateRoom: st.isProvidedPrivateRoom ?? false,
    });
  }, [currentReport]);

  const radioData = [
    {
      value: true,
      label: t("yes"),
    },
    {
      value: false,
      label: t("no"),
    },
  ];
  const handleInputChange = (event) => {
    // const { name, value } = event.target;
    // setValues((prevValues) => ({
    //   ...prevValues,
    //   [name]: value,
    // }));
  };

  return (
    <div className="modal-content">
      {/* <FormInput
          name="enterDate"
          required
          date
          label={t("statistical-information.signDate")}
        /> */}
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
              maxInput="workersAmount"
              required
              value={values.workersFemale}
              type="number"
              label={t("statistical-information.women")}
              onChange={handleInputChange}
            />
            <FormInput
              name="workersAdults"
              maxInput="workersAmount"
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
              maxInput="workersAmount"
              required
              value={values.workersMembers}
              type="number"
              label={t("statistical-information.all")}
              onChange={handleInputChange}
            />
            <FormInput
              name="workersFemaleMembers"
              maxInput="workersFemale"
              required
              value={values.workersFemaleMembers}
              type="number"
              label={t("statistical-information.women")}
              onChange={handleInputChange}
            />
            <FormInput
              name="workersAdultsMembers"
              maxInput="workersAdults"
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
              maxInput="studentsAmount"
              required
              value={values.studentsFemale}
              type="number"
              label={t("statistical-information.women")}
              onChange={handleInputChange}
            />
            <FormInput
              name="studentsAdults"
              maxInput="studentsAmount"
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
              maxInput="studentsAmount"
              required
              value={values.studentsMembers}
              type="number"
              label={t("statistical-information.all")}
              onChange={handleInputChange}
            />
            <FormInput
              name="studentsFemaleMembers"
              maxInput="studentsFemale"
              required
              value={values.studentsFemaleMembers}
              type="number"
              label={t("statistical-information.women")}
              onChange={handleInputChange}
            />
            <FormInput
              name="studentsAdultsMembers"
              maxInput="studentsAdults"
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
            name="staffingWorkersAmount"
            required
            value={values.staffingWorkersAmount}
            type="number"
            label={t("statistical-information.input2")}
            onChange={handleInputChange}
          />
        </div>
        <div datatype="list">
          <FormInput
            name="staffingResponsibleWorkers"
            maxInput="staffingWorkersAmount"
            required
            value={values.staffingResponsibleWorkers}
            type="number"
            label={t("statistical-information.input3")}
            onChange={handleInputChange}
          />
          <FormInput
            name="staffingTechnicalWorkers"
            maxInput="staffingWorkersAmount"
            required
            value={values.staffingTechnicalWorkers}
            type="number"
            label={t("statistical-information.input4")}
            onChange={handleInputChange}
          />
        </div>
      </Group>
      <Group title={t("statistical-information.group8")}>
        <div datatype="list">
          <FormInput
            name="salaryByAgreements"
            required
            value={values.salaryByAgreements}
            type="number"
            label={t("statistical-information.input5")}
            onChange={handleInputChange}
          />
          <FormInput
            name="spentAmount"
            required
            value={values.spentAmount}
            type="number"
            label={t("statistical-information.input6")}
            onChange={handleInputChange}
          />
          <FormInput
            name="newMemebersAmount"
            required
            value={values.newMemebersAmount}
            type="number"
            label={t("statistical-information.input7")}
            onChange={handleInputChange}
          />
          <FormInput
            name="firedMembersAmount"
            required
            value={values.firedMembersAmount}
            type="number"
            label={t("statistical-information.input8")}
            onChange={handleInputChange}
          />
          <FormInput
            name="membersProvidedTicket"
            required
            value={values.membersProvidedTicket}
            type="number"
            label={t("statistical-information.input9")}
            onChange={handleInputChange}
          />
          <div style={{ marginTop: 20 }} className="modal-row radio">
            <RadioGroup
              value={values.isProvidedPrivateRoom}
              name="isProvidedPrivateRoom"
              label={t("statistical-information.input10")}
              onChange={handleInputChange}
              data={radioData}
            />
            <RadioGroup
              value={values.isProvidedPC}
              name="isProvidedPC"
              label={t("statistical-information.input11")}
              data={radioData}
              onChange={handleInputChange}
            />
          </div>
          <div className="modal-row radio">
            <RadioGroup
              value={values.isProvidedInternet}
              name="isProvidedInternet"
              label={t("statistical-information.input12")}
              data={radioData}
              onChange={handleInputChange}
            />
            <RadioGroup
              value={values.isCollegialPresident}
              name="isCollegialPresident"
              label={t("statistical-information.input13")}
              data={radioData}
              onChange={handleInputChange}
            />
          </div>
          <div className="modal-row radio">
            <RadioGroup
              value={values.isFiredFromMainJob}
              name="isFiredFromMainJob"
              label={t("statistical-information.input14")}
              data={radioData}
              onChange={handleInputChange}
            />
            <RadioGroup
              value={values.isProvidedPaidApparatus}
              name="isProvidedPaidApparatus"
              label={t("statistical-information.input15")}
              data={radioData}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </Group>
    </div>
  );
}
