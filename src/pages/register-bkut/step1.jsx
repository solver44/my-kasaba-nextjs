import React, { useEffect, useState } from "react";
import styles from "./registerBkut.module.scss";
import { useTranslation } from "react-i18next";
import RadioGroups from "../../components/RadioGroup";
import { useSnackbar } from "notistack";
import { getBranches, getDistricts, getRegions } from "@/http/public";
import { getLocalizationNames } from "@/utils/data";
import FormInput from "@/components/FormInput";

export default function Step1({ bkutData = {}, isOrganization, canChange }) {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState(false);
  const [provinces, setProvinces] = useState();
  const [districts, setDistricts] = useState();
  const [branches, setBranches] = useState();
  const [values, setValues] = useState({
    provinceId: "",
    districtId: "",
    branchId: "",
  });

  useEffect(() => {
    let soato = bkutData?.soato?.id;
    if (!soato) return;
    soato += "";
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
        </div>
        <RadioGroups
          defaultValue={false}
          value={bkutData?.isLegalEntity}
          name="isLegalEntity"
          onChange={(e) => {
            setMode(JSON.parse(e.target.value));
          }}
          label={t("bkutType1")}
          data={[
            {
              value: true,
              label: t("yes"),
            },
            {
              value: false,
              label: t("no"),
            },
          ]}
        />
        {mode && (
          <FormInput
            required
            maxLength={9}
            name="bkutSTIR"
            value={bkutData?.application?.tin}
            label={t("bkutSTIR1")}
          />
        )}
        <FormInput
          required
          disabled
          name="seniorOrganization"
          label={t("seniorOrganization")}
          value={bkutData?.parent?.legalEntity?.name}
        />

        <FormInput
          required
          disabled={!canChange || isOrganization}
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
          value={bkutData?.address}
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
          value={bkutData.email}
          name="email"
        />
      </div>
    </div>
  );
}
