#!/bin/sh

# pg_ctl stop

# if ! psql -lqt -U postgres | cut -d \| -f 1 | grep -qw faces; then
#         createdb -U postgres faces
#         postgres --single  <<- EOSQL
#         CREATE DATABESE faces;
#         GRANT ALL PRIVILEGES ON DATABASE faces;
# EOSQL
#         echo "Creating faces db"
# fi

echo "Populating faces db"

psql -U postgres faces < /sql-dump/pg_dump.2017-02-28.sql
