import { Box, Typography, LinearProgress } from "@mui/material";
import React from "react";
import useMapperStore from "../store/store";

const StatusBar: React.FC = () => {
  // Get state from store
  const {
    selectedView,
    getCurrentViewMode,
    getCurrentViewParts,
    getCurrentPartIndex,
    getNextUnmappedPart,
  } = useMapperStore();

  // Derive status information
  const currentMode = getCurrentViewMode();
  const currentParts = getCurrentViewParts();
  const currentPartIndex = getCurrentPartIndex();
  const nextUnmappedPart = getNextUnmappedPart();

  // Calculate mapping progress
  const mappedCount = currentParts.filter((p) => p.status === "mapped").length;
  const totalParts = currentParts.length;
  const progress =
    totalParts > 0 ? Math.round((mappedCount / totalParts) * 100) : 0;

  // Get color based on current mode
  const getModeColor = () => {
    switch (currentMode) {
      case "initial":
        return "text.disabled";
      case "mapping":
        return "primary.main";
      case "complete":
        return "success.main";
      default:
        return "text.secondary";
    }
  };

  // Determine status message based on mode
  const getStatusMessage = () => {
    if (!selectedView) return "No view selected";

    switch (currentMode) {
      case "initial":
        return "Upload an image to begin";
      case "mapping":
        if (currentPartIndex < currentParts.length) {
          const currentPart = currentParts[currentPartIndex];
          return `Mapping {${currentPart.partName }}` 
        } else if (nextUnmappedPart) {
          return "Ready to continue mapping - Click on next location";
        } else {
          return "All parts mapped!";
        }
      case "complete":
        return "Mapping complete";
      default:
        return "Ready";
    }
  };

  // Render appropriate action button based on mode

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight:"8%",
        px: 2,
        py: 1,
        m: 1,
        background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
        boxShadow: `
        3px 3px 6px #c1c1c1,
        3px 3px 6px #ffffff
      `,
        gap: 1,
        backdropFilter: "blur(2px)",
        borderRadius: 1,
        border:1,
        borderColor:"rgb(183, 181, 181)",
      }}
    >
      <Typography
        variant="body2"
        color="text.primary"
        sx={{ minWidth: 200, fontWeight: 600,
          fontSize: { 
            xs: "0.75rem", 
            sm: "0.8rem", 
            md: "0.875rem" 
          }}}
      >
        Status: {getStatusMessage()}
      </Typography>

      {currentMode === "mapping" && totalParts > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "100%",
            maxWidth: 300,
            background: "#fff",
            borderRadius: "999px",
            px: 1,
            py: 0.5,
            boxShadow: `
            inset 1px 1px 2px #d1d1d1,
            inset -1px -1px 2px #ffffff
          `,
          }}
        >
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ whiteSpace: "nowrap", fontWeight: 600,
              fontSize: { 
                xs: "0.75rem", 
                sm: "0.8rem", 
                md: "0.875rem" 
              }}}
          >
            Progress: {mappedCount}/{totalParts}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              width: "100%",
              borderRadius: 5,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                background: "linear-gradient(to right, #00c6ff, #0072ff)",
              },
            }}
          />
        </Box>
      )}

      <Typography
        variant="body2"
        sx={{ fontWeight: 800, color: getModeColor() }}
      >
        Mode: {currentMode}
      </Typography>
    </Box>
  );
};

export default StatusBar;
