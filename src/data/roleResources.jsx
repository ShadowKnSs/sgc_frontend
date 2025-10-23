export const ROLES = {
  ADMINISTRADOR: 'Administrador',
  COORDINADOR: 'Coordinador',
  LIDER: 'Líder',
  SUPERVISOR: 'Supervisor',
  AUDITOR: 'Auditor',
  INVITADO: 'Invitado'
};

export const getResourcesByRole = (role) => {
  const resources = {
    [ROLES.ADMINISTRADOR]: [
      {
        label: "Video del Administrador",
        tipo: "video",
        src: "https://www.youtube.com/embed/Ygf9LtbPelw",
      },
      {
        label: "Manual en PDF",
        tipo: "pdf",
        src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=bac5baae-8341-4ff0-9d68-ecb962206202",
        download: true,
      }
    ],
    [ROLES.COORDINADOR]: [
      {
        label: "Video Canva",
        tipo: "video",
        src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=f937db67-53cf-4d8e-82a5-9ca6a924b28f&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=OneUpFileViewer&referrerScenario=EmbedDialog.Create",
      },
      {
        label: "Guía en PDF para Coordinador",
        tipo: "pdf",
        src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=def1c94c-ef13-4b01-af09-475e8e3d9d7a",
        download: true,
      }
    ],
    [ROLES.LIDER]: [
      {
        label: "Video para Líder de Proceso",
        tipo: "video",
        src: "https://www.youtube.com/embed/QRUW4vj7x6k",
      },
      {
        label: "Manual en PDF",
        tipo: "pdf",
        src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=4aeae0f2-6f9b-4ccb-bd82-60ea066b7238",
        download: true,
      }
    ],
    [ROLES.SUPERVISOR]: [
      {
        label: "Video para Supervisor",
        tipo: "video",
        src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=5e46bb60-c5c5-48ff-b8b4-21f319464ffb&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=OneUpFileViewer&referrerScenario=EmbedDialog.Create",
      },
      {
        label: "Manual en PDF",
        tipo: "pdf",
        src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=602b9a11-a1d2-4190-a32d-debdd2278be2",
        download: true,
      }
    ],
    [ROLES.AUDITOR]: [
      {
        label: "Video para Auditor",
        tipo: "video",
        src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=5e46bb60-c5c5-48ff-b8b4-21f319464ffb&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=OneUpFileViewer&referrerScenario=EmbedDialog.Create",
      },
      {
        label: "Manual en PDF",
        tipo: "pdf",
        src: "https://uaslpedu.sharepoint.com/sites/PCI-SistemadeGestindeCalidad/_layouts/15/embed.aspx?UniqueId=e7149bbd-28c8-4a5f-9f92-0a7649a8edf3&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=OneUpFileViewer&referrerScenario=EmbedDialog.Create",
        download: true,
      }
    ],
    [ROLES.INVITADO]: []
  };

  return resources[role] || [];
};

export const getRoleFromStorage = () => {
  try {
    const rolActivo = JSON.parse(localStorage.getItem("rolActivo"));
    const nombreRol = rolActivo?.nombreRol?.toLowerCase();
    
    const roleMapping = {
      administrador: ROLES.ADMINISTRADOR,
      coordinador: ROLES.COORDINADOR,
      'líder': ROLES.LIDER,
      supervisor: ROLES.SUPERVISOR,
      auditor: ROLES.AUDITOR,
    };

    return roleMapping[nombreRol] || ROLES.INVITADO;
  } catch (error) {
    console.error("Error getting role from storage:", error);
    return ROLES.INVITADO;
  }
};