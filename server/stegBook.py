import cv2
import numpy as np
import sys
from PIL import Image

def getImgArray(image):
    if image is None:
	    sys.exit("Could not read image")
    return np.asarray(image)

def resize(img):
    height,width = img.shape[:2]
    aspect_ratio = width/height
    newHeight = min(height,512)
    newWidth = int(newHeight * aspect_ratio)
    # print(newHeight, newWidth)
    return cv2.resize(img, (newWidth,newHeight))

def textToBits(text):
    bitsArr = np.array([], dtype=np.int32)
    for ch in text:
        ascii = ord(ch)
        # print(ch,ascii)
        thisChar = np.array([0])
        for i in range(8):
            thisBit = 1 if(ascii&(1<<i))>0 else 0
            # print(thisBit)
            # thisChar.append(thisBit)
            thisChar = np.append(thisChar,thisBit)
        # bitsArr.append(np.flip(thisChar, axis=0))
        bitsArr = np.append(bitsArr,np.flip(thisChar, axis=0))
    oneDimensionalBitsArray = bitsArr.flatten()
    sz=np.size(oneDimensionalBitsArray)
    oneDimensionalBitsArray[sz-1]=1
    # print(oneDimensionalBitsArray)
    return oneDimensionalBitsArray

def bitsToText(textBits):
    textString = ""
    ascii=0
    offset=7
    for i in textBits:
        # print(i)
        if(i==1):
            ascii = ascii|(1<<offset)
        offset = offset-1
        if(offset==-1):
            offset=7
            ch = chr(ascii)
            textString = textString+ch
            ascii=0
    # print(ascii)
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
            # thisRow[x] = [redLSB*16,greenLSB*16,blueLSB*16]
            # thisRow[x] = [redMSB*16,greenMSB*16,blueMSB*16]
        pixels[y] = thisRow
        # print(thisRow)
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
            # thisRow[x] = [redPX, greenPX, bluePX]
        pixels[y] = thisRow
        # print(thisRow)
    return Image.fromarray(pixels)

def textBitsFromImage(image):
    height,width,_ = image.shape
    # print(image.shape)
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

def revealHiddenText():
    # image = cv2.imread("./CIPHERED.png")
    image = cv2.imread("./Steganographed-Temp-pexels-tima-miroshnichenko-5380664.png")
    revealedTextBits = textBitsFromImage(image)
    # print(revealedTextBits)
    revealedText = bitsToText(revealedTextBits)
    print(revealedText)
    # return revealedText

def hideText():
    image = cv2.imread("./img.jpg")
    # text = "HELLO DEAR"
    text = "HELLO"
    textArray = textToBits(text)
    resized_img = resize(image)
    img = getImgArray(resized_img)
    # print(img)
    cipheredImage = modifyPixels(img,textArray)
    cipheredImage.save("CIPHERED.png")
    # cv2.imwrite("Ciphered", cipheredImage)
    # cv2.imshow("Ciphered", cipheredImage)


def hideImage():
    image = cv2.imread("./24.jpg")
    secretImage = cv2.imread("./hidden.jpg")
    resized_img = resize(image)
    resized_secret = resize(secretImage)
    img = getImgArray(resized_img)
    secret = getImgArray(resized_secret)
    steganographedImage = mergePixels(img,secret)
    steganographedImage.save("SteganographedImage.png")

def decipherSercet():
    # image = cv2.imread("./SteganographedImage.png")
    image = cv2.imread("./Steganographed-pexels-tima-miroshnichenko-5380664.png")
    # image = cv2.imread("./Steganographed-24.jpg")
    img = getImgArray(image)
    secretImage = revealSecret(img)
    secretImage.save("RevealedSecret.png")
    # secretImage.save("RevealedSecret.jpg")

# def compare(org,img):
#     heightIMG,widthIMG,_ = img.shape
#     heightORG,widthORG,_ = org.shape
#     height = min(heightIMG, heightORG)
#     width = min(widthIMG, widthORG)
#     for y in range(height):
#         thisRow = np.empty((width,3))
#         for x in range(width):
#             scrPixel = img[y][x]
#             orgPixel = org[y][x]

#             redMSB = scrPixel[2]/16
#             greenMSB = scrPixel[1]/16
#             blueMSB = scrPixel[0]/16

#             redMSBorg = orgPixel[2]/16
#             greenMSBorg = orgPixel[1]/16
#             blueMSBorg = orgPixel[0]/16

#             if(redMSB!=redMSBorg):
#                 print("MISS")
#             if(greenMSB!=greenMSBorg):
#                 print("MISS")
#             if(blueMSB!=blueMSBorg):
#                 print("MISS")
#     return


# def matchMSB():
#     orgimage = cv2.imread("./24.jpg")
#     resized_img = resize(orgimage)
#     org = getImgArray(resized_img)
#     image = cv2.imread("./SteganographedImage.png")
#     img = getImgArray(image)
#     compare(org,img)


def test():
    arr = np.array([],dtype=np.int32)
    for i in range(5):
        arr = np.append(arr,i|1)
    print(arr)


# hideImage()
# decipherSercet()
# matchMSB()
# hideText()
revealHiddenText()
# test()