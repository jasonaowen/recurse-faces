#!/usr/bin/env python

'''
Fetch and insert Recurse Center API data into database.

This script fetches the list of batches and the list of profiles from the
Recurse Center API using the personal access token specified in the environment
variable RC_API_ACCESS_TOKEN.

It connects to the database specified in the environment variable DATABASE_URL,
opens a transaction, deletes the current data (if any), and inserts the new
data. The database schema must already exist.
'''

import argparse
import json
import logging
import psycopg2
import requests

def fetch_data(token):
    return (get_batches(token), get_people(token))

def get_batches(token):
    url = 'https://www.recurse.com/api/v1/batches'
    headers = {'Authorization': f'Bearer {token}'}
    r = requests.get(url, headers=headers)
    if r.status_code != requests.codes.ok:
        r.raise_for_status()
    return r.json()

def get_people(token):
    people = []

    headers = {'Authorization': f'Bearer {token}'}
    url = 'https://www.recurse.com/api/v1/profiles?limit={limit}&offset={offset}'
    limit = 50
    offset = 0

    while True:
        r = requests.get(url.format(limit=limit, offset=offset), headers=headers)
        if r.status_code != requests.codes.ok:
            r.raise_for_status()
        page = r.json()
        if page == []:
            break
        people.extend(page)
        offset += limit

    return people

def replace_data(database_url, batches, people):
    connection = psycopg2.connect(database_url)
    cursor = connection.cursor()

    delete_data(cursor)
    insert_batches(cursor, batches)
    insert_people(cursor, people)

    connection.commit()
    cursor.close()
    connection.close()

def delete_data(cursor):
    cursor.execute('DELETE FROM stints')
    cursor.execute('DELETE FROM people')
    cursor.execute('DELETE FROM batches')

def insert_batches(cursor, batches):
    for batch in batches:
        logging.debug("Batch {}, \"{}\", {} - {}".format(
            batch.get('id'),
            batch.get('name'),
            batch.get('start_date'),
            batch.get('end_date')
        ))
        cursor.execute("INSERT INTO batches " +
                       " (batch_id, name, start_date, end_date)" +
                       " VALUES (%s, %s, %s, %s)",
                       [batch.get('id'),
                        batch.get('name'),
                        batch.get('start_date'),
                        batch.get('end_date')
                       ]
                      )

def insert_people(cursor, people):
    for person in people:
        logging.debug("Person #{}: {} {} {}; {}".format(
            person.get('id'),
            person.get('first_name'),
            person.get('middle_name'),
            person.get('last_name'),
            person.get('image')
        ))
        cursor.execute("INSERT INTO people" +
                       " (person_id, first_name, middle_name," +
                       "  last_name, image_url)" +
                       " VALUES (%s, %s, %s, %s, %s)",
                       [person.get('id'),
                        person.get('first_name'),
                        person.get('middle_name'),
                        person.get('last_name'),
                        person.get('image_path')
                       ]
                      )
        for stint in person['stints']:
            logging.debug("  Stint: {}, batch {}, {} - {}".format(
                stint.get('type'),
                stint.get('batch_id'),
                stint.get('start_date'),
                stint.get('end_date')
            ))
            cursor.execute("INSERT INTO stints" +
                           " (person_id, batch_id, stint_type," +
                           "  start_date, end_date)" +
                           " VALUES (%s, %s, %s, %s, %s)",
                           [person.get('id'),
                            stint.get('batch_id'),
                            stint.get('type'),
                            stint.get('start_date'),
                            stint.get('end_date')
                           ]
                          )

def main(database_url, token):
    batches, people = fetch_data(token)
    logging.info('Found %s people', len(people))

    replace_data(database_url, batches, people)

if __name__ == "__main__":
    import os

    logging.basicConfig(level=logging.INFO)

    database_url = os.environ['DATABASE_URL']
    token = os.environ['RC_API_ACCESS_TOKEN']

    main(database_url, token)
