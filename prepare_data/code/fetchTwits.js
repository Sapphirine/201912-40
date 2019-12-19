const request = require('request');
const moment = require('moment');
const fs = require('fs');

const search_auth = {
    consumer_key: 'cFlKYYuktOZ07y8EcTYgzvWpS',
    consumer_secret: 'dK72LQSalBCsd0LRBSHBSEDSPbCMpbuA7LYczgvsLNPUTrYPRE',
    token: '281449714-C5lo5XoTq8jUh8gpe6gNHtp5IOVitSpMqQjqn0sE',
    token_secret: '35tDuHOCKZcby2J9umjf0wWMp2HxoBs8Ae3m5pLtHfzhH'
};

const search_config = {
    url: 'api.twitter.com/1.1/tweets/search/',
    env: 'fullarchive/bart'
};

// has:images

// query for regular twits
let query = {
    'query': 'lang:en -is:retweet -@sfbart -@SFBARTalert (service OR fail OR down OR delay OR delayed OR late OR wait OR waiting OR problem OR (out of service) OR outage OR off OR ahead OR stuck OR closed) (#bart OR #sfbart)',
    'maxResults': 500,
    'fromDate': '',
    'toDate': ''
};

// query for official service change twits
let query = {
    'query': 'lang:en from:SFBARTalert',
    'maxResults': 500,
    'fromDate': '',
    'toDate': ''
};

const request_options = {
    url: 'https://' + search_config.url + search_config.env + '.json',
    oauth: search_auth,
    json: true,
    headers: {
        'content-type': 'application/json'
    },
    body: query
};

async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function fetch (reqOptions, date) {
    request.post(reqOptions, function (error, response, body) {
        if (error) {
            console.log(error);
            return;
        }

        fs.writeFile(`./raw_official/${date.substring(0, 8)}.json`, JSON.stringify(body), 'utf8', (err) => {if (err) console.log(err);});
    });
}

// fetch twits
// async function makeRequests() {
//     for (let i = 1; i <= 162; i++) {
//         query.fromDate = moment().subtract(i * 34, 'd').format('YYYYMMDDHHMM');
//         query.toDate = moment().subtract(i * 17, 'd').format('YYYYMMDDHHMM');

//         await fetch(request_options, query.toDate);
//         await wait(1200);
//     }
// }

// makeRequests(request_options);

async function makeRequests() {
    for (let i = 1; i <= 37; i++) {
        if (i === 1){
            query.fromDate = moment().subtract(i * 75, 'd').format('YYYYMMDDHHMM');
            query.toDate = moment().format('YYYYMMDDHHMM');
        } else {
            query.fromDate = moment().subtract((i-1) * 150, 'd').format('YYYYMMDDHHMM');
            query.toDate = moment().subtract((i-1) * 75, 'd').format('YYYYMMDDHHMM');
        }

        await fetch(request_options, query.toDate);
        await wait(1200);
    }
}

makeRequests(request_options);
