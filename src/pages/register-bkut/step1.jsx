import React, { useEffect, useState } from "react";
import styles from "./registerBkut.module.scss";
import { useTranslation } from "react-i18next";
import RadioGroups from "../../components/RadioGroup";
import { useSnackbar } from "notistack";
import { getBranches, getDistricts, getRegions } from "@/http/public";
import { getLocalizationNames } from "@/utils/data";
import FormInput from "@/components/FormInput";

export default function Step1({ bkutData = {}, canChange }) {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState(0);
  const [provinces, setProvinces] = useState();
  const [districts, setDistricts] = useState();
  const [branches, setBranches] = useState();
  const [values, setValues] = useState({
    provinceId: "",
    districtId: "",
    branchId: "",
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const soato = bkutData.eLegalEntity?.soatoDistrict?.id;
    if (!soato) return;
    const provinceId = soato.slice(0, 4);
    const districtId = soato;
    handleProvince({ target: { value: provinceId } });
    setValues({ provinceId, districtId, branchId: bkutData.branch?.id });
  }, [bkutData]);

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
          <FormInput
            required
            name="bkutName"
            label={t("bkutName1")}
            value={bkutData.name}
          />
          {mode == 1 && (
            <FormInput
              required
              maxLength={9}
              name="bkutSTIR"
              value={bkutData?.application?.tin}
              label={t("bkutSTIR1")}
            />
          )}
        </div>
        <RadioGroups
          defaultValue={0}
          value={bkutData?.bkutType ?? 0}
          name="bkutType"
          onChange={(e) => {
            setMode(e.target.value);
          }}
          label={t("bkutType1")}
          data={[
            {
              value: "1",
              label: t("yes"),
            },
            {
              value: "0",
              label: t("no"),
            },
          ]}
        />
        <FormInput
          required
          disabled={!canChange}
          name="seniorOrganization"
          label={t("seniorOrganization")}
          value={getLocalizationNames(bkutData?.parent, i18n)}
        />
        <FormInput
          required
          disabled={!canChange}
          select
          name="network"
          value={values.branchId}
          dataSelect={branches}
          label={t("network")}
        />
      </div>
      <div className={styles.grid_column}>
        <div className="row g-3 full-children">
          <FormInput
            required
            select
            disabled={!canChange}
            dataSelect={provinces}
            name="province"
            value={values.provinceId}
            onChange={handleProvince}
            label={t("province")}
          />
          <FormInput
            required
            select
            disabled={!canChange}
            dataSelect={districts}
            value={values.districtId}
            name="district"
            label={t("district")}
          />
        </div>
        <FormInput
          required
          name="address"
          label={t("address")}
          value={bkutData.eLegalEntity?.address}
        />
        <FormInput
          required
          name="phoneNumber"
          label={t("phone-number")}
          value={bkutData.phone}
          useMask
        />
        <FormInput
          required
          label={t("email")}
          value={bkutData.application?.email}
          name="email"
        />
      </div>
    </div>
  );
}
