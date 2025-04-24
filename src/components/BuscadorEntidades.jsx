import React, { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { TextField, Box, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const EntidadSearch = ({ entidades, onFiltrar }) => {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => new Fuse(entidades, {
    keys: ["nombreEntidad"],
    threshold: 0.4,
  }), [entidades]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    const resultados = value.trim()
      ? fuse.search(value).map(r => r.item)
      : entidades;
    onFiltrar(resultados);
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "0 auto", mb: 4 }}>
      <TextField
        fullWidth
        value={query}
        onChange={handleChange}
        placeholder="Buscar Entidad o Dependencia"
        variant="outlined"
        sx={{
            borderRadius: "16px",      // <- radio del borde
            '& .MuiOutlinedInput-root': {
              borderRadius: "16px",    // <- radio del borde del input
              height: "50px",          // <- alto del buscador
              fontSize: "16px",        // <- tamaño del texto
            },
          }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
    </Box>
  );
};

export default EntidadSearch;
