import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Box,
  Typography
} from "@mui/material";
import moment from "moment";
import CustomButton from "../Button";
import DialogTitleCustom from "../TitleDialog";

const DetallesAuditoriaDialog = ({
  open,
  onClose,
  event,
  onEdit,
  auditores,
  puedeEditar,
}) => {
  const renderAuditorLider = () => {
    if (!event?.auditorLider) return "Auditor Externo";
    if (typeof event.auditorLider === "object") return event.auditorLider.nombre || "Auditor Externo";
    const a = auditores.find(x => Number(x.idUsuario) === Number(event.auditorLider));
    return a ? [a.nombre, a.apellidoPat, a.apellidoMat].filter(Boolean).join(" ") : "Auditor Externo";
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <DialogTitleCustom title="Detalles de la Auditoría" />
      </Box>
      <DialogContent dividers>
        {event && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "max-content 1fr",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Entidad:
            </Typography>
            <Typography>{event.entidad}</Typography>

            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Proceso:
            </Typography>
            <Typography>{event.proceso}</Typography>

            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Fecha:
            </Typography>
            <Typography>{moment(event.start).format("LL")}</Typography>

            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Hora:
            </Typography>
            <Typography>{event.hora}</Typography>

            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Tipo:
            </Typography>
            <Typography textTransform="capitalize">{event.tipo}</Typography>

            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Estado:
            </Typography>
            <Typography
              sx={{
                color:
                  event.estado === "Finalizada"
                    ? "success.main"
                    : event.estado === "Cancelada"
                      ? "error.main"
                      : "info.main",
                fontWeight: 500,
              }}
            >
              {event.estado}
            </Typography>

            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Auditor Líder:
            </Typography>
            <Typography>{renderAuditorLider()}</Typography>

            {event.auditoresAdicionales?.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", alignSelf: "start" }}>
                  Auditores Adicionales:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {event.auditoresAdicionales.map((aud, idx) => (
                    <Typography component="li" key={idx}>
                      {aud.nombre}
                    </Typography>
                  ))}
                </Box>
              </>
            )}


            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", alignSelf: "start" }}
            >
              Descripción:
            </Typography>
            <Typography sx={{ whiteSpace: "pre-line" }}>
              {event.descripcion || "Sin descripción"}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <CustomButton type="cancelar" onClick={onClose}>
          Cerrar
        </CustomButton>
        {puedeEditar && (
          <CustomButton type="aceptar" onClick={onEdit}>
            Editar
          </CustomButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DetallesAuditoriaDialog;
