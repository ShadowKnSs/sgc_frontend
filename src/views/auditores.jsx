import React, { useState, useEffect } from 'react';
import DetalleAuditor from './informacionAuditor';
import Title from "../components/Title";
import axios from 'axios';

const AuditoresView = () => {
  const [auditores, setAuditores] = useState([]);
  const [auditorSeleccionado, setAuditorSeleccionado] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/auditores')
      .then(response => {
        if (response.data.success) {
          const auditoresOrdenados = response.data.data.sort((a, b) => {
            const nombreA = `${a.nombre} ${a.apellidoPat}`.toLowerCase();
            const nombreB = `${b.nombre} ${b.apellidoPat}`.toLowerCase();
            return nombreA.localeCompare(nombreB);
          });
          setAuditores(auditoresOrdenados);
        }
      })
      .catch(error => {
        console.error('Error al obtener auditores:', error);
      });
  }, []);  

  if (auditorSeleccionado) {
    return <DetalleAuditor auditor={auditorSeleccionado} onBack={() => setAuditorSeleccionado(null)} />;
  }

  return (
    <div style={styles.container}>
      <Title text="Auditores" />
      <div style={styles.scrollContainer}>
        <div style={styles.grid}>
          {auditores.map((auditor) => (
            <div
              key={auditor.idUsuario}
              style={styles.card}
              onClick={() => setAuditorSeleccionado(auditor)}
            >
              <p style={styles.name}>{auditor.nombre} {auditor.apellidoPat}</p>
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
