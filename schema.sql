CREATE TABLE IF NOT EXISTS batches (
  batch_id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL
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
  PRIMARY KEY (person_id, start_date)
);
