'''
Helper utility to find all the images in the static directory and create a sqlite database.
'''
import os
import sys
import sqlite3

def create_tables(conn):
    '''
    Create the database and tables if necessary.
    Params: conn - connection object
    '''

    c = conn.cursor()
    try:
        c.execute('''CREATE TABLE images (file_name text, event text)''')
    except sqlite3.DatabaseError as ex:
        pass

    c.execute('DELETE FROM images')

    return

def load_database(conn):
    '''
    Find all the images in the static directory and load our db.
    Params: conn - connection object
    '''

    c = conn.cursor()
    images_path = os.path.join('static', 'images')
    events = ['engagement', 'wedding']

    rows = []
    for event in events:
        # the large directory is the folder for the original images
        event_image_path = os.path.join(images_path, event, 'large')
        for entry in os.scandir(event_image_path):
            rows.append((entry.name, event))

    c.executemany('INSERT INTO images VALUES (?, ?)', rows)

    return

if __name__ == '__main__':
    try:
        db_path = os.path.join('database', 'db.sqlite3')
        conn = sqlite3.connect(db_path)

        create_tables(conn)
        load_database(conn)

        conn.commit()
        sys.exit(0)
    except Exception as ex:
        print(ex)
        sys.exit(1)
