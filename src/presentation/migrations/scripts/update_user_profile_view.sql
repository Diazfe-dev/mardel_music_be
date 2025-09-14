-- Script para actualizar la vista user_profile_details con los nuevos campos
-- Este script debe ejecutarse después de las migraciones de artistas

-- Actualizar la vista user_profile_details
SOURCE src/presentation/migrations/scripts/view_user_profile_details.sql;

-- Verificar que la vista se haya actualizado correctamente
DESCRIBE user_profile_details;

-- Hacer una consulta de prueba para verificar la estructura
SELECT * FROM user_profile_details LIMIT 1;
