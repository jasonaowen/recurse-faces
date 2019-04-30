# Recurse Faces

Learn the faces of your fellow Recursers with the
[Recurse Faces app](https://faces.recurse.com)!

This app helps users associate names and faces of
members of the [Recurse Center](https://recurse.com)
community, including batch mates and staff from
both current and past stints.

It uses the
[Recurse Center API](https://github.com/recursecenter/wiki/wiki/Recurse-Center-API)
to cycle through a set of profile photos,
prompting users to guess the first name of the
person shown in the photo. Users can choose to
see a set of hints if they are stuck, and they
can filter to see profiles as
broadly as all past and present members of the
RC community or as narrowly as
only the profiles from a specific batch they attended.

## Local Set Up

The app is comprised of a Flask back-end and a
React front-end. The instructions
below detail how to set up the
[front end with test data](#start-the-front-end-with-test-data),
which is the quickest way to get started and does not
require setting up the backend database and server.
To pull live data from the Recurse Center API,
see the instructions for
[setting up the backend](#start-the-back-end-with-the-rc-api).

### Start the Front End with Test Data

First, install dependencies by running the
[npm](https://www.npmjs.com/get-npm) command:

```sh
$ npm install
```

If you want to run the front end with test data, you may set the
`REACT_APP_USE_TEST_DATA` variable:

```sh
$ REACT_APP_USE_TEST_DATA=true npm run start
```

This option is the quickest way to get started, and
it is helpful when doing front end development or
testing that does not require updates to the database
or calls to the RC API. Instead of displaying photos of
Recursers, it will show photos and names of flowers:

<img src="./screenshots/test_data.png?raw=true" alt="Test Data Guess" width="400"/>


### Start the Back End with the RC API
The Python server is a Flask app
that serves the index page and the JavaScript,
handles the OAuth login process,
and looks up names and images in the database.

Running the API locally requires populating the database
and setting up the Python environment.

#### Python Virtual Environment
You'll first need to install the Python dependencies.
First, set up a
[virtual environment](https://docs.python.org/3/tutorial/venv.html):

```sh
$ python3 -m venv venv
```

or

```sh
$ python3 -m virtualenv --python=python3 venv
```

Then, activate the virtual environment
and install the app's dependencies into it:

```sh
$ . venv/bin/activate
(venv)$ pip install -r requirements.txt
```

To populate the database or start the Flask app,
the scripts must be run in this virtual environment (venv).
The virtual environment can be reactivated at any time with the command:
```sh
$ . venv/bin/activate
```

#### Populate the Database

We use [PostgreSQL](https://www.postgresql.org/) as our database.
Follow the [installation instructions](https://www.postgresql.org/download/)
for your platform to set up the database server.

First, choose or [create](https://www.postgresql.org/docs/current/tutorial-createdb.html)
a database:

```sh
$ createdb --owner=$(whoami) faces
```

Depending on your platform,
you may need to run that command
as the operating system user which owns the database server:

```sh
$ sudo -u postgres createdb --owner=$(whoami) faces
```

Then, create the schema:

```sh
$ psql faces < schema.sql
```

There is a script
to get the data the application needs
from the Recurse Center API
and store it in the database.
To connect to the RC API,
the script needs a personal access token,
which you can create in the
[Apps page in your RC Settings](https://www.recurse.com/settings/apps).
The personal access token will only be shown once,
so copy it to a safe place.

Run the script in your
[Python Virtual Environment](#python-virtual-environment)
with your personal access token:

```sh
(venv)$ DATABASE_URL=postgres:///faces \
  RC_API_ACCESS_TOKEN=<personal access token> \
  ./update-data.py
```

It should print out how many people and batches were added.

Note: the `DATABASE_URL` can be any
[libpq connection string](https://www.postgresql.org/docs/current/static/libpq-connect.html#LIBPQ-CONNSTRING).
Alternate database URLs you might try are
`postgres://localhost/faces`
or
`postgres://localhost/`,
to connect over TCP/IP to the database named `faces`.

#### Start the Flask App

The Flask app needs some configuration,
which it takes through environment variables.

When running in development mode,
the app does not require authentication,
but it does need to know your Recurse Center user ID.
You can find your ID by going to the
[directory](https://www.recurse.com/directory),
looking yourself up,
and examining the number in the URL;
for example, `2092` in
`https://www.recurse.com/directory/2092-jason-owen`.

If you are working on the RC OAuth integration,
you will need to
[create an OAuth app in your RC Settings](https://www.recurse.com/settings/apps).
Put the generated client ID and the client secret
into the respective placeholders below.
Otherwise, those can be set to placeholder values like `_`
(but must still be present and non-empty).

Then, build the static resources for the Flask app to serve:
```sh
$ npm run build
```

Next, start the Flask API in your
[Python Virtual Environment](#python-virtual-environment):

```sh
(venv)$ FLASK_APP=faces.py \
  FLASK_ENV=development \
  CLIENT_CALLBACK=http://127.0.0.1:5000/auth/recurse/callback \
  CLIENT_ID=<your_client_id> \
  CLIENT_SECRET=<your_client_secret> \
  DATABASE_URL=postgres:///faces \
  DEFAULT_USER=<your_recurse_user_id> \
  python -m flask run
```

The `CLIENT_CALLBACK` URL must include
the port number the Flask instance will be running on,
which defaults to port 5000.

Now, your local instance of Recurse Faces with
live data from the RC API will be available at http://127.0.0.1:5000/:

<img src="./screenshots/live_rc_data.png?raw=true" alt="Live RC Data Hint" width="400"/>

However, because this instance is running with
statically generated resources from `npm build`,
local changes to the React front end will not be reflected at this URL.

The React dev server is configured to proxy the
Flask API, so to run your local front end code
with live data from the RC API, leave the Flask
app running and start the React front end in another terminal window:
```sh
$ npm run start
```

Now, the React front end reflecting any local code
changes will be running at http://localhost:3000/
with data from the Flask back end API running at
http://127.0.0.1:5000/.

## Heroku Set Up

This is app is deployed on Heroku:

```sh
$ heroku apps:create
```

To set up your Heroku app, add both the Python and Node buildpacks:

```sh
$ heroku buildpacks:add heroku/python
$ heroku buildpacks:add heroku/nodejs
```

You will also need to set several environment variables.

Three relate to the Recurse Center OAuth API. When you create your OAuth app in
your RC account settings, you will need to set the callback to be
`https://<your_url>/auth/recurse/callback`. Once you create it, you will get a
`CLIENT_ID` and `CLIENT_SECRET`. You will also need to set a randomly chosen
password for Flask to encrypt sessions with.

```sh
$ heroku config:set \
    CLIENT_CALLBACK=https://<your_url>/auth/recurse/callback
    CLIENT_ID=<your_client_id> \
    CLIENT_SECRET=<your_client_secret> \
    FLASK_SECRET_KEY=$(makepasswd --chars=64) \
    FLASK_ENV=production
```

You will also need to create a database:

```sh
$ heroku create heroku-postgresql:hobby-dev
```

and populate it:

```sh
$ heroku pg:psql < schema.sql
```

And you'll probably want logs of some sort. I'm using Papertrail:

```sh
$ heroku addons:create papertrail:choklad
```

Then, in theory, it should be a simple `git push heroku master`!


## Troubleshooting
If you receive either of the following messages:
```sh
File "./update-data.py", line 24
headers = {'Authorization': f'Bearer {token}'}
                                                ^
SyntaxError: invalid syntax
```

or

```sh
/usr/bin/python: No module named flask
```

reactivate your
[Python virtual environment](#python-virtual-environment),
and then try to run the previous command again.

<a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11325206/336ea5f4-9150-11e5-9e90-d86ad31993d8.png' height='20px'/></a>
![Licensed under the AGPL, version 3](https://img.shields.io/badge/license-AGPL3-blue.svg)
