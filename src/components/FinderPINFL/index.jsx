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
  disablePINFL,
  removeGivenDate = true,
  pinflValue = "",
  givenDate = "",
  style = {},
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

    // if (!forms.givenDate && !removeGivenDate) {
    //   setInputValidation((inputValidation) => ({
    //     ...inputValidation,
    //     givenDate: true,
    //   }));
    //   isValid = false;
    // }
    if (forms.pinfl?.length < 14) {
      setInputValidation((inputValidation) => ({
        ...inputValidation,
        pinfl: true,
      }));
      isValid = false;
    }
    if (!isValid) return;

    setLoading(true);
    const { data } = await fetchPINFL(forms.pinfl, "20-20-2020");
    setLoading(false);
    if (data === "") enqueueSnackbar(t("server-error"), { variant: "error" });
    else if (data?.success === false) {
      enqueueSnackbar(t("pinfl-not-found"), {
        variant: "error",
      });
      setInputValidation((inputValidation) => ({
        ...inputValidation,
        pinfl: true,
        pinflError: "pinfl-not-found",
      }));
      onFetch(false);
      return;
    } else if (!data?.success) {
      enqueueSnackbar(t("pinfl-fetch-error"), {
        variant: "error",
      });
      onFetch(false);
      return;
    } else {
      setInputValidation({ pinfl: false, givenDate: false });
    }
    onFetch({
      id: data?.data?.id,
      ...data?.data?.profile,
      experiences: data?.data?.experiences,
    });
  }
  return (
    <div style={style} className={styles.wrapper}>
      <FormInput
        required
        name="pinfl"
        disabled={disablePINFL && !!pinflValue}
        validationError={inputValidation?.pinflError}
        value={pinflValue}
        maxLength={14}
        label={t("pinfl")}
        invalid={inputValidation.pinfl}
        onChange={(e, name) =>
          setForms((forms) => ({ ...forms, [name]: e.target.value }))
        }
      />
      {/* {!removeGivenDate && (
        <FormInput
          date
          invalid={inputValidation.givenDate}
          onChange={(e, name) =>
            setForms((forms) => ({ ...forms, [name]: e.target.value }))
          }
          name="givenDate"
          label={t("passport-given-date")}
        />
      )} */}
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
