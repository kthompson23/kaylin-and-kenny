from flask import jsonify, request, url_for
from os import path
from ..database.data_access import DataAccess
from . import api
from .errors import bad_request

@api.route('/images/')
def get_images():
    '''
    Return paginated list of images

    Params: page - page number; 1, 2, n
            event - the name of the event
            limit - number of results per request; default 50
    '''
    page = request.args.get('page', 1, type=int)
    event = request.args.get('event', type=str)
    limit = request.args.get('limit', 50, type=int)

    if event not in ['wedding', 'engagement']:
        return bad_request('Invalid event type requested')

    with DataAccess() as db:
        total_images, images, more_avail = db.get_images(event, page, limit)

    next = None
    if more_avail:
        next = url_for('api.get_images', page=page+1, event=event, _external=True)
    
    return jsonify({
        'images': [url_for('static', filename = path.join('images', event, 'small', image)) for image in images],
        'next': next,
        'count': total_images,
        'cacheable': True,
        'limit': limit
    })