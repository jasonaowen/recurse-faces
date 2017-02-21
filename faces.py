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
from flask_oauthlib.client import OAuth
import psycopg2


# pylint: disable=invalid-name
app = Flask(__name__, static_url_path='/build')
app.debug = not os.environ.get('PRODUCTION', False)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'development')

logging.basicConfig(level=logging.INFO)

rc = OAuth(app).remote_app(
    'Recurse Center',
    base_url='https://www.recurse.com/api/v1/',
    authorize_url='https://www.recurse.com/oauth/authorize',
    access_token_url='https://www.recurse.com/oauth/token',
    access_token_method='POST',
    consumer_key=os.environ['CLIENT_ID'],
    consumer_secret=os.environ['CLIENT_SECRET'],
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
    if app.debug:
        callback = 'urn:ietf:wg:oauth:2.0:oob'
    else:
        callback = os.environ['CLIENT_CALLBACK']
    return rc.authorize(callback=callback)

@app.route('/auth/recurse/callback', methods=['GET', 'POST'])
def auth_recurse_callback():
    "Process the results of a successful OAuth2 authentication"
    response = rc.authorized_response()
    if response is None or response.get('access_token') is None:
        return ({
            'message': 'Access Denied',
            'error': request.args['error'],
            'error_description': request.args['error_description'],
        }, 403)
    else:
        me = rc.get('people/me', token=[response.get('access_token')]).data
        logging.info("Logged in: %s %s %s",
                     me.get('first_name', ''),
                     me.get('middle_name', ''),
                     me.get('last_name', ''))

        session['recurse_user_id'] = me['id']
        return redirect(url_for('index'))

def needs_authorization(route):
    """ Use the @needs_authorization annotaiton to check that a valid session
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
                      LIMIT 1""",
                   [current_user])
    return cursor.fetchone()

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
                      LIMIT 1""",
                   [current_user])
    return cursor.fetchone()

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
                      ORDER BY random()
                      LIMIT 1""",
                   [current_user])
    return cursor.fetchone()

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
        random_person = get_random_person_from_all_batches(cursor, current_user)
    elif random_person_filter == 'overlapping':
        random_person = get_random_overlapping(cursor, current_user)
    elif random_person_filter == 'my_batch':
        random_person = get_random_in_batch(cursor, current_user)
    else:
        return (jsonify({
            'message': 'Unrecognized filter',
            'filter': random_person_filter,
        }), 400)
    cursor.close()

    return jsonify({
        'person_id': random_person[0],
        'first_name': random_person[1],
        'middle_name': random_person[2],
        'last_name': random_person[3],
        'image_url': random_person[4],
    })
