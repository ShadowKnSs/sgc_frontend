import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
    Chip,
    Divider,
    Tooltip,
    Fade,
    alpha
} from "@mui/material";
import { 
    Close, 
    ExpandMore, 
    CheckCircle,
    Schedule,
    Assignment,
    Person
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import CustomButton from "./Button";

const ActividadCard = ({
    actividad,
    onSelect,
    onClose,
    onEdit,
    onDelete,
    isActive,
    isSmall
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const campos = [
        { 
            title: "Actividad de Control", 
            value: actividad.nombreActividad,
            icon: <Assignment sx={{ fontSize: 18 }} />
        },
        { 
            title: "Procedimiento", 
            value: actividad.procedimiento,
            icon: <CheckCircle sx={{ fontSize: 18 }} />
        },
        { 
            title: "Criterio de Aceptación", 
            value: actividad.criterioAceptacion,
            icon: <CheckCircle sx={{ fontSize: 18 }} />
        },
        { 
            title: "Responsable", 
            value: actividad.responsable,
            icon: <Person sx={{ fontSize: 18 }} />
        },
        { 
            title: "Frecuencia", 
            value: actividad.frecuencia,
            icon: <Schedule sx={{ fontSize: 18 }} />
        },
        { 
            title: "Identificación de Salida", 
            value: actividad.identificacionSalida,
            icon: <Assignment sx={{ fontSize: 18 }} />
        },
        { 
            title: "Registro de Salidas", 
            value: actividad.registroSalida,
            icon: <Assignment sx={{ fontSize: 18 }} />
        },
        { 
            
            title: "Características a Verificar", 
            value: actividad.caracteristicasVerificar,
            icon: <Assignment sx={{ fontSize: 18 }} />
        },
        { 
            title: "Tratamiento", 
            value: actividad.tratamiento,
            icon: <Assignment sx={{ fontSize: 18 }} />
        }
    ];

    const cardVariants = {
        hover: {
            y: -8,
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        tap: {
            scale: 0.98,
            transition: { duration: 0.1 }
        }
    };

    const contentVariants = {
        collapsed: {
            opacity: 0.9,
            scale: 0.95
        },
        expanded: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut",
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        collapsed: {
            opacity: 0,
            y: 20,
            scale: 0.9
        },
        expanded: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
        <Card
            component={motion.div}
            layout
            variants={cardVariants}
            whileHover={!isActive ? "hover" : undefined}
            whileTap={!isActive ? "tap" : undefined}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            sx={{
                width: isActive ? "100%" : isSmall ? 200 : 260,
                maxWidth: "100%",
                height: isActive ? "auto" : 160,
                backgroundColor: "#fff",
                borderRadius: 3,
                cursor: isActive ? "default" : "pointer",
                position: "relative",
                overflow: "hidden",
                border: isActive ? `2px solid ${alpha('#004A98', 0.2)}` : "1px solid transparent",
                boxShadow: isActive 
                    ? `0 12px 40px ${alpha('#004A98', 0.15)}` 
                    : isHovered 
                        ? `0 8px 32px ${alpha('#004A98', 0.12)}` 
                        : `0 2px 12px ${alpha('#000', 0.08)}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: isActive 
                    ? `linear-gradient(145deg, #fff 0%, ${alpha('#004A98', 0.02)} 100%)`
                    : '#fff',
                '&::before': isActive ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #004A98 0%, #0066CC 100%)',
                    zIndex: 1
                } : {}
            }}
            onClick={!isActive ? () => onSelect?.(actividad) : undefined}
        >
            <AnimatePresence mode="wait">
                {isActive ? (
                    <motion.div
                        key="expanded"
                        variants={contentVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                    >
                        <CardContent sx={{ pt: 3, pb: 2 }}>
                            {/* Header con título y botón cerrar */}
                            <Box sx={{ 
                                display: "flex", 
                                alignItems: "flex-start", 
                                justifyContent: "space-between", 
                                mb: 3 
                            }}>
                                <Box sx={{ flex: 1, mr: 2 }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            color: "#004A98",
                                            lineHeight: 1.2,
                                            mb: 1
                                        }}
                                    >
                                        {actividad.nombreActividad || "Actividad sin nombre"}
                                    </Typography>
                                    <Chip
                                        label="Actividad de Control"
                                        size="small"
                                        sx={{
                                            backgroundColor: alpha('#004A98', 0.1),
                                            color: '#004A98',
                                            fontWeight: 500,
                                            fontSize: '0.75rem'
                                        }}
                                    />
                                </Box>
                                <Tooltip title="Cerrar" arrow>
                                    <IconButton
                                        onClick={() => onClose?.(actividad)}
                                        sx={{
                                            backgroundColor: alpha('#f44336', 0.1),
                                            color: '#f44336',
                                            '&:hover': {
                                                backgroundColor: alpha('#f44336', 0.2),
                                                transform: 'rotate(90deg)'
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                        size="small"
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            <Divider sx={{ mb: 3, opacity: 0.5 }} />

                            {/* Grid de campos */}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                                    gap: 3,
                                    mb: 4
                                }}
                            >
                                {campos.slice(1).map((campo, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                    >
                                        <Box
                                            sx={{
                                                p: 2.5,
                                                backgroundColor: alpha('#f8f9fa', 0.8),
                                                borderRadius: 2,
                                                border: `1px solid ${alpha('#e0e0e0', 0.5)}`,
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: alpha('#004A98', 0.03),
                                                    borderColor: alpha('#004A98', 0.2),
                                                    transform: 'translateY(-1px)'
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Box sx={{ 
                                                    color: '#004A98', 
                                                    mr: 1,
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}>
                                                    {campo.icon}
                                                </Box>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: "#004A98",
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    {campo.title}
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "#555",
                                                    whiteSpace: "pre-line",
                                                    lineHeight: 1.5,
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                {campo.value || (
                                                    <span style={{ 
                                                        color: '#999', 
                                                        fontStyle: 'italic' 
                                                    }}>
                                                        Sin información disponible
                                                    </span>
                                                )}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                ))}
                            </Box>

                            {/* Botones de acción */}
                            <motion.div variants={itemVariants}>
                                <Box
                                    sx={{
                                        pt: 2,
                                        borderTop: `1px solid ${alpha('#e0e0e0', 0.5)}`,
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: 1.5,
                                        flexWrap: "wrap"
                                    }}
                                >
                                    <Tooltip title="Eliminar actividad" arrow>
                                        <Box>
                                            <CustomButton 
                                                type="cancelar" 
                                                onClick={() => onDelete?.(actividad)}
                                                sx={{
                                                    minWidth: 120,
                                                    fontWeight: 500
                                                }}
                                            >
                                                Eliminar
                                            </CustomButton>
                                        </Box>
                                    </Tooltip>
                                    <Tooltip title="Editar actividad" arrow>
                                        <Box>
                                            <CustomButton 
                                                type="editar" 
                                                onClick={() => onEdit?.(actividad)}
                                                sx={{
                                                    minWidth: 120,
                                                    fontWeight: 500
                                                }}
                                            >
                                                Editar
                                            </CustomButton>
                                        </Box>
                                    </Tooltip>
                                </Box>
                            </motion.div>
                        </CardContent>
                    </motion.div>
                ) : (
                    <motion.div
                        key="collapsed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <CardContent sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            p: 2.5,
                            position: 'relative'
                        }}>
                            {/* Icono de fondo decorativo */}
                            <Box sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                color: alpha('#004A98', 0.1),
                                transform: 'rotate(15deg)'
                            }}>
                                <Assignment sx={{ fontSize: 24 }} />
                            </Box>

                            <Box sx={{ 
                                flex: 1, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: "#004A98",
                                        lineHeight: 1.3,
                                        mb: 1,
                                        overflow: "hidden",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        textOverflow: "ellipsis"
                                    }}
                                >
                                    {actividad.nombreActividad || `Actividad ${actividad.idActividad || "Sin ID"}`}
                                </Typography>

                                {actividad.responsable && (
                                    <Chip
                                        icon={<Person sx={{ fontSize: 14 }} />}
                                        label={actividad.responsable}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            fontSize: '0.7rem',
                                            height: 24,
                                            borderColor: alpha('#004A98', 0.3),
                                            color: '#004A98',
                                            mb: 1
                                        }}
                                    />
                                )}
                            </Box>

                            {/* Indicador de "click para expandir" */}
                            <Fade in={isHovered}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mt: 1,
                                    color: alpha('#004A98', 0.7)
                                }}>
                                    <Typography variant="caption" sx={{ mr: 0.5, fontSize: '0.7rem' }}>
                                        Ver detalles
                                    </Typography>
                                    <motion.div
                                        animate={{ y: [0, 2, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    >
                                        <ExpandMore sx={{ fontSize: 16 }} />
                                    </motion.div>
                                </Box>
                            </Fade>
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
};

export default ActividadCard;