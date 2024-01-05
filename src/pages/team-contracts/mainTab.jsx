import DocumentViewer from "@/components/DocumentViewer";
import FormInput from "@/components/FormInput";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function MainTab({ files, data, formData, bkutData }) {
  const { t } = useTranslation();
  const { applications = [] } = data;

  const isConfirmed = data.status == "CONFIRMED";
  const isAnalysis =
    data.status == "INANALYSIS" || data.status == "INEXECUTION";
  const isConsidered =
    data.status == "CONSIDERED" ||
    data.status == "CONFIRMED" ||
    data.status == "TO_CONFIRM";
  return (
    <div className="modal-col">
      <div className="modal-row">
        <FormInput
          disabled
          name="contractNumber"
          value={data.contractNo}
          label={t(
            isAnalysis
              ? "team-contracts.docNumber"
              : "team-contracts.contractNumber"
          )}
        />
        {!isAnalysis && (
          <FormInput
            disabled
            name="contractDate"
            value={data.contractDate}
            date
            label={t("team-contracts.contractDate")}
          />
        )}
      </div>
      <div className="modal-row">
        {!isAnalysis && (
          <FormInput
            name="employer"
            disabled={isConfirmed}
            required
            value={data.employer}
            label={t("team-contracts.employer")}
          />
        )}
        <FormInput
          name="director"
          value={formData.director}
          disabled
          onChange={() => {}}
          label={t("team-contracts.director")}
        />
      </div>
      {isAnalysis ? (
        <DocumentViewer
          url={applications?.length > 0 ? applications[0].file : ""}
        />
      ) : (
        <FormInput
          name="applications"
          required
          fileInput
          hidden
          disabled
          value={files.applications?.url}
          nameOfFile={files.applications?.name}
          label={t(
            isConsidered
              ? "team-contracts.applicationProject"
              : "team-contracts.application"
          )}
        />
      )}
      {!isAnalysis && (
        <div className="modal-row">
          <FormInput
            name="applicationNumber"
            disabled={isConfirmed}
            value={data.statementNo}
            required
            label={t("team-contracts.applicationNumber")}
          />
        </div>
      )}
      {!isAnalysis && (
        <div className="modal-row">
          <FormInput
            name="employeerRepresentatives"
            textarea
            disabled={isConfirmed}
            value={data.employerRepresentatives}
            label={t("team-contracts.employeerRepresentatives")}
          />
          <FormInput
            name="employeesRepresentatives"
            textarea
            disabled={isConfirmed}
            value={data.employeesRepresentatives}
            label={t("team-contracts.employeesRepresentatives")}
          />
        </div>
      )}
      {isConsidered && (
        <FormInput
          name="applications1"
          required
          disabled={isConfirmed}
          fileInput
          value={files.applications1?.url}
          nameOfFile={files.applications1?.name}
          label={t("team-contracts.application")}
        />
      )}
    </div>
  );
}
