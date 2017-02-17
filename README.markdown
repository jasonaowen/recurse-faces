# Recurse Faces

Learn the faces of your fellow Recursers!

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
    PRODUCTION=True
```

You will also need to create a database:

```sh
$ heroku create heroku-postgresql:hobby-dev
```

And you'll probably want logs of some sort. I'm using Papertrail:

```sh
$ heroku addons:create papertrail:choklad
```

Then, in theory, it should be a simple `git push heroku master`!

## Local set up

The app is comprised of a Flask back-end and a React front-end. You'll need to
install the Python dependencies and the Node dependencies:

```sh
$ python3 -m virtualenv --python=python3 venv
$ . venv/bin/activate
(venv)$ pip install -r requirements.txt

$ npm install
```

The React dev server is configured to proxy the Flask API, so you need only
start both (in separate terminals, probably):

```sh
$ FLASK_APP=faces.py \
  CLIENT_ID=<your_client_id> \
  CLIENT_SECRET=<your_client_secret> \
  DATABASE_URL=postgres://username:password@hostname:port/database \
  python -m flask run

$ npm run start
```

The `DATABASE_URL` can be any [libpq connection
string](https://www.postgresql.org/docs/current/static/libpq-connect.html#LIBPQ-CONNSTRING).

## Populating the database

First, create the schema:

```sh
$ heroku pg:psql < schema.sql
```

or

```sh
$ psql < schema.sql
```

Then, download the relevant data from the Recurse Center API, and invoke the
update script:

```sh
(venv)$ python update-data.py \
  <your_database_url> \
  batches.json \
  batch-*.json
```

<a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11325206/336ea5f4-9150-11e5-9e90-d86ad31993d8.png' height='20px'/></a>
![Licensed under the AGPL, version 3](https://img.shields.io/badge/license-AGPL3-blue.svg)
