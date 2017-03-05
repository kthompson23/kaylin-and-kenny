from flask import render_template, redirect, abort
from . import main

from ..database.data_access import DataAccess

@main.route('/', methods=['GET'])
def index():
    '''
    Default landing page
    '''
    return render_template('home.html')

@main.route('/photos/<event>')
def photos(event):
    '''
    Display a photos for a passed in event.
    '''

    available_events = ['wedding', 'engagement']

    if event not in available_events:
        abort(404)

    with DataAccess() as db:
        images = db.get_images(event)

    return render_template('event.html', event=event, images=images)