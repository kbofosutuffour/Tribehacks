from flask import Flask, request
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

class Recording(Resource):
    def post(self):
        # Get all information sent from the post request by frontend
        data = request.data

        # Analyse data
        
        return {'data': 'data'}

api.add_resource(Recording, '/')

if __name__ == '__main__':
    app.run(debug=True)