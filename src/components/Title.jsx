import { Typography } from "@mui/material";

const Title = ({ text }) => {
  return (
    <Typography
      variant="h4"
      sx={{
        color: "#004A98",
        fontWeight: "bold",
        textAlign: "center",
        paddingBottom: "10px",
        borderBottom: "4px solid #F9B800",
        display: "inline-block",
      }}
    >
      {text}
    </Typography>
  );
};

export default Title;
