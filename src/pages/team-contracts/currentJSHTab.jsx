import ChipStatus from "@/components/ChipStatus";
import CircularStatus from "@/components/CircularStatus";
import FormInput from "@/components/FormInput";
import { convertStringToFormatted, getRestOfDays } from "@/utils/date";
import { Card } from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function currentJSHTab({ formData, files, bkutData, data }) {
  const { t } = useTranslation();
  const [contractDate, setContractDate] = useState();
  const isOld = data?.status === "CURRENT_JSH";

  let endDate = contractDate
    ? convertStringToFormatted(contractDate.add(3, "year"))
    : "";
  let restDay = contractDate
    ? contractDate.add(3, "year").diff(dayjs(), "day")
    : 0;

  if (isNaN(restDay)) restDay = 0;

  return (
    <div className="modal-row full">
      <div className="modal-col">
        <div className="modal-row">
          {/* <FormInput
            required
            disabled={isOld}
            name="contractNumber"
            value={data.contractNo}
            label={t("team-contracts.contractNumber")}
          /> */}
          <FormInput
            required
            disabled={isOld}
            name="contractDate"
            value={data.contractDate}
            date
            onChange={({ target: { value } }) => setContractDate(dayjs(value))}
            label={t("team-contracts.contractDate")}
          />
        </div>
        <div className="modal-row">
          <FormInput
            name="employer"
            disabled={isOld}
            required
            value={data.employer}
            label={t("team-contracts.employer")}
          />
          <FormInput
            name="director"
            value={formData.director}
            disabled
            label={t("team-contracts.director")}
          />
        </div>
        <FormInput
          name="applications"
          required
          fileInput
          hidden
          disabled={isOld}
          value={files.applications?.url}
          nameOfFile={files.applications?.name}
          label={t("team-contracts.application")}
        />

        <div className="modal-row">
          <FormInput
            name="applicationNumber"
            disabled={isOld}
            value={data.statementNo}
            required
            label={t("team-contracts.applicationNumber")}
          />
        </div>

        <div className="modal-row">
          <FormInput
            name="employeerRepresentatives"
            textarea
            disabled={isOld}
            value={data.employerRepresentatives}
            label={t("team-contracts.employeerRepresentatives")}
          />
          <FormInput
            name="employeesRepresentatives"
            textarea
            disabled={isOld}
            value={data.employeesRepresentatives}
            label={t("team-contracts.employeesRepresentatives")}
          />
        </div>

        <FormInput
          name="applications"
          required
          disabled={isOld}
          fileInput
          value={files.applications?.url}
          nameOfFile={files.applications?.name}
          label={t("team-contracts.application")}
        />
        {!isOld && (
          <FormInput
            required
            disabled={isOld}
            minDate={contractDate}
            name="approvedDate"
            value={data.approvedDate}
            date
            label={t("team-contracts.approvedDate")}
          />
        )}
        {!isOld && (
          <FormInput
            name="expertize"
            required
            disabled={isOld}
            fileInput
            value={files.expertize?.url}
            nameOfFile={files.expertize?.name}
            label={t("team-contracts.expertize-file")}
          />
        )}
        <FormInput name="restDay" hidden value={restDay} />
      </div>
      {!isOld && (
        <Card elevation={1} className="modal-sidebar">
          <ChipStatus
            isSidebar
            label={t("team-contracts.contractEndDate")}
            color="default"
            value={endDate}
          />
          <CircularStatus
            label={t("leave-day")}
            value={restDay}
            errorValue={0}
            warningValue={15}
          />
        </Card>
      )}
    </div>
  );
}
