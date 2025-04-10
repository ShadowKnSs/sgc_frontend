import React, { useState } from 'react';
import DetalleAuditor from './informacionAuditor';

const auditores = [
  { id: 1, nombre: 'Juan', apellido: 'Pérez', correo: 'juan.perez@example.com', telefono: '111 111 1111', tipo: 'Asesor Externo', certificacion: 'ISO 9001:2015' },
  { id: 2, nombre: 'María', apellido: 'Gómez', correo: 'maria.gomez@example.com', telefono: '222 222 2222', tipo: 'Asesor Interno', certificacion: 'ISO 14001:2015' },
  { id: 3, nombre: 'Carlos', apellido: 'López', correo: 'carlos.lopez@example.com', telefono: '333 333 3333', tipo: 'Asesor Externo', certificacion: 'ISO 45001:2018' },
  { id: 4, nombre: 'Ana', apellido: 'Martínez', correo: 'ana.martinez@example.com', telefono: '444 444 4444', tipo: 'Asesor Externo', certificacion: 'ISO 22000:2018' }
];

const AuditoresView = () => {
  const [auditorSeleccionado, setAuditorSeleccionado] = useState(null);

  if (auditorSeleccionado) {
    return (
      <DetalleAuditor auditor={auditorSeleccionado} onBack={() => setAuditorSeleccionado(null)} />
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Auditores</h2>
      <div style={styles.scrollContainer}>
        <div style={styles.grid}>
          {auditores.map((auditor) => (
            <div
              key={auditor.id}
              style={styles.card}
              onClick={() => setAuditorSeleccionado(auditor)}
            >
              <p style={styles.name}>{auditor.nombre} {auditor.apellido}</p>
              <p style={styles.email}>{auditor.correo}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    position: 'relative'
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#004A98",
    marginBottom: "3rem",
    textAlign: "center",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)"
  },
  scrollContainer: {
    maxHeight: '500px',
    overflowY: 'auto',
    paddingRight: '10px',
    paddingBottom: '20px',
    width: '100%'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    textAlign: 'center',
    padding: '20px',
    width: '230px',
    height: '120px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  name: {
    fontSize: '20px',
    color: '#003366',
    fontWeight: 'bold',
    margin: '0'
  },
  email: {
    fontSize: '14px',
    color: '#666',
    marginTop: '5px'
  }
};

export default AuditoresView;
