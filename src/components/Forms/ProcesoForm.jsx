import React, { useState, useEffect } from "react";
import { Box, TextField, MenuItem, Card, CardContent, Typography, Grid, IconButton } from "@mui/material";
import DialogActionButtons from "../DialogActionButtons"; // o el componente que uses para los botones
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import YardOutlinedIcon from '@mui/icons-material/YardOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';
import BiotechOutlinedIcon from '@mui/icons-material/BiotechOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import SocialDistanceOutlinedIcon from '@mui/icons-material/SocialDistanceOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import LaptopChromebookOutlinedIcon from '@mui/icons-material/LaptopChromebookOutlined';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';


const iconOptions = [
    { name: 'Business', component: <BusinessIcon /> },
    { name: 'School', component: <SchoolIcon /> },
    { name: 'AccountBalance', component: <AccountBalanceOutlinedIcon /> },
    { name: 'HomeWork', component: <HomeWorkIcon /> },
    { name: 'Yard', component: <YardOutlinedIcon /> },
    { name: 'Science', component: <ScienceOutlinedIcon /> },
    { name: 'Biotech', component: <BiotechOutlinedIcon /> },
    { name: 'Psychology', component: <PsychologyOutlinedIcon /> },
    { name: 'Medical', component: < MedicalInformationOutlinedIcon /> },
    { name: 'Bloodtype', component: <BloodtypeOutlinedIcon /> },
    { name: 'LocalHospital', component: <LocalHospitalOutlinedIcon /> },
    { name: 'Topic', component: <TopicOutlinedIcon /> },
    { name: 'Assignment', component: <AssignmentOutlinedIcon /> },
    { name: 'Article', component: <ArticleOutlinedIcon /> },
    { name: 'ImportContacts', component: <ImportContactsOutlinedIcon /> },
    { name: 'AutoStories', component: <AutoStoriesOutlinedIcon /> },
    { name: 'LocalLibrary', component: <LocalLibraryOutlinedIcon /> },
    { name: 'Lightbulb', component: <LightbulbOutlinedIcon /> },
    { name: 'Settings', component: <SettingsOutlinedIcon /> },
    { name: 'PeopleOutline', component: <PeopleOutlineOutlinedIcon /> },
    { name: 'SocialDistance', component: <SocialDistanceOutlinedIcon /> },
    { name: 'Groups', component: <GroupsOutlinedIcon /> },
    { name: 'Gavel', component: <GavelOutlinedIcon /> },
    { name: 'Balance', component: <BalanceOutlinedIcon /> },
    { name: 'Assessment', component: <AssessmentOutlinedIcon /> },
    { name: 'Timeline', component: <TimelineOutlinedIcon /> },
    { name: 'Paid', component: <PaidOutlinedIcon /> },
    { name: 'RequestQuote', component: <RequestQuoteOutlinedIcon /> },
    { name: 'Translate', component: <TranslateOutlinedIcon /> },
    { name: 'Campaign', component: <CampaignOutlinedIcon /> },
    { name: 'LaptopChromebook', component: <LaptopChromebookOutlinedIcon /> },

];

