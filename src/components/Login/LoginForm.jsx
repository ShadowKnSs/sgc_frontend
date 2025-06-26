import { TextField, InputAdornment, Button, Typography, CircularProgress, Box } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from "@mui/icons-material/Lock";

export default function LoginForm({ rpe, password, setRpe, setPassword, onSubmit, loading }) {
  return (
    <>
      <Typography variant="h6" mb={1}>Usuario</Typography>
      <TextField
        fullWidth value={rpe} onChange={e => setRpe(e.target.value)}
        placeholder="RPE" variant="outlined" sx={{ mb: 3, bgcolor: "#fff", borderRadius: 1 }}
        InputProps={{ endAdornment: <InputAdornment position="end"><PersonIcon /></InputAdornment> }}
      />
      <Typography variant="h6" mb={1}>Contraseña</Typography>
      <TextField
        fullWidth type="password" value={password} onChange={e => setPassword(e.target.value)}
        placeholder="Contraseña" variant="outlined" sx={{ mb: 3, bgcolor: "#fff", borderRadius: 1 }}
        InputProps={{ endAdornment: <InputAdornment position="end"><LockIcon /></InputAdornment> }}
      />
      {loading ? (
        <Box textAlign="center"><CircularProgress sx={{ color: "#FFD600" }} /></Box>
      ) : (
        <Button fullWidth variant="contained" sx={{ bgcolor: "#68A2C9", mt: 1, borderRadius: 5, fontWeight: "bold" }} onClick={onSubmit}>
          Iniciar Sesión
        </Button>
      )}
    </>
  );
}
