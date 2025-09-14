-- Remove avatar_url column from profiles table to maintain consistency
-- We only need profile_image_url

-- First, migrate any data from avatar_url to profile_image_url where profile_image_url is NULL
UPDATE profiles 
SET profile_image_url = avatar_url 
WHERE profile_image_url IS NULL 
AND avatar_url IS NOT NULL;

-- Check if avatar_url column exists before dropping it
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.columns 
WHERE table_schema = DATABASE() 
AND table_name = 'profiles' 
AND column_name = 'avatar_url';

SET @sql = CASE 
    WHEN @col_exists = 1 THEN 'ALTER TABLE profiles DROP COLUMN avatar_url'
    ELSE 'SELECT "Column avatar_url does not exist" as message'
END;

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
