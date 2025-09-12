import React, { useState } from "react";
import {
  Card, CardContent, Typography, Box, IconButton, Tooltip, Chip, Fade
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CustomButton from "./Button";

const prefer = (...vals) => vals.find(v => typeof v === "string" && v.trim().length > 0) || null;
const safe = (s) => (s ?? "").toString().trim().replace(/\s+/g, "_");

const ReportCard = ({ report, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!report) return null;

  const title = report.nombreReporte || "Reporte de Proceso";
  const year = report.anio || (report.fechaElaboracion ? new Date(report.fechaElaboracion).getFullYear() : "N/D");
  const formattedDate = report.fechaElaboracion
    ? new Date(report.fechaElaboracion).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
    : "Fecha no disponible";

  const downloadUrl = prefer(report.ruta, report.storageUrl);

  const defaultFileName =
    report.nombreArchivo ||
    `${safe(title)}_${year}.pdf`;

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!downloadUrl || isDownloading) return;
    setIsDownloading(true);
    try {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = defaultFileName;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(report);
  };

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        mb: 2,
        mx: "auto",
        width: "100%",
        borderRadius: 3,
        boxShadow: isHovered ? 4 : 1,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        border: '1px solid',
        borderColor: isHovered ? 'primary.main' : 'divider',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", height: 120, justifyContent: "space-between" }}>
          {/* Header con icono y título */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48, height: 48,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                flex: "0 0 auto",
                transition: 'transform 0.3s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <PictureAsPdfIcon sx={{ color: "#fff", fontSize: 24 }} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0, height: 48, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {/* Tooltip en el nombre del reporte */}
              <Tooltip title={title} placement="top-start" arrow>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: 'text.primary',
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {title}
                </Typography>
              </Tooltip>
            </Box>

            {/* Botón de eliminar */}
            <Fade in={isHovered || window.innerWidth < 768}>
              <Tooltip title="Eliminar reporte" placement="top">
                <IconButton
                  onClick={handleDelete}
                  size="small"
                  aria-label="Eliminar"
                  sx={{
                    color: 'error.main',          
                    bgcolor: 'transparent',       
                    boxShadow: 'none',            
                    transition: 'all 0.2s ease',
                    alignSelf: 'flex-start',

                    '&:hover': {
                      bgcolor: 'error.main',
                      color: '#fff',
                      transform: 'scale(1.1)',
                      boxShadow: 'none',          // evita sombra roja/opaca
                    },

                    '& .MuiSvgIcon-root': { transition: 'color 0.2s ease' },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Fade>


          </Box>

          {/* Metadata */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", minHeight: 32, py: 0.5 }}>
            <Chip
              label={`Año ${year}`}
              size="small"
              variant="outlined"
              sx={{ borderColor: 'primary.main', color: 'primary.main', fontSize: '0.75rem', height: 24 }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: 'text.secondary' }}>
              <CalendarTodayIcon sx={{ fontSize: 14 }} />
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                {formattedDate}
              </Typography>
            </Box>
          </Box>

          {/* Botón de descarga */}
          {downloadUrl && (
            <Box sx={{
              display: "flex",
              justifyContent: "flex-end",
              pt: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
              minHeight: 48
            }}>
              <CustomButton
                type="descargar"
                startIcon={isDownloading ? null : <DownloadIcon />}
                onClick={handleDownload}
                disabled={isDownloading}
                sx={{ minWidth: 140, height: 36, fontSize: '0.875rem', mb: 2 }}
              >
                {isDownloading ? 'Descargando...' : 'Descargar PDF'}
              </CustomButton>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 3,
            borderRadius: '12px 12px 0 0',
            transition: 'all 0.3s ease'
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ReportCard;
