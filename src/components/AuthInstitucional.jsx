import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthInstitucional() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");
    const type = params.get("type");
    const rol = params.get("rol");

    if (user && type) {
      localStorage.setItem("usuario_institucional", JSON.stringify({ user, type, rol }));
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null;
}
