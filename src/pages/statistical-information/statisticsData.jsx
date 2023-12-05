import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import RadioGroup from "@/components/RadioGroup";
import Group from "@/components/Group";
import FormInput from "@/components/FormInput";

export default function statisticsData() {
const { t, i18n } = useTranslation();
const [editMode, setEditMode] = useState(false);
const [loadingEditMode, setLoadingEditMode] = useState(false);
const [isChanged, setIsChanged] = useState(false);
const animRef = useAnimation();
const allText = t("statistical-information.all");
  // const employeesText = t("statistical-information.employees");
  const womenText = t("statistical-information.women");
  const adultsText = t("statistical-information.adults");
  return (
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
  )
}
