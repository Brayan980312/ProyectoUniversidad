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
  Paper,
  Box,
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
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";
import {
  searchEstudianteMaterias,
  asignarMateriaEstudiante,
  searchCompanerosEstudianteMaterias,
} from "../../api/services/estudiantesService";
import type {
  responseAllMateriasEstudiante,
  responseAllCompaneros,
} from "../../api/types/estudiantes";
import Notification from "../../components/Notification";
import type { ErrorResponse } from "../../api/types/errorResponse";

// Importaciones de interface y servicio de materias
import { searchMateria } from "../../api/services/materialesService";
import type { responseAllMaterias } from "../../api/types/materias";
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

const EstudianteForm: React.FC = () => {
  const [estudianteId, setEstudianteId] = useState<number>(0);

  // Estado de la tabla
  const [materiasEstudiante, setMateriasEstudiante] = useState<
    responseAllMateriasEstudiante[]
  >([]);
  const [companerosEstudiante, setCompanerosEstudiante] = useState<
    responseAllCompaneros[]
  >([]);

  // Estado de paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  /** Estados para el manejo de notificaciones tipo Toast */
  const [abierto, setAbierto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState<AlertColor>("warning");

  // Estado de la modal
  const [openModalAsignar, setOpenModalAsignar] = useState(false);
  const [materiaAsignar, setMateriaAsignar] = useState(0);
  const [modalVer, setModalVer] = useState(0);

  // Estado de modal tipo dialog para confirmar la actualización
  const [openConfirm, setOpenConfirm] = useState(false);

  // Estado con las materias del sistema (activas)
  const [materiasActivas, setMateriasActivas] = useState<responseAllMaterias[]>(
    []
  );

  // Estado con el objeto de materias asignadas al estudiante para desasignar
  const [desasignarMateriaEstudiante, setDesasignarMateriaEstudiante] =
    useState<responseAllMateriasEstudiante | null>(null);

  useEffect(() => {
    // Hace la petición para obtener las materias asociadas del estudiante del sistema (Activas)
    const estudianteLocal = localStorage.getItem("estudianteId");
    if (estudianteLocal !== null) {
      setEstudianteId(Number(estudianteLocal));
    }

    handleSearchMateriasAsociadasEstudiante(Number(estudianteLocal));
    handleSearchMateriasActivas();
  }, []);

  // Handler de consulta de las materias asociadas al estudiante
  const handleSearchMateriasAsociadasEstudiante = async (
    estudianteIdbusqueda: number
  ) => {
    try {
      const dataObtenida: responseAllMateriasEstudiante[] =
        await searchEstudianteMaterias({
          EstudianteId: estudianteIdbusqueda,
        });
      setMateriasEstudiante(dataObtenida);
    } catch (error) {
      const err = error as ErrorResponse;

      if (err.status === 422 && err.detail) {
        generarNotificacion(
          "Consulta de materias asociadas a estudiante.",
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

  // Handler de consulta de los compañeros asociados a las materias del estudiante
  const handleSearchMateriasCompanerosEstudiante = async (
    materiaId: number
  ) => {
    try {
      const dataObtenida: responseAllCompaneros[] =
        await searchCompanerosEstudianteMaterias({
          MateriaId: materiaId,
          EstudianteId: estudianteId,
        });
      setCompanerosEstudiante(dataObtenida);
      setOpenModalAsignar(true);
    } catch (error) {
      const err = error as ErrorResponse;

      if (err.status === 422 && err.detail) {
        generarNotificacion(
          "Consulta de materias asociadas a estudiante.",
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

  // Control de abrir la modal
  const handleOpenModal = (tipoModal: number, materiaId: number) => {
    // Valida que debe hacer, traer las materias activas del sistema o mostrar los compañeros del estudiante
    if (tipoModal == 2) {
      setModalVer(tipoModal);
      handleSearchMateriasCompanerosEstudiante(materiaId);
    } else if (tipoModal == 1) {
      setOpenModalAsignar(true);
      setModalVer(tipoModal);
    }
  };

  // Control de cerrar la modal
  const handleCloseModal = () => {
    setMateriaAsignar(0);
    setOpenModalAsignar(false);
  };

  // Control de asignar materia
  const handleAsignarMateria = async () => {
    try {
      await asignarMateriaEstudiante({
        estudianteMateriaId: 0,
        estudianteId: estudianteId,
        materiaId: materiaAsignar,
        estudianteMateriaEstado: true,
      });

      generarNotificacion(
        "Inscripción Materias.",
        "Se asignó la materia correctamente",
        "success"
      );

      handleCloseModal();
      handleSearchMateriasAsociadasEstudiante(estudianteId);
    } catch (error) {
      const err = error as ErrorResponse;

      if (err.status === 422 && err.detail) {
        generarNotificacion("Inscripcion Materias.", err.detail, "warning");
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
      await asignarMateriaEstudiante({
        estudianteMateriaId:
          desasignarMateriaEstudiante?.estudianteMateriaId ?? 0,
        estudianteId: desasignarMateriaEstudiante?.estudianteId ?? 0,
        materiaId: desasignarMateriaEstudiante?.materiaId ?? 0,
        estudianteMateriaEstado: false,
      });

      generarNotificacion(
        "Desasignación de materia.",
        "Se desasignó la materia correctamente",
        "success"
      );

      handleSearchMateriasAsociadasEstudiante(estudianteId);
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

  // Confirma la desasignación de las materias y continua el proceso
  const handleConfirm = () => {
    handleDesasignarMateria();
    setOpenConfirm(false);
  };

  // Cancela la eliminación de la materia
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
          MATERIAS
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => {
          handleOpenModal(1, 0);
        }}
        sx={{ mb: 1 }}
      >
        INSCRIBIR NUEVA MATERIA
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
                MATERIA
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                DESCRIPCIÓN
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                CREDITOS
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {materiasEstudiante
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((materiaEstudiante) => (
                <TableRow key={materiaEstudiante.estudianteMateriaId}>
                  <TableCell>
                    <Tooltip title="ELIMINAR MATERIA" arrow>
                      <IconButton
                        onClick={() => {
                          setDesasignarMateriaEstudiante(materiaEstudiante);
                          setOpenConfirm(true);
                        }}
                      >
                        <DeleteForeverIcon sx={{ color: "red" }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="VER COMPAÑEROS" arrow>
                      <IconButton
                        onClick={() => {
                          handleOpenModal(2, materiaEstudiante.materiaId);
                        }}
                      >
                        <VisibilityIcon sx={{ color: "blue" }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{materiaEstudiante.materiaNombre}</TableCell>
                  <TableCell>{materiaEstudiante.materiaDescripcion}</TableCell>
                  <TableCell>{materiaEstudiante.materiaCreditos}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Paginación */}
        <TablePagination
          component="div"
          count={materiasEstudiante.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas por página:"
        />
      </Paper>

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
                  COMPAÑEROS DE MATERIA
                </Typography>
              </Box>
              <Paper elevation={3}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#1976d2" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        NOMBRE
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        APELLIDO
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        CORREO
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {companerosEstudiante
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((companero) => (
                        <TableRow key={companero.estudianteMateriaId}>
                          <TableCell>{companero.estudianteNombre}</TableCell>
                          <TableCell>{companero.estudianteApellido}</TableCell>
                          <TableCell>{companero.estudianteCorreo}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                {/* Paginación */}
                <TablePagination
                  component="div"
                  count={companerosEstudiante.length}
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

      {/* Modal tipo Dialog para que el usuario confirme la eliminación de la materia */}
      <Dialog open={openConfirm} onClose={handleCancel}>
        <DialogTitle>Eliminar materias</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Desea eliminar la materia seleccionada?
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

export default EstudianteForm;
