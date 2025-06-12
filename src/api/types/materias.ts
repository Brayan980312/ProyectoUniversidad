// Request para crear o actualizar materia
export interface createUpdateMateria {
  materiaId: number;
  materiaNombre: string;
  materiaDescripcion: string;
  materiaCreditos: number;
  materiaEstado: boolean;
}

// Request consultar materias
export interface responseAllMaterias {
  materiaId: number;
  materiaNombre: string;
  materiaDescripcion: string;
  materiaCreditos: number;
  materiaEstado: boolean;
}
