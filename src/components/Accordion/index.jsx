import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import styles from "./accordion.module.scss";

const CustomAccordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgb(66 148 255 / 6%)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function Accordion({ label, data = [] }) {
  const [expanded, setExpanded] = React.useState([]);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded((expandeds) => {
      if (!newExpanded) return expandeds.filter((ex) => ex != panel);
      return [...expandeds, panel];
    });
  };

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div>
        {data.map((item, index) => {
          const key = "panel" + index;
          return (
            <CustomAccordion
              key={key}
              expanded={expanded.indexOf(key) > -1}
              onChange={handleChange(key)}
            >
              <AccordionSummary
                aria-controls={key + "-content"}
                id={key + "-header"}
              >
                <Typography fontSize={18}>{item.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{item.description}</Typography>
              </AccordionDetails>
            </CustomAccordion>
          );
        })}
      </div>
    </div>
  );
}
