// Request de login
export interface LoginRequest {
  usuarioIdentificacion: string;
  usuarioContrasena: string;
}

// Roles de usuario
interface RolesUsuario {
  usuarioRolId: number;
  usuarioId: number;
  rolId: number;
}

// Response de login
export interface LoginResponse {
  tokenJWT: string;
  usuarioId: number;
  usuarioIdentificacion: string;
  usuarioNombres: string;
  usuarioApellidos: string;
  usuarioCorreo: string;
  usuarioCelular: string;
  estudianteId: number;
  roles: RolesUsuario[];
}

// Request de registro
export interface RegisterRequest {
  usuarioIdentificacion: string;
  usuarioNombres: string;
  usuarioApellidos: string;
  usuarioCelular: string;
  usuarioCorreo: string;
  usuarioContrasena: string;
  usuarioContrasenaConfirmar: string;
}

// Response de registro
export interface RegisterResponse {
  usuarioId: number;
  usuarioIdentificacion: string;
  usuarioNombres: string;
  usuarioApellidos: string;
  usuarioCorreo: string;
  usuarioCelular: string;
}
