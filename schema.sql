CREATE TABLE IF NOT EXISTS batches (
  batch_id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  short_name TEXT,
  alt_name TEXT
);

CREATE TABLE IF NOT EXISTS people (
  person_id INTEGER PRIMARY KEY,
  first_name TEXT,
  middle_name TEXT,
  last_name TEXT,
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS stints (
  person_id INTEGER NOT NULL REFERENCES people (person_id),
  batch_id INTEGER NULL REFERENCES batches (batch_id),
  stint_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NULL,
  title TEXT,
  PRIMARY KEY (person_id, start_date)
);

CREATE VIEW batch_mates AS
SELECT DISTINCT
  a.person_id AS querent_person_id,
  people.person_id,
  people.first_name,
  people.middle_name,
  people.last_name,
  people.image_url
FROM stints a
  INNER JOIN stints b
    ON (a.start_date < b.end_date OR b.end_date IS NULL)
    AND (b.start_date < a.end_date OR a.end_date IS NULL)
    AND a.person_id != b.person_id
  INNER JOIN people
    ON b.person_id = people.person_id;
