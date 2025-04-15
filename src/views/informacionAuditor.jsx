import React from 'react';

const DetalleAuditor = ({ auditor, onBack }) => {
  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backButton}>⬅ Volver</button>

      <div style={styles.card}>
        {/* Sección de Contacto */}
        <div style={styles.contactSection}>
          <h3 style={styles.sectionTitle}>Contacto</h3>
          <p style={styles.contactText}><strong>{auditor.nombre} {auditor.apellido}</strong></p>
          <a href={`mailto:${auditor.correo}`} style={styles.email}>{auditor.correo}</a>
          <p style={styles.contactText}>Teléfono: {auditor.telefono}</p>
          <p style={styles.contactText}>Tipo: {auditor.tipo}</p>
          <p style={styles.contactText}>Certificación: {auditor.certificacion}</p>
        </div>

        {/* Sección de Historial */}
        <div style={styles.historySection}>
          <h3 style={styles.sectionTitle}>Historial de Auditorías</h3>

          {/* Proceso 1 */}
          <div style={styles.historyItem}>
            <p><strong>ID Proceso:</strong> 001</p>
            <p><strong>Nombre de Proceso:</strong> Proceso Ejemplo</p>
            <p><strong>Entidad:</strong> Entidad A</p>
          </div>

          {/* Proceso 2 */}
          <div style={styles.historyItem}>
            <p><strong>ID Proceso:</strong> 002</p>
            <p><strong>Nombre de Proceso:</strong> Proceso Beta</p>
            <p><strong>Entidad:</strong> Entidad B</p>
          </div>

          <p style={styles.totalText}>
            Cantidad de Auditorías Realizadas: <strong>2</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    position: 'relative',
    fontFamily: 'Arial, sans-serif'
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    padding: '8px 16px',
    backgroundColor: '#004A98',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  card: {
    display: 'flex',
    gap: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '40px',
    alignItems: 'flex-start',
    marginTop: '30px'
  },
  sectionTitle: {
    color: '#00BFFF',
    marginBottom: '20px',
    fontSize: '20px',
    borderBottom: '2px solid #00BFFF',
    paddingBottom: '5px'
  },
  contactSection: {
    width: '250px',
    borderRight: '1px solid #ddd',
    paddingRight: '30px'
  },
  contactText: {
    margin: '10px 0',
    color: '#333',
    fontSize: '15px'
  },
  email: {
    display: 'block',
    marginBottom: '10px',
    textDecoration: 'underline',
    color: '#004A98',
    fontSize: '15px'
  },
  historySection: {
    flex: 1
  },
  historyItem: {
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  totalText: {
    marginTop: '20px',
    fontWeight: 'bold',
    color: '#333'
  }
};

export default DetalleAuditor;
