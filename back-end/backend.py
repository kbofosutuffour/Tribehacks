import scipy.io.wavfile as wavfile
import scipy
import scipy.fftpack as fftpk
import numpy as np
from matplotlib import pyplot as plt
from flask import Flask, jsonify, json
from flask_restful import reqparse, abort, Api, Resource

app = Flask(__name__)   
api = Api(app)

class sendData(Resource):
    def post(self):
        data = request.data
        return {'data': 'data'}

api.add_resource(sendData, '/')

s_rate, signal = wavfile.read("tibet.wav")

FFT = abs(scipy.fft.fft(signal))
freqs = fftpk.fftfreq(len(FFT), (1.0/s_rate))

plt.plot(freqs[range(len(FFT)//2)], FFT[range(len(FFT)//2)])
plt.xlabel('Frequency (Hz)')
plt.ylabel('Amplitude')
plt.savefig('scan.png')
# plt.show()

if __name__ == '__main__':
    app.run(debug=True)