import os
import scipy.io.wavfile as wavfile
import scipy
import scipy.fftpack as fftpk
import numpy as np
from matplotlib import pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from flask import Flask, jsonify, json
from flask_restful import reqparse, abort, Api, Resource

app = Flask(__name__)   
api = Api(app)

class sendData(Resource):
    def post(self):
        data = request.data
        predicted_type, predicted_load = predictData(data['input_type'], data['input_load'])
        return {
            'data': 'data', 
            'predicted_type': predicted_type,
            'predicted_load': predicted_load,
            'code': 200,
        }

api.add_resource(sendData, '/')


def computeFFT(filename):
    s_rate, signal = wavfile.read(filename)
    FFT = np.abs(scipy.fft.fft(signal, axis = 0))
    freqs = fftpk.fftfreq(len(FFT), (1.0/s_rate))
    return freqs[:len(FFT)//2], FFT[:len(FFT)//2]


def plotFFT(freqs, FFT, title):
    plt.plot(freqs, FFT)
    plt.title(title)
    plt.xlabel('Frequency (Hz)')
    plt.ylabel('Amplitude')
    plt.savefig(f"{title}.png")
    plt.show()


def find_dom_freq_spec_centroid(freqs, FFT):
    index = int(np.argmax(FFT) / 2)
    return [freqs[index], np.sum(freqs * FFT.shape[0]) / np.sum(FFT)]

# def find_energy_band_ratios(freqs, FFT, bands):
#     power_spectrum = FFT ** 2
      
#     band_powers = []
#     total_power = np.sum(power_spectrum)

#     for(low_freq, high_freq) in bands:
#         band_indices = np.where((freqs >= low_freq) & (freqs <= high_freq))[0]
#         band_power = np.sum(power_spectrum[band_indices])
#         band_powers.append(band_power)
    
#     energy_ratios = [band_power / total_power for band_power in band_powers]
#     return energy_ratios
    
# bands = [(0, 500), (500, 2000), (2000, 20000)]

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


if predicted_load == known_load:
    print("the pump is functioning normally under specified load")


if __name__ == '__main__':
    app.run(debug=True)