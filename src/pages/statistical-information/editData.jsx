import React from 'react'
import DataTable from "./dataTable";
import RadioGroup from "@/components/RadioGroup";
import Group from "@/components/Group";
import FormInput from "@/components/FormInput";
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function EditData() {
    const { t } = useTranslation();
    const { bkutData = {} } = useSelector((states) => states);
    const [values, setValues] = useState({
      workersAdults: (bkutData.statistics?.workersAdults ?? 0).toString(),
      workersFemale: (bkutData.statistics?.workersFemale ?? 0).toString(),
      firedMembersAmount: (bkutData.statistics?.firedMembersAmount ?? 0).toString(),
      staffingResponsibleWorkers: (bkutData.statistics?.staffingResponsibleWorkers ?? 0).toString(),
      homemakerAmount: (bkutData.statistics?.homemakerAmount ?? 0).toString(),
      staffingTechnicalWorkers: (bkutData.statistics?.staffingTechnicalWorkers ?? 0).toString(),
      newMemebersAmount: (bkutData.statistics?.newMemebersAmount ?? 0).toString(),
      pensionerAmount: (bkutData.statistics?.pensionerAmount ?? 0).toString(),
      studentsFemale:(bkutData.statistics?.studentsFemale ?? 0).toString(),
      workersMembers: (bkutData.statistics?.workersMembers ?? 0).toString(),
      staffingWorkersAmount: (bkutData.statistics?.staffingWorkersAmount ?? 0).toString(),
      workersAmount: (bkutData.statistics?.workersAmount ?? 0).toString(),
      membersProvidedTicket:(bkutData.statistics?.membersProvidedTicket ?? 0).toString(),
      studentsAdultsMembers: (bkutData.statistics?.studentsAdultsMembers ?? 0).toString(),
      studentsAmount:(bkutData.statistics?.studentsAmount ?? 0).toString(),
      studentsAdults: (bkutData.statistics?.studentsAdults ?? 0).toString(),
      studentsMembers: (bkutData.statistics?.studentsMembers ?? 0).toString(),
      studentsFemaleMembers: (bkutData.statistics?.studentsFemaleMembers ?? 0).toString(), 
      invalidAmount:(bkutData.statistics?.invalidAmount ?? 0).toString(),
      salaryByAgreements:(bkutData.statistics?.salaryByAgreements ?? 0).toString(),
      spentAmount: (bkutData.statistics?.spentAmount ?? 0).toString(),
      workersFemaleMembers: (bkutData.statistics?.workersFemaleMembers ?? 0).toString(),
      workersAdultsMembers: (bkutData.statistics?.workersAdultsMembers ?? 0).toString(),
      staffingAmount:(bkutData.statistics?.staffingAmount ?? 0).toString(),
      isProvidedPC: bkutData.statistics?.isProvidedPC,
      isProvidedInternet: bkutData.statistics?.isProvidedInternet,
      isProvidedPaidApparatus: bkutData.statistics?.isProvidedPaidApparatus,
      isFiredFromMainJob: bkutData.statistics?.isFiredFromMainJob,
      isCollegialPresident: bkutData.statistics?.isCollegialPresident,
      isProvidedPrivateRoom: bkutData.statistics?.isProvidedPrivateRoom,
    });
    const radioData = [
      {
        value: 'true',
        label: t("yes"),
      },
      {
        value: 'false',
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
              required
              value={values.staffingResponsibleWorkers}
              type="number"
              label={t("statistical-information.input3")}
              onChange={handleInputChange}
            />
            <FormInput
              name="staffingTechnicalWorkers"
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