import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Container,
  CircularProgress,
  AppBar,
  Toolbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Divider,
  Stack,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import axios from 'axios';

// ---------- ✅ Types ----------
type Coordinate = {
  x: number;
  y: number;
};

type Part = {
  partNumber: number;
  partName: string;
  coordinates: Coordinate;
  status: string;
};

type View = {
  viewId?: string;
  viewName: string;
  imageFileName?: string;
  imageUrl?: string;
  parts: Part[];
};

type Metadata = {
  exportedAt: string;
  viewCount: number;
  exportVersion?: string;
  uploadStats?: {
    successfulUploads: number;
    failedUploads: number;
  };
};

type ExportDataItem = {
  id: number;
  metadata: Metadata;
  views: View[];
  createdAt: string;
};

// ---------- ✅ Component ----------
const ExportList: React.FC = () => {
  const [exportData, setExportData] = useState<ExportDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExports = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ExportDataItem[]>('http://localhost:3000/upload/exports');
        setExportData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching exports:', err);
        setError('Failed to load motorcycle data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExports();
  }, []);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading motorcycle data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error" sx={{ width: '80%', maxWidth: 800 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <TwoWheelerIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Motorcycle Mapping Exports
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Exported Mappings
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Browse all exported motorcycle part mappings. Each card shows a different motorcycle export with detailed part mappings.
        </Typography>

        {exportData.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No motorcycle exports found. Try uploading some data first.
          </Alert>
        ) : (
          <Stack spacing={4} sx={{ mt: 1 }}>
            {exportData.map((item) => (
              <Card elevation={3} key={item.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5" component="div">
                      Export #{item.id}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DateRangeIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(item.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      icon={<ImageIcon />}
                      label={`${item.metadata?.viewCount || item.views?.length || 0} Views`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={`${item.metadata?.uploadStats?.successfulUploads || 0} Successful Uploads`}
                      color="success"
                      variant="outlined"
                    />
                    {item.metadata?.uploadStats && item.metadata.uploadStats.failedUploads > 0 && (
                      <Chip
                        icon={<ErrorIcon />}
                        label={`${item.metadata.uploadStats.failedUploads} Failed Uploads`}
                        color="error"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Version: {item.metadata?.exportVersion || 'N/A'}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  {item.views?.map((view, index) => (
                    <Accordion key={view.viewName + index} defaultExpanded={index === 0}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography sx={{ fontWeight: 'medium' }}>
                          {view.viewName} View ({view.parts?.length || 0} parts)
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                              {view.imageUrl && view.imageUrl !== 'failed_to_upload' ? (
                                <CardMedia
                                  component="img"
                                  height="300"
                                  image={view.imageUrl}
                                  alt={view.viewName}
                                  sx={{ objectFit: 'contain', backgroundColor: '#f5f5f5' }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    height: 300,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f5f5f5'
                                  }}
                                >
                                  <Typography color="error">Image failed to upload</Typography>
                                </Box>
                              )}
                            </Card>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" gutterBottom>Mapped Parts:</Typography>
                            <Box sx={{ height: 300, overflow: 'auto' }}>
                              {view.parts?.map((part) => (
                                <Paper key={part.partNumber} sx={{ mb: 1, p: 1, borderRadius: 1, backgroundColor: '#f5f5f5' }}>
                                  <Typography variant="subtitle2">
                                    {part.partNumber}. {part.partName}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Position: X: {part.coordinates.x.toFixed(2)}, Y: {part.coordinates.y.toFixed(2)}
                                  </Typography>
                                  <Chip
                                    label={part.status}
                                    size="small"
                                    color={part.status === 'mapped' ? 'success' : 'default'}
                                    sx={{ mt: 0.5 }}
                                  />
                                </Paper>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default ExportList;