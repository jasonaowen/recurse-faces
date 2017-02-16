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

import os
from flask import Flask, redirect, request, session, url_for
from flask_oauthlib.client import OAuth

# pylint: disable=invalid-name
app = Flask(__name__, static_url_path='/build')
app.debug = not os.environ.get('PRODUCTION', False)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'development')

# class RecurseCenter(Oauth2):
#     NAME = 'Recurse Center'
#     AUTHORIZATION_URL = 'https://www.recurse.com/oauth/authorize'
#     ACCESS_TOKEN_URL = 'https://www.recurse.com/oauth/token'
#     GET_USERINFO_URL = 'https://www.recurse.com/api/v1/people/me'
rc = OAuth(app).remote_app(
    'Recurse Center',
    base_url='https://www.recurse.com/api/v1/',
    authorize_url='https://www.recurse.com/oauth/authorize',
    access_token_url='https://www.recurse.com/oauth/token',
    access_token_method='POST',
    consumer_key=os.environ['CLIENT_ID'],
    consumer_secret=os.environ['CLIENT_SECRET'],
)

@app.route('/')
def index():
    "Get the single-page app HTML"
    return app.send_static_file('index.html')

@app.route('/bundle.js')
def bundle():
    "Get the single-page app JavaScript"
    return app.send_static_file('bundle.js')

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
    print("Response: {}".format(str(response)))
    if response is None or response.get('access_token') is None:
        return ({
            'message': 'Access Denied',
            'error': request.args['error'],
            'error_description': request.args['error_description'],
        }, 403)
    else:
        me = rc.get('people/me', token=[response.get('access_token')]).data
        session['recurse_user_id'] = me['id']
        return redirect(url_for('index'))
