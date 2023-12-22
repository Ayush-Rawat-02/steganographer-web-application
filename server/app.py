import steganographer
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
#test route
@app.route('/', methods=['GET'])
def index():
    return "WELCOME TO STAGANOGRAPHER"

@app.route('/steganographer/cipher', methods=['POST'])
def steganograph():
    print(request.files['cover'].filename)
    print(request.files['secret'].filename)
    cover = request.files['cover']
    secret = request.files['secret']
    return steganographer.cipherImage(cover,secret)

@app.route('/steganographer/decipher', methods=['POST'])
def reveal():
    print(request.files['file'].filename)
    file = request.files['file']
    return steganographer.decipherSecret(file)

@app.route('/steganographer/image', methods=['GET'])
def getImage():
    return send_file( request.args.get('name'), mimetype='image/png')
        

if(__name__=='__main__'):
    app.run(host="127.0.0.9", port=8080, debug=True)