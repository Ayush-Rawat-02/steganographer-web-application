import cv2
import numpy as np
import sys
from PIL import Image

def saveTempImage(image):
    if image is None:
	    sys.exit("Could not read image")
    tempImage = Image.open(image)
    tempImage.save("Temp-"+image.filename)


def getImgArray(image):
    if image is None:
	    sys.exit("Could not read image")
    return np.asarray(image)

def resize(img):
    height,width,_ = img.shape
    aspect_ratio = width/height
    newHeight = min(height,512)
    newWidth = int(newHeight * aspect_ratio)
    return cv2.resize(img, (newWidth,newHeight))

def mergePixels(img,secret):
    heightIMG,widthIMG,_ = img.shape
    heightSCRT,widthSCRT,_ = secret.shape
    height = min(heightIMG, heightSCRT)
    width = min(widthIMG, widthSCRT)
    pixels = np.empty((height,width,3), dtype = np.uint8)
    for y in range(height):
        thisRow = np.empty((width,3))
        for x in range(width):
            mainPixel = img[y][x]
            secretPixel = secret[y][x]
            # Default format of cv2 is BGR and not RGB
            # extracting MSB of pixel values of img - MSB of final image
            redMSB = int(mainPixel[2]/16)
            greenMSB = int(mainPixel[1]/16)
            blueMSB = int(mainPixel[0]/16)
            # extracting MSB of pixel values of secret - LSB of final image
            redLSB = int(secretPixel[2]/16)
            greenLSB = int(secretPixel[1]/16)
            blueLSB = int(secretPixel[0]/16)
            # combining MSB of img with MSB of secret
            redPX = redMSB*16 + redLSB
            greenPX = greenMSB*16 + greenLSB
            bluePX = blueMSB*16 + blueLSB
            thisRow[x] = [redPX, greenPX, bluePX]
        pixels[y] = thisRow
    return Image.fromarray(pixels)

def revealSecret(img):
    height,width,_ = img.shape
    pixels = np.empty((height,width,3), dtype = np.uint8)
    for y in range(height):
        thisRow = np.empty((width,3))
        for x in range(width):
            # Extracting LSB and converting it to MSB
            curPixel = img[y][x]
            redPX = int(curPixel[2]%16)
            greenPX = int(curPixel[1]%16)
            bluePX = int(curPixel[0]%16)
            thisRow[x] = [redPX*16, greenPX*16, bluePX*16]
        pixels[y] = thisRow
    return Image.fromarray(pixels)

def cipherImage(coverImage, secretImage):
    saveTempImage(coverImage)
    saveTempImage(secretImage)
    tempCover = cv2.imread("./Temp-"+coverImage.filename)
    tempSecret = cv2.imread("./Temp-"+secretImage.filename)
    resized_img = resize(tempCover)
    resized_secret = resize(tempSecret)
    img = getImgArray(resized_img)
    secret = getImgArray(resized_secret)
    staganographedImage = mergePixels(img,secret)
    staganographedImage.save("Temp-SteganographedImage.png")
    return "Temp-SteganographedImage.png"

def decipherSecret(staganographedImage):
    saveTempImage(staganographedImage)
    tempStaganographed = cv2.imread("./Temp-"+staganographedImage.filename)
    img = getImgArray(tempStaganographed)
    secretImage = revealSecret(img)
    secretImage.save("Revealed-"+staganographedImage.filename)
    return "Revealed-"+staganographedImage.filename