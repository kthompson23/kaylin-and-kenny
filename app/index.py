from flask import Flask, render_template, redirect, abort
from flask_script import Manager
import os
import sqlite3

from database.data_access import DataAccess

app = Flask(__name__)
manager = Manager(app)

@app.route('/')
def index():
    '''
    Default landing page
    '''
    return render_template('home.html')

@app.route('/photos/<event>')
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

if __name__ == '__main__':
    manager.run()
