import React, { useEffect, useState } from "react";
import styles from "./registerBkut.module.scss";
import ChangableInput from "../../components/ChangableInput";
import { useTranslation } from "react-i18next";
import RadioGroups from "../../components/RadioGroup";
import { useSnackbar } from "notistack";
import { getBranches, getDistricts, getRegions } from "@/http/public";

export default function Step1() {
  const { t } = useTranslation();
  const [mode, setMode] = useState(0);
  const [provinces, setProvinces] = useState();
  const [districts, setDistricts] = useState();
  const [branches, setBranches] = useState();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      let dataProvinces = await getRegions();
      setProvinces(
        (dataProvinces || []).map((current) => ({
          value: current.id,
          label: current.nameUz,
          labelRu: current.nameRu,
        }))
      );
      let dataBranches = await getBranches();
      setBranches(
        (dataBranches || []).map((current) => ({
          value: current.id,
          label: current.nameUz,
          labelRu: current.nameRu,
        }))
      );
    };
    fetchData();
  }, []);

  const handleProvince = async (e) => {
    const regionId = e.target.value;
    if (!regionId) return;
    const data = await getDistricts(regionId);
    setDistricts(
      data.map((current) => ({
        value: current.id,
        label: current.nameUz,
        labelRu: current.nameRu,
      }))
    );
  };

  return (
    <div className={styles.grid}>
      <div className={styles.grid_column}>
        <div className="row g-3 full-children">
          <ChangableInput name="bkutName" label={t("bkutName")} editable />
          {mode == 1 && (
            <ChangableInput
              maxLength={9}
              name="bkutSTIR"
              label={t("bkutSTIR")}
              editable
            />
          )}
        </div>
        <RadioGroups
          defaultValue={0}
          name="bkutType"
          onChange={(e) => setMode(e.target.value)}
          label={t("bkutType")}
          data={[
            {
              value: "0",
              label: t("team"),
            },
            {
              value: "1",
              label: t("legal"),
            },
          ]}
        />
        <ChangableInput label={t("seniorOrganization")} editable />
        <ChangableInput
          select
          dataSelect={branches}
          label={t("network")}
          editable
        />
      </div>
      <div className={styles.grid_column}>
        <div className="row g-3 full-children">
          <ChangableInput
            select
            dataSelect={provinces}
            name="province"
            onChange={handleProvince}
            label={t("province")}
            editable
          />
          <ChangableInput
            select
            dataSelect={districts}
            label={t("district")}
            editable
          />
        </div>
        <ChangableInput label={t("address")} editable />
        <ChangableInput label={t("phone-number")} useMask editable />
        <ChangableInput label={t("email")} name="email" editable />
      </div>
    </div>
  );
}
