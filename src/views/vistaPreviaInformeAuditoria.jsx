import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Grid, Typography, Button, TextField, MenuItem } from "@mui/material";
import React, { useState, useEffect } from "react";

function VistaPreviaAud() {
  const entidad = "Nombre de la Entidad";
  const proceso = "Nombre del Proceso";
  const lider = "Nombre del Líder";
  const { idAuditorialInterna } = useParams();
    // Estado para los criterios
    const [criterios, setCriterios] = useState([]);
    const [equipoAuditor, setEquipoAuditor] = useState([]);
    const [personalAuditado, setPersonalAuditado] = useState([]);
    const [verificaciones, setVerificaciones] = useState([]);
    const [fecha, setFecha] = useState('');
    const [objetivo, setObjetivo] = useState('');
    const [alcance, setAlcance] = useState('');
    const [fortalezas, setFortalezas] = useState('');
    const [debilidades, setDebilidades] = useState('');
    const [conclusiones, setConclusiones] = useState([]);
    const [plazos, setPlazos] = useState([]);
    const [puntosMejora, setPuntosMejora] = useState([]);
    const navigate = useNavigate();

    const handleGuardarReporte = async () => {
        try {
          const payload = {
            idAuditorialInterna: parseInt(idAuditorialInterna),
            hallazgo: verificaciones.map(v => v.hallazgo).filter(Boolean).join(', ') || "Sin hallazgos",
            oportunidadesMejora: puntosMejora.map(p => p.descripcion).filter(Boolean).join(', ') || "Sin oportunidades",
            cantidadAuditoria: 1,
            ruta: `reporte_${idAuditorialInterna}_${Date.now()}.pdf`,
            fechaGeneracion: fecha
          };
      
          await axios.post("http://localhost:8000/api/reportesauditoria", payload);
          navigate("/reportes-auditoria");
        } catch (error) {
          console.error("Error al guardar reporte:", error);
          alert("Error al guardar el reporte");
        }
    };  

    useEffect(() => {
        const obtenerDatosAuditoria = async () => {
          try {
            const res = await axios.get(`http://localhost:8000/api/auditorias/${idAuditorialInterna}`);
            const data = res.data;
      
            setFecha(data.fecha || "");
            setObjetivo(data.objetivoAud || "");
            setAlcance(data.alcanceAud || "");
            setFortalezas(data.fortalezas || "");
            setDebilidades(data.debilidades || "");
      
            setCriterios((data.criterios || []).map(item => item.criterio));
            
            setEquipoAuditor((data.equipo_auditor || []).map(item => ({
              rol: item.rolAsignado || "",
              auditor: item.nombreAuditor || ""
            })));
      
            setPersonalAuditado((data.personal_auditado || []).map(item => ({
              nombre: item.nombre || "",
              cargo: item.cargo || ""
            })));
      
            setVerificaciones((data.verificacion_ruta || []).map(item => ({
              criterio: item.criterio || "",
              reqAsociado: item.reqAsociado || "",
              observaciones: item.observaciones || "",
              evidencia: item.evidencia || "",
              hallazgo: item.tipoHallazgo || ""
            })));
      
            setPuntosMejora((data.puntos_mejora || []).map(item => ({
              reqISO: item.reqISO || "",
              descripcion: item.descripcion || "",
              evidencia: item.evidencia || ""
            })));
      
            setConclusiones((data.conclusiones || []).map(item => ({
              nombre: item.nombre || "",
              observaciones: item.descripcionConclusion || ""
            })));
      
            setPlazos((data.plazos || []).map(item => item.descripcion || ""));
          } catch (error) {
            console.error("Error al obtener auditoría:", error);
          }
        };
      
        obtenerDatosAuditoria();
    }, [idAuditorialInterna]);          

  return (
    <Box sx={{ p: 4, backgroundColor: "#f7f7f7", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: "100%", maxWidth: "900px", backgroundColor: "white", padding: 4, borderRadius: "8px" }}>
        <h1
        style={{
            textAlign: "center",
            marginBottom: "32px",
            fontFamily: "'Roboto', sans-serif",
            color: "#004A98",
        }}
        >
        Auditoría del {fecha ? new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '---'}
        </h1>
        
        <Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Entidad:</strong> {entidad}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Proceso:</strong> {proceso}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>Líder:</strong> {lider}</Typography>
            </Grid>
          </Grid>
        </Box>
        
        <Box mt={3}>
          <Typography variant="body1" gutterBottom><strong>Objetivo:</strong></Typography>
          <TextField fullWidth multiline rows={2} variant="outlined" value={objetivo} InputProps={{ readOnly: true }}
        />
        </Box>

        <Box mt={3}>
          <Typography variant="body1" gutterBottom><strong>Alcance:</strong></Typography>
          <TextField fullWidth multiline rows={1} variant="outlined" value={alcance} InputProps={{ readOnly: true }}/>
        </Box>
        
        <Box mt={3}>
          <Typography variant="body1" gutterBottom><strong>Criterios:</strong></Typography>
          {criterios.map((criterio, index) => (
            <Box key={index} display="flex" alignItems="center" mt={1}>
              <TextField 
                fullWidth 
                multiline 
                rows={1} 
                variant="outlined" 
                value={criterio} 
                InputProps={{ readOnly: true }}
              />
            </Box>
          ))}
        </Box>

        <Box mt={3}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom><strong>Equipo Auditor:</strong></Typography>
              {equipoAuditor.map((item, index) => (
                <Grid container spacing={2} alignItems="center" mt={1} key={index}>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Rol" variant="outlined" value={item.rol} InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField select fullWidth label="Nombre Auditor" variant="outlined" value={item.auditor} InputProps={{ readOnly: true }}
                    >
                      <MenuItem value="Juan Pérez">Juan Pérez</MenuItem>
                      <MenuItem value="Ana Gómez">Ana Gómez</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom><strong>Personal Auditado:</strong></Typography>
              {personalAuditado.map((item, index) => (
                <Grid container spacing={2} alignItems="center" mt={1} key={index}>
                  <Grid item xs={6}>
                  <TextField fullWidth label="Nombre" variant="outlined" value={item.nombre} InputProps={{ readOnly: true }}/>
                  </Grid>
                  <Grid item xs={6}>
                  <TextField fullWidth label="Cargo" variant="outlined" value={item.cargo} InputProps={{ readOnly: true }}/>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Box>

        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" gutterBottom>
            <strong>Verificación de Ruta de Auditoría</strong>
          </Typography>
          <Box width="100%" mt={2}>
          {verificaciones.map((verificacion, index) => (
              <Box key={index} width="100%" mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <TextField fullWidth variant="outlined" size="small" label="Criterio" value={verificacion.criterio} InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField fullWidth variant="outlined" size="small" label="Req. Asociado" value={verificacion.reqAsociado} InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField fullWidth variant="outlined" size="small" label="Observaciones" value={verificacion.observaciones} InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField fullWidth variant="outlined" size="small" label="Evidencia" value={verificacion.evidencia} InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField select fullWidth variant="outlined" size="small" label="Tipo de Hallazgo" value={verificacion.hallazgo} InputProps={{ readOnly: true }}
                    >
                      <MenuItem value="Mayor">Mayor</MenuItem>
                      <MenuItem value="Menor">Menor</MenuItem>
                      <MenuItem value="Oportunidad">Oportunidad</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                <Box display="flex" justifyContent="flex-end" mt={1}>
                </Box>
              </Box>
            ))}
            </Box>
        </Box>

        <Box mt={3}>
          <Typography variant="body1" gutterBottom><strong>Fortalezas:</strong></Typography>
          <TextField fullWidth multiline rows={2} variant="outlined" value={fortalezas} InputProps={{ readOnly: true }}/>
        </Box>

        <Box mt={3}>
          <Typography variant="body1" gutterBottom><strong>Debilidades:</strong></Typography>
          <TextField fullWidth multiline rows={2} variant="outlined" value={debilidades} InputProps={{ readOnly: true }}/>
        </Box>

        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" gutterBottom>
            <strong>Puntos de Mejora Detectados</strong>
          </Typography>
          <Box width="100%" mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography variant="body1" gutterBottom sx={{ fontSize: "0.875rem", whiteSpace: "nowrap", textAlign: "center" }}>
                  <strong>No.</strong>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1" gutterBottom sx={{ fontSize: "0.875rem", whiteSpace: "nowrap", textAlign: "center" }}>
                  <strong>Req. ISO 9001:2015</strong>
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body1" gutterBottom sx={{ fontSize: "0.875rem", whiteSpace: "nowrap", textAlign: "center" }}>
                  <strong>Descripción del Punto de Mejora</strong>
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body1" gutterBottom sx={{ fontSize: "0.875rem", whiteSpace: "nowrap", textAlign: "center" }}>
                  <strong>Evidencia Objetiva</strong>
                </Typography>
              </Grid>
            </Grid>
          </Box>
          {puntosMejora.map((puntoMejora, index) => (
            <Box key={index} width="100%" mt={2}>
                <Grid container spacing={2}>
                <Grid item xs={2}>
                <TextField fullWidth variant="outlined" size="small" label="Req. ISO" value={puntoMejora.reqISO} InputProps={{ readOnly: true }}
                />
                </Grid>
                <Grid item xs={6}>
                <TextField fullWidth variant="outlined" size="small" label="Descripción" value={puntoMejora.descripcion} InputProps={{ readOnly: true }}
                />
                </Grid>
                <Grid item xs={4}>
                <TextField fullWidth variant="outlined" size="small" label="Evidencia" value={puntoMejora.evidencia} InputProps={{ readOnly: true }}
                />
                </Grid>
                </Grid>
              <Box display="flex" justifyContent="flex-end" mt={1}>
              </Box>
            </Box>
          ))}
        </Box>

        <Box mt={3}>
          <Typography variant="body1" gutterBottom>
            <strong>Conclusiones Generales:</strong>
          </Typography>

          {conclusiones.map((conclusion, index) => (
            <Box key={index} mt={2} p={2} sx={{ border: "1px solid #ccc", borderRadius: "8px" }}>
              <TextField
                fullWidth
                label="Nombre de la conclusión"
                variant="outlined"
                size="small"
                value={conclusion.nombre}
                InputProps={{ readOnly: true }}
              />

              <TextField
                fullWidth
                label="Observaciones"
                variant="outlined"
                size="small"
                multiline
                rows={3}
                sx={{ mt: 2 }}
                value={conclusion.observaciones}
                InputProps={{ readOnly: true }}
              />
              {conclusiones.length > 1 && (
                <Box display="flex" justifyContent="flex-end" mt={1}>
                </Box>
              )}
            </Box>
          ))}
          <Box display="flex" justifyContent="flex-end" mt={2}>
          </Box>
        </Box>

        <Box mt={3}>
          <Typography variant="body1" gutterBottom><strong>Plazos y Consideraciones:</strong></Typography>

          {plazos.map((plazo, index) => (
            <Box key={index} display="flex" alignItems="center" mt={1}>
              <TextField 
                fullWidth 
                multiline 
                rows={1} 
                variant="outlined" 
                value={plazo} 
                InputProps={{ readOnly: true }}
              />
            </Box>
          ))}
        </Box>
        <Box display="flex" justifyContent="center" mt={3}>
            <Button
                sx={{
                    backgroundColor: '#0057A8',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '20px',
                    paddingX: 3,
                    marginRight: 2,
                    '&:hover': {
                    backgroundColor: '#004488',
                    }
                }}
                onClick={() => navigate('/reportes-auditoria')}
                >
                Cancelar
            </Button>
            <Button
                sx={{
                    backgroundColor: '#FFB800',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '20px',
                    paddingX: 3,
                    '&:hover': {
                    backgroundColor: '#E0A500',
                    }
                }}
                onClick={handleGuardarReporte}
                >
                Guardar
            </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default VistaPreviaAud;
