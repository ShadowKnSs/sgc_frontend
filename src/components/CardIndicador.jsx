// src/components/CardIndicador.jsx
import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, Tooltip, Grid } from '@mui/material';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import WarningIcon from '@mui/icons-material/Warning';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CommentIcon from '@mui/icons-material/Comment';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { motion } from 'framer-motion';

const IndicatorCard = ({ indicator, savedResult = {}, onRegisterResult, cardColor, soloLectura }) => {

  const tipo = indicator.origenIndicador?.toLowerCase();

  const renderResultados = () => {
    if (!savedResult || Object.values(savedResult).every(v => v == null)) return null;

    if (tipo === 'encuesta') {
      const { excelente, bueno, regular, malo } = savedResult;
      return (
        <Grid container spacing={1} mt={1}>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SentimentSatisfiedAltIcon fontSize="small" color="success" />
            <Typography variant="caption">Excelente: <strong>{excelente ?? 0}</strong></Typography>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThumbUpIcon fontSize="small" color="primary" />
            <Typography variant="caption">Bueno: <strong>{bueno ?? 0}</strong></Typography>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FeedbackIcon fontSize="small" color="warning" />
            <Typography variant="caption">Regular: <strong>{regular ?? 0}</strong></Typography>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SentimentVeryDissatisfiedIcon fontSize="small" color="error" />
            <Typography variant="caption">Malo: <strong>{malo ?? 0}</strong></Typography>
          </Grid>
        </Grid>
      );
    }

    if (tipo === 'retroalimentacion') {
      const { cantidadFelicitacion, cantidadSugerencia, cantidadQueja } = savedResult;
      return (
        <Grid container spacing={1} mt={1}>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon fontSize="small" color="success" />
            <Typography variant="caption">Felicitaciones: <strong>{cantidadFelicitacion ?? 0}</strong></Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CommentIcon fontSize="small" color="warning" />
            <Typography variant="caption">Sugerencias: <strong>{cantidadSugerencia ?? 0}</strong></Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon fontSize="small" color="error" />
            <Typography variant="caption">Quejas: <strong>{cantidadQueja ?? 0}</strong></Typography>
          </Grid>
        </Grid>
      );
    }

    if (tipo === 'evaluaproveedores') {
      const {
        resultadoConfiableSem1, resultadoCondicionadoSem1, resultadoNoConfiableSem1,
        resultadoConfiableSem2, resultadoCondicionadoSem2, resultadoNoConfiableSem2
      } = savedResult;

      return (
        <Grid container spacing={1} mt={1}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonthIcon fontSize="small" color="info" /> Ene-Jun
            </Typography>
            <Typography variant="caption">
              ✅ Confiable: <strong>{resultadoConfiableSem1 ?? 0}%</strong>
            </Typography><br />
            <Typography variant="caption">
              ⚠️ Condicionado: <strong>{resultadoCondicionadoSem1 ?? 0}%</strong>
            </Typography><br />
            <Typography variant="caption">
              ❌ No confiable: <strong>{resultadoNoConfiableSem1 ?? 0}%</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonthIcon fontSize="small" color="info" /> Jul-Dic
            </Typography>
            <Typography variant="caption">
              ✅ Confiable: <strong>{resultadoConfiableSem2 ?? 0}%</strong>
            </Typography><br />
            <Typography variant="caption">
              ⚠️ Condicionado: <strong>{resultadoCondicionadoSem2 ?? 0}%</strong>
            </Typography><br />
            <Typography variant="caption">
              ❌ No confiable: <strong>{resultadoNoConfiableSem2 ?? 0}%</strong>
            </Typography>
          </Grid>
        </Grid>
      );
    }

    if (savedResult.resultadoSemestral1 != null || savedResult.resultadoSemestral2 != null) {
      return (
        <Grid container spacing={1} mt={1}>
          {savedResult.resultadoSemestral1 != null && (
            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonthIcon fontSize="small" color="info" />
              <Typography variant="caption">Ene-Jun: <strong>{savedResult.resultadoSemestral1}%</strong></Typography>
            </Grid>
          )}
          {savedResult.resultadoSemestral2 != null && (
            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonthIcon fontSize="small" color="info" />
              <Typography variant="caption">Jul-Dic: <strong>{savedResult.resultadoSemestral2}%</strong></Typography>
            </Grid>
          )}
        </Grid>
      );
    }

    if (savedResult.resultadoAnual != null) {
      return (
        <Box mt={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarMonthIcon fontSize="small" color="info" />
          <Typography variant="caption">Resultado Anual: <strong>{savedResult.resultadoAnual}%</strong></Typography>
        </Box>
      );
    }

    const sem1 = savedResult.resultadoSemestral1;
    const sem2 = savedResult.resultadoSemestral2;

    if (sem1 != null || sem2 != null) {
      return (
        <Grid container spacing={1} mt={1}>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {sem1 != null && (
              <>
                <CalendarMonthIcon fontSize="small" color="info" />
                <Typography variant="caption">
                  Ene-Jun: <strong>{sem1}%</strong>
                </Typography>
              </>
            )}
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {sem2 != null && (
              <>
                <CalendarMonthIcon fontSize="small" color="info" />
                <Typography variant="caption">
                  Jul-Dic: <strong>{sem2}%</strong>
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      );
    }

    return null;
  };

  return (
    <Card
      component={motion.div}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      role="article"
      sx={{
        backgroundColor:
          cardColor === 'yellow' ? '#fff9c4' :
            cardColor === 'lightGreen' ? '#e8f5e9' :
              '#fff',
        borderRadius: 2,
        boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',             
      }}
    >

      <CardContent>
        <Tooltip title={indicator.nombreIndicador}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
              color: '#185FA4',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '3em',
            }}
          >
            {indicator.nombreIndicador}
          </Typography>
        </Tooltip>

        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            fontStyle: 'italic',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            minHeight: '1.5em',
            mt: 0.5
          }}
        >
          {indicator.origenIndicador}
        </Typography>

        {renderResultados()}

      </CardContent>

      {!soloLectura && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          mt: 'auto',
          px: 2,
          pb: 2
        }}>
          <Tooltip title="Registrar Resultado" arrow>
            <IconButton
              aria-label={`Registrar resultado para ${indicator.nombreIndicador}`}
              onClick={(e) => {
                e.stopPropagation(); // evita doble click
                onRegisterResult(indicator);
              }}
              sx={{ color: '#2dc1df' }}
            >
              <PlaylistAddCheckIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Card>
  );
};

export default IndicatorCard;
