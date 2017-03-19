'''
REST API error routing.
404 and 500 are handled in the standard error handing routing.
'''
from flask import jsonify

from . import api

@api.app_errorhandler(400)
def bad_request(message='Improperly formed request'):
    '''
    400 Response
    Use this for improperly formatted requests.
    '''
    response = jsonify({'error': 'bad request', 'message': message})
    response.status_code = 400
    return response

@api.app_errorhandler(405)
def method_not_allowed(error):
    '''
    405 Response
    This Request method not supported in the api.
    '''
    response = jsonify({'error': 'method not allowed'})
    response.status_code = 405
    return response