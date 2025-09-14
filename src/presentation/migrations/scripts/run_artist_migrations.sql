-- Script para ejecutar todas las migraciones relacionadas con artistas y géneros musicales

-- 1. Crear tabla de géneros musicales
SOURCE src/presentation/migrations/scripts/009_musical_genres_table.sql;

-- 2. Alterar tabla profiles
SOURCE src/presentation/migrations/scripts/010_alter_profiles_table.sql;

-- 3. Crear tabla de relación profile_genres
SOURCE src/presentation/migrations/scripts/011_profile_genres_table.sql;

-- 4. Crear stored procedure para artistas
SOURCE src/presentation/migrations/scripts/sp_create_artist_profile.sql;

-- 5. Insertar seed de géneros musicales
SOURCE src/presentation/migrations/scripts/seed_06_musical_genres.sql;

-- Verificar que todo se haya creado correctamente
SHOW TABLES LIKE '%musical%';
SHOW TABLES LIKE '%profile%';
DESCRIBE musical_genres;
DESCRIBE profile_genres;
DESCRIBE profiles;

-- Verificar géneros insertados
SELECT COUNT(*) as total_genres FROM musical_genres WHERE is_active = TRUE;
