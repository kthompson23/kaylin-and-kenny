import os
import sqlite3

class DataAccess:
    '''
    Data access layer
    
    This class should be created using a context manager
    '''

    def __init__(self):
        base_dir = os.path.abspath(os.path.dirname(__file__))
        db_path = os.path.join(base_dir, 'db.sqlite3')
        self.connection = sqlite3.connect(db_path)
        self.cursor = self.connection.cursor()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.connection.close()

    def get_images(self, event):
        '''
        Return a list of image file names for a given event.
        Params: event - name of the event
        '''

        images = []
        for row in (self.cursor.execute('SELECT file_name FROM images WHERE event = (?)', (event,))):
            images.append(row[0])

        return images