Frontend en Astro
    - Stack
        Astro 7 {Static First, en cazo de que no se pueda cumplir algun requisito de algun component de manera estatica usa Preact solo si es estrictamente necesario}
        Starwind {estructamente se tiene que usar estos components de esta libreria}
        Zod
        @tabler/icons
        pnpm {no uses npm ha tenido problemas de seguridad}
    - Estructura de carpetas
        frontend
            src/
                actions/
                    index.ts
                        import { landing } from "./landing";

                        export const server = {
                            landing,
                        };

                        export default server;

                components/
                    starwind/ # Aqui se agregan los components de Starwind al agregarlos
                    ui/ # Aqui se agregan los components que se comparten entre otros components que sean reutilizables
                        sidebar # Usa el primer ejemplo que esta en https://starwind.dev/docs/components/sidebar/ {es para el dashboard en la layout AdminLayout.astro}
                features/
                    landing/
                        components/
                        landing.action.ts # Solo crear cuando se necesitan hacer peticiones http {esto se hace con la lib de api-client.ts} en alguna feature
                        landing.types.ts # Solo crear si se necesita tupar algo en alguna feature
                layouts/
                    BaseLayout.astro # De esta Layout se extendera
                lib/
                    api-client.ts
                pages/
                middleware.ts # Aqui manejas las rutas publicas y privadas y revisa que no afecte a las peticiones que ejecutan los actions a la api 
    - Configuracion de alias en tsconfig.json
        "compilerOptions": {
            "baseUrl": ".",
            "paths": {
                "@/*": ["src/*"],
                "@actions/*": ["src/actions/*"],
                "@features/*": ["src/features/*"],
                "@layouts/*": ["src/layouts/*"],
                "@lib/*": ["src/lib/*"],
                "@ui/*": ["src/components/ui/*"],
            },
        }
    - El formulario se valida con el action que se ejecuta y muestre los errores
    - Don'ts
        * Don't duplicate data across modules
        * Don't over-engineer — ship the minimum needed
        * Don't use if/else — use early returns
        * Do not use unnecessary JavaScript; use only the minimum required to implement the solution.


No termines hasta que:
- Sea responsive
- Tenga experiencia visual profesional
- Exista PERFORMANCE_REPORT.md con metricas finales y mejoras aplicadas.
- El backend [backend] compile correctamente y no tenga errores el frontend [frontend]

Ejecuta las pruebas necesarias desde terminal y optimiza lo que haga falta hasta cumplir el objetivo.