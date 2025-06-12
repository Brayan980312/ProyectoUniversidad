import { BASE_URLS, ENDPOINT, CONTROLLER } from "../constants";
import { httpPost, httpGet } from "../httpClient";
import type {
  responseAllMaterias,
  createUpdateMateria,
} from "../types/materias";

/**
 * Llama al MS Principal, para actualizar la materia.
 * Retorna la información de todas las materias
 */
export async function createUpdateMateria(
  data: createUpdateMateria
): Promise<responseAllMaterias> {
  const url = `${BASE_URLS.MSPRINCIPAL}/${CONTROLLER.MATERIA}/${ENDPOINT.CREAACTUALIZATEMATERIA}`;

  return httpPost<createUpdateMateria, responseAllMaterias>(url, data);
}

/**
 * Llama al MS Principal, para buscar las materias en el sistema.
 * Retorna la información de todas las materias
 */
export async function searchMateria(
  filters: Record<string, string | number | boolean> = {}
): Promise<responseAllMaterias[]> {
  const url = `${BASE_URLS.MSPRINCIPAL}/${CONTROLLER.MATERIA}/${ENDPOINT.CONSULTARMATERIAS}`;

  return httpGet<responseAllMaterias[]>(url, filters);
}
