/** Exporta el diccionario español a JSON (fuente para generar otros idiomas). */
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "lib/i18n/dictionaries/json");
mkdirSync(outDir, { recursive: true });

const { default: es } = await import(join(root, "lib/i18n/dictionaries/es.ts"));
writeFileSync(join(outDir, "es.json"), JSON.stringify(es, null, 2), "utf8");
console.log("Wrote es.json", Object.keys(es).length, "top-level keys");
