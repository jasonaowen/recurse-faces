#!/usr/bin/env python

import argparse
import json
import psycopg2

def parse_args():
    parser = argparse.ArgumentParser(description='Insert Recurse Center API data into database')
    parser.add_argument('connection', help='PostgreSQL connection string')
    parser.add_argument('batches', help='Path to batches.json')
    parser.add_argument('people', nargs='+', help='Path(s) to batch_people.json')
    return parser.parse_args()

def insert_batches(cursor, batches_filename):
    with open(batches_filename) as batches_file:
        batches = json.loads(batches_file.read())

    for batch in batches:
        print("Batch {}, \"{}\", {} - {}".format(
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

def insert_people(cursor, people_filename):
    with open(people_filename) as people_file:
        people = json.loads(people_file.read())

    for person in people:
        print("Person #{}: {} {} {}; {}".format(
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
                        person.get('image')
                       ]
                      )
        for stint in person['stints']:
            print("  Stint: {}, batch {}, {} - {}".format(
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

def main():
    args = parse_args()
    connection = psycopg2.connect(args.connection)
    cursor = connection.cursor()

    insert_batches(cursor, args.batches)
    for people_filename in args.people:
        insert_people(cursor, people_filename)

    connection.commit()
    cursor.close()
    connection.close()

if __name__ == "__main__":
    main()
