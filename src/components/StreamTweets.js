const Twit = require('twit')

const streamTwits = () => {
    const T = new Twit({
        consumer_key: 'cFlKYYuktOZ07y8EcTYgzvWpS',
        consumer_secret: 'dK72LQSalBCsd0LRBSHBSEDSPbCMpbuA7LYczgvsLNPUTrYPRE',
        access_token: '281449714-C5lo5XoTq8jUh8gpe6gNHtp5IOVitSpMqQjqn0sE',
        access_token_secret: '35tDuHOCKZcby2J9umjf0wWMp2HxoBs8Ae3m5pLtHfzhH'
    });

    const stream = T.stream('statuses/filter', { track: 'movie' })

    stream.on('tweet', function (tweet) {
        console.log(tweet)
    })
}

export default streamTwits;
