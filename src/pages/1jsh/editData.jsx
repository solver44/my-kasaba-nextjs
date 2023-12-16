import FormInput from "@/components/FormInput";
import { getDBOBT, getOPF, getOwnership, getSOATO } from "@/http/handbooks";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function EditData() {
  const { t } = useTranslation();
  const { bkutData = {} } = useSelector((states) => states);
  const st = bkutData.statistics || {};
  const [options, setOptions] = useState({});
  const [KTUTValue, setKTUT] = useState("");
  const [values, setValues] = useState({
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

  //   console.log(values);
  useEffect(() => {
    if (!bkutData.id) return;
  }, [bkutData]);

  async function initData() {
    getDBOBT().then((data) => {
      setOptions((opts) => ({
        ...opts,
        dbobt: data.map((current) => ({
          value: current.id,
          ktutCode: current.ktutCode,
          label: `${current.code || ""} ${current.nameUz || current.nameRu}`,
          labelRu: current.nameRu,
        })),
      }));
    });
    getSOATO().then((data) => {
      setOptions((opts) => ({
        ...opts,
        soato: data.map((current) => ({
          value: current.id,
          label: `${current.code || ""} ${current.nameUz || current.nameRu}`,
          labelRu: current.nameRu,
        })),
      }));
    });
    getOPF().then((data) => {
      setOptions((opts) => ({
        ...opts,
        txt: data.map((current) => ({
          value: current.id,
          label: `${current.code || ""} ${current.nameUz || current.nameRu}`,
          labelRu: current.nameRu,
        })),
      }));
    });
    getOwnership().then((data) => {
      setOptions((opts) => ({
        ...opts,
        msht: data.map((current) => ({
          value: current.id,
          label: `${current.code || ""} ${current.nameUz || current.nameRu}`,
          labelRu: current.nameRu,
        })),
      }));
    });
  }
  useEffect(() => {
    initData().then(() => {
      const el = bkutData.eLegalEntity;
      let dbibt = el.soogu;
      dbibt = {
        value: dbibt.id,
        ktutCode: dbibt.ktutCode,
        label: `${dbibt.code || ""} ${dbibt.nameUz || dbibt.nameRu}`,
        labelRu: dbibt.nameRu,
      };
      const soato = `${el.soato.code || ""} ${
        el.soato.nameUz || el.soato.nameRu
      }`;
      const opf = `${el.opf.code || ""} ${el.opf.nameUz || el.opf.nameRu}`;
      const ownership = `${el.ownership.code || ""} ${
        el.ownership.nameUz || el.ownership.nameRu
      }`;
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
  }, []);

  return (
    <div style={{ marginTop: 20 }} className="modal-content">
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
          autocomplete
          options={options.dbobt}
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
          autocomplete
          options={options.soato}
          value={values.soato}
          label={t("1sh.soato")}
        />
      </div>
      <div className="modal-row">
        <FormInput
          name="txt"
          required
          autocomplete
          options={options.txt}
          value={values.opf}
          label={t("1sh.txt")}
        />
        <FormInput
          name="msht"
          required
          autocomplete
          options={options.msht}
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
