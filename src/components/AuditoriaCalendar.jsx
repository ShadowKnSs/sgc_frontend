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
        let backgroundColor = "#0288d1";
        if (event.estado === "Finalizada") backgroundColor = "#2e7d32";
        if (event.estado === "Cancelada") backgroundColor = "#c62828";

        return {
            style: {
                backgroundColor,
                borderRadius: "10px",
                color: "#fff",
                padding: "6px 10px",
                marginBottom: "6px", // <-- Espacio entre eventos
                fontSize: "0.85rem",
                fontWeight: 500,
                lineHeight: 1.4,
                minHeight: 36, // <-- Altura mínima
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                whiteSpace: "normal",
                wordBreak: "break-word",
            }
        };
    };


    const handleView = useCallback((newView) => setView(newView), [setView]);
    const handleNavigate = useCallback((newDate) => setDate(newDate), [setDate]);

    const renderEvent = ({ event }) => (
        <Tooltip
            title={
                <Box>
                    <Typography fontSize={13}><strong>Hora:</strong> {event.hora}</Typography>
                    <Typography fontSize={13}><strong>Auditor Líder:</strong> {event.auditorLider}</Typography>
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
                        backgroundColor:
                            event.estado === "Finalizada" ? "#66bb6a" :
                                event.estado === "Cancelada" ? "#ef5350" :
                                    "#42a5f5",
                        color: "white",
                        height: 20,
                        fontSize: "0.7rem"
                    }}
                />
            </Box>
        </Tooltip>
    );

    return (
        <div
            style={{
                height: "calc(100vh - 120px)", // Altura adaptativa
                width: "100%",
                maxWidth: "1200px",            // Espacio más amplio
                margin: "0 auto",              // Centrado horizontal
                padding: "16px",               // Espacio interno
                boxSizing: "border-box"
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
