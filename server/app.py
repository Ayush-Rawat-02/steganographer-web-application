import steganographerIMAGE
import steganographerTEXT
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app,resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'
#test route
@app.route('/', methods=['GET'])
def index():
    return "WELCOME TO STAGANOGRAPHER"

@app.route('/steganographer/cipher', methods=['POST'])
def steganograph():
    mode = request.form['mode']
    if(mode=="1"):
        print(request.files['cover'].filename)
        print(request.files['secret'].filename)
        cover = request.files['cover']
        secret = request.files['secret']
        return steganographerIMAGE.cipherImage(cover,secret)
    elif(mode=="2"):
        print(request.files['cover'].filename)
        cover = request.files['cover']
        text = request.form['text']
        return steganographerTEXT.hideText(cover,text)

@app.route('/steganographer/decipher', methods=['POST'])
def reveal():
    mode = request.form['mode']
    print(request.files['file'].filename)
    file = request.files['file']
    if(mode=="1"):
        return steganographerIMAGE.decipherSecret(file)
    elif(mode=="2"):
        return steganographerTEXT.revealHiddenText(file)

@app.route('/steganographer/image', methods=['GET'])
def getImage():
    return send_file( request.args.get('name'), mimetype='image/png')


if(__name__=='__main__'):
    app.run(host="127.0.0.9", port=8080, debug=True)