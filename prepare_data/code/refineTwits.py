from glob import glob
import datetime
from dateutil.parser import parse
import operator
import re
import json
from statistics import mean

'''1'''
# output = {}
# for file in glob('./raw_output/*.json'):
#     with open(file) as json_file:
#         twits = json.load(json_file)
#         for twit in twits['results']:
#             key = parse(twit['created_at']).strftime('%Y%m%d%H%M%S')
#             if key not in output:
#                 output[key] = twit

# output = dict(sorted(output.items(), key=operator.itemgetter(0)))

# with open('initial_output.json', 'w') as output_file:
#     json.dump(output, output_file)


'''2'''
# output = {}
# not_locations = ['Rid', 'Maj', 'Exp', 'The', 'Buu', 'We', 'I']

# empty_locations_count = 0
# service_delay_count = 0
# service_outage_count = 0

# for file in glob('./refined/1/1_official_text.json'):
#     with open(file) as json_file:
#         twits = json.load(json_file)
#         for key, twit in twits.items():
#             locations = []
#             event = {}
#             isDelay = False

#             split_twit = twit.split()
#             for word in split_twit:
#                 if word != 'BART' and word[0:3] not in not_locations and word[0].isupper():
#                     word = word.encode('ascii', 'ignore').decode(encoding='UTF-8')
#                     locations.append(re.sub(r'[^a-zA-Z0-9\s]', '', word).lower())

#                 if word == 'delay':
#                     isDelay = True
#                     status_type = 'delay'
#                     degree = list(map(int, re.findall(r'\d+', twit)))
#                     event['type'] = status_type
#                     if len(degree) == 0:
#                         event['degree'] = 'unknown'
#                     if len(degree) > 0:
#                         event['degree'] = mean(degree)

#                 if isDelay == False:
#                     status_type = 'outage'
#                     degree = list(map(int, re.findall(r'\d+', twit)))
#                     event['type'] = status_type
#                     if len(degree) > 0:
#                         event['degree'] = mean(degree)

#             if len(locations) == 0:
#                 locations.append('all')
#                 empty_locations_count += 1

#             if event['type'] == 'delay':
#                 service_delay_count += 1
#             else:
#                 service_outage_count += 1

#             output[key] = {}
#             output[key]['event'] = event
#             output[key]['locations'] = locations

# print('EMPTY LOCATIONS:', empty_locations_count)
# print('NUMBER OF DELAYS:', service_delay_count)
# print('NUMBER OF OUTAGES:', service_outage_count)

# output = dict(sorted(output.items(), key=operator.itemgetter(0)))
# with open('test.json', 'w') as output_file:
#     json.dump(output, output_file)

'''3'''
twits = {}
twits_official = {}

for twits_output in glob('./refined/1/1_output.json'):
    with open(twits_output) as json_twits:
        twits = json.load(json_twits)

for twits_official in glob('./refined/2/2_official.json'):
    with open(twits_official) as json_officials:
        twits_officials = json.load(json_officials)

output = {}
output_photos = {}
na_count = 0

def categorize_status(status_type, time):
    i = 0

    if status_type == 'outage':
        i = 5
    if time == 'unknown':
        return i

    if 0 <= time <= 15:
        return i + 1
    elif 16 <= time <= 30:
        return i + 2
    elif 31 <= time <= 60:
        return i + 3
    else:
        return i + 4

for twit_key, twit in twits.items():
    context = {}
    # delay, delay_15_min, delay_30_min, delay_1_hour, delay_more_than_hour, outage, outage_15_min, outage_30_min, outage_1_hour, outage_more_than_hour, N/A
    officials = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for official_key, official in twits_officials.items():
        if (int(twit_key) - 6000) <= int(official_key) <= (int(twit_key) + 6000):
            status_type = official['event']['type']
            if 'degree' in official['event']:
                category = categorize_status(status_type, official['event']['degree'])
                officials[category] = 1
            else:
                if official['event']['type'] == 'delay':
                    officials[0] = 1
                elif official['event']['type'] == 'outage':
                    officials[5] = 1

    if 1 not in officials:
        officials[10] = 1

    context['text'] = str(twit['text'].encode('ascii', 'ignore').decode(encoding='UTF-8')).lower()

    if officials[10] == 1:
        na_count += 1
        # print(na_count)
        if (na_count <= 2000):
            output[twit_key] = (context, officials)
    else:
        output[twit_key] = (context, officials)

    if 'extended_entities' in twit and 'media' in twit['extended_entities'] and 'media_url' in twit['extended_entities']['media'][0]:
        media = twit['extended_entities']['media'][0]['media_url']
        filename = media.split('/')[-1]
        context['filename'] = filename
        context['media'] = media
        output_photos[twit_key] = (context, officials)

    officials = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

output = dict(sorted(output.items(), key=operator.itemgetter(0)))
with open('input.json', 'w') as output_file:
    json.dump(output, output_file)

print(len(output))

# output_photos = dict(sorted(output_photos.items(), key=operator.itemgetter(0)))
# with open('3_photos.json', 'w') as output_file:
#     json.dump(output_photos, output_file)


# fig_size = plt.rcParams["figure.figsize"]
# fig_size[0] = 10
# fig_size[1] = 8
# plt.rcParams["figure.figsize"] = fig_size

# test_y[['delay', 'delay_15_min', 'delay_30_min', 'delay_1_hour', 'delay_more_than_hour',
#           'outage', 'outage_15_min', 'outage_30_min', 'outage_1_hour', 'outage_more_than_hour']].sum(axis=0).plot.bar()

'''4'''
# twits_images = {}
# output_images = {}

# for twits_images in glob('./refined/3/3_photos.json'):
#     with open(twits_images) as json_officials:
#         twits_images = json.load(json_officials)
# print(len(twits_images))

# all_photos = glob('./images/*.jpg')
# all_photos.extend(glob('./images/*.png'))
# picked_photos = glob('./good_images/*.jpg')
# picked_photos.extend(glob('./good_images/*.png'))
# print(len(all_photos), len(picked_photos))

# for twit_key, twit in twits_images.items():
#     officials = []
#     for file_path in picked_photos:
#         if twit[0]['filename'] == file_path.split('/')[-1]:
#             officials = twit[1]
#             officials.append(0)
#             output_images[twit_key] = (twit[0]['filename'], officials)
#             break
#         else:
#             officials = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
#             output_images[twit_key] = (twit[0]['filename'], officials)

#     officials = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

# output_images = dict(sorted(output_images.items(), key=operator.itemgetter(0)))
# print(len(output_images))

# with open('input_images.json', 'w') as output_file:
#     json.dump(output_images, output_file)
