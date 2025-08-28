import React, { useState, useEffect, useMemo } from "react";
import { TextField, MenuItem, Typography, Grid, Box, IconButton } from '@mui/material';
import FeedbackSnackbar from "../Feedback";
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

const iconOptions = [
  { name: 'Business', component: BusinessIcon },
  { name: 'School', component: SchoolIcon },
  { name: 'AccountBalance', component: AccountBalanceOutlinedIcon },
  { name: 'HomeWork', component: HomeWorkIcon },
  { name: 'Yard', component: YardOutlinedIcon },
  { name: 'Science', component: ScienceOutlinedIcon },
  { name: 'Biotech', component: BiotechOutlinedIcon },
  { name: 'Psychology', component: PsychologyOutlinedIcon },
  { name: 'Medical', component: MedicalInformationOutlinedIcon },
  { name: 'Bloodtype', component: BloodtypeOutlinedIcon },
  { name: 'LocalHospital', component: LocalHospitalOutlinedIcon },
  { name: 'Topic', component: TopicOutlinedIcon },
  { name: 'Assignment', component: AssignmentOutlinedIcon },
  { name: 'Article', component: ArticleOutlinedIcon },
  { name: 'ImportContacts', component: ImportContactsOutlinedIcon },
  { name: 'AutoStories', component: AutoStoriesOutlinedIcon },
  { name: 'LocalLibrary', component: LocalLibraryOutlinedIcon },
  { name: 'Lightbulb', component: LightbulbOutlinedIcon },
  { name: 'Settings', component: SettingsOutlinedIcon },
  { name: 'PeopleOutline', component: PeopleOutlineOutlinedIcon },
  { name: 'SocialDistance', component: SocialDistanceOutlinedIcon },
  { name: 'Groups', component: GroupsOutlinedIcon },
  { name: 'Gavel', component: GavelOutlinedIcon },
  { name: 'Balance', component: BalanceOutlinedIcon },
  { name: 'Assessment', component: AssessmentOutlinedIcon },
  { name: 'Timeline', component: TimelineOutlinedIcon },
  { name: 'Paid', component: PaidOutlinedIcon },
  { name: 'RequestQuote', component: RequestQuoteOutlinedIcon },
  { name: 'Translate', component: TranslateOutlinedIcon },
  { name: 'Campaign', component: CampaignOutlinedIcon },
  { name: 'LaptopChromebook', component: LaptopChromebookOutlinedIcon },
];

const MAX = 255;

const AddEntidad = ({ onSubmit, initialData, onClose }) => {
  const [form, setForm] = useState({
    nombreEntidad: '',
    tipo: '',
    ubicacion: '',
    icono: ''
  });
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0].name);

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [snack, setSnack] = useState({ open: false, type: "error", title: "", message: "" });
  const closeSnack = () => setSnack(s => ({ ...s, open: false }));

  useEffect(() => {
    if (initialData) {
      setForm({
        nombreEntidad: initialData.nombreEntidad || '',
        tipo: initialData.tipo || '',
        ubicacion: initialData.ubicacion || '',
      });
      setSelectedIcon(initialData.icono || iconOptions[0].name);
    }
  }, [initialData]);


  const iconList = useMemo(() =>
    iconOptions.map(({ name, component: IconComponent }) => (
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
          <IconComponent
            fontSize="large"
            color={selectedIcon === name ? 'primary' : 'action'}
          />
        </IconButton>
      </Grid>
    )), [selectedIcon]);
  const setField = (name, value) => {
    const clipped = value.slice(0, MAX);
    setForm(prev => ({ ...prev, [name]: clipped }));
    if (submitted && errors[name]) {
      setErrors(prev => { const cp = { ...prev }; delete cp[name]; return cp; });
    }
  };

  const validate = () => {
    const e = {};
    const nombreEntidad = (form.nombreEntidad || "").trim();
    const tipo = (form.tipo || "").trim();
    const ubicacion = (form.ubicacion || "").trim();

    if (!nombreEntidad) e.nombreEntidad = "Nombre es obligatorio.";
    else if (nombreEntidad.length > MAX) e.nombreEntidad = `Máximo ${MAX} caracteres.`;

    if (!tipo) e.tipo = "Tipo es obligatorio.";
    else if (tipo.length > MAX) e.tipo = `Máximo ${MAX} caracteres.`;

    if (!ubicacion) e.ubicacion = "Ubicación es obligatoria.";
    else if (ubicacion.length > MAX) e.ubicacion = `Máximo ${MAX} caracteres.`;

    return e;
  };

  const handleSave = async (ev) => {
    ev?.preventDefault?.();
    setSubmitted(true);

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const firstKey = Object.keys(e)[0];
      setSnack({ open: true, type: "error", title: "Validación", message: e[firstKey] });
      return;
    }

    try {
      setSaving(true);
      // onSubmit puede ser sync o async — devolvemos el control al padre
      await Promise.resolve(onSubmit({ ...form, icono: selectedIcon }));
    } catch (err) {
      setSnack({ open: true, type: "error", title: "Error", message: "No se pudo guardar la entidad." });
      return;
    } finally {
      setSaving(false);
    }
  };

  const handleSelectIcon = (iconName) => setSelectedIcon(iconName);

  return (
    <Box component="form" onSubmit={handleSave} sx={{ minWidth: 300 }}>
      <TextField
        fullWidth
        label="Nombre"
        name="nombreEntidad"
        value={form.nombreEntidad}
        onChange={(e) => setField("nombreEntidad", e.target.value)}
        margin="normal"
        inputProps={{ maxLength: MAX }}
        error={!!errors.nombreEntidad}
        helperText={errors.nombreEntidad || `${form.nombreEntidad.length}/${MAX}`}
        InputLabelProps={{ shrink: true, required: true }}
      />

      <TextField
        select
        fullWidth
        label="Tipo"
        name="tipo"
        value={form.tipo}
        onChange={(e) => setField("tipo", e.target.value)}
        margin="normal"
        inputProps={{ maxLength: MAX }}
        error={!!errors.tipo}
        helperText={errors.tipo}
        InputLabelProps={{ shrink: true, required: true }}
      >
        <MenuItem value="Entidad">Entidad</MenuItem>
        <MenuItem value="Dependencia">Dependencia</MenuItem>
      </TextField>

      <TextField
        fullWidth
        label="Ubicación"
        name="ubicacion"
        value={form.ubicacion}
        onChange={(e) => setField("ubicacion", e.target.value)}
        margin="normal"
        inputProps={{ maxLength: MAX }}
        error={!!errors.ubicacion}
        helperText={errors.ubicacion || `${form.ubicacion.length}/${MAX}`}
        InputLabelProps={{ shrink: true, required: true }}
      />

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Selecciona un icono:</Typography>
        <Grid container spacing={2}>
          {iconList}
        </Grid>
      </Box>

      <Box sx={{ textAlign: 'right', mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <CustomButton type="cancelar" onClick={onClose}>
          Cancelar
        </CustomButton>

        <CustomButton
          type="guardar"
          onClick={handleSave}
          loading={saving}
        >
          Guardar
        </CustomButton>
      </Box>

      <FeedbackSnackbar
        open={snack.open}
        onClose={closeSnack}
        type={snack.type}
        title={snack.title}
        message={snack.message}
        autoHideDuration={4000}
      />
    </Box>
  );
};

export default AddEntidad;
