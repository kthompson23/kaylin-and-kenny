from flask import Flask, render_template
from config import config

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    # routes and errors
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    # api
    from .api_1_0 import api as api_1_0_blueprint
    app.register_blueprint(api_1_0_blueprint, url_prefix-'/api/v1.0')

    return app
