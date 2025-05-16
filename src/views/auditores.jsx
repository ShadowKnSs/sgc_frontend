/**
 * Componente: AuditoresView
 * Ubicación: src/views/AuditoresView.jsx
 * Descripción:
 * Vista principal que muestra una lista de todos los auditores registrados en el sistema.
 * Permite seleccionar un auditor para visualizar su información detallada.

 * Funcionalidades:
 * 1. ✅ Consulta la lista de auditores desde la API `/api/auditores`.
 * 2. ✅ Ordena la lista alfabéticamente por nombre y apellido paterno.
 * 3. ✅ Muestra cada auditor en una tarjeta (`card`) en una cuadrícula responsiva.
 * 4. ✅ Permite hacer clic en un auditor para ver su información detallada, usando el componente `DetalleAuditor`.
 * 5. ✅ Proporciona un botón de regreso (`onBack`) desde el detalle al listado general.

 * Dependencias:
 * - `axios` para solicitudes HTTP.
 * - `Title` (componente estilizado) para encabezado visual.
 * - `DetalleAuditor`: componente para mostrar la vista individual del auditor seleccionado.

 * Estados:
 * - `auditores`: lista de auditores cargada desde el backend.
 * - `auditorSeleccionado`: auditor activo para mostrar detalles.

 * Hooks:
 * - `useEffect`: para realizar la carga inicial de auditores.
 * - `useState`: para controlar los estados del listado y la selección de auditor.

 * Diseño:
 * - El componente usa estilos en línea (`styles`) con una cuadrícula responsiva (`grid`) para adaptar el número de columnas al tamaño de pantalla.
 * - El contenedor permite scroll vertical con altura máxima (`maxHeight`) para evitar que crezca indefinidamente.
 * - Las tarjetas (`card`) tienen sombra, color de fondo y efecto visual al pasar el mouse.

 * UX/UI:
 * - Diseño simple, limpio y visualmente centrado.
 * - Cada auditor se muestra con su nombre y correo.
 * - Animación suave al hacer clic para ir al detalle del auditor.

 * Consideraciones futuras:
 * - Agregar paginación si la lista de auditores crece considerablemente.
 * - Incluir buscador y filtros por entidad, proceso o rol.
 * - Agregar avatar o ícono para cada auditor.
 * - Mostrar más información como teléfono, especialidad, o procesos asignados.
 */

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
