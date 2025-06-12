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
  Paper,
  Box,
  IconButton,
  Tooltip,
  Modal,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  searchEstudiante,
  searchEstudianteMaterias,
} from "../../../api/services/estudiantesService";
import type {
  responseAllEstudiante,
  responseAllMateriasEstudiante,
} from "../../../api/types/estudiantes";
import Notification from "../../../components/Notification";
import type { ErrorResponse } from "../../../api/types/errorResponse";
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

const EstudiantesForm: React.FC = () => {
  // Estado de la tabla
  const [estudiantes, setEstudiantes] = useState<responseAllEstudiante[]>([]);
  const [estudiantesMaterias, setEstudiantesMaterias] = useState<
    responseAllMateriasEstudiante[]
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

  useEffect(() => {
    // Hace la petición para obtener los estudiantes del sistema
    handleSearchEstudiantes();
  }, []);

  // Handler de consulta de estudiantes
  const handleSearchEstudiantes = async () => {
    try {
      const dataObtenida: responseAllEstudiante[] = await searchEstudiante();
      setEstudiantes(dataObtenida);
    } catch (error) {
      const err = error as ErrorResponse;

      if (err.status === 422 && err.detail) {
        generarNotificacion("Consulta de estudiantes.", err.detail, "warning");
      } else {
        generarNotificacion(
          "Error en la apicación.",
          "Error desconocido.",
          "error"
        );
      }
    }
  };

  // Handler de consulta de materias asociadas al estudiante
  const handleSearchMaterialEstudiantes = async (estudianteId: number) => {
    try {
      const dataObtenida: responseAllMateriasEstudiante[] =
        await searchEstudianteMaterias({
          EstudianteId: estudianteId,
        });
      setEstudiantesMaterias(dataObtenida);
      setOpenModalAsignar(true);
    } catch (error) {
      const err = error as ErrorResponse;

      if (err.status === 422 && err.detail) {
        generarNotificacion(
          "Consulta de materias asociadas al estudiante.",
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
  const handleOpenModal = (estudiante: responseAllEstudiante) => {
    handleSearchMaterialEstudiantes(estudiante.estudianteId);
  };

  // Control de cerrar la modal
  const handleCloseModal = () => {
    setOpenModalAsignar(false);
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
          ESTUDIANTES
        </Typography>
      </Box>

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
            {estudiantes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((estudiante) => (
                <TableRow key={estudiante.estudianteId}>
                  <TableCell>
                    <Tooltip title="VER MATERIAS" arrow>
                      <IconButton
                        onClick={() => {
                          handleOpenModal(estudiante);
                        }}
                        disabled={!estudiante.estudianteEstado}
                      >
                        <VisibilityIcon sx={{ color: "blue" }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{estudiante.estudianteIdentificacion}</TableCell>
                  <TableCell>{estudiante.estudianteNombre}</TableCell>
                  <TableCell>{estudiante.estudianteApellido}</TableCell>
                  <TableCell>{estudiante.estudianteCorreo}</TableCell>
                  <TableCell>
                    {estudiante.estudianteEstado ? "ACTIVO" : "INACTIVO"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Paginación */}
        <TablePagination
          component="div"
          count={estudiantes.length}
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
                {estudiantesMaterias
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((estudianteMateria) => (
                    <TableRow key={estudianteMateria.estudianteMateriaId}>
                      <TableCell>{estudianteMateria.materiaNombre}</TableCell>
                      <TableCell>
                        {estudianteMateria.materiaDescripcion}
                      </TableCell>
                      <TableCell>{estudianteMateria.materiaCreditos}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {/* Paginación */}
            <TablePagination
              component="div"
              count={estudiantesMaterias.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Filas por página:"
            />
          </Paper>
        </Box>
      </Modal>
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

export default EstudiantesForm;
