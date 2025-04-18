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
     
        sx={{ ml: 2 }}
      >
        Export Data
      </Button>
      </Box>
    
    </Box>
  );
};

export default Header;
