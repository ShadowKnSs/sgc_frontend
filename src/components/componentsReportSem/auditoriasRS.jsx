import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TextField } from "@mui/material";

const AuditoriasInternas = ({ data }) => {
  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "Sin registro";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Box sx={{ width: "100%", textAlign: "center", padding: "20px" }}>
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#004A98" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>No.</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Proceso</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Entidad</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Auditor Líder</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} sx={{ backgroundColor: index % 2 ? "#E8E8E8" : "white" }}>
                <TableCell sx={{ fontWeight: "bold" }}>{index + 1}</TableCell>
                <TableCell>{item.NombreProceso || "Sin registro"}</TableCell>
                <TableCell>{item.Entidad || "Sin registro"}</TableCell>
                <TableCell>{item.AuditorLider || "Sin registro"}</TableCell>
                <TableCell>{formatDate(item.fecha)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AuditoriasInternas;
