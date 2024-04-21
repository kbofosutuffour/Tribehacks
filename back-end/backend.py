import scipy.io.wavfile as wavfile
import scipy
import scipy.fftpack as fftpk
import numpy as np
from matplotlib import pyplot as plt
from flask import Flask, jsonify, json, request
from flask_restful import reqparse, abort, Api, Resource
from pydub import AudioSegment
from werkzeug.utils import secure_filename
import os


UPLOAD_FOLDER = os.path.join(os.path.abspath(os.getcwd()), 'output')
ALLOWED_EXTENSIONS = {'wav', 'm4a'}

app = Flask(__name__)   
api = Api(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

class sendData(Resource):
    def post(self):
        convertAudio(request.files['sound'])
        return {'data': 'data'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convertAudio(file):
    print(file.filename)
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

def analyzeData(input = None):

    s_rate, signal = wavfile.read("tibet.wav")

    FFT = abs(scipy.fft.fft(signal))
    freqs = fftpk.fftfreq(len(FFT), (1.0/s_rate))

    plt.plot(freqs[range(len(FFT)//2)], FFT[range(len(FFT)//2)])
    plt.xlabel('Frequency (Hz)')
    plt.ylabel('Amplitude')
    plt.savefig('scan.png')
    # plt.show()

api.add_resource(sendData, '/')

if __name__ == '__main__':
    app.run(debug=True)