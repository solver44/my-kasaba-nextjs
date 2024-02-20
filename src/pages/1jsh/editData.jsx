import FormInput from "@/components/FormInput";
import Group from "@/components/Group";
import {
  getDBOBT,
  getIFUT,
  getOPF,
  getOwnership,
  getSOATO,
  getXXTUT,
} from "@/http/handbooks";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function getOption(obj = {}) {
  if (!obj.id) return "";
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
  const isValid = useRef(false);
  const [values, setValues] = useState({
    date: st.date,
    bhutForm: st.bhutForm,
    dbibt: undefined,
    opf: undefined,
    soato: undefined,
    ifut: undefined,
    xxtut: undefined,
    mainActivity: undefined,
    receiverJsh: undefined,
    receiverAddress: undefined,
    colAgrAmount: st.colAgrAmount,
    colAgrFinishedAmount: st.colAgrFinishedAmount,
    seperateDepartments: st.seperateDepartments,
    signed: st.signed,
    spentColAgrSum: st.spentColAgrSum,
    employeesCount: st.employeesCount,
    spentColAgrSumAll: st.resultSpentAmount || 0,
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
    getIFUT().then((data) => {
      setOptions((opts) => ({
        ...opts,
        ifut: data.map((current) => getOption(current)),
      }));
    });
    getXXTUT().then((data) => {
      setOptions((opts) => ({
        ...opts,
        xxtut: data.map((current) => getOption(current)),
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
      let ifut = getOption(el?.oked);
      let xxtut = getOption(el?.okonx);
      const mainActivity = el.mainActivity;
      setValues((vals) => ({
        ...vals,
        dbibt,
        soato,
        opf,
        ownership,
        ifut,
        xxtut,
        mainActivity,
        receiverJsh: el.receiverJsh,
        receiverAddress: el.receiverAddress,
      }));
    });
  }, [bkutData]);
  function validValue(num) {
    return isNaN(num) || num == Infinity ? 0 : num;
  }

  function calculateSum({ target }, name) {
    const value = target.value;
    if (!isValid.current) return (isValid.current = true);
    if (name === "spentColAgrSum")
      setValues((vals) => ({
        ...vals,
        spentColAgrSum: value,
        spentColAgrSumAll: validValue((value / vals.employeesCount).toFixed(2)),
      }));
    else
      setValues((vals) => ({
        ...vals,
        employeesCount: value,
        spentColAgrSumAll: validValue((vals.spentColAgrSum / value).toFixed(2)),
      }));
  }

  return (
    <div style={{ marginTop: 20 }} className="modal-content left">
      <FormInput name="id" hidden value={currentReport.id} />
      <FormInput name="date" hidden value={values.date} />

      <div className="modal-row">
        <FormInput
          name="bhutForm"
          value="071002"
          disabled
          label={t("1sh.bhut")}
        />
        <FormInput
          name="forWho"
          value="Ўзбекистон касаба уюшмалари Федерацияси"
          disabled
          label={t("1sh.input8")}
        />
      </div>
      <div className="modal-row">
        <FormInput
          name="ktut"
          disabled
          value={KTUTValue}
          label={t("1sh.ktut")}
        />
        <FormInput
          name="receiverJsh"
          value={values.receiverJsh}
          label={t("1sh.input9")}
        />
      </div>
      <div className="modal-row">
        <FormInput
          name="stir"
          disabled
          value={bkutData.tin}
          label={t("1sh.stir")}
        />
        <FormInput
          name="receiverAddress"
          value={values.receiverAddress}
          label={t("1sh.input10")}
        />
      </div>
      <div className="modal-row">
        <FormInput
          name="xxtut"
          required
          select
          allowInputSelect
          dataSelect={options.xxtut}
          value={values.xxtut}
          label={t("1sh.xxtut")}
        />
        <FormInput
          name="input11"
          value={bkutData.eLegalEntity?.soogu?.nameUz || ""}
          disabled
          label={t("1sh.input11")}
        />
      </div>
      <div className="modal-row">
        <FormInput
          name="ifut"
          required
          select
          allowInputSelect
          dataSelect={options.ifut}
          value={values.ifut}
          label={t("1sh.ifut")}
        />
        <FormInput
          name="input12"
          value={bkutData.name || ""}
          disabled
          label={t("1sh.input12")}
        />
      </div>
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
          name="address2"
          value={bkutData.address || ""}
          disabled
          label={t("1sh.input10")}
        />
      </div>
      <div className="modal-row">
        <FormInput
          name="soato"
          required
          select
          allowInputSelect
          dataSelect={options.soato}
          value={values.soato}
          label={t("1sh.soato")}
        />
        <FormInput
          name="mainActivity"
          required
          value={values.mainActivity}
          label={t("1sh.mainActivity")}
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
          name="input13"
          value={bkutData.eLegalEntity?.opf?.nameUz || ""}
          disabled
          label={t("1sh.input13")}
        />
      </div>
      <div className="modal-row">
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

      <Group title={t("1sh.groupTitle")}>
        <div datatype="list">
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
              maxInput="colAgrAmount"
              required
              type="number"
              value={values.colAgrFinishedAmount}
              label={t("1sh.input2")}
            />
          </div>
          <div className="modal-row">
            <FormInput
              name="spentColAgrSum"
              required
              type="currency"
              value={values.spentColAgrSum || st.spentColAgrSum}
              onChange={calculateSum}
              label={t("1sh.input6")}
            />
            <FormInput
              name="employeesCount"
              required
              type="number"
              onChange={calculateSum}
              value={values.employeesCount || st.employeesCount}
              label={t("1sh.input7")}
            />
          </div>
          <FormInput
            name="spentColAgrSumAll"
            type="currency"
            disabled
            value={values.spentColAgrSumAll}
            label={t("1sh.input4")}
          />
          <div className="modal-row">
            <FormInput
              name="seperateDepartments"
              required
              type="number"
              value={values.seperateDepartments}
              label={t("1sh.input5")}
            />
            <FormInput
              name="signed"
              required
              type="number"
              value={values.signed}
              label={t("1sh.input3")}
            />
          </div>
        </div>
      </Group>
    </div>
  );
}
