import useAnimation from "@/hooks/useAnimation";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Grow, Tab } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Tabs({ tabs = [] }) {
  const { t } = useTranslation();
  const [value, setValue] = useState("0");
  const [animate, setAnimate] = useState(true);
  function handleChange(_, value) {
    setAnimate(false);
    setValue(value);
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }
  const animRef = useAnimation();

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 1 }}>
          <TabList
            onChange={handleChange}
            variant="fullWidth"
            className="tab-main"
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={t(tab.label)} value={index + ""} />
            ))}
          </TabList>
        </Box>
        {tabs.map((tab, index) => (
          <Grow key={index} timeout={300} in={animate}>
            <TabPanel
              style={{ paddingRight: 0, paddingLeft: 0 }}
              key={index}
              value={index + ""}
            >
              {tab.children}
            </TabPanel>
          </Grow>
        ))}
      </TabContext>
    </Box>
  );
}
