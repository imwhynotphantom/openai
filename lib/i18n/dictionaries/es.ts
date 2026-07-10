/**
 * Diccionario español — FUENTE DE VERDAD del copy de la web.
 * Los JSON en dictionaries/json/ deben tener la misma estructura.
 * Plantillas: los valores dinámicos usan "{clave}" (helper tf()).
 */
import dict from "./json/es.json";

export type Dictionary = typeof dict;
export default dict;
