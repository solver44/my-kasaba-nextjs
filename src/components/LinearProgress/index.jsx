import { Box, LinearProgress, Typography } from "@mui/material";
import React from "react";
import UploadIcon from "@mui/icons-material/Upload";

export default function LinearProgressWithLabel({ value = 0, label }) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "90%",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", mt: 3, }}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="h6" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Box>
  );
}
