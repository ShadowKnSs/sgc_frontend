import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  Slide
} from "@mui/material";
import DialogTitleCustom from "../TitleDialog";
import CustomButton from "../Button";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PERIODOS = ["Semestral", "Trimestral", "Anual"];
const normalizePeriodo = (v) => {
  const s = String(v ?? "").trim().toLowerCase();
  const match = PERIODOS.find(p => p.toLowerCase() === s);
  return match || "";
};

const IndicadorForm = ({
  open,
  onClose,
  onSave,
  formData,
  setFormData,
  modo = "crear",
  showSnackbar
}) => {
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const limits = useMemo(() => ({
    descripcion: 512,
    formula: 512,
    responsable: 255
  }), []);

  const validate = () => {
    const e = {};
    const desc = (formData.descripcion || "").trim();
    const form = (formData.formula || "").trim();
    const resp = (formData.responsable || "").trim();
    const per = normalizePeriodo(formData.periodo);
    const metaNum = Number(formData.meta);

    if (!desc) e.descripcion = "Descripción es obligatoria.";
    else if (desc.length > limits.descripcion) e.descripcion = `Máximo ${limits.descripcion} caracteres.`;

    if (!form) e.formula = "Fórmula es obligatoria.";
    else if (form.length > limits.formula) e.formula = `Máximo ${limits.formula} caracteres.`;

    if (!resp) e.responsable = "Responsable es obligatorio.";
    else if (resp.length > limits.responsable) e.responsable = `Máximo ${limits.responsable} caracteres.`;

    if (!per) e.periodo = "Período es obligatorio.";

    if (!Number.isFinite(metaNum)) e.meta = "Meta debe ser un número.";
    else if (metaNum < 1 || metaNum > 100) e.meta = "Meta debe estar entre 1 y 100.";

    return e;
  };

  const handleSave = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const firstKey = Object.keys(e)[0];
      if (showSnackbar) {
        showSnackbar(e[firstKey], "error", "Error de validación");
      }
      return;
    }

    try {
      setSaving(true);
      await onSave?.();
      if (showSnackbar) {
        showSnackbar("Indicador guardado correctamente", "success", "Éxito");
      }
      onClose();
    } catch (error) {
      console.error("Error guardando indicador:", error);
      if (showSnackbar) {
        showSnackbar("No se pudo guardar el indicador", "error", "Error");
      }
    } finally {
      setSaving(false);
    }
  };

  // Handlers con clamp/limites
  const onChangeText = (key, max) => (ev) => {
    const val = (ev.target.value || "").slice(0, max);
    setFormData({ ...formData, [key]: val });
    if (errors[key]) setErrors(prev => { const cp = { ...prev }; delete cp[key]; return cp; });
  };


  const onChangeMeta = (ev) => {
    let v = ev.target.value;
    // permitir cadena vacía mientras escribe
    if (v === "") { 
      setFormData({ ...formData, meta: "" }); 
      if (errors.meta) setErrors(p => { const cp = { ...p }; delete cp.meta; return cp; }); 
      return; 
    }
    let n = Number(v);
    if (!Number.isFinite(n)) n = 0;
    // clamp 1..100
    if (n < 1) n = 1;
    if (n > 100) n = 100;
    setFormData({ ...formData, meta: n });
    if (errors.meta) setErrors(prev => { const cp = { ...prev }; delete cp.meta; return cp; });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Transition}
      keepMounted
    >
      <DialogTitleCustom
        title={modo === "editar" ? "Editar Indicador" : "Agregar Nuevo Indicador"}
        subtitle="Complete todos los campos para continuar"
      />

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
          <TextField
            label="Descripción"
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            value={formData.descripcion ?? ""}
            onChange={onChangeText("descripcion", limits.descripcion)}
            inputProps={{ maxLength: limits.descripcion }}
            error={!!errors.descripcion}
            helperText={errors.descripcion || `${(formData.descripcion || "").length}/${limits.descripcion}`}
            InputLabelProps={{ shrink: true, required: true }}
          />

          <TextField
            label="Fórmula"
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            value={formData.formula ?? ""}
            onChange={onChangeText("formula", limits.formula)}
            inputProps={{ maxLength: limits.formula }}
            error={!!errors.formula}
            helperText={errors.formula || `${(formData.formula || "").length}/${limits.formula}`}
            InputLabelProps={{ shrink: true, required: true }}
          />

          <TextField
            label="Período"
            fullWidth
            select
            variant="outlined"
            value={normalizePeriodo(formData.periodo ?? formData.periodoMed)}
            onChange={(e) => {
              const val = e.target.value;
              setFormData({ ...formData, periodo: val, periodoMed: val });
            }}
            error={!!errors.periodo}
            helperText={errors.periodo}
            InputLabelProps={{ shrink: true, required: true }}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=""><em>Seleccione…</em></MenuItem>
            {PERIODOS.map(p => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Responsable"
            fullWidth
            variant="outlined"
            value={formData.responsable ?? ""}
            onChange={onChangeText("responsable", limits.responsable)}
            inputProps={{ maxLength: limits.responsable }}
            error={!!errors.responsable}
            helperText={errors.responsable || `${(formData.responsable || "").length}/${limits.responsable}`}
            InputLabelProps={{ shrink: true, required: true }}
          />

          <TextField
            label="Meta (1–100)"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.meta ?? ""}
            onChange={onChangeMeta}
            inputProps={{ min: 1, max: 100, step: 1 }}
            error={!!errors.meta}
            helperText={errors.meta}
            InputLabelProps={{ shrink: true, required: true }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", p: 2 }}>
        <CustomButton type="cancelar" onClick={onClose}>
          Cancelar
        </CustomButton>
        <CustomButton type="guardar" onClick={handleSave} loading={saving}>
          Guardar Indicador
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default IndicadorForm;