import React, { useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CustomCalendarToolbar from "../components/BarraCalendario";

moment.locale("es");
const localizer = momentLocalizer(moment);

const STATUS_COLOR = {
    Pendiente: "#0288d1", // azul
    Finalizada: "#2e7d32", // verde
    Cancelada: "#c62828", // rojo
};

const AuditoriaCalendar = ({
    events = [],
    view,
    date,
    setView,
    setDate,
    onSelectEvent
}) => {
    const capitalizeFirstLetter = (str) =>
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const formats = {
        monthHeaderFormat: (date) =>
            capitalizeFirstLetter(moment(date).format("MMMM YYYY")),
        dayHeaderFormat: (date) =>
            capitalizeFirstLetter(moment(date).format("dddd, D")),
        dayRangeHeaderFormat: ({ start, end }) =>
            `${capitalizeFirstLetter(moment(start).format("D MMMM"))} - ${capitalizeFirstLetter(moment(end).format("D MMMM"))}`,
    };

    const customEventStyleGetter = (event) => {
        const bg = STATUS_COLOR[event.estado] ?? STATUS_COLOR.Pendiente;
        return {
            style: {
                backgroundColor: bg,
                color: "#fff",
                borderRadius: 8,
                padding: "2px 6px",      // ← compacto
                marginBottom: 3,         // ← compacto
                fontSize: "0.78rem",     // ← compacto
                lineHeight: 1.2,
                minHeight: 22,           // ← compacto
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                whiteSpace: "nowrap",    // ← una línea
                textOverflow: "ellipsis" // ← puntos suspensivos
            }
        };
    };


    const handleView = useCallback((newView) => setView(newView), [setView]);
    const handleNavigate = useCallback((newDate) => setDate(newDate), [setDate]);

    const renderEvent = ({ event }) => {
        const isExternal = String(event.tipo || '').toLowerCase() === 'externa';
        const leaderName = isExternal
            ? 'No líder asignado (auditoría externa)'
            : (typeof event.auditorLider === 'object'
                ? (event.auditorLider?.nombre || 'No asignado')
                : (event.auditorLider || 'No asignado'));

        return (
            <Tooltip
                title={
                    <Box>
                        <Typography fontSize={13}><strong>Hora:</strong> {event.hora}</Typography>
                        <Typography fontSize={13}><strong>Auditor Líder:</strong> {leaderName}</Typography>
                    </Box>
                }
                arrow
                placement="top"
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography sx={{ fontWeight: 500 }}>{event.title}</Typography>
                    <Chip
                        size="small"
                        label={capitalizeFirstLetter(event.estado)}
                        sx={{
                            backgroundColor: STATUS_COLOR[event.estado] ?? STATUS_COLOR.Pendiente,
                            color: "white",
                            height: 18,
                            fontSize: "0.68rem",
                            ml: 0.5
                        }}
                    />
                </Box>
            </Tooltip>
        );
    };

    return (
        <div
            style={{
                // Altura un poco mayor; ajusta según necesidad visual de tu layout
                height: "calc(100vh - 180px)",
                minHeight: 700,
                width: "100%",
                maxWidth: "1450px",      // quitar límite anterior
                margin: "0 auto",
                padding: "12px 16px 48px",
                boxSizing: "border-box",
            }}
        >
            <Calendar
                localizer={localizer}
                events={Array.isArray(events) ? events : []}
                view={view}
                date={date}
                onView={handleView}
                onNavigate={handleNavigate}
                startAccessor="start"
                endAccessor="end"
                views={["month", "week", "day"]}
                popup
                messages={{
                    showMore: total => `+${total} más`,
                    today: "Hoy",
                    previous: "Anterior",
                    next: "Siguiente",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                }}
                formats={formats}
                onSelectEvent={onSelectEvent}
                eventPropGetter={customEventStyleGetter}
                components={{
                    toolbar: CustomCalendarToolbar,
                    event: renderEvent
                }}
            />
        </div>
    );

};

export default AuditoriaCalendar;
