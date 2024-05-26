import pygame
import sys
from gtts import gTTS
import os
  
mytext = sys.argv[1]

language = 'en'
  
myobj = gTTS(text=mytext, lang=language, slow=False)
  
myobj.save("/home/yuvi/server/IoT-Server-Visual-Assistance/Audio/audio.mp3")
  

pygame.mixer.init()

pygame.mixer.music.load("/home/yuvi/server/IoT-Server-Visual-Assistance/Audio/audio.mp3")

pygame.mixer.music.play()

while pygame.mixer.music.get_busy():
    pygame.time.Clock().tick(10)
