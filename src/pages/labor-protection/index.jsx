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
    label: "(III) 1-oktyabr uchun",
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
    labors.forEach((r) => {
      const cYear = r.year;
      if (cYear == y) return;
      allYears.push({
        value: cYear,
        label: t("on-year", { year: cYear }),
        labelRu: t("on-year", { year: cYear }),
      });
    });
    allYears.push({ value: y, label: t("on-year", { year: y }) });
    setYears(allYears.reverse());
  }

  useEffect(() => {
    if (!bkutData.id) return;
    async function initData() {
      const labors = await getLaborProtections(bkutData.id);
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
      ]}
    />
  );
}
LaborProtectionPage.layout = function (Component, t) {
  return <HomeWrapper title={t("labor-protection")}>{Component}</HomeWrapper>;
};
