import { useMemo } from "react";
import {
  Box,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody
} from "@mui/material";
import useMapperStore from "../store/store";
import { useShallow } from "zustand/shallow";
import { MarkerStatus } from "../interface/interfaces";

export const SideBar = () => {
  const { partsByView, selectedView } = useMapperStore(
    useShallow((state) => ({
      partsByView: state.partsByView,
      selectedView: state.selectedView,
    }))
  );

  const currentViewParts = useMemo(() => {
    return partsByView[selectedView] || [];
  }, [partsByView, selectedView]);

  const getStatusColor = (status: string|undefined) => {
    const colors: Record<MarkerStatus, { main: string; dark: string }> = {
      unmapped:{main: " rgba(40, 38, 38, 0.48)", dark: "darkgray" },
      mapped: { main: "green", dark: "darkgreen" },
      ok: { main: "blue", dark: "darkblue" },
      notOK: { main: "red", dark: "darkred" },
      editing: { main: "orange", dark: "darkorange" },
    };
  
    const defaultColor = { };
  
    return colors[status as MarkerStatus] ?? defaultColor;
  };
  
  return (
    <Box
    sx={{
      width: "20%",
      height: "90vh", // ✅ Add this line
      boxShadow: 3,
      bgcolor: "background.paper",
      borderRadius: "0.5vw",
      boxSizing: "border-box",
      m: 1,
      overflow: "hidden", // ✅ Optional: Ensures no overflow leaks from child
    }}
  >
      <TableContainer
        sx={{ 
          minHeight: "90vh", 
          maxHeight: "90vh", 
          overflow: "auto" ,
          scrollbarColor: "rgba(69, 66, 66, 0.2) transparent",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "0.4vw",
            height: "0.4vw",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(51, 50, 50, 0.25)",
            borderRadius: "0.5vw",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(146, 128, 128, 0.4)",
          },
        }}
      >
        <Table
          stickyHeader
          sx={{
            width: "100%",
            tableLayout: "fixed",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: { 
                    xs: "0.85rem", 
                    sm: "0.9rem", 
                    md: "1rem"
                  },
                  backgroundColor: "#f5f5f5",
                  borderBottom: "0.15vw solid #e0e0e0",
                  width: "15%",
                }}
              >
                #
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: { 
                    xs: "0.85rem", 
                    sm: "0.9rem", 
                    md: "1rem"
                  },
                  backgroundColor: "#f5f5f5",
                  borderBottom: "0.15vw solid #e0e0e0",
                  width: "55%",
                }}
              >
                Parts Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: { 
                    xs: "0.85rem", 
                    sm: "0.9rem", 
                    md: "1rem"
                  },
                  backgroundColor: "#f5f5f5",
                  borderBottom: "0.15vw solid #e0e0e0",
                  width: "30%",
                }}
              >
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentViewParts.length > 0 ? (
              currentViewParts.map((part, index) => {
                
                const statusColor = getStatusColor(part.status);
                
                return (
                  <TableRow key={`part-${part.partNumber}-${index}`}>
                    <TableCell
                      sx={{
                        padding: { 
                          xs: "0.5vw", 
                          md: "0.75vw" 
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: { 
                            xs: "1.5vw", 
                            sm: "1.75vw", 
                            md: "2vw" 
                          },
                          height: { 
                            xs: "1.5vw", 
                            sm: "1.75vw", 
                            md: "2vw" 
                          },
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: { 
                            xs: "0.7rem", 
                            sm: "0.8rem", 
                            md: "0.9rem" 
                          },
                        }}
                      >
                        {part.partNumber}
                      </Box>
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: { 
                          xs: "0.75rem", 
                          sm: "0.8rem", 
                          md: "0.875rem" 
                        },
                        color: "text.primary",
                        padding: { 
                          xs: "0.5vw", 
                          md: "0.75vw" 
                        },
                        wordBreak: "break-word",
                      }}
                    >
                      {part.partName}
                    </TableCell>
                    
                    <TableCell
                      sx={{
                        padding: { 
                          xs: "0.375vw", 
                          sm: "0.45vw", 
                          md: "0.5vw" 
                        },
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          textTransform: "lowercase",
                          boxShadow: 2,
                          borderRadius: "0.5vw",
                          padding: { 
                            xs: "0.375vw 0.75vw", 
                            md: "0.5vw 1vw" 
                          },
                          fontSize: { 
                            xs: "0.6rem", 
                            sm: "0.65rem", 
                            md: "0.7rem" 
                          },
                          fontWeight: 700,
                          bgcolor: statusColor.main,
                          color: "rgb(248, 247, 247)",
                          width: "100%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          "&:hover": {
                            boxShadow: 4,
                            bgcolor: statusColor.dark,
                          },
                        }}
                      >
                        {part.status}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={3} 
                  align="center" 
                  sx={{ 
                    padding: "1vw",
                    fontSize: { 
                      xs: "0.75rem", 
                      sm: "0.85rem", 
                      md: "1rem" 
                    }
                  }}
                >
                  No parts available for this view
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};