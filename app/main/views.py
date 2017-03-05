from flask import render_template

@main.route('/', methodos=['GET'])
def index():
    '''
    Default landing page
    '''
    return render_template('home.html')