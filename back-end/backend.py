import scipy.io.wavfile as wavfile
import scipy
import scipy.fftpack as fftpk
import numpy as np
from matplotlib import pyplot as plt
from flask import Flask, jsonify, json, request
from flask_restful import reqparse, abort, Api, Resource
from pydub import AudioSegment
from werkzeug.utils import secure_filename


UPLOAD_FOLDER = '/output'
ALLOWED_EXTENSIONS = {'wav', 'm4a'}

app = Flask(__name__)   
api = Api(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

class sendData(Resource):
    def post(self):
        print('test')
        data = request.form['sound']
        print(data)
        # convertAudio(request.data['sound'])
        return {'data': 'data'}

def convertAudio(input):
    wav_filename = 'output.wav'

    sound = AudioSegment.from_file(input, format='m4a')
    file  = sound.export(wav_filename, format='wav')
    print(file)
    # return file

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