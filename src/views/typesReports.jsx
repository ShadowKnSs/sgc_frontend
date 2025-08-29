/**
 * Vista: TypesReports
 * Descripción:
 * Muestra al usuario un menú visual con acceso a tres tipos de reportes disponibles en el sistema:
 * - Reporte Semestral
 * - Reporte de Proceso
 * - Reporte de Auditoría Interna
 *
 * Características:
 * - Utiliza `MenuCard` para mostrar íconos y títulos en tarjetas.
 * - Se apoya en el componente `Title` para mostrar el encabezado.
 * - Redirecciona a la ruta correspondiente al hacer clic en cada tarjeta.
 */
import React from "react";
import { Box } from "@mui/material";
import MenuCard from "../components/menuCard";
import { useNavigate } from "react-router-dom";
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import SummarizeIcon from '@mui/icons-material/Summarize';
import DescriptionIcon from "@mui/icons-material/Description";
import Title from "../components/Title";
import BreadcrumbNav from "../components/BreadcrumbNav";

const TypesReports = () => {
    const navigate = useNavigate();

    const menuItems = [
        { icon: <AnalyticsOutlinedIcon />, title: "Semestral", path: "/principalReportSem" },
        { icon: <AccountTreeOutlinedIcon />, title: "Proceso", path: "/listado-reportes-proceso" },
        { icon: <DescriptionIcon />, title: "Auditoría Interna", path: "/reportes-auditoria" },
    ];

    return (
        <Box sx={{p:3}}>
            <BreadcrumbNav items={[{ label: "Reportes", icon: SummarizeIcon }]} />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,  // Ajusta la distancia desde el header
                    mb: 5,
                    position: "relative", // Asegura que no se superponga con elementos fijos
                    zIndex: 1 // Eleva el título en caso de solapamiento
                }}
            >
                <Title text="Reportes" mode="sticky"  />
            </Box>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 10,
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    //height: "100vh",
                    //padding: 0,
                    maxWidth: "800px",
                    margin: "auto",
                }}
            >
                {menuItems.slice(0, 4).map((item, index) => (
                    <MenuCard
                        key={index}
                        icon={item.icon}
                        title={item.title}
                        sx={{ textAlign: "center" }}
                        onClick={() => navigate(item.path)}
                    />
                ))}

                <Box
                    sx={{
                        gridColumn: "span 4",
                        display: "flex",
                        justifyContent: "center",
                        gap: 10,
                        marginTop: -30,
                    }}
                >
                    {menuItems.slice(4).map((item, index) => (
                        <MenuCard
                            key={index + 4}
                            icon={item.icon}
                            title={item.title}
                            sx={{ textAlign: "center" }}
                            onClick={() => navigate(item.path)}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default TypesReports;