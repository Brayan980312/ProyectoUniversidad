import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  TextField,
  Paper,
  Stack,
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  searchMateria,
  createUpdateMateria,
} from "../../../api/services/materialesService";
import type { responseAllMaterias } from "../../../api/types/materias";
import Notification from "../../../components/Notification";
import type { ErrorResponse } from "../../../api/types/errorResponse";
import { searchParams } from "../../../api/services/paramsService";
import type { responseAllParams } from "../../../api/types/params";
import type { AlertColor } from "@mui/material/Alert";

const MateriasForm: React.FC = () => {
  // Estado de la tabla
  const [materias, setMaterias] = useState<responseAllMaterias[]>([]);

  // Estado de paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Estado de edición
  const [selectedMateria, setSelectedMateria] =
    useState<responseAllMaterias | null>(null);
  const [accionRealizar, setAccionRealizar] = useState(0);

  // Valores del fomulario
  const [valorId, setValorId] = useState(0);
  const [valorNombre, setValorNombre] = useState("");
  const [valorDescripcion, setValorDescripcion] = useState("");
  const [valorEstado, setValorEstado] = useState(true);

  /** Estados para el manejo de notificaciones tipo Toast */
  const [abierto, setAbierto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState<AlertColor>("warning");

  // Parametro de cantidad de creditos por materias
  const [numeroCreditosMateria, setNumeroCreditosMateria] = useState(0);

  // Manejo de errores en entradas del formulario
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Hace la petición para obtener las materias del sistema
    consultarNumeroCreditosMaterias();
    handleSearchMaterias();
  }, []);

  // Handler de consulta de materias
  const handleSearchMaterias = async () => {
    const dataObtenida: responseAllMaterias[] = await searchMateria();
    setMaterias(dataObtenida);
  };

  // Handlers de paginación
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Limpia el formulario de creacion - edición
  const handleCleanForm = () => {
    setSelectedMateria(null);
    setAccionRealizar(0);
    setValorId(0);
    setValorNombre("");
    setValorDescripcion("");
    setValorEstado(true);
  };

  // Handler al crear y actualizar
  const handleCreateUpdate = async () => {
    if (selectedMateria || accionRealizar == 1) {
      const valid = validateFields({
        valorNombre,
        valorDescripcion,
      });

      if (valid) {
        try {
          await createUpdateMateria({
            materiaId: valorId,
            materiaNombre: valorNombre,
            materiaDescripcion: valorDescripcion,
            materiaCreditos: numeroCreditosMateria,
            materiaEstado: valorEstado,
          });

          generarNotificacion(
            "Creación y actualización.",
            "Materia guardada correctamente",
            "success"
          );

          handleSearchMaterias();
          handleCleanForm();
        } catch (error) {
          const err = error as ErrorResponse;

          if (err.status === 422 && err.detail) {
            generarNotificacion(
              "Creación y actualización.",
              err.detail,
              "warning"
            );
          } else {
            generarNotificacion(
              "Error en la apicación.",
              "Error desconocido.",
              "error"
            );
          }
        }
      }
    }
  };

  // Cierra el mensaje toast de validaciones, confirmaciones o errores
  const cerrarNotificacion = () => {
    setAbierto(false);
  };

  // Setea los estados de la notificación para mostrar
  const generarNotificacion = (
    titulo: string,
    mensaje: string,
    tipo: "error" | "success" | "info" | "warning"
  ) => {
    setTitulo(titulo);
    setMensaje(mensaje);
    setTipo(tipo);
    setAbierto(true);
  };

  // Handler al hacer click en "Editar"
  const handleEdit = (materia: responseAllMaterias) => {
    handleChange("valorNombre", "", setValorNombre);
    handleChange("valorDescripcion", "", setValorDescripcion);

    setSelectedMateria(materia);
    setValorId(materia.materiaId);
    setValorNombre(materia.materiaNombre);
    setValorDescripcion(materia.materiaDescripcion);
    setValorEstado(materia.materiaEstado);
    setAccionRealizar(2);

    // Lleva al usuario hasta la edición del registro
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Consultar parametro de cantidad de creditos por materia
  const consultarNumeroCreditosMaterias = async () => {
    const dataObtenida: responseAllParams[] = await searchParams({
      ParametrosNombre: "CantidadCreditosPorMateria",
    });

    // Si no trae un registro entonces no setea nada, si si lo trae entonces lo setea
    if (dataObtenida.length > 0) {
      setNumeroCreditosMateria(Number(dataObtenida[0].parametrosValor));
    }
  };

  // Validar campos obligatorios y validaciones
  const validateFields = (fields: { [key: string]: string }) => {
    const newErrors: { [key: string]: string } = {};

    Object.entries(fields).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "* campo obligatorio";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2, // margen inferior opcional
        }}
      >
        <Typography variant="h4" gutterBottom>
          MATERIAS
        </Typography>
      </Box>

      {/* Controles de creacion y edición */}
      {(selectedMateria || accionRealizar === 1) && (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            CREAR / ACTUALIZAR MATERIA
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Nombre"
              value={valorNombre ?? ""}
              onChange={(e) => {
                setValorNombre(e.target.value);
                handleChange("valorNombre", e.target.value, setValorNombre);
              }}
              disabled={valorId > 0}
              required={true}
              error={!!errors.valorNombre}
            />
            {errors.valorNombre && (
              <FormHelperText error>{errors.valorNombre}</FormHelperText>
            )}

            <TextField
              label="Descripcion"
              value={valorDescripcion ?? ""}
              multiline
              rows={4}
              onChange={(e) => {
                setValorDescripcion(e.target.value);
                handleChange(
                  "valorDescripcion",
                  e.target.value,
                  setValorDescripcion
                );
              }}
              required={true}
              error={!!errors.valorDescripcion}
            />
            {errors.valorDescripcion && (
              <FormHelperText error>{errors.valorDescripcion}</FormHelperText>
            )}

            <TextField
              label="Creditos"
              value={numeroCreditosMateria}
              disabled={true}
              required
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={valorEstado ?? false}
                  disabled={!(valorId ?? 0 > 0)}
                  onChange={(e) => setValorEstado(e.target.checked)}
                />
              }
              label="Estado"
            />

            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleCreateUpdate}
              >
                GUARDAR
              </Button>

              <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={handleCleanForm}
              >
                VOLVER
              </Button>
            </Box>
          </Stack>
        </Paper>
      )}

      {accionRealizar == 0 && (
        <>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setAccionRealizar(1);
            }}
            sx={{ mb: 1 }}
          >
            NUEVA MATERIA
          </Button>
          {/* Tabla */}
          <Paper elevation={3}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    ACCIONES
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    NOMBRE
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    DESCRIPCIÓN
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    CREDITOS
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    ESTADO
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {materias
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((materia) => (
                    <TableRow key={materia.materiaId}>
                      <TableCell>
                        <Tooltip title="EDITAR" arrow>
                          <IconButton
                            onClick={() => {
                              window.scrollTo({ top: 0, behavior: "smooth" });
                              handleEdit(materia);
                            }}
                          >
                            <EditIcon sx={{ color: "orange" }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{materia.materiaNombre}</TableCell>
                      <TableCell>{materia.materiaDescripcion}</TableCell>
                      <TableCell>{materia.materiaCreditos}</TableCell>
                      <TableCell>
                        {materia.materiaEstado ? "ACTIVO" : "INACTIVO"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {/* Paginación */}
            <TablePagination
              component="div"
              count={materias.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Filas por página:"
            />
          </Paper>
        </>
      )}

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

export default MateriasForm;
