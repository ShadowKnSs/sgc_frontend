import React from "react";
import { Box } from "@mui/material";
import MenuCard from "../components/menuCard";
import { useNavigate} from "react-router-dom";
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import DescriptionIcon from "@mui/icons-material/Description";
import Title from "../components/Title";

const TypesReports = () => {
    const navigate = useNavigate();

    const menuItems = [
        { icon: <AnalyticsOutlinedIcon />, title: "Semestral", path: "/principalReportSem"},
        { icon: <AccountTreeOutlinedIcon />, title: "Proceso", path: "/listado-reportes-proceso" },
        { icon: <DescriptionIcon />, title: "Aditoría Interna", path: "/reportes-auditoria"},
    ];

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 5,  // Ajusta la distancia desde el header
                    mb: 5,
                    position: "relative", // Asegura que no se superponga con elementos fijos
                    zIndex: 1 // Eleva el título en caso de solapamiento
                }}
            >
                <Title text="Reportes" sx={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold" }} />
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