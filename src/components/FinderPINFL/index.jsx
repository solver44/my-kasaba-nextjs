import React, { useState } from "react";
import styles from "./finderPINFL.module.scss";
import { useTranslation } from "react-i18next";
import { SearchRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import FormInput from "../FormInput";
import { fetchPINFL } from "@/http/public";
import { useSnackbar } from "notistack";

export default function FinderPINFL({
  required,
  pinflValue = "",
  givenDate = "",
  onFetch = () => {},
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [forms, setForms] = useState({ pinfl: pinflValue, givenDate });
  const [inputValidation, setInputValidation] = useState({
    pinfl: false,
    givenDate: false,
  });

  async function fetchData() {
    let isValid = true;

    if (!forms.givenDate) {
      setInputValidation((inputValidation) => ({
        ...inputValidation,
        givenDate: true,
      }));
      isValid = false;
    }
    if (forms.pinfl?.length < 14) {
      setInputValidation((inputValidation) => ({
        ...inputValidation,
        pinfl: true,
      }));
      isValid = false;
    }
    if (!isValid) return;

    setLoading(true);
    const { data } = await fetchPINFL(forms.pinfl, forms.givenDate);
    setLoading(false);
    if (!data?.success) {
      enqueueSnackbar(t("pinfl-fetch-error"), {
        variant: "error",
      });
      onFetch(false);
      return;
    }
    onFetch(data?.data);
  }
  return (
    <div className={styles.wrapper}>
      <FormInput
        required
        name="pinfl"
        value={pinflValue}
        label={t("pinfl")}
        invalid={inputValidation.pinfl}
        onChange={(e, name) =>
          setForms((forms) => ({ ...forms, [name]: e.target.value }))
        }
      />
      <FormInput
        date
        invalid={inputValidation.givenDate}
        onChange={(e, name) =>
          setForms((forms) => ({ ...forms, [name]: e.target.value }))
        }
        name="givenDate"
        label={t("passport-given-date")}
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
