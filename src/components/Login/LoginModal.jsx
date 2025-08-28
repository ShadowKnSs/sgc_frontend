import { Dialog, DialogContent, DialogActions, Typography, IconButton, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";

export default function LoginModal({ open, onClose, type, title, message }) {
  return (
    <Dialog open={open} onClose={onClose} role="dialog" aria-labelledby="dialog-title">
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}><CloseIcon /></IconButton>
      <DialogContent sx={{ textAlign: 'center', p: 4 }}>
        {type === "success" ? (
          <CheckCircleIcon sx={{ fontSize: 60, color: "green" }} />
        ) : (
          <CancelIcon sx={{ fontSize: 60, color: "red" }} />
        )}
        <Typography variant="h5" id="dialog-title" mt={2} fontWeight="bold">{title}</Typography>
        <Typography mt={1}>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
