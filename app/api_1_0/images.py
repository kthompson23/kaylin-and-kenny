from flask import jsonify, request, url_for
from math import ceil
from os import path
from ..database.data_access import DataAccess
from . import api
from .errors import bad_request

@api.route('/images/')
def get_images():
    '''
    Return paginated list of images

    Params: page - page number; 0, 1, n
            event - the name of the event
            limit - number of results per request; default 50
    '''
    page = request.args.get('page', 0, type=int)
    event = request.args.get('event', type=str)
    limit = request.args.get('limit', 50, type=int)

    if event not in ['wedding', 'engagement']:
        return bad_request('Invalid event type requested')

    with DataAccess() as db:
        total_images, images, more_avail = db.get_images(event, page, limit)

    curr = None
    next = None
    prev = None

    # echo back the current request
    curr = url_for('api.get_images', page=page, event=event, limit=limit, _external=True)

    if page > 0:
        prev = url_for('api.get_images', page=page-1, event=event, limit=limit, _external=True)

    if more_avail:
        next = url_for('api.get_images', page=page+1, event=event, limit=limit, _external=True)

    return jsonify({
        'current': curr,
        'previous': prev,
        'next': next,
        'totalImages': total_images,
        'totalPages': ceil(total_images / limit),
        'cacheable': True,
        'limit': limit,
        'results': {
            'images': [url_for('static', filename = path.join('images', event, 'small', image)) for image in images],
        }
    })