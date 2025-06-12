// Request para crear o actualizar profesor
export interface createUpdateProfesor {
  profesorId: number;
  profesorIdentificacion: string;
  profesorNombre: string;
  profesorApellido: string;
  profesorCorreo: string;
  profesorEstado: boolean;
}

// Request consultar profesores
export interface responseAllProfesor {
  profesorId: number;
  profesorIdentificacion: string;
  profesorNombre: string;
  profesorApellido: string;
  profesorCorreo: string;
  profesorEstado: boolean;
}

// Request consultar materias asociadas al profesor
export interface responseAllMateriasProfesor {
  profesorMateriaId: number;
  profesorId: number;
  materiaId: number;
  materiaNombre: string;
  materiaDescripcion: string;
  materiaCreditos: number;
}

// Request para asignar una materia a un profesor
export interface asignarMateriaProfesor {
  profesorMateriaId: number;
  profesorId: number;
  materiaId: number;
  profesorMateriaEstado: boolean;
}
