import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import Header from "./Header";

import StatusBar from "./StatusBar";
//import MapperV1 from "./MapperV1";
import { MapperProps, Part } from "../interface/interfaces";
import useMapperStore from "../store/store";
import { SideBar } from "./SideBar";
import MapperV2 from "./MapperV2";

const mockPartsData: Part[] = [
  // Front View
  { partNumber: 1, partName: "Headlight", view: "Front", group: 1 },
  { partNumber: 2, partName: "Front Disc Brake", view: "Front", group: 1 },
  { partNumber: 3, partName: "Front Tire", view: "Front", group: 1 },
  { partNumber: 4, partName: "Front Mudguard", view: "Front", group: 1 },
  { partNumber: 5, partName: "Front Suspension", view: "Front", group: 1 },
  { partNumber: 6, partName: "Headlight", view: "Front", group: 1 },
  { partNumber: 7, partName: "Front Disc Brake", view: "Front", group: 1 },
  { partNumber: 8, partName: "Front Tire", view: "Front", group: 1 },
  { partNumber: 9, partName: "Front Mudguard", view: "Front", group: 1 },
  { partNumber: 10, partName: "Front Suspension", view: "Front", group: 1 },
  { partNumber: 11, partName: "Headlight", view: "Front", group: 1 },
  { partNumber: 12, partName: "Front Disc Brakecvdd", view: "Front", group: 1 },
  { partNumber: 13, partName: "Front Tirefdfdfdf", view: "Front", group: 1 },
  { partNumber: 14, partName: "Front Mudguard", view: "Front", group: 1 },
  { partNumber: 15, partName: "Front Suspension", view: "Front", group: 1 },

  { partNumber: 1, partName: "Rear Tire", view: "Rear", group: 5 },
  { partNumber: 2, partName: "Rear Disc Brake", view: "Rear", group: 5 },
  { partNumber: 3, partName: "Taillight", view: "Rear", group: 5 },
  { partNumber: 4, partName: "Rear Suspension", view: "Rear", group: 5 },
  { partNumber: 5, partName: "Exhaust Pipe", view: "Rear", group: 6 },

  // Left-Hand Side (LHS) View
  { partNumber: 1, partName: "Left Handlebar", view: "LHS", group: 2 },
  { partNumber: 2, partName: "Clutch Lever", view: "LHS", group: 2 },
  { partNumber: 3, partName: "Gear Shifter", view: "LHS", group: 3 },
  { partNumber: 4, partName: "Side Stand", view: "LHS", group: 4 },
  { partNumber: 5, partName: "Left Foot Peg", view: "LHS", group: 3 },
  { partNumber: 6, partName: "Battery Compartment", view: "LHS", group: 6 },

  // Right-Hand Side (RHS) View
  { partNumber: 1, partName: "Front Brake Lever", view: "RHS", group: 2 },
  { partNumber: 2, partName: "Right Handlebar", view: "RHS", group: 2 },
  { partNumber: 3, partName: "Throttle Grip", view: "RHS", group: 2 },
  {
    partNumber: 4,
    partName: "Rear Brake Pedalsfsdfefdfdfdefdefefefefefefdfsdfdsv",
    view: "RHS",
    group: 3,
  },
  { partNumber: 5, partName: "Kick Starter", view: "RHS", group: 3 },
  { partNumber: 6, partName: "Rear Chain Sprocket", view: "RHS", group: 3 },
  { partNumber: 7, partName: "Engine Block", view: "RHS", group: 6 },
  { partNumber: 8, partName: "Oil Filter", view: "RHS", group: 6 },
];
const VisualPartMapper: React.FC<MapperProps> = ({
  partsData = mockPartsData,
}) => {
  const renderCount = useRef(0);
  const initializePartsData = useMapperStore(
    (state) => state.initializePartsData
  );

  // Get specific state pieces separately to avoid stale closures
  const views = useMapperStore((state) => state.views);
  const partsByView = useMapperStore((state) => state.partsByView);
  const selectedView = useMapperStore((state) => state.selectedView);
  const imageUrls = useMapperStore((state) => state.images);
  const viewModes = useMapperStore((state) => state.viewModes);
  const currentPartIndices = useMapperStore(
    (state) => state.currentPartIndices
  );

  // Initialize store with parts data on first render
  useEffect(() => {
    console.groupCollapsed("Initializing Parts Data");
    console.log("Raw parts data input:", partsData);

    initializePartsData(partsData);

    console.groupEnd();
  }, [partsData, initializePartsData]);

  // Log the updated state after initialization
  useEffect(() => {
    if (views.length > 0) {
      // Only log when we have actual data
      console.groupCollapsed("Current Store State");
      console.log("Store state:", {
        views,
        partsByView,
        selectedView,
        imageUrls,
        viewModes,
        currentPartIndices,
      });

      console.groupCollapsed("Detailed View Breakdown");
      views.forEach((view) => {
        console.group(`View: ${view}`);
        console.log("Parts:", partsByView[view]);
        console.log("Image URL:", imageUrls[view]);

        console.log("View Mode:", viewModes[view]);
        console.log("Current Part Index:", currentPartIndices[view]);
        console.groupEnd();
      });
      console.groupEnd();

      console.groupEnd();
    }
  }, [
    views,
    partsByView,
    selectedView,
    imageUrls,
    viewModes,
    currentPartIndices,
  ]);

  // Log when component re-renders
  useEffect(() => {
    renderCount.current += 1;
    console.log(
      `[RENDER] Mapper component re-rendered (count: ${renderCount.current})`
    );
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: "100%",
        minHeight: "100%",
        maxHeight: "100vh",
       
          }}    >
      <Header />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: "100%",
          minWidth: "100%",
          overflow: "hidden",
        }}
      >
        <SideBar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: "100%",
            minWidth: "80%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <StatusBar />
          <MapperV2 />
        </Box>
      </Box>
    </Box>
  );
};
export default VisualPartMapper;
