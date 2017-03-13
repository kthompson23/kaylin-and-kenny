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

    def get_images(self, event, page, images_per_page=50):
        '''
        Return a list of image files for a given event and specified page.
        Params: event - name of the event
                page - page number; 1, 2, 3, n
                images_per_page - number of images to include in each page (default 50)
        Returns: total_images - total number of images
                 images - list of image names.
        '''

        self.cursor.execute('SELECT COUNT(*) FROM images WHERE event = (?)', (event,))
        total_images = self.cursor.fetchone()[0]

        images = []        
        offset = page * images_per_page
        for row in (self.cursor.execute('SELECT file_name FROM images WHERE event = (?) LIMIT (?), (?)', (event, offset, images_per_page))):
            images.append(row[0])


        return total_images, images
