import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export const useProyectoMejoraForm = () => {
    const { idRegistro } = useParams();
    const navigate = useNavigate();

    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        idRegistro: "",
        division: "",
        departamento: "",
        fecha: new Date().toISOString().split("T")[0],
        noMejora: "",
        responsable: "",
        descripcionMejora: "",
        objetivos: [{ descripcion: "" }],
        areaImpacto: "",
        personalBeneficiado: "",
        responsables: [{ nombre: "" }],
        situacionActual: "",
        indicadoresExito: [{ nombre: "", meta: "" }],
        recursos: [{ tiempoEstimado: "", recursosMatHum: "" }],
        costoProyecto: "",
        actividadesPM: [{ actividad: "", responsable: "", fecha: "" }],
        aprobacionNombre: "",
        aprobacionPuesto: ""
    });

    const [validando, setValidando] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    useEffect(() => {
        if (idRegistro) {
            setFormData(prev => ({ ...prev, idRegistro }));
        }
    }, [idRegistro]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDynamicChange = (section, index, field, value) => {
        const updated = [...formData[section]];
        updated[index][field] = value;
        setFormData(prev => ({ ...prev, [section]: updated }));
    };

    const addDynamicField = (section, newItem) => {
        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], newItem]
        }));
    };

    const removeDynamicField = (section, index) => {
        const updated = [...formData[section]];
        updated.splice(index, 1);
        setFormData(prev => ({ ...prev, [section]: updated }));
    };

    const handleStep = (step) => () => setActiveStep(step);
    const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, 7));
    const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

    const erroresCampos = validando
        ? {
            division: !formData.division?.trim(),
            departamento: !formData.departamento?.trim(),
            fecha: !formData.fecha?.trim(),
            noMejora: !formData.noMejora?.toString().trim(),
            responsable: !formData.responsable?.trim(),
            descripcionMejora: !formData.descripcionMejora?.trim(),
            areaImpacto: !formData.areaImpacto?.trim(),
            personalBeneficiado: !formData.personalBeneficiado?.toString().trim(),
            situacionActual: !formData.situacionActual?.trim(),
            costoProyecto: !formData.costoProyecto?.toString().trim(),
            aprobacionNombre: !formData.aprobacionNombre?.trim(),
            aprobacionPuesto: !formData.aprobacionPuesto?.trim(),

            ...Object.fromEntries(
                formData.objetivos.map((obj, i) => [
                    `objetivos.${i}.descripcion`,
                    !obj.descripcion?.trim(),
                ])
            ),

            ...Object.fromEntries(
                formData.responsables.map((resp, i) => [
                    `responsables.${i}.nombre`,
                    !resp.nombre?.trim(),
                ])
            ),

            ...Object.fromEntries(
                formData.indicadoresExito.flatMap((ind, i) =>
                    Object.entries({
                        [`indicadoresExito.${i}.nombre`]: !ind.nombre?.trim(),
                        [`indicadoresExito.${i}.meta`]: !ind.meta?.toString().trim(),
                    })
                )
            ),

            ...Object.fromEntries(
                formData.recursos.flatMap((rec, i) =>
                    Object.entries({
                        [`recursos.${i}.tiempoEstimado`]: !rec.tiempoEstimado?.trim(),
                        [`recursos.${i}.recursosMatHum`]: !rec.recursosMatHum?.trim(),
                    })
                )
            ),

            ...Object.fromEntries(
                formData.actividadesPM.flatMap((act, i) =>
                    Object.entries({
                        [`actividadesPM.${i}.actividad`]: !act.actividad?.trim(),
                        [`actividadesPM.${i}.responsable`]: !act.responsable?.trim(),
                        [`actividadesPM.${i}.fecha`]: !act.fecha?.trim(),
                    })
                )
            ),
        }
        : {};

    const handleSubmit = async () => {
        setValidando(true);

        const hayErrores = Object.values(erroresCampos).some((v) => v === true);
        if (hayErrores) {
            setSnackbar({
                open: true,
                message: "Hay campos obligatorios sin completar.",
                severity: "error",
            });
            return;
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/proyecto-mejora", formData);
            setSnackbar({
                open: true,
                message: "Proyecto guardado correctamente!",
                severity: "success"
            });
            setTimeout(() => {
                navigate(-1);
            }, 1000);
        } catch (error) {
            console.error("Error al guardar:", error);
            setSnackbar({
                open: true,
                message: "Error al guardar el proyecto.",
                severity: "error"
            });
        }
    };

    return {
        idRegistro,
        formData,
        setFormData,
        activeStep,
        handleStep,
        handleNext,
        handleBack,
        handleChange,
        handleDynamicChange,
        addDynamicField,
        removeDynamicField,
        handleSubmit,
        snackbar,
        setSnackbar,
        erroresCampos
    };
};
