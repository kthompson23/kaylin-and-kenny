from flask import render_template
from . import main

@main.route('/', methods=['GET'])
def index():
    '''
    Default landing page
    '''
    return render_template('home.html')