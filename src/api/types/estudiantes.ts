// Response consultar estudiantes
export interface responseAllEstudiante {
  estudianteId: number;
  usuarioId: number;
  estudianteIdentificacion: string;
  estudianteNombre: string;
  estudianteApellido: string;
  estudianteCorreo: string;
  estudianteEstado: boolean;
}

// Response consultar materias asociadas al estudiante
export interface responseAllMateriasEstudiante {
  estudianteMateriaId: number;
  materiaId: number;
  estudianteId: number;
  materiaNombre: string;
  materiaDescripcion: string;
  materiaCreditos: number;
}

// Request para asignar una materia a un estudiante
export interface asignarMateriaEstudiante {
  estudianteMateriaId: number;
  estudianteId: number;
  materiaId: number;
  estudianteMateriaEstado: boolean;
}

// Request para asignar una materia a un estudiante
export interface responseAllCompaneros {
  estudianteMateriaId: number;
  materiaId: number;
  estudianteId: number;
  estudianteNombre: string;
  estudianteApellido: string;
  estudianteCorreo: string;
}
