import { TabContext, TabList, TabPanel } from "@mui/lab";
import { AppBar, Box, Grow, Tab } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./tabs.module.scss";

export default function Tabs({
  tabs = [],
  appBar,
  reverse,
  contentPadding,
  onChange,
  value: defaultValue = "",
  scrollContent,
  scrollable,
  color,
}) {
  const { t } = useTranslation();
  const [value, setValue] = useState(defaultValue + "" || "0");
  const [animate, setAnimate] = useState(true);
  const [customTabs, setCustomTabs] = useState(tabs);
  function handleChange(_, value) {
    setAnimate(false);
    setValue(value);
    if (onChange) onChange(value);
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }

  useEffect(() => {
    if (reverse) setCustomTabs(tabs.reverse());
    else setCustomTabs(tabs);
  }, [reverse, tabs]);

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
              {customTabs.map((tab, index) => (
                <Tab
                  style={scrollContent ? { overflowY: "auto" } : {}}
                  icon={tab?.icon}
                  iconPosition="start"
                  key={index}
                  className={styles.label}
                  label={t(tab.label)}
                  value={index + ""}
                />
              ))}
            </TabList>
          </AppBarCom>
        </Box>
        {tabs.map((tab, index) => (
          <Grow
            key={index}
            timeout={300}
            in={tab.disableAnimation ? true : animate}
          >
            <TabPanel
              style={
                contentPadding
                  ? { padding: 24 }
                  : { paddingRight: 0, paddingLeft: 0 }
              }
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
