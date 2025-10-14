import React, { useState, useEffect } from "react";
import { Box, TextField, MenuItem, Card, CardContent, Typography, Grid, IconButton } from "@mui/material";
import CustomButton from "../Button";
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
import Title from "../Title";

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
        icono: ''
    },
    leaders = [],
    macroprocesos = [],
    entidades = [],
    years = [],
    onSubmit,
    onCancel,
    title = "Nuevo Proceso",
}) => {
    const [formData, setFormData] = useState({
        ...initialValues,
        idUsuario: initialValues.idUsuario ? String(initialValues.idUsuario) : ""
    });
    const [selectedIcon, setSelectedIcon] = useState(iconOptions[0].name);
    const isFormValid = [
        formData.nombreProceso,
        formData.idUsuario,
        formData.objetivo,
        formData.alcance,
        formData.idMacroproceso,
        formData.estado,
        formData.idEntidad,
        formData.anioCertificado,
    ].every(val => String(val).trim() !== "");



    const handleSelectIcon = (iconName) => {
        setSelectedIcon(iconName);
    };

    const shallowEqual = (a, b) => {
        const ak = Object.keys(a || {}), bk = Object.keys(b || {});
        if (ak.length !== bk.length) return false;
        for (const k of ak) if (a[k] !== b[k]) return false;
        return true;
    };

    const prevRef = React.useRef(initialValues);

    useEffect(() => {
        if (!shallowEqual(prevRef.current, initialValues)) {
            setFormData(initialValues);
            setSelectedIcon(initialValues.icono || iconOptions[0].name);
            prevRef.current = initialValues;
        }
    }, [initialValues])

    const handleChange = (field) => (e) => {
        const val = field === "idUsuario" ? String(e.target.value) : e.target.value;
        setFormData(prev => ({ ...prev, [field]: val }));
    };

    const handleSubmit = () => {
        // Si onSubmit devuelve una promesa (async), la regresamos
        return onSubmit({ ...formData, icono: selectedIcon });
    };


    const commonStyles = {
        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
        "& .MuiInputBase-root": { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
        "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" },
    };

    return (
        <Card sx={{ width: "100%", maxWidth: 800, p: 3, boxShadow: 3, borderRadius: "12px", margin: "0 auto" }}>
            <CardContent>

                <Title text={title} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
                    <TextField
                        required
                        fullWidth
                        label="Nombre del Proceso"
                        variant="outlined"
                        value={formData.nombreProceso}
                        onChange={handleChange("nombreProceso")}
                        sx={commonStyles}
                    />
                    <TextField
                        required
                        select
                        fullWidth
                        label="Líder del Proceso"
                        value={formData.idUsuario ?? ""}              
                        onChange={handleChange("idUsuario")}
                        sx={commonStyles}
                        disabled={leaders.length === 0}               
                    >
                        <MenuItem value="">{/* opción vacía */}</MenuItem>
                        {leaders.map((l) => (
                            <MenuItem key={l.idUsuario} value={String(l.idUsuario)}>   {/* <- String */}
                                {l.nombre} {l.apellidoPat} {l.apellidoMat}
                            </MenuItem>
                        ))}
                    </TextField>


                    <TextField
                        required
                        fullWidth
                        label="Objetivo del Proceso"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={formData.objetivo}
                        onChange={handleChange("objetivo")}
                        sx={commonStyles}
                        inputProps={{ maxLength: 300 }}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Alcance del Proceso"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={formData.alcance}
                        onChange={handleChange("alcance")}
                        sx={commonStyles}
                        inputProps={{ maxLength: 300 }}
                    />
                    <TextField
                        required
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
                        required
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
                        required
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
                        required
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
                        required
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
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
                    <CustomButton
                        type="cancelar"
                        onClick={onCancel}
                    >
                        {"Cancelar"}
                    </CustomButton>
                    <CustomButton
                        type="guardar"
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                    >
                        Guardar
                    </CustomButton>


                </Box>

            </CardContent>
        </Card>
    );
};

export default ProcessForm;
