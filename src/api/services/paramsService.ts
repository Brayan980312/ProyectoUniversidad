import { BASE_URLS, ENDPOINT, CONTROLLER } from "../constants";
import { httpPost, httpGet } from "../httpClient";
import type { responseAllParams, updateParam } from "../types/params";

/**
 * Llama al MS Principal, para actualizar el parametro.
 * Retorna la información de todos los parametros
 */
export async function updateParams(
  data: updateParam
): Promise<responseAllParams> {
  const url = `${BASE_URLS.MSPRINCIPAL}/${CONTROLLER.PARAMETROS}/${ENDPOINT.UPDATEPARAM}`;

  return httpPost<updateParam, responseAllParams>(url, data);
}

/**
 * Consulta los parámetros utilizando una petición GET con posibles filtros.
 * @param filters Objeto con filtros opcionales como query params.
 * @returns Lista de parámetros encontrados.
 */
export async function searchParams(
  filters: Record<string, string | number | boolean> = {}
): Promise<responseAllParams[]> {
  const url = `${BASE_URLS.MSPRINCIPAL}/${CONTROLLER.PARAMETROS}/${ENDPOINT.SEARCHPARAMS}`;

  return httpGet<responseAllParams[]>(url, filters);
}
