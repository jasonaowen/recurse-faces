# Recurse Faces

Learn the faces of your fellow Recursers!

## Local set up

The app is comprised of a Flask back-end and a React front-end.

### Front End

You will need to install dependencies:

```sh
$ npm install
```

If you want to do front end development only, you may set the
`REACT_APP_USE_TEST_DATA` variable:

```sh
$ REACT_APP_USE_TEST_DATA=true npm run start
```

If you want to run the front end with the API, set it up as below. The React dev
server is configured to proxy the Flask API, so you need only start both (in
separate terminals, probably):

```sh
$ npm run start
```


### Back End

The Python server is a Flask app
that serves the index page and the JavaScript,
handles the OAuth login process,
and looks up names and images in the database.

Running the API locally requires populating the database
and setting up the Python environment.

#### Database

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
from the
[Recurse Center API](https://github.com/recursecenter/wiki/wiki/Recurse-Center-API)
and store it in the database.
To connect to the
Recurse Center API,
the script needs a personal access token,
which you can create in the
[Apps page in your RC Settings](https://www.recurse.com/settings/apps).
The personal access token will only be shown once,
so copy it to a safe place.

Run the script with your personal access token:

```sh
(venv)$ DATABASE_URL=postgres:///faces \
  RC_API_ACCESS_TOKEN=<personal access token> \
  ./update-data.py
```

It should print out how many people were added.

Note: the `DATABASE_URL` can be any
[libpq connection string](https://www.postgresql.org/docs/current/static/libpq-connect.html#LIBPQ-CONNSTRING).
Alternate database URLs you might try are
`postgres://localhost/faces`
or
`postgres://localhost/`,
to connect over TCP/IP to the databases named `faces` and your username,
respectively.

#### Flask app

You'll need to install the Python dependencies.
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

The Flask app needs some configuration,
which it takes through environment variables.

When running in development mode,
the app does not require authentication,
so it needs to know your Recurse Center user ID.
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
(but must still be present and nonempty).

Start the Flask API by:

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
the port number the Flask instance is running on,
which defaults to port 5000.

## Heroku set up

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

<a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11325206/336ea5f4-9150-11e5-9e90-d86ad31993d8.png' height='20px'/></a>
![Licensed under the AGPL, version 3](https://img.shields.io/badge/license-AGPL3-blue.svg)
