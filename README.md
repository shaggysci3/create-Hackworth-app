# Phase 4 Full-Stack Application Project Template

This will create a template of what you need a vite app with v6 routing

a server with python flask and sqlaclchemy
or
a PERN app with Supabase

## Set up

## using WSL:

cd and open into your clone of Hackworth-template dir and
right click on create-Hackworth-app.js
select copy path
run these commands and put in your

```console
sudo mkdir -p /usr/local/bin
sudo ln -s <paste/path/to/create-Hackworth-app.js>  /usr/local/bin/cdha
sudo chmod +x /usr/local/bin/cdha
```

navigate to where you want to create your project
run command

```console
cdha create <your-project-name>
```

and wait for it to fully load it may take a couple minutes ignore all prompts
until it says Project <project-name> created successfully!
do this anywhere as many times as you want as it is saved globally

to remove cdha run

```console
sudo rm /usr/local/bin/cdha
```

## not using wsl:

right click on create-Hackworth-app.js
select copy path

```console
chmod +x <paste/path/to/create-Hackworth-app.js>
```

navigate in external terminal to where you want to load your new project
paste the path

```console
/path/to/create-Hackworth-app.js create <your-project-name>
```

follow the prompts and once it says

```console
Creating <project-name>
```

wait for it to fully load it may take a couple minutes ignore all prompts
until it says Project <project-name> created successfully!
you will have to run

```console
/path/to/create-Hackworth-app.js create <your-project-name>
```

every time you want to make a new project

## Setup once created for PERN-SB

check your env variables in `.env` in `server/` and `.env.local` in `client/`

to run: `npm start`
other scripts check `package.json` in `client/`
to build out your backend with Supabase
https://supabase.com/docs/reference/javascript/installing
the docs are very useful and lay out Auth and basic CRUD commands

## Setup once created for REACT FLASK

### `server/`

The `server/` directory contains all of your backend code.

`app.py` is your Flask application. You'll want to use Flask to build a simple
API backend like we have in previous modules. You should use Flask-RESTful for
your routes. You should be familiar with `models.py` and `seed.py` by now, but
remember that you will need to use Flask-SQLAlchemy, Flask-Migrate, and
SQLAlchemy-Serializer instead of SQLAlchemy and Alembic in your models.

The project contains a default `Pipfile` with some basic dependencies. You may
adapt the `Pipfile` if there are additional dependencies you want to add for
your project.

To download the dependencies for the backend server, run:

```console
pipenv install
pipenv shell
```

You can run your Flask API on [`localhost:5555`](http://localhost:5555) by
running:

```console
python server/app.py
```

Check that your server serves the default route `http://localhost:5555`. You
should see a web page with the heading "Project Server".

### `client/`

The `client/` directory contains all of your frontend code. The file
`package.json` has been configured with common React application dependencies,
include `react-router-dom`.

You can run your React app by
running:

```sh
npm run dev --prefix client
```

Check that your the React client displays a default page
`http://localhost:3000`. You should see a web page with the heading "Project
Client".

## Generating Your Database

NOTE: The initial project directory structure does not contain the `instance` or
`migrations` folders. Change into the `server` directory:

```console
cd server
```

Then enter the commands to create the `instance` and `migrations` folders and
the database `app.db` file:

```
flask db init
flask db upgrade head
```

Type `tree -L 2` within the `server` folder to confirm the new directory
structure:

```console
.
├── app.py
├── config.py
├── instance
│   └── app.db
├── migrations
│   ├── README
│   ├── __pycache__
│   ├── alembic.ini
│   ├── env.py
│   ├── script.py.mako
│   └── versions
├── models.py
└── seed.py
```

Edit `models.py` and start creating your models. Import your models as needed in
other modules, i.e. `from models import ...`.

Remember to regularly run
`flask db revision --autogenerate -m'<descriptive message>'`, replacing
`<descriptive message>` with an appropriate message, and `flask db upgrade head`
to track your modifications to the database and create checkpoints in case you
ever need to roll those modifications back.

> **Tip: It's always a good idea to start with an empty revision! This allows
> you to roll all the way back while still holding onto your database. You can
> create this empty revision with `flask db revision -m'Create DB'`.**

If you want to seed your database, now would be a great time to write out your
`seed.py` script and run it to generate some test data. Faker has been included
in the Pipfile if you'd like to use that library.

---

#### `config.py`

When developing a large Python application, you might run into a common issue:
_circular imports_. A circular import occurs when two modules import from one
another, such as `app.py` and `models.py`. When you create a circular import and
attempt to run your app, you'll see the following error:

```console
ImportError: cannot import name
```

If you're going to need an object in multiple modules like `app` or `db`,
creating a _third_ module to instantiate these objects can save you a great deal
of circular grief. Here's a good start to a Flask config file (you may need more
if you intend to include features like authentication and passwords):

```py
# Standard library imports

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)

```

Now let's review that last line...

#### CORS

CORS (Cross-Origin Resource Sharing) is a system that uses HTTP headers to
determine whether resources from different servers-of-origin can be accessed. If
you're using the fetch API to connect your frontend to your Flask backend, you
need to configure CORS on your Flask application instance. Lucky for us, that
only takes one line:

```py
CORS(app)

```

By default, Flask-CORS enables CORS on all routes in your application with all
fetching servers. You can also specify the resources that allow CORS. The
following specifies that routes beginning with `api/` allow CORS from any
originating server:

```py
CORS(app, resources={r"/api/*": {"origins": "*"}})

```

You can also set this up resource-by-resource by importing and using the
`@cross_origin` decorator:

```py
@app.route("/")
@cross_origin()
def howdy():
  return "Howdy partner!"

```

---
