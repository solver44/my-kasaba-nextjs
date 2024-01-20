import React, { useState } from "react";
import styles from "./finderSTIR.module.scss";
import { useTranslation } from "react-i18next";
import { SearchRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import FormInput from "../FormInput";
import { fetchSTIR } from "@/http/public";
import { useSnackbar } from "notistack";

export default function FinderSTIR({
  required,
  label,
  stirValue,
  onFetch = () => {},
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [forms, setForms] = useState({ tin: "" });
  const [inputValidation, setInputValidation] = useState({
    tin: false,
  });

  async function fetchData() {
    let isValid = true;

    if (forms.tin?.length < 9) {
      setInputValidation((inputValidation) => ({
        ...inputValidation,
        tin: true,
      }));
      isValid = false;
    }
    if (!isValid) return;

    setLoading(true);
    const { data } = await fetchSTIR(forms.tin);
    setLoading(false);
    if (data === "") enqueueSnackbar(t("server-error"), { variant: "error" });
    else if (data?.success === false) {
      enqueueSnackbar(t("stir-not-found"), {
        variant: "error",
      });
      onFetch(false);
      return;
    } else if (!data?.success) {
      enqueueSnackbar(t("pinfl-fetch-error"), {
        variant: "error",
      });
      onFetch(false);
      return;
    }
    setInputValidation({
      tin: false,
    });

    const d = data?.data;
    onFetch({
      ...d,
      companyBillingAddress: { streetName: d?.address, soato: d.city_soato },
      company: { name: d.company_name, address: d?.address },
    });
  }

  return (
    <div className={styles.wrapper}>
      <FormInput
        required
        name="tin"
        maxLength={9}
        value={stirValue}
        label={label ?? t("stir")}
        invalid={inputValidation.tin}
        onChange={(e, name) =>
          setForms((forms) => ({ ...forms, [name]: e.target.value }))
        }
      />
      <LoadingButton
        loading={loading}
        loadingPosition="start"
        onClick={fetchData}
        className={styles.btn}
        startIcon={<SearchRounded color="white" />}
      >
        {t("search")}
      </LoadingButton>
    </div>
  );
}
