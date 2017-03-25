from flask import make_response
from functools import wraps, update_wrapper
from datetime import datetime

import os

def nocache(view):
    '''
    View wrapper to add do not cached response when in dev mode.
    https://arusahni.net/blog/2014/03/flask-nocache.html
    '''
    @wraps(view)
    def no_cache(*args, **kwargs):
        response = make_response(view(*args, **kwargs))

        if os.environ.get('FLASK_CONFIG', '') == 'production':
            return response

        response.headers['Last-Modified'] = datetime.now()
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '-1'
        return response

    return update_wrapper(no_cache, view)

