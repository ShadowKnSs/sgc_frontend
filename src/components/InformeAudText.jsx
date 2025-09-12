import React, { useState, useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";
import FeedbackSnackbar from "./Feedback";

const InformeAudText = ({
  label,
  value,
  onChange,
  maxChars = 255,
  minRows = 1,
  maxRows = 5,
  placeholder = "",
}) => {
  const [error, setError] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, type: "error", title: "", message: "" });

  const showSnackbar = (title, message) =>
    setSnackbar({ open: true, type: "error", title, message });

  // Validación en tiempo real
  useEffect(() => {
    if (value.trim() === "") {
      setError(true);
    } else {
      setError(false);
    }
  }, [value]);

  // Función que se puede usar al intentar enviar formulario
  const validateField = () => {
    if (value.trim() === "") {
      setError(true);
      showSnackbar("Campo obligatorio", `El campo "${label}" no puede estar vacío.`);
      return false;
    }
    return true;
  };

  return (
    <Box mt={2}>
      {label && (
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
          {label}
        </Typography>
      )}
      <TextField
        fullWidth
        placeholder={placeholder}
        variant="outlined"
        value={value}
        onChange={onChange}
        multiline
        minRows={minRows}
        maxRows={maxRows}
        inputProps={{ maxLength: maxChars }}
        error={error}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "#fff",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: error ? "red" : "#ccc",
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: error ? "red" : "#004A98",
          },
        }}
      />
      <Typography
        variant="caption"
        sx={{ display: "block", textAlign: "right", color: "text.secondary", mt: 0.5 }}
      >
        {value.length}/{maxChars}
      </Typography>

      <FeedbackSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        type={snackbar.type}
        title={snackbar.title}
        message={snackbar.message}
      />
    </Box>
  );
};

export default InformeAudText;
