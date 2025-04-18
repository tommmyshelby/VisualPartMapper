import React from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button, // ✅ import this!
} from "@mui/material";
import useMapperStore from "../store/store";

const Header: React.FC = () => {
  const { views, selectedView, setSelectedView } = useMapperStore();

  // ✅ Updated the event type to SelectChangeEvent
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedView(event.target.value);
  };
  const handleExport = async () => {
    try {
      const state = useMapperStore.getState();
      const exportData = state.exportData();

      if (!exportData) return;

      const formData = new FormData();

      // 1. Append all image files
      exportData.views.forEach((view) => {
        const imageFile = state.images[view.viewName]?.file;
        if (imageFile) {
          formData.append("images", imageFile, imageFile.name);
        }
      });

      // 2. Append JSON data as a file (better for backend handling)
      const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      formData.append("metadata", jsonBlob, `export-${Date.now()}.json`);

      // 3. Send to backend
      const response = await fetch("http://localhost:3000/upload/export", {
        method: "POST",
        body: formData,
        // Headers are automatically set by FormData
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      // 4. Handle successful export
      const result = await response.json();
      console.log("Export successful:", result);
      alert("Export completed successfully!");

      // Optional: Download the zip file if returned
      if (result.downloadUrl) {
        window.open(result.downloadUrl, "_blank");
      }
    } catch (error: any) {
      console.error("Export error:", error);
      alert(`Export failed: ${error.message}`);
    }
  };

  return (
    <Box
      sx={{
     
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 1,
        borderBottom: "1px solid #e0e0e0",
        background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800, // bold
          fontSize: "1.5rem", // custom size
          color: "text.primary",
        }}
      >
        Visual Part Mapper
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="view-select-label">View</InputLabel>
          <Select
            labelId="view-select-label"
            value={selectedView}
            onChange={handleChange}
            label="View"
          >
            {views.map((view) => (
              <MenuItem key={view} value={view}>
                {view}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
        variant="contained"
        color="primary"
        onClick={handleExport}
        sx={{ ml: 2 }}
      >
        Export Data
      </Button>
      </Box>
    
    </Box>
  );
};

export default Header;
