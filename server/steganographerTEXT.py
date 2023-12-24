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

def textToBits(text):
    bitsArr = np.array([], dtype=np.int32)
    for ch in text:
        ascii = ord(ch)
        thisChar = np.array([0])
        for i in range(8):
            thisBit = 1 if(ascii&(1<<i))>0 else 0
            thisChar = np.append(thisChar,thisBit)
        bitsArr = np.append(bitsArr,np.flip(thisChar, axis=0))
    oneDimensionalBitsArray = bitsArr.flatten()
    sz=np.size(oneDimensionalBitsArray)
    oneDimensionalBitsArray[sz-1]=1
    return oneDimensionalBitsArray

def bitsToText(textBits):
    textString = ""
    ascii=0
    offset=7
    for i in textBits:
        if(i==1):
            ascii = ascii|(1<<offset)
        offset = offset-1
        if(offset==-1):
            offset=7
            ch = chr(ascii)
            textString = textString+ch
            ascii=0
    return textString

def modifyPixels(img,textBitsArray):
    height,width,_ = img.shape
    pixels = np.empty((height,width,3), dtype = np.uint8)
    len = np.size(textBitsArray)
    idx=0
    for y in range(height):
        thisRow = np.empty((width,3))
        for x in range(width):
            curPixel = img[y][x]
            # BGR format
            redPX = curPixel[2]
            greenPX = curPixel[1]
            bluePX = curPixel[0]
            if(idx<len):
                if(textBitsArray[idx]==1):
                    redPX = redPX|1
                else:
                    redPX = redPX&(~1)
                if(textBitsArray[idx+1]==1):
                    greenPX = greenPX|1
                else:
                    greenPX = greenPX&(~1)
                if(textBitsArray[idx+2]==1):    
                    bluePX = bluePX|1
                else:
                    bluePX = bluePX&(~1)
                idx = idx+3
            thisRow[x] = [redPX, greenPX, bluePX]
        pixels[y] = thisRow
    return Image.fromarray(pixels)

def textBitsFromImage(image):
    height,width,_ = image.shape
    pixelNo=1
    textBits = np.array([], dtype = np.int32)
    finished = False
    for y in range(height):
        for x in range(width):
            curPixel = image[y][x]
            redPxBit = int(curPixel[2])&1
            greenPxBit = int(curPixel[1])&1
            bluePxBit = int(curPixel[0])&1
            textBits = np.append(textBits,redPxBit)
            textBits = np.append(textBits,greenPxBit)
            if(pixelNo%3==0):
                if(bluePxBit==1):
                    finished=True
                    break
            else:
                textBits = np.append(textBits,bluePxBit)
            pixelNo = pixelNo+1
        if(finished):
            break
    return textBits

def hideText(coverImage,text):
    saveTempImage(coverImage)
    tempCover = cv2.imread("./Temp-"+coverImage.filename)
    textArray = textToBits(text)
    resized_img = resize(tempCover)
    img = getImgArray(resized_img)
    steganographedImage = modifyPixels(img,textArray)
    originalName = (coverImage.filename.split("."))[0]
    steganographedImage.save("Steganographed-"+originalName+".png")
    return "Steganographed-"+originalName+".png"


def revealHiddenText(steganographedImage):
    saveTempImage(steganographedImage)
    tempSteganographed = cv2.imread("./Temp-"+steganographedImage.filename)
    img = getImgArray(tempSteganographed)
    revealedTextBits = textBitsFromImage(img)
    revealedText = bitsToText(revealedTextBits)
    return revealedText