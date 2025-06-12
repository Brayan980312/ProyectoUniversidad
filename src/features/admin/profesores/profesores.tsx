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
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  AddCircle as AddCircleIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  searchProfesor,
  createUpdateProfesor,
  searchProfesorMaterias,
  asignarMateriaProfesor as asignarMateriaProfesorServicio,
} from "../../../api/services/profesoresService";
import type {
  responseAllProfesor,
  responseAllMateriasProfesor,
} from "../../../api/types/profesores";
import Notification from "../../../components/Notification";
import type { ErrorResponse } from "../../../api/types/errorResponse";

// Importaciones de interface y servicio de materias
import { searchMateria } from "../../../api/services/materialesService";
import type { responseAllMaterias } from "../../../api/types/materias";
import type { AlertColor } from "@mui/material/Alert";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 850,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const ProfesoresForm: React.FC = () => {
  // Estado de la tabla
  const [profesores, setProfesores] = useState<responseAllProfesor[]>([]);
  const [profesoresMaterias, setProfesoresMaterias] = useState<
    responseAllMateriasProfesor[]
  >([]);

  // Estado de paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Estado de edición
  const [selectedProfesor, setSelectedProfesor] =
    useState<responseAllProfesor | null>(null);
  const [accionRealizar, setAccionRealizar] = useState(0);

  // Valores del fomulario
  const [valorId, setValorId] = useState(0);
  const [valorIdentificacion, setValorIdentificacion] = useState("");
  const [valorNombre, setValorNombre] = useState("");
  const [valorApellido, setValorApellido] = useState("");
  const [valorCorreo, setValorCorreo] = useState("");
  const [valorEstado, setValorEstado] = useState(true);
  const [valorEstadoActualizar, setValorEstadoActualizar] = useState(true);

  /** Estados para el manejo de notificaciones tipo Toast */
  const [abierto, setAbierto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState<AlertColor>("warning");

  // Manejo de errores en entradas del formulario
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Estado de la modal
  const [openModalAsignar, setOpenModalAsignar] = useState(false);
  const [selectedProfesorAsignarMateria, setSelectedProfesorAsignarMateria] =
    useState<responseAllProfesor | null>(null);
  const [materiaAsignar, setMateriaAsignar] = useState(0);
  const [modalVer, setModalVer] = useState(0);

  // Estado de modal tipo dialog para confirmar la actualización
  const [openConfirm, setOpenConfirm] = useState(false);
  const [dialogAccion, setDialogAccion] =
    useState(0); /** 1=Actualizar profesor | 2=Desasignar Materia */

  // Estado con las materias del sistema (activas)
  const [materiasActivas, setMateriasActivas] = useState<responseAllMaterias[]>(
    []
  );

  // Estado con el objeto de materias asignadas al profesor para desasignar
  const [desasignarMateriaProfesor, setDesasignarMateriaProfesor] =
    useState<responseAllMateriasProfesor | null>(null);

  useEffect(() => {
    // Hace la petición para obtener los profesores del sistema
    handleSearchProfesores();
    handleSearchMateriasActivas();
  }, []);

  // Handler de consulta de profesores
  const handleSearchProfesores = async () => {
    try {
      const dataObtenida: responseAllProfesor[] = await searchProfesor();
      setProfesores(dataObtenida);
    } catch (error) {
      const err = error as ErrorResponse;

      if (err.status === 422 && err.detail) {
        generarNotificacion("Consulta de profesores.", err.detail, "warning");
      } else {
        generarNotificacion(
          "Error en la apicación.",
          "Error desconocido.",
          "error"
        );
      }
    }
  };

  // Handler que consulta las materias activas en el sistema
  const handleSearchMateriasActivas = async () => {
    try {
      const dataObtenida: responseAllMaterias[] = await searchMateria({
        MateriaEstado: true,
      });
      setMateriasActivas(dataObtenida);
    } catch (error) {
      const err = error as ErrorResponse;

      if (err.status === 422 && err.detail) {
        generarNotificacion("Consulta de materias.", err.detail, "warning");
      } else {
        generarNotificacion(
          "Error en la apicación.",
          "Error desconocido.",
          "error"
        );
      }
    }
  };

  // Handler de consulta de materias asociadas al profesor
  const handleSearchMaterialProfesores = async (profesorId: number) => {
    try {
      const dataObtenida: responseAllMateriasProfesor[] =
        await searchProfesorMaterias({
          ProfesorId: profesorId,
        });
      setProfesoresMaterias(dataObtenida);
      setOpenModalAsignar(true);
    } catch (error) {
      const err = error as ErrorResponse;

      if (err.status === 422 && err.detail) {
        generarNotificacion(
          "Consulta de materias asociados al profesor.",
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
    setSelectedProfesor(null);
    setAccionRealizar(0);
    setValorId(0);
    setValorIdentificacion("");
    setValorNombre("");
    setValorApellido("");
    setValorCorreo("");
    setValorEstado(true);
  };

  // Handler al crear y actualizar
  const handleCreateUpdate = async () => {
    if (selectedProfesor || accionRealizar == 1) {
      const valid = validateFields({
        valorIdentificacion,
        valorNombre,
        valorApellido,
        valorCorreo,
      });

      if (valid) {
        try {
          await createUpdateProfesor({
            profesorId: valorId,
            profesorIdentificacion: valorIdentificacion,
            profesorNombre: valorNombre,
            profesorApellido: valorApellido,
            profesorCorreo: valorCorreo,
            profesorEstado: valorEstado,
          });

          generarNotificacion(
            "Creación y actualización.",
            "Profesor guardado correctamente",
            "success"
          );

          handleSearchProfesores();
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
  const handleEdit = (profesor: responseAllProfesor) => {
    handleChange("valorIdentificacion", "", setValorIdentificacion);
    handleChange("valorNombre", "", setValorNombre);
    handleChange("valorApellido", "", setValorApellido);
    handleChange("valorCorreo", "", setValorCorreo);

    setSelectedProfesor(profesor);
    setValorId(profesor.profesorId);
    setValorIdentificacion(profesor.profesorIdentificacion);
    setValorNombre(profesor.profesorNombre);
    setValorApellido(profesor.profesorApellido);
    setValorCorreo(profesor.profesorCorreo);
    setValorEstado(profesor.profesorEstado);
    setValorEstadoActualizar(profesor.profesorEstado);
    setAccionRealizar(2);

    // Lleva al usuario hasta la edición del registro
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Validar campos obligatorios y validaciones
  const validateFields = (fields: { [key: string]: string }) => {
    const newErrors: { [key: string]: string } = {};

    Object.entries(fields).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "* campo obligatorio";
      } else {
        if (
          key === "valorCorreo" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          newErrors[key] = "* correo inválido";
        }
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

  // Control de abrir la modal
  const handleOpenModal = (
    profesor: responseAllProfesor,
    tipoModal: number
  ) => {
    setSelectedProfesorAsignarMateria(profesor);

    // Valida que debe hacer, traer las materias activas del sistema o mostrar las materias asociadas al profesor (activas)
    if (tipoModal == 2) {
      setModalVer(tipoModal);
      handleSearchMaterialProfesores(profesor.profesorId);
    } else if (tipoModal == 1) {
      setOpenModalAsignar(true);
      setModalVer(tipoModal);
    }
  };

  // Control de cerrar la modal
  const handleCloseModal = () => {
    setSelectedProfesorAsignarMateria(null);
    setMateriaAsignar(0);
    setOpenModalAsignar(false);
    setProfesoresMaterias([]);
  };

  // Control de asignar materia
  const handleAsignarMateria = async () => {
    try {
      await asignarMateriaProfesorServicio({
        profesorMateriaId: 0,
        profesorId: selectedProfesorAsignarMateria?.profesorId ?? 0,
        materiaId: materiaAsignar,
        profesorMateriaEstado: true,
      });

      generarNotificacion(
        "Asignación Materias.",
        "Se asignó la materia correctamente",
        "success"
      );

      handleCloseModal();
    } catch (error) {
      const err = error as ErrorResponse;

      if (err.status === 422 && err.detail) {
        generarNotificacion("Asignación Materias.", err.detail, "warning");
      } else {
        generarNotificacion(
          "Error en la apicación.",
          "Error desconocido.",
          "error"
        );
      }
    }
  };

  // Control de desasignar materia
  const handleDesasignarMateria = async () => {
    try {
      await asignarMateriaProfesorServicio({
        profesorMateriaId: desasignarMateriaProfesor?.profesorMateriaId ?? 0,
        profesorId: desasignarMateriaProfesor?.profesorId ?? 0,
        materiaId: desasignarMateriaProfesor?.materiaId ?? 0,
        profesorMateriaEstado: false,
      });

      generarNotificacion(
        "Desasignación de materia.",
        "Se desasignó la materia correctamente",
        "success"
      );

      handleCloseModal();
    } catch (error) {
      const err = error as ErrorResponse;

      if (err.status === 422 && err.detail) {
        generarNotificacion("Desasignación de materia.", err.detail, "warning");
      } else {
        generarNotificacion(
          "Error en la apicación.",
          "Error desconocido.",
          "error"
        );
      }
    }
  };

  // Validador si debe o no mostrar mensaje de confirmación
  const handleGuardarActualizar = () => {
    if (!valorEstado && valorEstadoActualizar) {
      setDialogAccion(1);
      setOpenConfirm(true);
    } else {
      handleCreateUpdate();
    }
  };

  // Confirma la desasignación de las materias y continua el proceso
  const handleConfirm = () => {
    /**1=Actualizar Profesor | 2=Desasignar Materia */
    if (dialogAccion == 1) {
      handleCreateUpdate();
    } else if (dialogAccion == 2) {
      handleDesasignarMateria();
    }
    setOpenConfirm(false);
  };

  // Cancela la actualización del profesor
  const handleCancel = () => {
    setOpenConfirm(false);
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
          PROFESORES
        </Typography>
      </Box>

      {/* Controles de creacion y edición */}
      {(selectedProfesor || accionRealizar === 1) && (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            CREAR / ACTUALIZAR PROFESOR
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Identificación"
              value={valorIdentificacion ?? ""}
              onChange={(e) => {
                setValorIdentificacion(e.target.value);
                handleChange(
                  "valorIdentificacion",
                  e.target.value,
                  setValorIdentificacion
                );
              }}
              disabled={valorId > 0}
              error={!!errors.valorIdentificacion}
            />
            {errors.valorIdentificacion && (
              <FormHelperText error>
                {errors.valorIdentificacion}
              </FormHelperText>
            )}

            <TextField
              label="Nombres"
              value={valorNombre ?? ""}
              onChange={(e) => {
                setValorNombre(e.target.value);
                handleChange("valorNombre", e.target.value, setValorNombre);
              }}
              error={!!errors.valorNombre}
            />
            {errors.valorNombre && (
              <FormHelperText error>{errors.valorNombre}</FormHelperText>
            )}

            <TextField
              label="Apellidos"
              value={valorApellido ?? ""}
              onChange={(e) => {
                setValorApellido(e.target.value);
                handleChange("valorApellido", e.target.value, setValorApellido);
              }}
              error={!!errors.valorApellido}
            />
            {errors.valorApellido && (
              <FormHelperText error>{errors.valorApellido}</FormHelperText>
            )}

            <TextField
              label="Correo"
              value={valorCorreo ?? ""}
              onChange={(e) => {
                setValorCorreo(e.target.value);
                handleChange("valorCorreo", e.target.value, setValorCorreo);
              }}
              error={!!errors.valorCorreo}
            />
            {errors.valorCorreo && (
              <FormHelperText error>{errors.valorCorreo}</FormHelperText>
            )}

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
                onClick={handleGuardarActualizar}
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
            NUEVO PROFESOR
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
                    IDENTIFICACIÓN
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    NOMBRE
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    APELLIDOS
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    CORREO
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    ESTADO
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {profesores
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((profesor) => (
                    <TableRow key={profesor.profesorId}>
                      <TableCell>
                        <Tooltip title="EDITAR" arrow>
                          <IconButton
                            onClick={() => {
                              window.scrollTo({ top: 0, behavior: "smooth" });
                              handleEdit(profesor);
                            }}
                          >
                            <EditIcon sx={{ color: "orange" }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="ASIGNAR MATERIAS" arrow>
                          <IconButton
                            onClick={() => {
                              handleOpenModal(profesor, 1);
                            }}
                            disabled={!profesor.profesorEstado}
                          >
                            <AddCircleIcon sx={{ color: "green" }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="VER MATERIAS" arrow>
                          <IconButton
                            onClick={() => {
                              handleOpenModal(profesor, 2);
                            }}
                            disabled={!profesor.profesorEstado}
                          >
                            <VisibilityIcon sx={{ color: "blue" }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{profesor.profesorIdentificacion}</TableCell>
                      <TableCell>{profesor.profesorNombre}</TableCell>
                      <TableCell>{profesor.profesorApellido}</TableCell>
                      <TableCell>{profesor.profesorCorreo}</TableCell>
                      <TableCell>
                        {profesor.profesorEstado ? "ACTIVO" : "INACTIVO"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {/* Paginación */}
            <TablePagination
              component="div"
              count={profesores.length}
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

      {/* Modal para asignar materia */}
      <Modal
        open={openModalAsignar}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleCloseModal();
          }
        }}
        disableEscapeKeyDown
      >
        <Box sx={styleModal}>
          {/* Botón de cierre */}
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          {modalVer == 1 && (
            <>
              <Box display="flex" justifyContent="center">
                <Typography variant="h6" gutterBottom>
                  ASIGNAR MATERIA
                </Typography>
              </Box>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="materia-label">Materia</InputLabel>
                <Select
                  labelId="materia-label"
                  value={materiaAsignar}
                  label="Materia"
                  onChange={(e) => {
                    setMateriaAsignar(Number(e.target.value));
                  }}
                >
                  {materiasActivas.map((materia) => (
                    <MenuItem value={materia.materiaId}>
                      {materia.materiaNombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box display="flex" justifyContent="center" gap={2}>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 3 }}
                  onClick={handleAsignarMateria}
                  disabled={materiaAsignar == 0}
                >
                  ASIGNAR
                </Button>
              </Box>
            </>
          )}

          {modalVer == 2 && (
            <>
              {/* Tabla */}
              <Box display="flex" justifyContent="center">
                <Typography variant="h6" gutterBottom>
                  MATERIAS ASIGNADAS
                </Typography>
              </Box>
              <Paper elevation={3}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#1976d2" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        ACCIONES
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        MATERIA
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        DESCRIPCION
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        CREDITOS
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {profesoresMaterias
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((profesorMateria) => (
                        <TableRow key={profesorMateria.profesorMateriaId}>
                          <TableCell>
                            <Tooltip title="DESASIGNAR" arrow>
                              <IconButton
                                onClick={() => {
                                  setDialogAccion(2);
                                  setDesasignarMateriaProfesor(profesorMateria);
                                  setOpenConfirm(true);
                                }}
                              >
                                <DeleteForeverIcon sx={{ color: "red" }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                          <TableCell>{profesorMateria.materiaNombre}</TableCell>
                          <TableCell>
                            {profesorMateria.materiaDescripcion}
                          </TableCell>
                          <TableCell>
                            {profesorMateria.materiaCreditos}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                {/* Paginación */}
                <TablePagination
                  component="div"
                  count={profesoresMaterias.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  labelRowsPerPage="Filas por página:"
                />
              </Paper>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal tipo Dialog para que el usuario confirme la actualización del profesor */}
      <Dialog open={openConfirm} onClose={handleCancel}>
        <DialogTitle>
          {dialogAccion == 1 ? "Actualizar profesor" : "Desasignar materias"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogAccion == 1
              ? "Se desasignarán las materias asociadas al profesor, ¿desea continuar?"
              : "¿Desea desasignar la materia asociada al profesor?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
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

export default ProfesoresForm;
