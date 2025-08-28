export const downloadManual = async (rol) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
  
  const response = await fetch(`${baseUrl}/api/descargar-manual/${rol.toLowerCase()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al descargar el archivo');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `manual-${rol}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};