'''
Helper utility to generate small and medium sized image resources.
'''
import sys
import os
import shutil

from PIL import Image
from resizeimage import resizeimage

def clear_resized_images(images_directory):
    '''
    Delete any previously resized images.

    Accepts: image_directory: path to the top-level image directory.
    '''

    try:
        for entry in os.scandir(images_directory):
            med_images = os.path.join(images_directory, entry.name, 'medium')
            shutil.rmtree(med_images, ignore_errors=True)
            os.mkdir(med_images)

            small_images = os.path.join(images_directory, entry.name, 'small')
            shutil.rmtree(small_images, ignore_errors=True)
            os.mkdir(small_images)

    except OSError as ex:
        raise Exception("Error encountered while trying to clear previously resized images. {0}".format(ex))

    return

def resize():
    '''
    Resize images found in the "large" images directory.
    
    medium: 1200px wide
    small: 300px wide
    '''

    images_directory = os.path.join('static', 'images')

    # First clear out any resizing work we may have done.
    clear_resized_images(images_directory)

    try: 
        for entry in os.scandir(images_directory):
            orig_images = os.path.join(images_directory, entry.name, 'large')

            for orig_image in os.scandir(orig_images):
                with open(os.path.join(orig_images, orig_image.name), 'r+b') as f:
                    with Image.open(f) as large_image:
                        med_image = resizeimage.resize_width(large_image, 1200)
                        med_image.save(os.path.join(images_directory, entry.name, 'medium', orig_image.name))

                        small_image = resizeimage.resize_width(large_image, 300)
                        small_image.save(os.path.join(images_directory, entry.name, 'small', orig_image.name))

    except OSError as ex:
        raise Exception("Error encountered while trying to resize images. {0}".format(ex))

    return

if __name__ == '__main__':
    try:
        resize()
        sys.exit(0)
    except Exception as ex:
        print(ex)
        sys.exit(1)
