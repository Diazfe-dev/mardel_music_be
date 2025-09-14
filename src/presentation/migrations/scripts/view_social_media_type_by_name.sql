DROP VIEW IF EXISTS social_media_type_by_name;

CREATE VIEW social_media_type_by_name AS
SELECT
    sm.id AS social_media_id,
    sm.name AS social_media_name,
    sm.description as social_media_description,
    smt.id AS social_media_type_id,
    smt.name AS social_media_type_name
FROM
    social_media_type smt
        LEFT JOIN
    social_media sm ON sm.type_id = smt.id
ORDER BY
    smt.name, sm.name;