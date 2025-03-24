import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const RiesgosTable = ({ data }) => {
    // Modificamos los datos para agrupar por riesgo
    const formattedData = data.map((item, index) => ({
        name: `Riesgo ${index + 1}`,
        severidad: item.valorSeveridad,
        ocurrencia: item.valorOcurrencia,
        nrp: item.valorNRP,
    }));
    return (
        <div style={{ width: "100%", textAlign: "center", padding: "20px" }}>
            {/* Tabla */}
            <TableContainer component={Paper} sx={{ mt: 5, boxShadow: 3, borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#004A98" }}>
                            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Riesgo</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Proceso</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Entidad</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Fuente</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index} sx={{ backgroundColor: index % 2 ? "#E8E8E8" : "white" }}>
                                <TableCell sx={{ fontWeight: "bold" }}>Riesgo {index + 1}</TableCell>
                                <TableCell>{item.NombreProceso}</TableCell>
                                <TableCell>{item.Entidad}</TableCell>
                                <TableCell>{item.fuente}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default RiesgosTable;