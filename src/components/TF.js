const tf = require('@tensorflow/tfjs');

async function loadTextModel() {
    let model;
    try {
        model = await tf.loadLayersModel('https://storage.googleapis.com/bart-ml.appspot.com/tfjs_output/model.json');
        model.summary();
        return model;
    } catch (err) {
        console.error(err);
    }
}

async function loadImageModel() {
    let model;
    try {
        model = await tf.loadLayersModel('https://storage.googleapis.com/bart-ml.appspot.com/tfjs_image_output/model.json');
        model.summary();
        return model;
    } catch (err) {
        console.error(err);
    }
}

async function makePrediction(modelType, input, tensor) {
    let model;
    const labels = ['delay', 'delay_15_min', 'delay_30_min', 'delay_1_hour', 'delay_more_than_hour', 'outage', 'outage_15_min', 'outage_30_min', 'outage_1_hour', 'outage_more_than_hour', 'N/A'];

    if (modelType === 'text') {
        model = await loadTextModel();
        const prediction = await model.predict(tensor);
        const labelIndex = prediction.argMax(-1).dataSync()[0]

        console.log('Original Text:', input[0]);
        console.log('Prediction:', labels[labelIndex]);

        return labels[labelIndex];
    }
}

class Tokenizer {
    constructor(config = {}) {
      this.filters = config.filters || /[#!"$%&()*+,-./:;<=>?@[\]^_`{|}~]/g;
      this.lower = true;
      this.wordIndex = {};
      this.indexWord = {};
      this.wordCounts = {};
    }

    cleanText(text) {
      if (this.lower) text = text.toLowerCase();
      return text
        .replace(this.filters, '')
        .split(' ');
    }

    fitOnTexts(texts) {
      texts.forEach(text => {
        text = this.cleanText(text);
        text.forEach(word => {
          this.wordCounts[word] = (this.wordCounts[word] || 0) + 1;
        });
      });

      Object.entries(this.wordCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([word, number], i) => {
          this.wordIndex[word] = i + 1;
          this.indexWord[i + 1] = word;
        });
    }

    textsToSequences(texts) {
      return texts.map(text => this.cleanText(text).map(word => this.wordIndex[word] || 0));
    }
}

function preprocessText(input) {
    const jsonInput = require('../assets/input.json');
    const jsonText = [];

    Object.entries(jsonInput).forEach(item => {
        jsonText.push(item[1][0].text);
    });
    const tokenizer = new Tokenizer();
    tokenizer.fitOnTexts(jsonText);
    const sequences = tokenizer.textsToSequences(input);

    const MAX_LENGTH = 250;
    const padded = new Array(MAX_LENGTH - sequences[0].length).fill(0);
    sequences[0].forEach(token => padded.push(token))

    const tensor = tf.tensor1d(padded, 'int32').expandDims();

    return tensor;
}

export {
    preprocessText,
    makePrediction,
}
