/**
 * Vista: UserManagement
 * Descripción:
 * Esta vista permite gestionar usuarios del sistema, incluyendo:
 * - Visualización y edición de usuarios normales y temporales.
 * - Creación de nuevos usuarios.
 * - Eliminación de usuarios existentes.
 * - Generación y limpieza de tokens temporales.
 * Incluye tarjetas para usuarios (`UserCard`), tarjetas para usuarios temporales (`UserTempCard`),
 * formulario emergente (`UserForm`) y confirmación de eliminación (`ConfirmDelete`).
 */
import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import {
    Box,
    Skeleton,
    Alert,
    Grid,
    useTheme,
    useMediaQuery,
    TextField,
    MenuItem,
    Stack,
    InputAdornment,
    IconButton,
} from "@mui/material";

import FabCustom from "../components/FabCustom";
import PersonaAddIcon from "@mui/icons-material/PersonAdd";
import axios from "axios";
import Title from "../components/Title";
import UserCardSkeleton from "../components/UserCardSkeleton";
import UserTempCardSkeleton from "../components/UserTempCardSkeleton";
import SectionTabs from "../components/SectionTabs";
import EmptyState from "../components/EmptyState";
import { Group as GroupIcon, Schedule as ScheduleIcon, Search as SearchIcon, Clear as ClearIcon, People as PeopleIcon } from "@mui/icons-material";
import BreadcrumbNav from "../components/BreadcrumbNav";
import FeedbackSnackbar from "../components/Feedback";
// Virtualización
import { FixedSizeList as VirtualList } from "react-window";

// Lazy-loaded (code splitting)
const UserCard = React.lazy(() => import("../components/userCard"));
const UserTempCard = React.lazy(() => import("../components/userTempCard"));
const UserForm = React.lazy(() => import("../components/userForms"));
const ConfirmDelete = React.lazy(() => import("../components/confirmDelete"));
const SupervisorProcessDialog = React.lazy(() => import("../components/Modals/SupervisorProcessDialog"));

// Ruta base de la API
const API_URL = "http://127.0.0.1:8000/api";
const VIRTUALIZE_THRESHOLD = 60; // a partir de X usuarios, usa virtualización

