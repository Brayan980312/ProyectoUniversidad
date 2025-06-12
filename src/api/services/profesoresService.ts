import { BASE_URLS, ENDPOINT, CONTROLLER } from "../constants";
import { httpPost, httpGet } from "../httpClient";
import type {
  responseAllProfesor,
  createUpdateProfesor,
  responseAllMateriasProfesor,
  asignarMateriaProfesor,
} from "../types/profesores";

/**
 * Llama al MS Principal, para crear o actualizar el profesor.
 * Retorna la información de todos los profesores
 */
export async function createUpdateProfesor(
  data: createUpdateProfesor
): Promise<responseAllProfesor> {
  const url = `${BASE_URLS.MSPRINCIPAL}/${CONTROLLER.PROFESOR}/${ENDPOINT.CREAACTUALIZATEPROFESOR}`;

  return httpPost<createUpdateProfesor, responseAllProfesor>(url, data);
}

/**
 * Llama al MS Principal, para buscar los profesores dedl sistema.
 * Retorna la información de todos los profesores
 */
export async function searchProfesor(
  filters: Record<string, string | number | boolean> = {}
): Promise<responseAllProfesor[]> {
  const url = `${BASE_URLS.MSPRINCIPAL}/${CONTROLLER.PROFESOR}/${ENDPOINT.CONSULTARPROFESORES}`;

  return httpGet<responseAllProfesor[]>(url, filters);
}

/**
 * Llama al MS Principal, para buscar las materias asociadas al profesor.
 * Retorna la información de todas las materias activas que tenga el profesor asignadas
 */
export async function searchProfesorMaterias(
  filters: Record<string, string | number | boolean> = {}
): Promise<responseAllMateriasProfesor[]> {
  const url = `${BASE_URLS.MSPRINCIPAL}/${CONTROLLER.PROFESOR}/${ENDPOINT.CONSULTARPROFESORESMATERIAS}`;

  return httpGet<responseAllMateriasProfesor[]>(url, filters);
}

/**
 * Llama al MS Principal, asignar una materia a un profesor.
 * Retorna la información de todas las asociaciones de materias a profesores
 */
export async function asignarMateriaProfesor(
  data: asignarMateriaProfesor
): Promise<asignarMateriaProfesor> {
  const url = `${BASE_URLS.MSPRINCIPAL}/${CONTROLLER.PROFESOR}/${ENDPOINT.ASIGNARMATERIAPROFESOR}`;

  return httpPost<asignarMateriaProfesor, asignarMateriaProfesor>(url, data);
}
