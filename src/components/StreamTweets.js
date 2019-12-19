const Twit = require('twit')

const streamTwits = () => {
    const T = new Twit({
        consumer_key: 'XXXXXX',
        consumer_secret: 'XXXXXX',
        access_token: 'XXXXXX',
        access_token_secret: 'XXXXXX'
    });

    const stream = T.stream('statuses/filter', { track: 'movie' })

    stream.on('tweet', function (tweet) {
        console.log(tweet)
    })
}

export default streamTwits;
