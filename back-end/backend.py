import matplotlib.pyplot
import scipy.io.wavfile as wavfile
import scipy
import scipy.fftpack as fftpk
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
import numpy as np
import matplotlib
# from matplotlib import pyplot as plt
from flask import Flask, jsonify, json, request
from flask_restful import reqparse, abort, Api, Resource
from pydub import AudioSegment
from werkzeug.utils import secure_filename
import os
import math


UPLOAD_FOLDER = os.path.join(os.path.abspath(os.getcwd()))
ALLOWED_EXTENSIONS = {'wav', 'm4a'}

app = Flask(__name__)
api = Api(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
matplotlib.use('agg')

class sendData(Resource):
    def post(self):
        data = convertAudio(request.files['sound'])
        predicted_load, is_correct = predictData(request.form['input_load'])
        print(predicted_load, type(predicted_load))
        return {
            'url': 'static/scan.png', 
            'predicted_load': predicted_load[0],
            'is_correct': is_correct,
            'code': 200,
        }


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

def computeFFT(filename):
    s_rate, signal = wavfile.read(filename)
    FFT = np.abs(scipy.fft.fft(signal, axis = 0))
    freqs = fftpk.fftfreq(len(FFT), (1.0/s_rate))
    return freqs[:len(FFT)//2], FFT[:len(FFT)//2]

def find_dom_freq_spec_centroid(freqs, FFT):
    index = int(np.argmax(FFT) / 2)
    return [freqs[index], np.sum(freqs * FFT.shape[0]) / np.sum(FFT)]

def predictData(inputLoad):
    features = []
    loads = []

    files_and_data = [("low_state1.wav", 9.5),
                    ("low_state2.wav", 9.5),
                    ("low_state2.wav", 9.5),
                    ("low_state2.wav", 9.5),
                    ("low_state2.wav", 9.5),
                    ("high_state1.wav", 2950),
                    ("high_state1.wav", 2950),
                    ("high_state1.wav", 2950),
                    ("high_state1.wav", 2950),
                    ("high_state1.wav", 2950)]

    for filename, load in files_and_data:
        freqs, FFT = computeFFT(filename)
        features.append(find_dom_freq_spec_centroid(freqs, FFT))
        loads.append(load)

    x = np.array(features)

    y_load = np.array(loads)

    load_model = RandomForestRegressor(n_estimators = 100).fit(x, y_load)

    input_freqs, input_FFT = computeFFT("input.wav")
    known_load = inputLoad # load must be known if you want to see if pump is functioning normally
    input_features = find_dom_freq_spec_centroid(input_freqs, input_FFT)
    print(f"Input audio features: {input_features}")
    predicted_load = load_model.predict([input_features])

    print(f"predicted pump load: {float(predicted_load)}")

    if math.isclose(predicted_load, float(known_load), rel_tol=50):
        print("pump is functioning normally under specified load")
    else:
        print("the pump is functioning abnormally under specified load")

    return predicted_load, math.isclose(predicted_load, float(known_load), rel_tol=50)

api.add_resource(sendData, '/')

if __name__ == '__main__':
    app.run(debug=True)