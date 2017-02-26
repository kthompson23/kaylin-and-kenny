from flask import Flask, render_template
from flask.ext.script import Manager
app = Flask(__name__)
manager = Manager(app)

@app.route('/')
def index():
    '''
    Redirect the user to the wedding page
    '''
    return 'Redirect to wedding.'

@app.route('/photos/<event>')
def photos(event):
    '''
    Display a photos for a passed in event.
    '''
    return render_template('event.html', event=event)

if __name__ == '__main__':
    manager.run()
