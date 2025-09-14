-- Script completo para ejecutar todas las migraciones de la refactorización de artistas
-- Este script debe ejecutarse en orden para actualizar correctamente la base de datos

-- 1. Crear tabla de géneros musicales
SOURCE src/presentation/migrations/scripts/009_musical_genres_table.sql;

-- 2. Alterar tabla profiles para incluir nuevos campos
SOURCE src/presentation/migrations/scripts/010_alter_profiles_table.sql;

-- 3. Crear tabla de relación profile_genres
SOURCE src/presentation/migrations/scripts/011_profile_genres_table.sql;

-- 4. Crear stored procedure para artistas
SOURCE src/presentation/migrations/scripts/sp_create_artist_profile.sql;

-- 5. Insertar seed de géneros musicales
SOURCE src/presentation/migrations/scripts/seed_06_musical_genres.sql;

-- 6. Actualizar la vista user_profile_details
SOURCE src/presentation/migrations/scripts/view_user_profile_details.sql;

-- Verificaciones finales
SHOW TABLES LIKE '%musical%';
SHOW TABLES LIKE '%profile%';

-- Verificar que los géneros se hayan insertado
SELECT COUNT(*) as total_genres FROM musical_genres WHERE is_active = TRUE;

-- Verificar que la vista tenga la estructura correcta
DESCRIBE user_profile_details;

-- Hacer una consulta de prueba (si hay datos)
SELECT 
    user_id,
    user_name,
    profile_id,
    profile_artist_name,
    has_artist_profile,
    musical_genres
FROM user_profile_details 
LIMIT 3;

-- Mostrar estadísticas
SELECT 
    COUNT(DISTINCT user_id) as total_users,
    COUNT(DISTINCT profile_id) as total_artists,
    COUNT(DISTINCT CASE WHEN profile_verified = 1 THEN profile_id END) as verified_artists
FROM user_profile_details;

SELECT 'Migration completed successfully!' as status;
