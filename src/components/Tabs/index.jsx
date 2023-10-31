import { TabContext, TabList, TabPanel } from "@mui/lab";
import { AppBar, Box, Grow, Tab } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Tabs({
  tabs = [],
  appBar,
  contentPadding,
  onChange,
  value: defaultValue,
  scrollable,
  color,
}) {
  const { t } = useTranslation();
  const [value, setValue] = useState(defaultValue + "" || "0");
  const [animate, setAnimate] = useState(true);
  function handleChange(_, value) {
    setAnimate(false);
    setValue(value);
    if (onChange) onChange(value);
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }

  const AppBarCom = appBar ? AppBar : "div";

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 1 }}>
          <AppBarCom color="transparent" position="sticky">
            <TabList
              indicatorColor={color}
              textColor="inherit"
              onChange={handleChange}
              variant={scrollable ? "scrollable" : "fullWidth"}
              className="tab-main"
            >
              {tabs.map((tab, index) => (
                <Tab key={index} label={t(tab.label)} value={index + ""} />
              ))}
            </TabList>
          </AppBarCom>
        </Box>
        {tabs.map((tab, index) => (
          <Grow key={index} timeout={300} in={animate}>
            <TabPanel
              style={contentPadding ? {} : { paddingRight: 0, paddingLeft: 0 }}
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
