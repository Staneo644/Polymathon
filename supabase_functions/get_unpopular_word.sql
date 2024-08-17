-- Supprimer la fonction existante
DROP FUNCTION IF EXISTS get_unpopular_words(INTEGER);

-- Créer ou remplacer la fonction
CREATE OR REPLACE FUNCTION get_unpopular_words(limit_count INTEGER)
RETURNS TABLE (
  id BIGINT,
  name VARCHAR,
  definition TEXT,
  type VARCHAR,
  etymology TEXT,
  example TEXT,
  theme_id BIGINT,
  theme_name TEXT,
  last_day_word DATE,
  likes BIGINT,
  dislikes BIGINT,
  user_like_status BOOLEAN,   -- Indicateur de l'état du like (TRUE = liké, FALSE = disliké, NULL = ni l'un ni l'autre)
  views BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM (
    SELECT
      w.id,
      w.name,
      w.definition,
      w.type,
      w.etymology,
      w.example,
      w.theme as theme_id,
      (SELECT theme.name FROM theme WHERE theme.id = w.theme) AS theme_name,
      w.last_day_word,
      (SELECT COUNT(*)
       FROM "like" 
       WHERE "like".word = w.id 
         AND "like"."like" = TRUE) AS likes,
      (SELECT COUNT(*)
       FROM "like" 
       WHERE "like".word = w.id 
         AND "like"."like" = FALSE) AS dislikes,
      (SELECT l.like 
       FROM "like" l 
       WHERE l.word = w.id 
         AND l.user_id = auth.uid()
       LIMIT 1) AS user_like_status,
      (SELECT COUNT(*)
       FROM "views"
       WHERE views.word = w.id) AS views
    FROM
      word w
    WHERE
      w.validated = TRUE
  ) AS subquery
  ORDER BY
    (subquery.likes - subquery.dislikes) ASC
  LIMIT
    limit_count;
END;
$$ LANGUAGE plpgsql;

-- Appel de la fonction avec une limite de 10
SELECT * FROM get_unpopular_words(10);
