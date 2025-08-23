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
    ToggleButtonGroup,
    ToggleButton,
    InputAdornment,
    IconButton,
} from "@mui/material";

import FabCustom from "../components/FabCustom";
import PersonaAddIcon from "@mui/icons-material/PersonAdd";
import axios from "axios";
import Title from "../components/Title";
import Button from "../components/Button";
import UserCardSkeleton from "../components/UserCardSkeleton";
import UserTempCardSkeleton from "../components/UserTempCardSkeleton";
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [assignOpen, setAssignOpen] = useState(false);
    const [supervisorToAssign, setSupervisorToAssign] = useState(null);

    // Filtros
    const [q, setQ] = useState("");
    const [estado, setEstado] = useState("all"); // all|true|false
    const [rol, setRol] = useState("");
    const [rolesOptions, setRolesOptions] = useState([]);

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
            activo: typeof user.activo === "boolean" ? user.activo : true,
        };
    };

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
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const params = { exclude_me: true, per_page: 100 };
            if (debouncedQ) params.q = debouncedQ;
            if (estado !== "all") params.estado = estado; // "true" | "false"
            if (rol) params.rol = rol;

            const response = await axios.get(`${API_URL}/usuarios`, { params });
            const list = (response.data?.data ?? []).map(transformUserData).filter(Boolean);
            setUsers(list);
            setError(null);
        } catch (err) {
            setUsers([]);
            setError("Error al cargar los usuarios");
            showFeedback("error", "Error", "No se pudieron cargar los usuarios");
        } finally {
            setLoading(false);
        }
    }, [debouncedQ, estado, rol, showFeedback]);

    // Cargar usuarios temporales
    const fetchUsuariosTemporales = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/usuarios-temporales`);
            setUsuariosTemporales(res.data);
        } catch (err) {
            // opcional: feedback
        }
    }, []);

    // Efecto inicial y cuando cambian filtros
    useEffect(() => {
        fetchUsers();
        fetchUsuariosTemporales();
    }, [fetchUsers, fetchUsuariosTemporales]);

    // Guardar usuario creado o editado
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

    // Eliminar (desactivar) usuario
    const handleDelete = useCallback(
        async (id) => {
            try {
                // Obtener token de autenticación
                const token = localStorage.getItem('auth_token'); // Ajusta según tu almacenamiento

                await axios.delete(`${API_URL}/usuarios/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                setUsers((prev) => prev.filter((u) => u.id !== id));
                setOpenDelete(false);
                showFeedback("info", "Usuario desactivado", "El usuario fue desactivado correctamente");
            } catch (err) {
                console.error('Error al eliminar:', err.response?.data);
                showFeedback("error", "Error", err.response?.data?.message || "No se pudo desactivar el usuario");
            }
        },
        [showFeedback]
    );

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
        fetchUsers();
    }, [fetchUsers]);

    const handleEliminarYActualizar = useCallback(async () => {
        try {
            const res = await axios.delete(`${API_URL}/usuarios-temporales/expirados`);
            showFeedback("success", "Tokens eliminados", res.data?.message || "Limpieza completada");
            await fetchUsuariosTemporales();
        } catch (err) {
            showFeedback("error", "Error", "No se pudieron eliminar los tokens expirados");
        }
    }, [fetchUsuariosTemporales, showFeedback]);

    const handleOpenAssign = useCallback((user) => {
        setSupervisorToAssign(user);
        setAssignOpen(true);
    }, []);

    const handleAssignSaved = useCallback(() => {
        fetchUsers();
    }, [fetchUsers]);

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
                            canDelete={canDelete}
                        />
                    </Suspense>
                </div>
            );
        },
        [currentUserId, handleEdit, handleOpenAssign]
    );

    // Lista a renderizar (ya viene transformada)
    const vmUsers = users;

    return (
        <Box
            sx={{ p: isMobile ? 2 : isTablet ? 3 : 4, textAlign: "center", maxWidth: "100%", overflowX: "hidden" }}
        >
            <BreadcrumbNav items={[{ label: "Gestión de Usuarios", icon: PeopleIcon }]} />

            {loading ? (
                <>

                    {/* Skeletons para usuarios normales */}
                    <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={2} justifyContent="center">
                        {Array.from({ length: 6 }).map((_, idx) => (
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
                        }}
                    >
                        <TextField
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Buscar por nombre o correo"
                            size="small"
                            fullWidth
                            inputProps={{ "aria-label": "Buscar usuarios" }}
                            sx={{ maxWidth: 420 }}
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

                        <ToggleButtonGroup exclusive value={estado} onChange={(_, v) => v && setEstado(v)} size="small">
                            <ToggleButton value="all">Todos</ToggleButton>
                            <ToggleButton value="true">Activos</ToggleButton>
                            <ToggleButton value="false">Inactivos</ToggleButton>
                        </ToggleButtonGroup>

                        <TextField select size="small" label="Rol" value={rol} onChange={(e) => setRol(e.target.value)} sx={{ minWidth: 180 }}>
                            <MenuItem value="">Todos</MenuItem>
                            {rolesOptions.map((r) => (
                                <MenuItem key={r.idTipoUsuario || r.nombreRol} value={r.nombreRol}>
                                    {r.nombreRol}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>

                    {/* Usuarios normales */}
                    {vmUsers.length === 0 ? (
                        <EmptyState
                            icon={GroupIcon}
                            title="No hay usuarios registrados"
                            description="Comienza agregando el primer usuario al sistema"
                            buttonText="Agregar Usuario"
                            onButtonClick={handleAddNewUser}
                        />
                    ) : (
                        <>
                            {vmUsers.length >= VIRTUALIZE_THRESHOLD ? (
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
                                    {vmUsers.map((user) => {
                                        const canDelete = user.id !== currentUserId;
                                        return (
                                            <Suspense key={user.id} fallback={<UserCardSkeleton />}>
                                                <UserCard
                                                    user={user}
                                                    onEdit={() => handleEdit(user)}
                                                    onDelete={canDelete ? () => { setUserToDelete(user); setOpenDelete(true); } : undefined}
                                                    onAssign={handleOpenAssign}
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
                    {usuariosTemporales.length > 0 && (
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

                            <Box mt={4} display="flex" justifyContent="center">
                                <Button type="eliminar" onClick={handleEliminarYActualizar}>
                                    Eliminar Tokens Expirados
                                </Button>
                            </Box>
                        </>
                    )}

                    {/* Si no hay usuarios temporales */}
                    {usuariosTemporales.length === 0 && !loading && (
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
                    onTokenCreated={fetchUsuariosTemporales}
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
                    onConfirm={() => handleDelete(userToDelete?.id)}
                    entityType="usuario"
                    entityName={userToDelete?.firstName}
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
