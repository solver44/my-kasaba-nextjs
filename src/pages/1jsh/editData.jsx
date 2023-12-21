import FormInput from "@/components/FormInput";
import { getDBOBT, getOPF, getOwnership, getSOATO } from "@/http/handbooks";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function getOption(obj = {}) {
  return {
    value: obj.id,
    ktutCode: obj.ktutCode,
    label: `${obj.code || ""} ${obj.nameUz || obj.nameRu}`,
    labelRu: obj.nameRu,
  };
}

export default function EditData({ currentReport = {} }) {
  const { t } = useTranslation();
  const { bkutData = {} } = useSelector((states) => states);
  const st = currentReport || {};
  const [options, setOptions] = useState({});
  const [KTUTValue, setKTUT] = useState("");
  const [values, setValues] = useState({
    date: st.date,
    bhutForm: st.bhutForm,
    xxtutForm: st.xxtutForm,
    ifutForm: st.ifutForm,
    dbibt: undefined,
    opf: undefined,
    soato: undefined,
    mainActivity: undefined,
    colAgrAmount: st.colAgrAmount,
    colAgrFinishedAmount: st.colAgrFinishedAmount,
    includingLaborCommission: st.includingLaborCommission,
    includingLaborConsidered: st.includingLaborConsidered,
    includingLaborSolved: st.includingLaborSolved,
    spentColAgrSum: st.spentColAgrSum,
  });

  async function initData() {
    getDBOBT().then((data) => {
      setOptions((opts) => ({
        ...opts,
        dbobt: data.map((current) => getOption(current)),
      }));
    });
    getSOATO().then((data) => {
      setOptions((opts) => ({
        ...opts,
        soato: data.map((current) => getOption(current)),
      }));
    });
    getOPF().then((data) => {
      setOptions((opts) => ({
        ...opts,
        txt: data.map((current) => getOption(current)),
      }));
    });
    getOwnership().then((data) => {
      setOptions((opts) => ({
        ...opts,
        msht: data.map((current) => getOption(current)),
      }));
    });
  }
  useEffect(() => {
    if (!bkutData.id) return;

    initData().then(() => {
      const el = bkutData?.eLegalEntity || {};
      let dbibt = getOption(el?.soogu);
      let soato = getOption(el?.soato);
      let opf = getOption(el?.opf);
      let ownership = getOption(el?.ownership);
      const mainActivity = el.mainActivity;
      setValues((vals) => ({
        ...vals,
        dbibt,
        soato,
        opf,
        ownership,
        mainActivity,
      }));
    });
  }, [bkutData]);

  return (
    <div style={{ marginTop: 20 }} className="modal-content">
      <FormInput name="id" hidden value={currentReport.id} />
      <FormInput name="date" hidden value={values.date} />
      <FormInput
        name="stir"
        disabled
        value={bkutData.tin}
        label={t("1sh.stir")}
      />
      <div className="modal-row">
        <FormInput
          name="dbibt"
          required
          select
          allowInputSelect
          dataSelect={options.dbobt}
          value={values.dbibt}
          onChange={({ target }) => {
            const data = target.value;
            setKTUT(data.ktutCode);
          }}
          label={t("1sh.dbibt")}
        />
        <FormInput
          name="ktut"
          required
          disabled
          value={KTUTValue}
          label={t("1sh.ktut")}
        />
      </div>
      <div className="modal-row">
        <FormInput
          name="bhutForm"
          required
          value={values.bhutForm}
          label={t("1sh.bhut")}
        />
        <FormInput
          name="xxtutForm"
          required
          value={values.xxtutForm}
          label={t("1sh.xxtut")}
        />
      </div>
      <div className="modal-row">
        <FormInput
          name="ifutForm"
          required
          value={values.ifutForm}
          label={t("1sh.ifut")}
        />
        <FormInput
          name="soato"
          required
          select
          allowInputSelect
          dataSelect={options.soato}
          value={values.soato}
          label={t("1sh.soato")}
        />
      </div>
      <div className="modal-row">
        <FormInput
          name="txt"
          required
          select
          allowInputSelect
          dataSelect={options.txt}
          value={values.opf}
          label={t("1sh.txt")}
        />
        <FormInput
          name="msht"
          required
          select
          allowInputSelect
          dataSelect={options.msht}
          value={values.ownership}
          label={t("1sh.msht")}
        />
      </div>
      <FormInput
        name="mainActivity"
        required
        value={values.mainActivity}
        label={t("1sh.mainActivity")}
      />
      <div className="modal-row">
        <FormInput
          name="colAgrAmount"
          required
          type="number"
          value={values.colAgrAmount}
          label={t("1sh.input1")}
        />
        <FormInput
          name="colAgrFinishedAmount"
          required
          type="number"
          value={values.colAgrFinishedAmount}
          label={t("1sh.input2")}
        />
      </div>
      <FormInput
        name="includingLaborCommission"
        required
        type="number"
        value={values.includingLaborCommission}
        label={t("1sh.input3")}
      />
      <div className="modal-row">
        <FormInput
          name="includingLaborConsidered"
          required
          type="number"
          value={values.includingLaborConsidered}
          label={t("1sh.input4")}
        />
        <FormInput
          name="includingLaborSolved"
          required
          type="number"
          value={values.includingLaborSolved}
          label={t("1sh.input5")}
        />
      </div>
      <FormInput
        name="spentColAgrSum"
        required
        type="number"
        value={values.spentColAgrSum}
        label={t("1sh.input6")}
      />
    </div>
  );
}
