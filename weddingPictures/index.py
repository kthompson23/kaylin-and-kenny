from flask import Flask, render_template, redirect, abort
from flask_script import Manager
import os
import sqlite3

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

    images = []

    base_dir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(base_dir, 'database', 'db.sqlite3')
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    for row in (c.execute('SELECT file_name FROM images WHERE event = (?)', (event,))):
        images.append(row[0])

    conn.close()

    return render_template('event.html', event=event, images=images)

@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404

if __name__ == '__main__':
    manager.run()
