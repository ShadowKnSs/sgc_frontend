import { Typography } from "@mui/material";

const Subtitle = ({ text }) => {
  return (
    <Typography
      variant="h6"
      sx={{
        color: "#00B2E3",
        fontWeight: "500",
        textAlign: "center",
        marginTop: "5px",
      }}
    >
      {text}
    </Typography>
  );
};

export default Subtitle;
