import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
const file = resolve('src/environments/environment.generated.ts');
mkdirSync(dirname(file), { recursive: true });
writeFileSync(file, `export const environment = { production: ${process.env.VERCEL === '1'}, apiBaseUrl: ${JSON.stringify(apiBaseUrl)} } as const;\n`);
console.log(`Environment generated for ${apiBaseUrl}`);
