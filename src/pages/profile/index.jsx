import React, { useRef, useState } from "react";
import HomeWrapper from "../home/wrapper";
import { useTranslation } from "react-i18next";
import styles from "./profile.module.scss";
import BigButton from "../../components/BigButton";
import EditIcon from "@mui/icons-material/Edit";
import ChangableInput from "../../components/ChangableInput";
import Profile from "../../components/Profile";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import useActions from "@/hooks/useActions";
import FormValidation from "@/components/FormValidation";
import { Close } from "@mui/icons-material";
import EditData from "../statistical-information/editData";
import EditProfile from "./editProfile";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { bkutData = {} } = useSelector((states) => states);
  const { application = {} } = bkutData;
  const { enqueueSnackbar } = useSnackbar();
  const [loadingEditMode, setLoadingEditMode] = useState(false);
  const [animRef] = useAutoAnimate();
  const currentData = useRef();
  const [editMode, setEditMode] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const actions = useActions();
  console.log(bkutData)

  async function saveBKUT(data) {
    if (!data) return;
    try {

      const requestData = {
        ...bkutData,
        id: bkutData.id,
        code: bkutData.code,
        soato: {
          id: data.district,
        },
        address: data.address,
        branch: {
          id: data.network,
        },
        eLegalEntity: {
          id: bkutData.eLegalEntity.id,
        },
        parent: {
          id: bkutData.parent.id,
        },
        applicationFile: applicationFileRef,
        protocolNumber: data.foundingDocNum,
        bkutType: data.bkutType,
        email: data.email,
        protocolFile: protocolFileRef,
        tin: data.bkutSTIR || bkutData.application.tin,
        phone: data.phoneNumber,
        protocolDate: data.foundingDocDate,
        name: data.bkutName,
      };

      const response = await sendEBKUT(requestData);

      if (response?.id) {
        setEditMode(false);
        enqueueSnackbar(t("successfully-saved"), { variant: "success" });
        actions.updateData();
      } else {
        enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(t("error-send-application"), { variant: "error" });
    } finally {
      setLoadingEditMode(false);
    }
  }

  return (
    <FormValidation
    onSubmit={saveBKUT}
    onChanged={(data) => {
      if (!currentData.current) {
        currentData.current = data;
        return;
      }
      if (areEqual(data, currentData.current)) setIsChanged(false);
      else setIsChanged(true);
    }}
    > 
      <div ref={animRef} className={styles.containers}>
      <div className={styles.top}>
        
        <p className={styles.subtitle}>{t("profile-page.title1")}</p>
        <div className={styles.editBtn}>
        {editMode && (
            <Button
              variant="text"
              onClick={() => {
                currentData.current = undefined;
                setIsChanged(false);
                setEditMode(false);
              }}
              startIcon={<Close />}
              disabled={loadingEditMode}
              type="button"
            >
              {t("leave")}
            </Button>
          )}
        {!editMode ? (
            <Button onClick={() => setEditMode(true)} startIcon={<EditIcon />}>
              {t("change")}
            </Button>
          ) : (
            <LoadingButton
              variant="contained"
              type="submit"
              disabled={!isChanged}
              startIcon={<EditIcon />}
              loading={loadingEditMode}
            >
              {t("save")}
            </LoadingButton>
          )}</div>
      </div>
      {!editMode ? (
      <div className={styles.grid}>
        <Profile imgOnly />
        <div className={styles.grid_column}>
          <ChangableInput
            label={t("first-name")}
            disabled
            value={application.passport?.firstName}
          />
          <ChangableInput
            label={t("second-name")}
            disabled
            value={application.passport?.lastName}
          />
          <ChangableInput
            label={t("third-name")}
            disabled
            value={application.passport?.middleName}
          />
          <ChangableInput label={t("nationality")}disabled value="O'zbek" />
        </div>
        <div className={styles.grid_column}>
          <ChangableInput label={t("birth-date")} disabled value={application.passport?.birthDate } />
          <ChangableInput label={t("stir")} disabled value={application.tin} />
          <ChangableInput label={t("birth-place")} disabled value="O'zbekiston" />
        </div>
        <div className={styles.grid_column}>
          <p>{t("address")}</p>
          <ChangableInput label={t("province")} disabled value="Toshkent shahar" />
          <ChangableInput label={t("district")} disabled value="Chilonzor" />
        </div>
        <div className={styles.grid_column}>
          <p>{t("contact-info")}</p>
          <ChangableInput label={t("phone-number")} disabled value={application.phone} />
          <ChangableInput label={t("email")} disabled value={application.email} />
        </div>
        <div className={styles.grid_column}>
          <p>{t("job-status")}</p>
          <ChangableInput label={t("job-place")} disabled value={bkutData.name} />
          <ChangableInput
            label={t("job-position")}
            disabled
            value={t("employees.chairman")}
          />
        </div>
        </div>
        ) : (<EditProfile/>)}
      </div>
    </FormValidation>
  );
}

ProfilePage.layout = function (Component, t) {
  return (
    <HomeWrapper title={t("profile-page.title")} desc={t("profile-page.desc")}>
      {Component}
    </HomeWrapper>
  );
};
