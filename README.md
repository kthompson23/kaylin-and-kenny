# Kaylin and Kenny #

A simple website to share our wedding and engagement photos.
September 24, 2016 @ Rutgers Gardens

------------------

Original images go into static/images/[event_name]/large
Run:
```sh
$ python utils/resize_images.py
```
To create medium sized and small thumbnail images.
Then run:
```
$ python utils/create_database.py
```
To generate the sqlite database.
Finally, start the Flask server: 
```sh
$ ./manage.py runserver --host 0.0.0.0`
```

### Production ###
The environment variable FLASK_CONFIG should be set to 'production'