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

def replace_data(database_url, people):
    connection = psycopg2.connect(database_url)
    cursor = connection.cursor()

    delete_data(cursor)
    insert_data(cursor, people)

    connection.commit()
    cursor.close()
    connection.close()

def delete_data(cursor):
    cursor.execute('DELETE FROM stints')
    cursor.execute('DELETE FROM people')
    cursor.execute('DELETE FROM batches')

def insert_data(cursor, people):
    processed_batches = set()

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
            batch_id = None
            batch = stint.get('batch')

            if (batch):
                batch_id = batch.get('id')

                if (batch_id not in processed_batches):
                    logging.debug("  Batch {}, \"{}\", {} - {}".format(
                        batch_id,
                        batch.get('name'),
                        batch.get('short_name'),
                        batch.get('alt_name')
                    ))
                    cursor.execute("INSERT INTO batches " +
                                   " (batch_id, name, short_name, alt_name)" +
                                   " VALUES (%s, %s, %s, %s)",
                                   [batch_id,
                                    batch.get('name'),
                                    batch.get('short_name'),
                                    batch.get('alt_name')
                                   ]
                                  )
                    processed_batches.add(batch_id)

            logging.debug("  Stint: {}, Batch: {}, {} - {}".format(
                stint.get('type'),
                batch_id,
                stint.get('start_date'),
                stint.get('end_date')
            ))
            cursor.execute("INSERT INTO stints" +
                           " (person_id, batch_id, stint_type," +
                           "  start_date, end_date)" +
                           " VALUES (%s, %s, %s, %s, %s)",
                           [person.get('id'),
                            batch_id,
                            stint.get('type'),
                            stint.get('start_date'),
                            stint.get('end_date')
                           ]
                          )

    logging.info('Found %s batches', len(processed_batches))

def main(database_url, token):
    people = get_people(token)
    logging.info('Found %s people', len(people))

    replace_data(database_url, people)

if __name__ == "__main__":
    import os

    logging.basicConfig(level=logging.INFO)

    database_url = os.environ['DATABASE_URL']
    token = os.environ['RC_API_ACCESS_TOKEN']

    main(database_url, token)
