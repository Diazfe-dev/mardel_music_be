-- Alter profiles table to add new fields for artist profiles
-- Check and add location column if it doesn't exist
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.columns 
WHERE table_schema = DATABASE() 
AND table_name = 'profiles' 
AND column_name = 'location';

SET @sql = CASE 
    WHEN @col_exists = 0 THEN 'ALTER TABLE profiles ADD COLUMN location VARCHAR(255)'
    ELSE 'SELECT "Column location already exists" as message'
END;

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add profile_image_url column if it doesn't exist
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.columns 
WHERE table_schema = DATABASE() 
AND table_name = 'profiles' 
AND column_name = 'profile_image_url';

SET @sql = CASE 
    WHEN @col_exists = 0 THEN 'ALTER TABLE profiles ADD COLUMN profile_image_url VARCHAR(500)'
    ELSE 'SELECT "Column profile_image_url already exists" as message'
END;

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for better performance on location searches
-- Check if index exists before creating
SET @index_exists = 0;
SELECT COUNT(*) INTO @index_exists
FROM information_schema.statistics
WHERE table_schema = DATABASE()
AND table_name = 'profiles'
AND index_name = 'idx_profiles_location';

SET @sql = CASE 
    WHEN @index_exists = 0 THEN 'CREATE INDEX idx_profiles_location ON profiles(location)'
    ELSE 'SELECT "Index idx_profiles_location already exists" as message'
END;

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
