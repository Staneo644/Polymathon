-- Supprimer la fonction existante
DROP FUNCTION IF EXISTS get_liked_word(BOOLEAN);

-- Créer ou remplacer la fonction
CREATE OR REPLACE FUNCTION get_liked_word(state BOOLEAN)
RETURNS TABLE (
  id BIGINT,
  name VARCHAR,
  definition TEXT,
  type VARCHAR,
  etymology TEXT,
  example TEXT,
  theme TEXT,
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
    (SELECT theme.name FROM theme WHERE theme.id = w.theme) AS theme,
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
    w.id IN (SELECT * FROM like WHERE like.like = state)
END;
$$ LANGUAGE plpgsql;

-- Appel de la fonction
SELECT * FROM get_liked_word(true);
