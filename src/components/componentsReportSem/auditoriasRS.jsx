import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TextField } from "@mui/material";

const AuditoriasInternas = ({ data }) => {
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
                                <TableCell>{item.NombreProceso}</TableCell>
                                <TableCell>{item.Entidad}</TableCell>
                                <TableCell>{item.AuditorLider}</TableCell>
                                <TableCell>{item.fecha}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AuditoriasInternas;
