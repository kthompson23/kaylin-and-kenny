'''
REST API error routing.
404 and 500 are handled in the standard error handing routing.
'''
from flask import jsonify

def bad_request(message='Improperly formed request'):
    '''
    400 Request
    Use this for improperly formatted requests.
    '''
    response = jsonify({'error': 'bad request', 'message': message})
    response.status_code = 400
    return response