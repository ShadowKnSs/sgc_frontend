import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const IndicadoresTable = ({ data }) => {
    // Formateamos los datos para la gráfica de barras
    const formattedData = data.map((item, index) => ({
        name: `Indicador ${index + 1}`,
        resultado: item.resultado
    }));

    return (
        <div sx={{ width: "100%", textAlign: "center", padding: "20px" }}>
            {/* Tabla */}
            <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#004A98" }}>
                            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Indicador</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Proceso</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Entidad</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Nombre Indicador</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>Origen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index} sx={{ backgroundColor: index % 2 ? "#E8E8E8" : "white" }}>
                                <TableCell sx={{ fontWeight: "bold" }}>Indicador {index + 1}</TableCell>
                                <TableCell>{item.NombreProceso}</TableCell>
                                <TableCell>{item.Entidad}</TableCell>
                                <TableCell>{item.nombreIndicador}</TableCell>
                                <TableCell>{item.origenIndicador}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    );
}

export default IndicadoresTable;