import React, { useEffect, useState } from "react";
import HomeWrapper from "@/pages/home/wrapper";
import Tabs from "@/components/Tabs";
import LaborApp3Page from "./app3";
import useQueryPage from "@/hooks/useQueryPage";
import useActions from "@/hooks/useActions";
import { useSnackbar } from "notistack";
import { getLaborProtections, sendELaborProtection } from "@/http/data";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import LaborApp4Page from "./app4";
import LaborApp5Page from "./app5";
import LaborJSHPage from "./jsh";
import LaborMedicalPage from "./medical";
import LaborAttestationPage from "./attestation";

export const QUARTERS = (type) => [
  type != 2 && {
    value: 1,
    label: "(I) 1-aprel uchun",
  },
  {
    value: 2,
    label: "(II) 1-iyul uchun",
  },
  type != 2 && {
    value: 3,
    label: "(III) 1-oktabr uchun",
  },
  {
    value: 4,
    label: "(IV) 1-yanvar uchun",
  },
];

export default function LaborProtectionPage() {
  const { searchParams, addQueryToCurrentURL } = useQueryPage({
    tab: 1,
  });
  const { bkutData = {} } = useSelector((states) => states);
  const { t } = useTranslation();
  const [labors, setLabors] = useState();
  const [years, setYears] = useState();
  const actions = useActions();
  const { enqueueSnackbar } = useSnackbar();

  async function initYears(labors = []) {
    const allYears = [];
    const y = dayjs().year();
    const prevY = y - 1;
    labors.forEach((r) => {
      const cYear = r.year;
      if (cYear == y || cYear == prevY) return;
      allYears.push({
        value: cYear,
        label: t("on-year", { year: cYear }),
        labelRu: t("on-year", { year: cYear }),
      });
    });
    allYears.push({ value: prevY, label: t("on-year", { year: prevY }) });
    allYears.push({ value: y, label: t("on-year", { year: y }) });
    setYears(allYears.sort((a, b) => b.value - a.value));
  }

  useEffect(() => {
    if (!bkutData.id) return;
    async function initData() {
      let labors = await getLaborProtections(bkutData.id);
      labors = Array.isArray(labors) ? labors : [];
      setLabors(labors);
      initYears(labors);
    }
    initData();
  }, [bkutData]);

  function onChangeTabs(index) {
    addQueryToCurrentURL({ tab: +index + 1 });
  }
  async function saveLabor(forms, currentReport, name) {
    const quarter = currentReport.quarter;
    delete currentReport.quarter;
    if (!currentReport.id) {
      delete forms.id;
    }
    const requestData = {
      ...currentReport,
      date: currentReport.date,
      year: currentReport.year,
      eBKUT: {
        id: bkutData.id,
      },
      [name]: [
        ...(currentReport[name] || []).filter((a) => a.quarter != quarter),
        {
          quarter,
          ...forms,
        },
      ],
    };

    const response = await sendELaborProtection(requestData);

    if (response?.success) {
      enqueueSnackbar(t("successfully-saved"), { variant: "success" });
      actions.updateData();
      return true;
    } else {
      enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
      return false;
    }
  }

  return (
    <Tabs
      onChange={onChangeTabs}
      value={(searchParams.get("tab") ?? 1) - 1}
      tabs={[
        {
          label: "labor.app3",
          children: (
            <LaborApp3Page
              bkutData={bkutData}
              data={labors}
              years={years}
              saveReport={saveLabor}
            />
          ),
        },
        {
          label: "labor.app4",
          children: (
            <LaborApp4Page
              bkutData={bkutData}
              data={labors}
              years={years}
              saveReport={saveLabor}
            />
          ),
        },
        {
          label: "labor.app5",
          children: (
            <LaborApp5Page
              bkutData={bkutData}
              data={labors}
              years={years}
              saveReport={saveLabor}
            />
          ),
        },
        {
          label: "labor.jsh",
          children: (
            <LaborJSHPage
              bkutData={bkutData}
              data={labors}
              years={years}
              saveReport={saveLabor}
            />
          ),
        },
        {
          label: "labor.medical",
          children: (
            <LaborMedicalPage
              bkutData={bkutData}
              data={labors}
              years={years}
              saveReport={saveLabor}
            />
          ),
        },
        {
          label: "labor.attestation",
          children: (
            <LaborAttestationPage
              bkutData={bkutData}
              data={labors}
              years={years}
              saveReport={saveLabor}
            />
          ),
        },
      ]}
    />
  );
}
LaborProtectionPage.layout = function (Component, t) {
  return <HomeWrapper title={t("labor-protection")}>{Component}</HomeWrapper>;
};
