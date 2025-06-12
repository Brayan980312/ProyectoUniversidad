import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { registerUser, loginUser } from "../../api/services/authService";
import type { ErrorResponse } from "../../api/types/errorResponse";
import type { AlertColor } from "@mui/material";
import Notification from "../../components/Notification";
import { useNavigate } from "react-router-dom";
import { STORAGE_KEYS } from "../../api/constants";

const LoginRegister: React.FC = () => {
  const navigate = useNavigate();

  /** Manejo de que formulario debe mostrar */
  const [isLogin, setIsLogin] = useState(true);

  /** Estados de los formularios de login */
  const [cedula, setCedula] = useState("");
  const [claveLogin, setClaveLogin] = useState("");

  /** Estados de los formularios de registro */
  const [identificacion, setidentificacion] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [claveReg, setClaveReg] = useState("");
  const [confClaveReg, setConfClaveReg] = useState("");

  /** Estados para el manejo de notificaciones tipo Toast */
  const [abierto, setAbierto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState<AlertColor>("warning");

  // Estado de errores
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validar campos obligatorios y validaciones
  const validateFields = (fields: { [key: string]: string }) => {
    const newErrors: { [key: string]: string } = {};

    Object.entries(fields).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "* campo obligatorio";
      } else {
        if (key === "correo" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[key] = "* correo inválido";
        }
        if (key === "confClaveReg" && value !== fields["claveReg"]) {
          newErrors[key] = "* las contraseñas no coinciden";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Controlador del inicio de sesión
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = validateFields({ cedula, claveLogin });
    if (valid) {
      try {
        /** Si todo está en orden entonces se realiza la petición para registrar el usuario */
        const response = await loginUser({
          usuarioIdentificacion: cedula,
          usuarioContrasena: claveLogin,
        });

        // Agrega la información al localSotrage
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.tokenJWT);
        localStorage.setItem("usuarioId", response.usuarioId.toString());
        localStorage.setItem("estudianteId", response.estudianteId.toString());
        localStorage.setItem(
          "usuarioIdentificacion",
          response.usuarioIdentificacion
        );
        localStorage.setItem("usuarioNombres", response.usuarioNombres);
        localStorage.setItem("usuarioApellidos", response.usuarioApellidos);
        localStorage.setItem("usuarioCorreo", response.usuarioCorreo);
        localStorage.setItem("usuarioCelular", response.usuarioCelular);
        localStorage.setItem("roles", JSON.stringify(response.roles));

        navigate("/");
      } catch (error) {
        const err = error as ErrorResponse;

        if (err.status === 422 && err.detail) {
          setTitulo("Validación de logueo.");
          setMensaje(err.detail);
          setTipo("warning");
          setAbierto(true);
        } else {
          setTitulo("Error en la apicación.");
          setMensaje("Error desconocido.");
          setTipo("error");
          setAbierto(true);
        }
      }
    }
  };

  // Controlador del registro de nuevo usuario
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const valid = validateFields({
      identificacion,
      nombres,
      apellidos,
      celular,
      correo,
      claveReg,
      confClaveReg,
    });

    if (valid) {
      try {
        /** Si todo está en orden entonces se realiza la petición para registrar el usuario */
        await registerUser({
          usuarioIdentificacion: identificacion,
          usuarioNombres: nombres,
          usuarioApellidos: apellidos,
          usuarioCelular: celular,
          usuarioCorreo: correo,
          usuarioContrasena: claveReg,
          usuarioContrasenaConfirmar: confClaveReg,
        });

        setIsLogin(true);
        setTitulo("Registro de estudiante.");
        setMensaje("Usuario registrado exitosamente");
        setTipo("success");
        setAbierto(true);
      } catch (error) {
        const err = error as ErrorResponse;

        if (err.status === 422 && err.detail) {
          setTitulo("Validación de registro.");
          setMensaje(err.detail);
          setTipo("warning");
          setAbierto(true);
        } else {
          setTitulo("Error en la apicación.");
          setMensaje("Error desconocido.");
          setTipo("error");
          setAbierto(true);
        }
      }
    }
  };

  // Control de cambio de una entrada del formulario
  const handleChange = (
    field: string,
    value: string,
    setValue: (val: string) => void
  ) => {
    setValue(value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const cerrarNotificacion = () => {
    setAbierto(false);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        sx={{
          boxShadow: 3,
          p: 4,
          borderRadius: 2,
          backgroundColor: "#fafafa",
        }}
      >
        {isLogin ? (
          <>
            <Typography variant="h5" mb={3} textAlign="center">
              Iniciar Sesión
            </Typography>
            <form onSubmit={handleLoginSubmit}>
              <TextField
                label="Usuario"
                variant="outlined"
                fullWidth
                margin="normal"
                value={cedula}
                error={!!errors.cedula}
                onChange={(e) =>
                  handleChange("cedula", e.target.value, setCedula)
                }
              />
              {errors.cedula && (
                <FormHelperText error>{errors.cedula}</FormHelperText>
              )}

              <TextField
                label="Clave"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                value={claveLogin}
                error={!!errors.claveLogin}
                onChange={(e) =>
                  handleChange("claveLogin", e.target.value, setClaveLogin)
                }
              />
              {errors.claveLogin && (
                <FormHelperText error>{errors.claveLogin}</FormHelperText>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Iniciar Sesión
              </Button>
            </form>
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => {
                    setErrors({});
                    setIsLogin(false);
                  }}
                >
                  ¿No tienes cuenta? Regístrate
                </Link>
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            <Typography variant="h5" mb={3} textAlign="center">
              Registrar Estudiante
            </Typography>
            <form onSubmit={handleRegisterSubmit}>
              <TextField
                label="Identificación"
                variant="outlined"
                fullWidth
                margin="normal"
                value={identificacion}
                error={!!errors.identificacion}
                onChange={(e) =>
                  handleChange(
                    "identificacion",
                    e.target.value,
                    setidentificacion
                  )
                }
              />
              {errors.identificacion && (
                <FormHelperText error>{errors.identificacion}</FormHelperText>
              )}

              <TextField
                label="Nombres"
                variant="outlined"
                fullWidth
                margin="normal"
                value={nombres}
                error={!!errors.nombres}
                onChange={(e) =>
                  handleChange("nombres", e.target.value, setNombres)
                }
              />
              {errors.nombres && (
                <FormHelperText error>{errors.nombres}</FormHelperText>
              )}

              <TextField
                label="Apellidos"
                variant="outlined"
                fullWidth
                margin="normal"
                value={apellidos}
                error={!!errors.apellidos}
                onChange={(e) =>
                  handleChange("apellidos", e.target.value, setApellidos)
                }
              />
              {errors.apellidos && (
                <FormHelperText error>{errors.apellidos}</FormHelperText>
              )}

              <TextField
                label="Número Celular"
                variant="outlined"
                fullWidth
                margin="normal"
                value={celular}
                error={!!errors.celular}
                onChange={(e) => {
                  const input = e.target.value.replace(/\D/g, "").slice(0, 10);
                  handleChange("celular", input, setCelular);
                }}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              />
              {errors.celular && (
                <FormHelperText error>{errors.celular}</FormHelperText>
              )}

              <TextField
                label="Correo"
                variant="outlined"
                fullWidth
                margin="normal"
                value={correo}
                error={!!errors.correo}
                onChange={(e) =>
                  handleChange("correo", e.target.value, setCorreo)
                }
              />
              {errors.correo && (
                <FormHelperText error>{errors.correo}</FormHelperText>
              )}

              <TextField
                label="Clave"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                value={claveReg}
                error={!!errors.claveReg}
                onChange={(e) =>
                  handleChange("claveReg", e.target.value, setClaveReg)
                }
              />
              {errors.claveReg && (
                <FormHelperText error>{errors.claveReg}</FormHelperText>
              )}

              <TextField
                label="Confirmar Clave"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                value={confClaveReg}
                error={!!errors.confClaveReg}
                onChange={(e) =>
                  handleChange("confClaveReg", e.target.value, setConfClaveReg)
                }
              />
              {errors.confClaveReg && (
                <FormHelperText error>{errors.confClaveReg}</FormHelperText>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Registrar
              </Button>
            </form>
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => {
                    setErrors({});
                    setIsLogin(true);
                  }}
                >
                  ¿Ya tienes cuenta? Inicia Sesión
                </Link>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
      <Notification
        titulo={titulo}
        mensaje={mensaje}
        tipo={tipo}
        abierto={abierto}
        onCerrar={cerrarNotificacion}
      />
    </Container>
  );
};

export default LoginRegister;
