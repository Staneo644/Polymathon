-- Supprimer la fonction existante
DROP FUNCTION IF EXISTS get_unvalidated_word(INTEGER);

-- Créer ou remplacer la fonction
CREATE OR REPLACE FUNCTION get_unvalidated_word(limit_count INTEGER)
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
  WHERE w.validated = FALSE          -- Assurer que le mot est non validé
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Appel de la fonction
SELECT * FROM get_unvalidated_word(10);
