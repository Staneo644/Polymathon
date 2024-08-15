-- Assurez-vous que l'extension fuzzystrmatch est installée
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

-- Supprimer la fonction existante
DROP FUNCTION IF EXISTS get_word_name_search(TEXT);

-- Créer ou remplacer la fonction
CREATE OR REPLACE FUNCTION get_word_name_search(searchtext TEXT)
RETURNS TABLE (
  id BIGINT,
  name VARCHAR,
  distance INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    w.id,
    w.name,
    levenshtein(w.name, searchtext) AS distance
  FROM
    word w
  WHERE
    levenshtein(w.name, searchtext) <= 4
  ORDER BY
    distance
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- Appel de la fonction
SELECT * FROM get_word_name_search('extinguib');
