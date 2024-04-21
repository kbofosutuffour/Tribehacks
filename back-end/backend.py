import matplotlib.pyplot
import scipy.io.wavfile as wavfile
import scipy
import scipy.fftpack as fftpk
import numpy as np
import matplotlib
# from matplotlib import pyplot as plt
from flask import Flask, jsonify, json, request
from flask_restful import reqparse, abort, Api, Resource
from pydub import AudioSegment
from werkzeug.utils import secure_filename
import os


UPLOAD_FOLDER = os.path.join(os.path.abspath(os.getcwd()))
ALLOWED_EXTENSIONS = {'wav', 'm4a'}

app = Flask(__name__)
api = Api(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
matplotlib.use('agg')

class sendData(Resource):
    def post(self):
        data = convertAudio(request.files['sound'])
        return {'url': 'static/scan.png'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convertAudio(file):
    print(file.filename)
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    sound = AudioSegment.from_file('input.m4a', format='m4a')
    sound.export('input.wav', format='wav')
    analyzeData()

def analyzeData():
    s_rate, signal = wavfile.read("input.wav")

    FFT = abs(scipy.fft.fft(signal))
    freqs = fftpk.fftfreq(len(FFT), (1.0/s_rate))

    matplotlib.pyplot.clf()
    matplotlib.pyplot.plot(freqs[range(len(FFT)//2)], FFT[range(len(FFT)//2)])
    matplotlib.pyplot.xlabel('Frequency (Hz)')
    matplotlib.pyplot.ylabel('Amplitude')
    matplotlib.pyplot.savefig('static/scan.png')

api.add_resource(sendData, '/')

if __name__ == '__main__':
    app.run(debug=True)