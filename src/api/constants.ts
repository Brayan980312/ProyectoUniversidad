// URL base de cada microservicio
export const BASE_URLS = {
  MSSEGURIDAD:
    "https://microservicioseguridad-ebfae0aabrgedygw.brazilsouth-01.azurewebsites.net/api",
  MSPRINCIPAL:
    "https://microservicioprincipal-grbfdudgbwh2ebag.brazilsouth-01.azurewebsites.net/api",
} as const;

// Nombres de Controlles
export const CONTROLLER = {
  SEGURIDAD: "Seguridad",
  PARAMETROS: "Parametros",
  MATERIA: "Materia",
  PROFESOR: "Profesor",
  ESTUDIANTE: "Estudiante",
} as const;

// Nombres de endpoint
export const ENDPOINT = {
  REGISTERUSER: "RegistrarUsuario",
  LOGINUSER: "LoginUsuario",
  SEARCHPARAMS: "ConsultarParametros",
  UPDATEPARAM: "ActualizarParametro",
  CREAACTUALIZATEMATERIA: "CrearActualizarMateria",
  CONSULTARMATERIAS: "ConsultarMaterias",
  CREAACTUALIZATEPROFESOR: "CrearActualizarProfesor",
  CONSULTARPROFESORES: "ConsultarProfesores",
  CONSULTARPROFESORESMATERIAS: "ConsultarMateriasProfesor",
  ASIGNARMATERIAPROFESOR: "AsignarProfesorMateria",
  CONSULTARESTUDIANTES: "ConsultarEstudiante",
  CONSULTARESTUDIANTESMATERIAS: "ConsultarMateriasEstudiante",
  ASIGNARMATERIAESTUDIANTE: "AsociarMateriaEstudiante",
  CONSULTACOMPANEROSESTUDIANTE: "ConsultarCompanerosMaterias",
} as const;

// Timeout por defecto para fetch
export const DEFAULT_TIMEOUT = 10000;

// Nombre de la clave que usaremos en localStorage para guardar el token JWT
export const STORAGE_KEYS = {
  TOKEN: "auth_token",
};
