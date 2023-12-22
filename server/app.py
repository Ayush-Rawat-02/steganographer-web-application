import staganographer
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
#test route
@app.route('/', methods=['GET'])
def index():
    # response = jsonify({'message': 'Welcome to toonIt!'})
    # response.headers.add('Access-Control-Allow-Origin','*')
    # return response
    return "WELCOME TO STAGANOGRAPHER"
#cartoonify route
@app.route('/staganographer/cipher', methods=['POST'])
def cartoonify():
    print(request.files['cover'].filename)
    print(request.files['secret'].filename)
    cover = request.files['cover']
    secret = request.files['secret']
    return staganographer.cipherImage(cover,secret)

@app.route('/staganographer/decipher', methods=['POST'])
def reveal():
    print(request.files['file'].filename)
    file = request.files['file']
    # return send_file( cartoonifier.cartoonifyIt(file), mimetype='image/gif')
    return staganographer.decipherSecret(file)

@app.route('/steganographer/image', methods=['GET'])
def getImage():
    return send_file( request.args.get('name'), mimetype='image/gif')
    # return send_file( 'CartoonifiedNew.jpg', mimetype='image/gif')
        

if(__name__=='__main__'):
    app.run(host="127.0.0.9", port=8080, debug=True)