function UserManagement() {
    // Responsive
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));

    // Estado de usuarios
    const [users, setUsers] = useState([]);
    const [usuariosTemporales, setUsuariosTemporales] = useState([]);

    // Estados de control
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [assignOpen, setAssignOpen] = useState(false);
    const [supervisorToAssign, setSupervisorToAssign] = useState(null);
    const [allUsers, setAllUsers] = useState([]); // ← NUEVO: almacenar todos los usuarios
    const [selectedTab, setSelectedTab] = useState(0);
    const [reactivatingUser, setReactivatingUser] = useState(null);



    // Filtros
    const [q, setQ] = useState("");
    const [estado, setEstado] = useState("all"); // all|true|false
    const [rol, setRol] = useState("");
    const [rolesOptions, setRolesOptions] = useState([]);
    const statusSections = ["Activos", "Inactivos"];


    // Debounce búsqueda
    const [debouncedQ, setDebouncedQ] = useState("");
    useEffect(() => {
        const t = setTimeout(() => setDebouncedQ(q.trim()), 400);
        return () => clearTimeout(t);
    }, [q]);

    // Feedback (snackbar)
    const [snackbar, setSnackbar] = useState({ open: false, type: "info", title: "", message: "" });
    const showFeedback = useCallback((type, title, message) => setSnackbar({ open: true, type, title, message }), []);

    // Usuario actual (para no permitir auto-eliminarse desde UI)
    const currentUserId = useMemo(() => {
        try {
            const raw = localStorage.getItem("usuario");
            return raw ? JSON.parse(raw).idUsuario : null;
        } catch {
            return null;
        }
    }, []);

    // Transformar datos de API para uso en el frontend
    const transformUserData = (user) => {
        if (!user || typeof user !== "object") return null;
        const hasSupervisor = user.supervisor && typeof user.supervisor === "object";

        return {
            id: user.idUsuario,
            firstName: user.nombre,
            lastName: user.apellidoPat,
            secondLastName: user.apellidoMat,
            email: user.correo,
            phone: user.telefono,
            academicDegree: user.gradoAcademico,
            roles: Array.isArray(user.roles) ? user.roles.map((r) => r.nombreRol) : [],
            supervisor: hasSupervisor
                ? {
                    id: user.supervisor.idUsuario,
                    firstName: user.supervisor.nombre,
                    lastName: user.supervisor.apellidoPat,
                    secondLastName: user.supervisor.apellidoMat,
                }
                : null,
            activo: Boolean(user.activo), // ← Conversión explícita a boolean
        };
    };
    // Mapear el tab seleccionado al valor de estado
    useEffect(() => {
        const statusMap = ["true", "false"];
        setEstado(statusMap[selectedTab]);
    }, [selectedTab])

    // Cargar roles (para combo)
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`${API_URL}/tiposusuario`);
                const list = Array.isArray(data?.data) ? data.data : [];
                setRolesOptions(list);
            } catch {
                // sin roles no se rompe, solo combo vacío
            }
        })();
    }, []);

    // Cargar usuarios normales con filtros
    // Cargar usuarios normales con filtros - MODIFICADO
    // Modificar la función fetchUsers para incluir el parámetro de estado
    const fetchUsers = useCallback(async () => {
        try {
            setInitialLoading(true);
            const params = {
                exclude_me: true,
                per_page: 200,
                estado: estado // ← Incluir el estado en la petición
            };

            const response = await axios.get(`${API_URL}/usuarios`, { params });
            const list = (response.data?.data ?? []).map(transformUserData).filter(Boolean);
            setAllUsers(list);
            setUsers(list);
            setError(null);
        } catch (err) {
            setAllUsers([]);
            setUsers([]);
            setError("Error al cargar los usuarios");
            showFeedback("error", "Error", "No se pudieron cargar los usuarios");
        } finally {
            setInitialLoading(false);
        }
    }, [showFeedback, estado]); // ← Agregar estado como dependencia

    // Modificar applyFilters para manejar correctamente el estado
    const applyFilters = useCallback(() => {
        if (allUsers.length === 0) return;

        let filtered = [...allUsers];

        // Solo filtro de búsqueda (el estado ya se filtró en el backend)
        if (debouncedQ) {
            const searchTerm = debouncedQ.toLowerCase();
            filtered = filtered.filter(user =>
                user.firstName?.toLowerCase().includes(searchTerm) ||
                user.lastName?.toLowerCase().includes(searchTerm) ||
                user.secondLastName?.toLowerCase().includes(searchTerm) ||
                user.email?.toLowerCase().includes(searchTerm)
            );
        }

        // Solo filtro de rol (el estado ya se filtró en el backend)
        if (rol) {
            filtered = filtered.filter(user =>
                user.roles?.some(userRole => userRole === rol)
            );
        }

        setUsers(filtered);
    }, [allUsers, debouncedQ, rol]);

    // Modificar el efecto para recargar cuando cambie el estado
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]); // ← Recargar cuando cambie el estado

    // Modificar el efecto de aplicacion de filtros
    useEffect(() => {
        if (!initialLoading) {
            applyFilters();
        }
    }, [applyFilters, initialLoading, debouncedQ, rol]); // ← Agregar debouncedQ y rol como dependencias

    // Cargar usuarios temporales
    const fetchUsuariosTemporales = useCallback(async (showNotification = false) => {
        try {
            const res = await axios.get(`${API_URL}/usuarios-temporales`);
            setUsuariosTemporales(res.data);
            // Mostrar notificación si se solicita
            if (showNotification) {
                showFeedback("success", "Token generado", "Token generado exitosamente");
            }
        } catch (err) {
            if (showNotification) {
                showFeedback("error", "Error", "No se pudieron cargar los tokens actualizados");
            }
        }
    }, [showFeedback]);


    // Efecto inicial - MODIFICADO
    useEffect(() => {
        fetchUsuariosTemporales();
    }, [fetchUsuariosTemporales]);

    // Guardar usuario creado o editado
    const handleAddUser = useCallback((usuarioGuardado) => {
        if (editingUser) {
            setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? transformUserData(usuarioGuardado) : u)));
            showFeedback("success", "Usuario actualizado", "El usuario fue actualizado correctamente");
        } else {
            setUsers((prev) => [...prev, transformUserData(usuarioGuardado)]);
            showFeedback("success", "Usuario creado", "El usuario fue creado correctamente");
        }
        setError(null);
        setEditingUser(null);
    }, [editingUser, showFeedback]);


    const handleDeactivate = useCallback(
        async (id) => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.post(
                    `${API_URL}/usuarios/${id}/desactivar`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.success) {
                    // Actualizar estado a inactivo
                    setUsers(prev => prev.map(u =>
                        u.id === id ? { ...u, activo: false } : u
                    ));
                    setAllUsers(prev => prev.map(u =>
                        u.id === id ? { ...u, activo: false } : u
                    ));

                    setSelectedTab(0);
                    setOpenDelete(false);
                    showFeedback("info", "Usuario desactivado", response.data.message || "El usuario fue desactivado correctamente");
                }
            } catch (err) {
                console.error('Error al desactivar:', err.response?.data);
                showFeedback("error", "Error", err.response?.data?.message || "No se pudo desactivar el usuario");
            }
        },
        [showFeedback]
    );

    const handleDeletePermanent = useCallback(
        async (id) => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.delete(`${API_URL}/usuarios/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    // Eliminar completamente de las listas
                    setUsers(prev => prev.filter(u => u.id !== id));
                    setAllUsers(prev => prev.filter(u => u.id !== id));

                    setSelectedTab(1);

                    setOpenDelete(false);
                    showFeedback("success", "Usuario eliminado", response.data.message || "El usuario fue eliminado permanentemente");
                }
            } catch (err) {
                console.error('Error al eliminar:', err.response?.data);
                showFeedback("error", "Error", err.response?.data?.message || "No se pudo eliminar el usuario");
            }
        },
        [showFeedback]
    )
    // Eliminar (desactivar) usuario
    const handleDeleteAction = useCallback((user) => {
        if (user.activo) {
            // Usuario activo: desactivar
            setUserToDelete(user);
            setOpenDelete(true);
        } else {
            // Usuario inactivo: eliminar permanentemente
            setUserToDelete(user);
            setOpenDelete(true);
        }
    }, []);

    // Abrir/cerrar UI
    const handleAddNewUser = useCallback(() => {
        setEditingUser(null);
        setOpenForm(true);
    }, []);

    const handleEdit = useCallback((user) => {
        setEditingUser(user);
        setOpenForm(true);
    }, []);

    const handleFormClose = useCallback(() => {
        setOpenForm(false);
        setEditingUser(null);
    }, []);
    //Eliminación manual de tokens expirados
    // const handleEliminarYActualizar = useCallback(async () => {
    //     try {
    //         const res = await axios.delete(`${API_URL}/usuarios-temporales/expirados`);
    //         showFeedback("success", "Tokens eliminados", res.data?.message || "Limpieza completada");
    //         await fetchUsuariosTemporales();
    //     } catch (err) {
    //         showFeedback("error", "Error", "No se pudieron eliminar los tokens expirados");
    //     }
    // }, [fetchUsuariosTemporales, showFeedback]);

    const handleOpenAssign = useCallback((user) => {
        setSupervisorToAssign(user);
        setAssignOpen(true);
    }, []);

    const handleAssignSaved = useCallback((success = true, message = "") => {
        fetchUsers();
        if (success) {
            showFeedback("success", "Asignación guardada", message || "Los procesos fueron asignados correctamente al supervisor");
        } else {
            showFeedback("error", "Error", message || "No se pudieron asignar los procesos");
        }
    }, [fetchUsers, showFeedback]);

    const handleReactivate = useCallback(async (user) => {
        setReactivatingUser(user.id);

        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(
                `${API_URL}/usuarios/${user.id}/reactivar`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                // Si la API devuelve el usuario actualizado, usarlo
                const usuarioActualizado = response.data.usuario
                    ? transformUserData(response.data.usuario)
                    : { ...user, activo: true };

                // Actualizar el estado del usuario en las listas
                setUsers(prev => prev.map(u =>
                    u.id === user.id ? usuarioActualizado : u
                ));
                setAllUsers(prev => prev.map(u =>
                    u.id === user.id ? usuarioActualizado : u
                ));

                // Cambiar automáticamente a la pestaña de usuarios activos
                setSelectedTab(0); // 0 = Activos, 1 = Inactivos


                showFeedback("success", "Usuario reactivado", response.data.message || "El usuario fue reactivado correctamente");
            }
        } catch (err) {
            console.error('Error al reactivar:', err.response?.data);
            const errorMessage = err.response?.data?.message || "No se pudo reactivar el usuario";
            showFeedback("error", "Error", errorMessage);

            // Si el error es por tiempo de inactividad, recargar para actualizar la lista
            if (errorMessage.includes('más de 1 año')) {
                setTimeout(() => {
                    fetchUsers();
                }, 1000);
            }
        } finally {
            setReactivatingUser(null);
        }
    }, [showFeedback, fetchUsers]);

    // Item renderer para react-window (memoizado)
    const Row = useCallback(
        ({ index, style, data }) => {
            const user = data[index];
            const canDelete = user.id !== currentUserId;
            return (
                <div style={style}>
                    <Suspense fallback={<UserCardSkeleton />}>
                        <UserCard
                            key={user.id}
                            user={user}
                            onEdit={() => handleEdit(user)}
                            onDelete={canDelete ? () => { setUserToDelete(user); setOpenDelete(true); } : undefined}
                            onAssign={handleOpenAssign}
                            onReactivate={handleReactivate} // Agregar esta prop
                            canDelete={canDelete}
                        />
                    </Suspense>
                </div>
            );
        },
        [currentUserId, handleEdit, handleOpenAssign, handleReactivate] // Agregar handleReactivate
    );

    // Lista a renderizar (ya viene transformada)
    const vmUsers = users;

    return (
        <Box
            sx={{ p: isMobile ? 2 : isTablet ? 3 : 4, textAlign: "center", maxWidth: "100%", overflowX: "hidden" }}
        >
            <BreadcrumbNav items={[{ label: "Gestión de Usuarios", icon: PeopleIcon }]} />

            {initialLoading ? (
                <>
                    {/* Skeletons para usuarios normales */}
                    <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={2} justifyContent="center">
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <UserCardSkeleton key={idx} />
                        ))}
                    </Box>

                    {/* Skeletons para usuarios temporales */}
                    <Box sx={{ mt: 6 }}>
                        <Skeleton variant="text" width="200px" height={40} sx={{ mx: "auto", mb: 2 }} />
                        <Grid container spacing={3}>
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <Grid item xs={12} sm={6} md={4} key={idx}>
                                    <UserTempCardSkeleton />
                                </Grid>
                            ))}
                        </Grid>
                        <Box mt={4} display="flex" justifyContent="center">
                            <Skeleton variant="rounded" width={200} height={40} />
                        </Box>
                    </Box>
                </>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <>
                    <Box mb={1}>
                        <Title text="Gestión de Usuarios" />
                    </Box>

                    {/* Toolbar de filtros */}
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={1.5}
                        alignItems={{ xs: "stretch", md: "center" }}
                        justifyContent="space-between"
                        sx={{
                            mb: 2,
                            position: "sticky",
                            top: isMobile ? 56 : 64,
                            zIndex: 1,
                            bgcolor: "background.paper",
                            py: 1.5,
                            borderBottom: 1,
                            borderColor: "divider",
                            mr: 22,
                            ml: 10
                        }}
                    >
                        <TextField
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Buscar por nombre o correo"
                            size="small"
                            fullWidth
                            inputProps={{ "aria-label": "Buscar usuarios" }}
                            sx={{ maxWidth: 300 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                                endAdornment: q ? (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setQ("")} size="small">
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null,
                            }}
                        />

                        {/* SectionTabs integrado */}
                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                            <SectionTabs
                                sections={statusSections}
                                selectedTab={selectedTab}
                                onTabChange={setSelectedTab}
                            />
                        </Box>

                        <TextField
                            select
                            size="small"
                            label="Rol"
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                            sx={{ minWidth: 180 }}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {rolesOptions.map((r) => (
                                <MenuItem key={r.idTipoUsuario || r.nombreRol} value={r.nombreRol}>
                                    {r.nombreRol}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>

                    {/* Usuarios normales */}
                    {users.length === 0 ? (
                        <EmptyState
                            icon={GroupIcon}
                            title={
                                estado === "false" ? "No hay usuarios inactivos" :
                                    estado !== "all" ? "No hay usuarios activos" :
                                        "No hay usuarios registrados"
                            }
                            description={
                                estado === "false" ? "No se encontraron usuarios inactivos en el sistema" :
                                    estado !== "all" ? "No se encontraron usuarios activos que coincidan con los filtros" :
                                        "Comienza agregando el primer usuario al sistema"
                            }
                            buttonText="Agregar Usuario"
                            onButtonClick={handleAddNewUser}
                        />
                    ) : (
                        <>
                            {users.length >= VIRTUALIZE_THRESHOLD ? (
                                <VirtualList
                                    height={isMobile ? 520 : 640}
                                    itemCount={vmUsers.length}
                                    itemSize={isMobile ? 220 : 180}
                                    width={"100%"}
                                    itemData={vmUsers}
                                    overscanCount={6}
                                >
                                    {Row}
                                </VirtualList>
                            ) : (
                                <Box
                                    display="grid"
                                    gridTemplateColumns={isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(300px, 1fr))"}
                                    gap={isMobile ? 1 : 2}
                                    justifyContent="center"
                                    sx={{ width: "100%" }}
                                >
                                    {users.map((user) => {
                                        const canDelete = user.id !== currentUserId;
                                        return (
                                            <Suspense key={user.id} fallback={<UserCardSkeleton />}>
                                                <UserCard
                                                    user={user}
                                                    onEdit={() => handleEdit(user)}
                                                    onDelete={canDelete ? () => handleDeleteAction(user) : undefined}
                                                    onAssign={handleOpenAssign}
                                                    onReactivate={handleReactivate}
                                                    reactivating={reactivatingUser === user.id}
                                                    canDelete={canDelete}
                                                />
                                            </Suspense>
                                        );
                                    })}
                                </Box>
                            )}
                        </>
                    )}

                    {/* Sección de usuarios temporales */}
                    {selectedTab === 0 && usuariosTemporales.length > 0 && (
                        <>
                            <Box sx={{ mt: 6 }}>
                                <Title text="Usuarios Temporales" />
                            </Box>

                            <Grid container spacing={3}>
                                {usuariosTemporales.map((temp) => (
                                    <Grid item xs={12} sm={6} md={4} key={temp.idToken}>
                                        <Suspense fallback={<UserTempCardSkeleton />}>
                                            <UserTempCard tempUser={temp} />
                                        </Suspense>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Eliminación manual de tokens temporales */}
                            {/* <Box mt={4} display="flex" justifyContent="center">
                                <Button type="eliminar" onClick={handleEliminarYActualizar}>
                                    Eliminar Tokens Expirados
                                </Button>
                            </Box> */}
                            <Box mt={4} display="flex" justifyContent="center">
                                <Alert severity="info" sx={{ maxWidth: 500 }}>
                                    Los tokens expirados se eliminan automáticamente cada semana
                                </Alert>
                            </Box>
                        </>
                    )}

                    {/* Si no hay usuarios temporales */}
                    {selectedTab === 0 && usuariosTemporales.length === 0 && !initialLoading && (
                        <EmptyState
                            icon={ScheduleIcon}
                            title="No hay usuarios temporales"
                            description="Los tokens de acceso temporal aparecerán aquí cuando sean generados"
                            sx={{ mt: 6 }}
                        />
                    )}

                    {/* Botón flotante para agregar */}
                    <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
                        <FabCustom onClick={handleAddNewUser} title="Agregar Usuario" icon={<PersonaAddIcon />} />
                    </Box>
                </>
            )}

            {/* Formulario emergente para crear o editar usuario */}
            <Suspense fallback={<Skeleton variant="rounded" height={420} />}>
                <UserForm
                    open={openForm}
                    onClose={handleFormClose}
                    onSubmit={handleAddUser}
                    onTokenCreated={() => fetchUsuariosTemporales(true)} // ← Pasar true para mostrar notificación
                    editingUser={editingUser}
                />
            </Suspense>

            {/* Asignar supervisor */}
            <Suspense fallback={<Skeleton variant="rounded" height={260} />}>
                <SupervisorProcessDialog
                    open={assignOpen}
                    onClose={() => setAssignOpen(false)}
                    supervisorUser={supervisorToAssign}
                    onSaved={handleAssignSaved}
                />
            </Suspense>

            {/* Confirmación de desactivación */}
            <Suspense fallback={<Skeleton variant="rounded" height={180} />}>
                <ConfirmDelete
                    open={openDelete}
                    onClose={() => setOpenDelete(false)}
                    onConfirm={() => {
                        if (userToDelete?.activo) {
                            handleDeactivate(userToDelete?.id);
                        } else {
                            handleDeletePermanent(userToDelete?.id);
                        }
                    }}
                    entityType="usuario"
                    entityName={userToDelete?.firstName}
                    isPermanent={userToDelete && !userToDelete.activo}
                />
            </Suspense>

            {/* Feedback global */}
            <FeedbackSnackbar
                open={snackbar.open}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                type={snackbar.type}
                title={snackbar.title}
                message={snackbar.message}
                autoHideDuration={4000}
            />
        </Box>
    );
}

export default UserManagement;
