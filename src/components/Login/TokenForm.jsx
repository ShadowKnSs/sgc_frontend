import { TextField, InputAdornment, Button, Typography, CircularProgress, Box } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

export default function TokenForm({ token, setToken, onSubmit, loading }) {
  return (
    <>
      <Typography variant="h6" mb={1}>Token</Typography>
      <TextField
        fullWidth value={token} onChange={e => setToken(e.target.value)}
        placeholder="AZ19DBB860L9533" variant="outlined"
        sx={{ mb: 3, bgcolor: "#fff", borderRadius: 1 }}
        InputProps={{ endAdornment: <InputAdornment position="end"><LockIcon /></InputAdornment> }}
      />
      {loading ? (
        <Box textAlign="center"><CircularProgress sx={{ color: "#FFD600" }} /></Box>
      ) : (
        <Button fullWidth variant="contained" sx={{ bgcolor: "#68A2C9", mt: 1, borderRadius: 5, fontWeight: "bold" }} onClick={onSubmit}>
          Validar Token
        </Button>
      )}
    </>
  );
}
