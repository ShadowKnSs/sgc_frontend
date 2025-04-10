import React from 'react';

const LoginErrorModal = ({ onClose, onRetry }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modalContainer}>
        <h2 style={styles.title}>Error de Inicio de Sesión</h2>
        <p style={styles.message}>
          Las credenciales introducidas son incorrectas. Por favor, verifica tu usuario y contraseña e inténtalo nuevamente.
        </p>

        <div style={styles.actions}>
          <button style={styles.cancelButton} onClick={onClose}>CANCELAR</button>
          <button style={styles.retryButton} onClick={onRetry}>REINTENTAR</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
  },
  title: {
    color: '#003366',
    marginBottom: '20px'
  },
  message: {
    color: '#333',
    marginBottom: '30px'
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px'
  },
  cancelButton: {
    backgroundColor: '#003366',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer'
  },
  retryButton: {
    backgroundColor: '#FFCC00',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer'
  }
};

export default LoginErrorModal;
