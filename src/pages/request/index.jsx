"use client";
import styles from "./request.module.scss";
import React, { useEffect, useRef, useState } from "react";
import logo from "public/kasaba-logo.svg";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/LanguageSelector";
import Input from "../../components/Input";
import InputButton from "../../components/InputButton";
import useActions from "../../hooks/useActions";
import InputDate from "../../components/InputDate";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { fetchPINFL, fetchSTIR } from "@/http/public";
import dayjs from "dayjs";
import {
  getBranches,
  getDistricts,
  getRegions,
  sendApplicationViaBack,
} from "@/http/public";
import DropDown from "@/components/DropDown";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import Reglament from "@/components/Reglament";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function RequestPage({ router }) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [provinces, setProvinces] = useState();
  const [districts, setDistricts] = useState();
  const [branches, setBranches] = useState();
  const [formData, setFormData] = useState({
    pinfl: "",
    passportGivenDate: "",
    firstName: "",
    secondName: "",
    thirdName: "",
    birthDate: null,
    phoneNumber: "",
    email: "",
    inn: "",
    name: "",
    province: "",
    district: "",
    address: "",
    form3: "",
    form4: "",
  });
  const [inputValidation, setInputValidation] = useState({
    pinfl: true,
    passportGivenDate: true,
    firstName: true,
    secondName: true,
    thirdName: true,
    birthDate: true,
    phoneNumber: true,
    email: true,
    inn: true,
    name: true,
    province: true,
    district: true,
    address: true,
    form3: true,
    form4: true,
  });
  const [isReglament, setIsReglament] = useState(false);
  const { caches } = useSelector((state) => state);
  const actions = useActions();

  const initializeRecaptcha = () => {
    if (window.grecaptcha && window.grecaptcha.render) {
      try {
        // Initialize reCAPTCHA after the script has loaded
        window.grecaptcha.render("recaptcha-container", {
          sitekey: "6LeWaT4oAAAAAMCtmf03tyxo495eGt_J2xpn_fzp",
          // Other reCAPTCHA options here
        });
      } catch (error) {}
    } else {
      // Retry initialization after a short delay
      setTimeout(initializeRecaptcha, 100);
    }
  };
  function reloadCaptcha() {
    if (window.grecaptcha && window.grecaptcha.reset) {
      window.grecaptcha.reset();
    }
  }
  useEffect(() => {
    initializeRecaptcha();
    if (localStorage.getItem("reglementViewed")) {
      setIsReglament(false);
    } else {
      setIsReglament(true);
    }
  }, []);
  function hideReglament() {
    setIsReglament(false);
    localStorage.setItem("reglementViewed", 1);
  }

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

  const handleProvince = async (e, name) => {
    const regionId = e.target.value;
    if (!regionId) return;
    const data = await getDistricts(regionId);
    setFormData((formData) => ({ ...formData, [name]: regionId }));
    setDistricts(
      data.map((current) => ({
        value: current.id,
        label: current.nameUz,
        labelRu: current.nameRu,
      }))
    );
  };

  const handleInputChange = (event, name) => {
    const { value } = event.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Check reCAPTCHA response
    const recaptchaResponse = grecaptcha.getResponse();
    // Check if any input is invalid
    let isAnyInvalid = false;
    Object.values(formData).map((isValid, index) => {
      const key = Object.keys(inputValidation)[index];
      if (!isValid) {
        if (key === "form4" || key === "form3") return;
        setInputValidation((inputValidation) => ({
          ...inputValidation,
          [key]: false,
        }));
        isAnyInvalid = true;
      } else {
        setInputValidation((inputValidation) => ({
          ...inputValidation,
          [key]: true,
        }));
      }
    });
    if (isAnyInvalid || !recaptchaResponse) {
      if (!recaptchaResponse)
        enqueueSnackbar(t("recaptcha-error"), {
          variant: "error",
        });
      if (isAnyInvalid)
        enqueueSnackbar(t("error-form-application"), { variant: "error" });
      return;
    }
    actions.showLoading(true);
    const branchId = formData?.form3 || null;
    const data = await sendApplicationViaBack(
      {
        pinfl: formData.pinfl,
        tin: formData.inn,
        phone: formData.phoneNumber,
        givenDate: formData.passportGivenDate,
        soatoId: formData.district,
        branchId,
        email: formData.email,
        comment: formData.form4,
      },
      recaptchaResponse
    );
    actions.showLoading(false);
    if (data?.success) {
      actions.caches({
        sent: true,
        fio: `${formData.firstName} ${formData.secondName} ${formData.thirdName}`,
        id: data.statusCheckCode,
      });
    } else if (data?.error == "reCAPTCHA verification failed") {
      reloadCaptcha();
      enqueueSnackbar(t("recaptcha-try"), { variant: "error" });
    } else {
      enqueueSnackbar(t("error-send-application"), { variant: "error" });
      reloadCaptcha();
    }
  };

  function resetValidation() {
    // Reset the input validation statuses
    setInputValidation({
      pinfl: true,
      passportGivenDate: true,
      firstName: true,
      secondName: true,
      thirdName: true,
      birthDate: true,
      phoneNumber: true,
      email: true,
      inn: true,
      name: true,
      province: true,
      district: true,
      address: true,
      form3: true,
      form4: true,
    });
  }

  function responsePINFL(data, status) {
    if (!data?.success) {
      setInputValidation((inputValidation) => ({
        ...inputValidation,
        passportGivenDate: false,
      }));
      return;
    }
    resetValidation();

    const personData = data?.data;
    setFormData((formData) => ({
      ...formData,
      firstName: personData.first_name,
      secondName: personData.last_name,
      thirdName: personData.middle_name,
      birthDate: dayjs(personData.birth_date),
    }));
  }

  async function responseSTIR(data, status) {
    if (!data?.success) {
      setInputValidation((inputValidation) => ({
        ...inputValidation,
        inn: false,
      }));
      return;
    }
    const entityData = data?.data;

    let soato = entityData.companyBillingAddress.soato;
    if (soato) {
      soato = soato + "";
      const provinceId = soato.slice(0, 4);
      const districtId = soato;
      await handleProvince({ target: { value: provinceId } });
      setFormData((formData) => ({
        ...formData,
        province: provinceId,
        district: districtId,
      }));
    }
    setInputValidation((inputValidation) => ({
      ...inputValidation,
      inn: true,
    }));

    setFormData((formData) => ({
      ...formData,
      name: entityData.company.name,
      address: entityData.companyBillingAddress.streetName,
    }));
  }

  return (
    <WrapperRequest
      toBack={caches?.sent}
      onClickLink={() => {
        setIsReglament(true);
      }}
      isReglament={isReglament}
      onBack={() => {
        actions.caches({ ...caches, sent: false });
      }}
    >
      {isReglament ? (
        <Reglament
          title="homePage.title"
          message="homePage.message"
          onClick={hideReglament}
          buttonText="homePage.send"
        />
      ) : caches?.sent ? (
        <RequestHasBeenSent />
      ) : (
        <React.Fragment>
          <p className="title bold mb-1">{t("request-page.subtitle")}</p>
          <div className={styles.content}>
            <p style={{ marginTop: 30 }} className={styles.title}>
              {t("request-page.form1-title")}
            </p>
            <InputButton
              validationError={"input-error.pinfl"}
              name="pinfl"
              maxLength={14}
              request={(value) => {
                if (!formData.passportGivenDate) {
                  setInputValidation((inputValidation) => ({
                    ...inputValidation,
                    passportGivenDate: false,
                  }));
                  return;
                } else {
                  setInputValidation((inputValidation) => ({
                    ...inputValidation,
                    passportGivenDate: true,
                  }));
                }
                return fetchPINFL(value, formData.passportGivenDate);
              }}
              invalid={!inputValidation.pinfl}
              onResponse={responsePINFL}
              onChange={handleInputChange}
              fullWidth
              titleText={t("pinfl")}
              buttonText={t("check")}
            />
            <InputDate
              name="passportGivenDate"
              fullWidth
              invalid={!inputValidation.passportGivenDate}
              validationError={"input-error.date"}
              onChange={handleInputChange}
              titleText={t("passport-given-date")}
            />
            <Input
              name="firstName"
              fullWidth
              value={formData.firstName}
              invalid={!inputValidation.firstName}
              onChange={handleInputChange}
              titleText={t("first-name")}
            />
            <Input
              name="secondName"
              fullWidth
              value={formData.secondName}
              invalid={!inputValidation.secondName}
              onChange={handleInputChange}
              titleText={t("second-name")}
            />
            <Input
              name="thirdName"
              fullWidth
              value={formData.thirdName}
              invalid={!inputValidation.thirdName}
              onChange={handleInputChange}
              titleText={t("third-name")}
            />
            <InputDate
              name="birthDate"
              fullWidth
              value={formData.birthDate}
              invalid={!inputValidation.birthDate}
              onChange={handleInputChange}
              titleText={t("birth-date")}
            />
            <Input
              name="phoneNumber"
              fullWidth
              value={formData.phoneNumber}
              invalid={!inputValidation.phoneNumber}
              useMask
              onChange={handleInputChange}
              titleText={t("phone-number")}
            />
            <Input
              name="email"
              fullWidth
              value={formData.email}
              invalid={!inputValidation.email}
              emailRequired
              onChange={handleInputChange}
              titleText={t("email")}
            />
            <p style={{ marginTop: 20 }} className={styles.title}>
              {t("request-page.form2-title")}
            </p>
            <InputButton
              fullWidth
              name="inn"
              request={fetchSTIR}
              invalid={!inputValidation.inn}
              onResponse={responseSTIR}
              maxLength={9}
              onChange={handleInputChange}
              titleText={t("stir")}
              buttonText={t("check")}
            />
            <Input
              fullWidth
              name="name"
              value={formData.name}
              invalid={!inputValidation.name}
              onChange={handleInputChange}
              titleText={t("name")}
            />
            <DropDown
              fullWidth
              name="province"
              data={provinces}
              onChange={handleProvince}
              invalid={!inputValidation.province}
              value={formData.province}
              titleText={t("province")}
            />
            <DropDown
              name="district"
              fullWidth
              data={districts}
              value={formData.district}
              invalid={!inputValidation.district}
              onChange={handleInputChange}
              titleText={t("district")}
            />
            <Input
              name="address"
              fullWidth
              value={formData.address}
              invalid={!inputValidation.address}
              onChange={handleInputChange}
              titleText={t("address")}
            />
            <div style={{ padding: "5px 0" }}></div>
            <span>
              <DropDown
                name="form3"
                fullWidth
                data={branches}
                value={formData.form3}
                invalid={!inputValidation.form3}
                onChange={handleInputChange}
                titleText={t("request-page.form3-title")}
              />
            </span>
            <span>
              <Input
                name="form4"
                fullWidth
                value={formData.form4}
                onChange={handleInputChange}
                textarea
                titleText={t("request-page.form4-title")}
              />
            </span>
            <div className={styles.bottom}>
              <div id="recaptcha-container"></div>
              <button onClick={handleSubmit} className="primary-btn">
                {t("request-page.submit")}
              </button>
            </div>
          </div>
        </React.Fragment>
      )}
    </WrapperRequest>
  );
}
const RequestHasBeenSent = ({}) => {
  const { t } = useTranslation();
  const { caches: state } = useSelector((state) => state);
  return (
    <div className="center">
      <div
        className="card"
        dangerouslySetInnerHTML={{
          __html: t("request-page.sent", { fio: state?.fio, id: state?.id }),
        }}
      ></div>
    </div>
  );
};
export const WrapperRequest = ({
  children,
  isReglament,
  onClickLink,
  toBack,
  onBack,
}) => {
  const [parentAnimation] = useAutoAnimate();
  const { t } = useTranslation();
  const navigate = useRouter();
  const onBackFunc = () => {
    if (onBack) onBack();
    else navigate.replace("/request");
  };
  return (
    <div ref={parentAnimation} className={"wrapper " + styles.wrapper}>
      <div className={styles.top}>
        <div className={styles.row}>
          <Image className="logo" src={logo} alt="logo kasaba" />
          <h2 className="title">{t("request-page.title")}</h2>
          {!isReglament && (
            <p onClick={onClickLink} className={styles.link}>
              {t("reglament")}
            </p>
          )}
        </div>
        <div className={styles.row}>
          <LanguageSelector />
          <Link href="/auth">{t("loginTitle")}</Link>
        </div>
      </div>
      {toBack && (
        <div onClick={onBackFunc} className={styles.back}>
          {t("back")}
        </div>
      )}
      {children}
    </div>
  );
};
