# Interaulas Website

Website público para ver:
- Tabla masculina Grupo A y B
- Tabla femenina (un grupo, pasan los 4 mejores)
- Calendario y resultados
- Sección pública de sanciones
- Login para organizadores
- Edición de resultados y sanciones

## Para ponerlo online
1. Crea un proyecto en Supabase.
2. Abre el SQL Editor y ejecuta `supabase.sql`.
3. En Authentication > Users crea las cuentas de los organizadores.
4. Copia la URL del proyecto y la anon key a `config.js`.
5. Publica esta carpeta en cualquier hosting estático (por ejemplo GitHub Pages, Netlify o Vercel).

IMPORTANTE:
La política incluida permite editar a cualquier usuario autenticado. Para un torneo real, conviene restringir la edición a una lista/rol de organizadores antes de publicar.

## Resultados ya registrados
- Fortnite 1-0 Chifladitos
- Sin Esquinas 2-1 Motoneta

Puedes cambiar cualquier resultado desde el botón Editar después de iniciar sesión.
