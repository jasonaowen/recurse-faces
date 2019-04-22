"""
Recurse Faces back-end
"""

# Copyright (C) 2017 Jason Owen <jason.a.owen@gmail.com>

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.

# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

from functools import wraps
import logging
import os
from flask import Flask, jsonify, redirect, request, send_from_directory, session, url_for
from authlib.flask.client import OAuth
from werkzeug.exceptions import HTTPException
import psycopg2


# pylint: disable=invalid-name
app = Flask(__name__, static_url_path='/build')
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'development')

logging.basicConfig(level=logging.INFO)

rc = OAuth(app).register(
    'Recurse Center',
    api_base_url='https://www.recurse.com/api/v1/',
    authorize_url='https://www.recurse.com/oauth/authorize',
    access_token_url='https://www.recurse.com/oauth/token',
    client_id=os.environ['CLIENT_ID'],
    client_secret=os.environ['CLIENT_SECRET'],
)

connection = psycopg2.connect(os.environ['DATABASE_URL'])

@app.route('/')
def index():
    "Get the single-page app HTML"
    return send_from_directory('build', 'index.html')

@app.route('/static/<path:path>')
def static_file(path):
    "Get the single-page app assets"
    return send_from_directory('build/static', path)

@app.route('/auth/recurse')
def auth_recurse_redirect():
    "Redirect to the Recurse Center OAuth2 endpoint"
    callback = os.environ['CLIENT_CALLBACK']
    return rc.authorize_redirect(callback)

@app.route('/auth/recurse/callback', methods=['GET', 'POST'])
def auth_recurse_callback():
    "Process the results of a successful OAuth2 authentication"

    try:
        token = rc.authorize_access_token()
    except HTTPException as e:
        logging.error(
            'Error %s parsing OAuth2 response: %s',
            request.args.get('error', '(no error code)'),
            request.args.get('error_description', '(no error description'),
        )
        return (jsonify({
            'message': 'Access Denied',
            'error': request.args.get('error', '(no error code)'),
            'error_description': request.args.get('error_description', '(no error description'),
        }), 403)

    me = rc.get('people/me', token=token).json()
    logging.info("Logged in: %s %s %s",
                 me.get('first_name', ''),
                 me.get('middle_name', ''),
                 me.get('last_name', ''))

    session['recurse_user_id'] = me['id']
    return redirect(url_for('index'))

def needs_authorization(route):
    """ Use the @needs_authorization annotation to check that a valid session
    exists for the current user."""
    @wraps(route)
    def wrapped_route(*args, **kwargs):
        """Check the session, or return access denied."""
        if app.debug:
            return route(*args, **kwargs)
        elif 'recurse_user_id' in session:
            return route(*args, **kwargs)
        else:
            return (jsonify({
                'message': 'Access Denied',
            }), 403)

    return wrapped_route

def get_random_person_from_all_batches(cursor, current_user):
    """Find a random person from the database that is not the current users."""
    cursor.execute("""SELECT person_id,
                             first_name,
                             middle_name,
                             last_name,
                             image_url
                      FROM people
                      WHERE person_id != %s
                      ORDER BY random()
                      LIMIT 4""",
                   [current_user])
    return [x for x in cursor.fetchall()]

def get_random_overlapping(cursor, current_user):
    """Find a random person from the database that was at RC at the same time as
    the current user."""
    cursor.execute("""SELECT person_id,
                             first_name,
                             middle_name,
                             last_name,
                             image_url
                      FROM batch_mates
                      WHERE querent_person_id = %s
                      ORDER BY random()
                      LIMIT 4""",
                   [current_user])
    return [x for x in cursor.fetchall()]

def get_random_in_batch(cursor, current_user):
    """Find a random person from the database that is in (one of) the current
    user's batch(es)."""
    cursor.execute("""WITH user_batch AS (
                        SELECT batch_id
                        FROM stints
                        WHERE person_id = %s
                      )
                      SELECT people.person_id,
                             people.first_name,
                             people.middle_name,
                             people.last_name,
                             people.image_url
                      FROM people
                        INNER JOIN stints
                          ON people.person_id = stints.person_id
                        INNER JOIN user_batch
                          ON stints.batch_id = user_batch.batch_id
                      WHERE people.person_id != %s
                      ORDER BY random()
                      LIMIT 4""",
                   [current_user,current_user])
    return [x for x in cursor.fetchall()]

def get_stints_for_user(cursor, user):
    """Returns the stint type, name, and duration for each stint in which the current
    user participated."""
    cursor.execute("""SELECT
                        stints.stint_type,
                        stints.start_date,
                        stints.end_date,
                        stints.title,
                        batches.short_name
                      FROM stints
                      LEFT JOIN batches
                        ON stints.batch_id = batches.batch_id
                      WHERE stints.person_id = %s
                      ORDER BY stints.start_date""",
                   [user])
    return [x for x in cursor.fetchall()]

@app.route('/api/people/random')
@needs_authorization
def get_random_person():
    """Find a random person from the database that meets the selected filter"""
    if app.debug:
        current_user = request.args.get('user')
        if current_user is None:
            current_user = os.environ.get('DEFAULT_USER', 1)
    else:
        current_user = session['recurse_user_id']
    cursor = connection.cursor()
    random_person_filter = request.args.get('filter')
    if random_person_filter is None or random_person_filter == 'all':
        random_people = get_random_person_from_all_batches(cursor, current_user)
    elif random_person_filter == 'overlapping':
        random_people = get_random_overlapping(cursor, current_user)
    elif random_person_filter == 'my_batch':
        random_people = get_random_in_batch(cursor, current_user)
    else:
        return (jsonify({
            'message': 'Unrecognized filter',
            'filter': random_person_filter,
        }), 400)

    target_user = random_people[0]
    stints = get_stints_for_user(cursor, target_user[0])
    cursor.close()

    return jsonify(
        [{
        'person_id': x[0],
        'first_name': x[1],
        'middle_name': x[2],
        'last_name': x[3],
        'image_url': x[4],
        'stints': [{
            'stint_type': s[0],
            'start_date': s[1],
            'end_date': s[2],
            'title': s[3],
            'short_name': s[4]
            } for s in stints] if i == 0 else [],
        } for i, x in enumerate(random_people)]
    )
