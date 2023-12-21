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

def modifyPixels(img,text):
    height,width,_ = img.shape
    pixels = np.empty((height,width,3), dtype = np.uint8)
    bit_offset=0
    word_index=0
    text_length=len(text)

    for y in range(height):
        thisRow = np.empty((width,3))
        for x in range(width):
            curPixel = img[y][x]
            # BGR format
            redPX = curPixel[2]
            greenPX = curPixel[1]
            bluePX = curPixel[0]
            # if(word_index==text_length):
            #     thisRow[x] = [redPX, greenPX, bluePX]
            # else:
            #     ascii = ord(text[word_index])
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

def hideText():
    image = cv2.imread("./24.png")
    text="HELLO DEAR"
    resized_img = resize(image)
    img = getImgArray(resized_img)
    cipheredImage = modifyPixels(img,text)
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
    staganographedImage = mergePixels(img,secret)
    staganographedImage.save("StagnanographedImage.png")

def decipherSercet():
    image = cv2.imread("./StagnanographedImage.png")
    # image = cv2.imread("./StagnanographedImage.jpg")
    img = getImgArray(image)
    secretImage = revealSecret(img)
    secretImage.save("RevealedSecret.png")

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
#     image = cv2.imread("./StagnanographedImage.png")
#     img = getImgArray(image)
#     compare(org,img)

# hideText()
hideImage()
# decipherSercet()
# matchMSB()