const ProcessForm = ({
    initialValues = {
        nombreProceso: "",
        idUsuario: "",
        objetivo: "",
        alcance: "",
        norma: "",
        idMacroproceso: "",
        estado: "",
        idEntidad: "",
        anioCertificado: "",
        icono:''
    },
    leaders = [],
    macroprocesos = [],
    entidades = [],
    years = [],
    onSubmit,
    onCancel,
    title = "Nuevo Proceso",
}) => {
    const [formData, setFormData] = useState(initialValues);
    const [selectedIcon, setSelectedIcon] = useState(iconOptions[0].name);

    const handleSelectIcon = (iconName) => {
        setSelectedIcon(iconName);
    };

    useEffect(() => {
        setFormData(initialValues);
        console.log("Form data precargado:", initialValues);
    }, [initialValues]);

    const handleChange = (field) => (e) => {
        setFormData({
            ...formData,
            [field]: e.target.value,
        });
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    const commonStyles = {
        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
        "& .MuiInputBase-root": { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
        "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" },
    };

    return (
        <Card sx={{ width: "100%", maxWidth: 800, p: 3, boxShadow: 3, borderRadius: "12px", margin: "0 auto" }}>
            <CardContent>
                <Typography variant="h1" sx={{ textAlign: "center", mb: 3, color: "primary.main", fontSize: "2.5rem" }}>
                    {title}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Nombre del Proceso"
                        variant="outlined"
                        value={formData.nombreProceso}
                        onChange={handleChange("nombreProceso")}
                        sx={commonStyles}
                    />
                    <TextField
                        select
                        fullWidth
                        label="Líder del Proceso"
                        value={formData.idUsuario}
                        onChange={handleChange("idUsuario")}
                        sx={commonStyles}
                    >
                        <MenuItem value=""></MenuItem>
                        {leaders.map((l) => (
                            <MenuItem key={l.idUsuario} value={l.idUsuario}>
                                {l.nombre} {l.apellidoPat} {l.apellidoMat}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="Objetivo del Proceso"
                        multiline
                        rows={3}
                        variant="outlined"
                        value={formData.objetivo}
                        onChange={handleChange("objetivo")}
                        sx={commonStyles}
                    />
                    <TextField
                        fullWidth
                        label="Alcance del Proceso"
                        multiline
                        rows={3}
                        variant="outlined"
                        value={formData.alcance}
                        onChange={handleChange("alcance")}
                        sx={commonStyles}
                    />
                    <TextField
                        select
                        fullWidth
                        label="Norma"
                        value={formData.norma}
                        onChange={handleChange("norma")}
                        sx={commonStyles}
                    >
                        <MenuItem value="ISO 9001">ISO 9001</MenuItem>
                        <MenuItem value="ISO 14001">ISO 14001</MenuItem>
                        <MenuItem value="ISO 45001">ISO 45001</MenuItem>
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Macroproceso"
                        value={formData.idMacroproceso}
                        onChange={handleChange("idMacroproceso")}
                        sx={commonStyles}
                    >
                        {macroprocesos.map((mp) => (
                            <MenuItem key={mp.idMacroproceso} value={mp.idMacroproceso}>
                                {mp.tipoMacroproceso}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Estado"
                        value={formData.estado}
                        onChange={handleChange("estado")}
                        sx={commonStyles}
                    >
                        <MenuItem value="Activo">Activo</MenuItem>
                        <MenuItem value="Inactivo">Inactivo</MenuItem>
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Entidad/Dependencia"
                        value={formData.idEntidad}
                        onChange={handleChange("idEntidad")}
                        sx={commonStyles}
                    >
                        {entidades.map((ent) => (
                            <MenuItem key={ent.idEntidadDependencia} value={ent.idEntidadDependencia}>
                                {ent.nombreEntidad}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Año de Certificación"
                        value={formData.anioCertificado}
                        onChange={handleChange("anioCertificado")}
                        sx={commonStyles}
                    >
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Selecciona un icono:</Typography>
                    <Grid container spacing={2}>
                        {iconOptions.map(({ name, component }) => (
                            <Grid item key={name}>
                                <IconButton
                                    onClick={() => handleSelectIcon(name)}
                                    sx={{
                                        border: selectedIcon === name ? '2px solid' : '1px dashed',
                                        borderColor: selectedIcon === name ? 'primary.main' : 'grey.400',
                                        borderRadius: 2,
                                        p: 1,
                                        backgroundColor: selectedIcon === name ? 'primary.light' : 'transparent'
                                    }}
                                >
                                    {React.cloneElement(component, {
                                        fontSize: 'large',
                                        color: selectedIcon === name ? 'primary' : 'action'
                                    })}
                                </IconButton>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <DialogActionButtons
                        onCancel={onCancel}
                        onSave={handleSubmit}
                        saveText={title.includes("Editar") ? "Actualizar" : "Guardar"}
                        cancelText="Cancelar"
                        saveColor="#F9B800"
                        cancelColor="#0056b3"
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProcessForm;
