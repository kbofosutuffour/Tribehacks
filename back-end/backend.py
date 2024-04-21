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


UPLOAD_FOLDER = os.path.join(os.path.abspath(os.getcwd()))
ALLOWED_EXTENSIONS = {'wav', 'm4a'}

app = Flask(__name__)
api = Api(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
matplotlib.use('agg')

class sendData(Resource):
    def post(self):
        data = convertAudio(request.files['sound'])
        predicted_type, predicted_load = predictData(request.form['input_type'], request.form['input_load'])
        return {
            'url': 'static/scan.png', 
            'predicted_type': predicted_type,
            'predicted_load': predicted_load,
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

def predictData(inputPump, inputLoad):
    features = []
    pump_types = []
    loads = []

    files_and_data = [("pump1.wav", 0, 10),
                    ("pump2.wav", 0, 10),
                    ("pump4.wav", 0, 10),
                    ("pump5.wav", 0, 10),
                    ("low1.wav", 1, 11),
                    ("low2.wav", 1, 11),
                    ("low4.wav", 1, 11),
                    ("low5.wav", 1, 11),
                    ("mid1.wav", 1, 12),
                    ("mid2.wav", 1, 12),
                    ("mid4.wav", 1, 12),
                    ("mid5.wav", 1, 12),
                    ("high1.wav", 1, 13),
                    ("high2.wav", 1, 13),
                    ("high4.wav", 1, 13),
                    ("high5.wav", 1, 13)]

    for filename, type, load in files_and_data:
        freqs, FFT = computeFFT(filename)
        features.append(find_dom_freq_spec_centroid(freqs, FFT))
        pump_types.append(type)
        loads.append(load)

    x = np.array(features)

    y_type = np.array(pump_types)
    y_load = np.array(loads)

    type_model = RandomForestRegressor(n_estimators = 100).fit(x, y_type)
    load_model = RandomForestRegressor(n_estimators = 100).fit(x, y_load)

    unknown_freqs, unknown_FFT = computeFFT("low3.wav")
    plotFFT(unknown_freqs, unknown_FFT, "Unknown")
    known_load = inputLoad # load must be known if you want to see if pump is functioning normally
    known_type = inputPump
    unknown_features = find_dom_freq_spec_centroid(unknown_freqs, unknown_FFT)
    print(f"unknown features: {unknown_features}")
    predicted_load = load_model.predict([unknown_features])
    predicted_type = type_model.predict([unknown_features])

    if known_load != None:
        print(f"load of test pump: {known_load}")
    print(f"predicted pump type: {float(predicted_type)}")
    print(f"predicted pump load: {float(predicted_load)}")

    return predicted_type, predicted_load



api.add_resource(sendData, '/')

if __name__ == '__main__':
    app.run(debug=True)