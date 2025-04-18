// MapperV2.tsx
import { Box, Button,IconButton, Tooltip } from "@mui/material";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import useMapperStore from "../store/store";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Circle, Group, Image, Layer, Rect, Stage, Text } from "react-konva";
import { Add, CenterFocusStrong, Remove } from "@mui/icons-material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import useImage from "use-image";


const MapperV2: React.FC = () => {
  const {
    selectedView,
    setImage,
    setCurrentPartIndex,
    setViewMode,
    getCurrentPartIndex,
    getCurrentViewParts,
    updatePartMapping,
    getNextUnmappedPart,
    getCurrentViewMode,
    resetViewMapping,
    getCurrentViewImage,
  } = useMapperStore();

  useEffect(() => {
    console.log(`[RENDER] Mapper component re-rendered `);
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUrl = getCurrentViewImage();
  const [image] = useImage(imageUrl || "");
  const stageRef = useRef<any>(null);
  const currentPartIndex = getCurrentPartIndex();
  const currentParts = getCurrentViewParts();
  useEffect(() => {
    if (image && containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const imgRatio = image.width / image.height;
      const containerRatio = containerWidth / containerHeight;

      let width, height;

      if (containerRatio > imgRatio) {
        height = containerHeight;
        width = height * imgRatio;
      } else {
        width = containerWidth;
        height = width / imgRatio;
      }

      setDimensions({ width, height });
    }
  }, [image]);
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedView) {
      setImage(selectedView, file);//storing the file object in store
      resetViewMapping(selectedView);
      setCurrentPartIndex(selectedView, 0);
      setViewMode(selectedView, "mapping");
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleStageClick = (e:any) => {
    if (getCurrentViewMode() !== "mapping") return;
    if (currentPartIndex >= currentParts.length) {
      console.warn("Current part index exceeds available parts");
      return;
    }

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    // Convert to normalized coordinates
    const normalizedX = pointerPosition.x / dimensions.width;
    const normalizedY = pointerPosition.y / dimensions.height;

    const currentPart = currentParts[currentPartIndex];
    if (currentPart) {
      updatePartMapping(
        selectedView,
        currentPart.partNumber,
        normalizedX,
        normalizedY
      );
    }

    const nextUnmapped = getNextUnmappedPart();
    if (nextUnmapped) {
      const nextIndex = currentParts.findIndex(
        (p) => p.partNumber === nextUnmapped.partNumber
      );
      if (nextIndex >= 0) {
        setCurrentPartIndex(selectedView, nextIndex);
      }
    }
  };

  const handleDragEnd = (e: any, partNumber: number) => {
    const node = e.target;
    // Convert back to normalized coordinates
    const normalizedX = node.x() / dimensions.width;
    const normalizedY = node.y() / dimensions.height;

    updatePartMapping(selectedView, partNumber, normalizedX, normalizedY);
  };



  return (
    <Box
      ref={containerRef}
      sx={{
        borderRadius: 1,
        border: 1,
        borderColor: "rgb(183, 181, 181)",
        m: 1,
        height: "100%",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `
        linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
      `,
        boxShadow: "0px 15px 35px rgba(0, 0, 0, 0.15)",
        backgroundSize: "20px 20px",

        backdropFilter: "blur(4px)",
      }}
    >
      {image ? (
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={5}
          wheel={{ step: 0.1 }}
          doubleClick={{ step: 0 }}
          limitToBounds={true}
          centerOnInit={true}
          panning={{
            disabled: true,
          }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <TransformComponent
                wrapperStyle={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
                    borderRadius: 1,
                    overflow: "hidden",
                    display: "inline-block",
                  }}
                >
                  <Stage
                    width={dimensions.width}
                    height={dimensions.height}
                    onClick={
                      getCurrentViewMode() === "mapping"
                        ? handleStageClick
                        : undefined
                    }
                    ref={stageRef}
                  >
                    <Layer>
                      <Rect
                        x={0}
                        y={0}
                        width={dimensions.width}
                        height={dimensions.height}
                        fill="white"
                      />
                      <Image
                        image={image}
                        width={dimensions.width}
                        height={dimensions.height}
                        opacity={0.8}
                      />
                      {/* Render markers for parts that have coordinates */}
                      {currentParts.map(
                        (part, index) =>
                          part.coordinates && (
                            <Group
                              key={`${part.partNumber}-${index}`}
                              x={part.coordinates.x * dimensions.width}
                              y={part.coordinates.y * dimensions.height}
                              draggable
                              onDragEnd={(e) =>
                                handleDragEnd(e, part.partNumber)
                              }
                              dragBoundFunc={(pos) => {
                                return {
                                  x: Math.max(
                                    0,
                                    Math.min(pos.x, dimensions.width)
                                  ),
                                  y: Math.max(
                                    0,
                                    Math.min(pos.y, dimensions.height)
                                  ),
                                };
                              }}
                            >
                              <Circle radius={15} fill="red" opacity={0.8} />

                              <Text
                                text={part.partNumber.toString()}
                                fontSize={15}
                                fill="white"
                                align="center"
                                verticalAlign="middle"
                                offsetX={
                                  (part.partNumber.toString().length * 15) / 3.5
                                }
                                offsetY={7.5}
                              />
                            </Group>
                          )
                      )}
                    </Layer>
                  </Stage>
                </Box>
              </TransformComponent>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 24,
                  right: 24,
                  zIndex: 10,
                  display: "flex",
                  gap: 1,
                  backgroundColor: "rgb(255, 255, 255)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "12px",
                  padding: "6px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                <Tooltip title="Zoom In">
                  <IconButton
                    size="small"
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.main",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => zoomIn()}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Zoom Out">
                  <IconButton
                    size="small"
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.main",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => zoomOut()}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Reset View">
                  <IconButton
                    size="small"
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.main",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => resetTransform()}
                  >
                    <CenterFocusStrong fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Change Image">
                  <IconButton
                    size="small"
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.main",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                    onClick={triggerFileInput}
                  >
                    <DriveFolderUploadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </Box>
            </>
          )}
        </TransformWrapper>
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <Button
            variant="contained"
            startIcon={<DriveFolderUploadIcon />}
            onClick={triggerFileInput}
          >
            Upload Image for {`${selectedView} View`}
            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
            />
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MapperV2;
