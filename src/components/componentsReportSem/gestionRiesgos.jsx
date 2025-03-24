import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const RiesgosChart = ({ data }) => {
    // Modificamos los datos para agrupar por riesgo
    const formattedData = data.map((item, index) => ({
        name: `Riesgo ${index + 1}`,
        severidad: item.valorSeveridad,
        ocurrencia: item.valorOcurrencia,
        nrp: item.valorNRP,
    }));
    return (
        <div style={{ width: "100%", textAlign: "center", padding: "20px" }}>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                    <XAxis dataKey="name" stroke="#004A98" />
                    <YAxis stroke="#004A98" />
                    <Tooltip contentStyle={{ backgroundColor: "#E8E8E8", borderRadius: "5px" }} />
                    <Legend wrapperStyle={{ color: "#004A98", fontWeight: "bold" }} />
                    <Bar dataKey="severidad" fill="#004A98" name="Severidad" barSize={40} radius={[5, 5, 0, 0]} />
                    <Bar dataKey="ocurrencia" fill="#00B2E3" name="Ocurrencia" barSize={40} radius={[5, 5, 0, 0]} />
                    <Bar dataKey="nrp" fill="#F9B800" name="NRP" barSize={40} radius={[5, 5, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
export default RiesgosChart;
