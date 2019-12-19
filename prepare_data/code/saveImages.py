from glob import glob
import json
import requests
import os.path

twits_photos = {}

for twits_photos in glob('./refined/3/3_photos.json'):
    with open(twits_photos) as json_officials:
        twits_photos = json.load(json_officials)
print(len(twits_photos))

for twit_key, twit in twits_photos.items():
    image_request = requests.get(twit[0]['media'])
    image_path = os.path.join('./images/', twit[0]['filename'])
    if image_request.status_code == 200:
        with open(image_path, 'wb') as image_file:
            image_file.write(image_request.content)

