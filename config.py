import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    '''
    Base configuration class.
    '''

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    '''
    Configuration options for development.
    '''
    DEBUG = True

class ProductionConfig(Config):
    '''
    Configuration options for production.
    '''
    pass

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,

    'default': DevelopmentConfig
}