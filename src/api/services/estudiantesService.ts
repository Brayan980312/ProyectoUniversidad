import { BASE_URLS, ENDPOINT, CONTROLLER } from "../constants";
import { httpGet, httpPost } from "../httpClient";
import type {
  responseAllEstudiante,
  responseAllMateriasEstudiante,
  asignarMateriaEstudiante,
  responseAllCompaneros,
} from "../types/estudiantes";

/**
 * Llama al MS Principal, para buscar los estudiantes del sistema.
 * Retorna la información de todos los estudiantes
 */
export async function searchEstudiante(
  filters: Record<string, string | number | boolean> = {}
): Promise<responseAllEstudiante[]> {
  const url = `${BASE_URLS.MSPRINCIPAL}/${CONTROLLER.ESTUDIANTE}/${ENDPOINT.CONSULTARESTUDIANTES}`;

  return httpGet<responseAllEstudiante[]>(url, filters);
}

/**
 * Llama al MS Principal, para buscar las materias asociadas al estudiante.
 * Retorna la información de todas las materias activas que tenga el estudiante asignadas
 */
export async function searchEstudianteMaterias(
  filters: Record<string, string | number | boolean> = {}
): Promise<responseAllMateriasEstudiante[]> {
  const url = `${BASE_URLS.MSPRINCIPAL}/${CONTROLLER.ESTUDIANTE}/${ENDPOINT.CONSULTARESTUDIANTESMATERIAS}`;

  return httpGet<responseAllMateriasEstudiante[]>(url, filters);
}

/**
 * Llama al MS Principal, para inscribir materias.
 * Retorna la información ingresada en el sistema
 */
export async function asignarMateriaEstudiante(
  data: asignarMateriaEstudiante
): Promise<asignarMateriaEstudiante> {
  const url = `${BASE_URLS.MSPRINCIPAL}/${CONTROLLER.ESTUDIANTE}/${ENDPOINT.ASIGNARMATERIAESTUDIANTE}`;

  return httpPost<asignarMateriaEstudiante, asignarMateriaEstudiante>(
    url,
    data
  );
}

/**
 * Llama al MS Principal, para buscar los compañeros que están asociados a la materia.
 * Retorna la información de todos los compañeros asociados a la materia
 */
export async function searchCompanerosEstudianteMaterias(
  filters: Record<string, string | number | boolean> = {}
): Promise<responseAllCompaneros[]> {
  const url = `${BASE_URLS.MSPRINCIPAL}/${CONTROLLER.ESTUDIANTE}/${ENDPOINT.CONSULTACOMPANEROSESTUDIANTE}`;

  return httpGet<responseAllCompaneros[]>(url, filters);
}
