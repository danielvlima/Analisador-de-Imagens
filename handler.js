const aws = require("aws-sdk");
// const { promises: { readFile } } = require('fs');

const { get } = require("axios");

class Handler {
  constructor({ rekoSvc, translatorSvc }) {
    this.rekoSvc = rekoSvc;
    this.translatorSvc = translatorSvc;
  }

  async detectImageLabels(buffer) {
    const result = await this.rekoSvc
      .detectLabels({
        Image: {
          Bytes: buffer,
        },
      })
      .promise();

    const workingItems = result.Labels.filter(
      ({ Confidence }) => Confidence > 80
    );

    const names = workingItems.map(({ Name }) => Name).join(" and ");

    return { names, workingItems };
  }

  async translateTxt(text) {
    const params = {
      SourceLanguageCode: "en",
      TargetLanguageCode: "pt",
      Text: text,
    };

    const { TranslatedText } = await this.translatorSvc
      .translateText(params)
      .promise();

    return TranslatedText.split(" e ");
  }

  formatTextResults(texts, workingItems) {
    const finalText = [];
    for (const indexText in texts) {
      const nameInPortuguese = texts[indexText];
      const confidence = workingItems[indexText].Confidence;
      finalText.push(
        `${confidence.toFixed(2)}% de ser do tipo ${nameInPortuguese}`
      );
    }

    return finalText.join("\n");
  }

  async getImageBuffer(imageUrl) {
    const response = await get(imageUrl, {
      responseType: "arraybuffer"
    });

    const buffer = Buffer.from(response.data, 'base64');
    return buffer
  }

  async main(event) {
    try {
      const { imageUrl } = event.queryStringParameters
      // const imgBuffer = await readFile("./images/macaco.jpg");
      console.log("@Baixando imagem...");
      const buffer = await this.getImageBuffer(imageUrl);
    
      console.log("@Detectando as labels...");
      const { names, workingItems } = await this.detectImageLabels(buffer);

      console.log("@Traduzindo para português...");

      const texts = await this.translateTxt(names);

      console.log("@Formatando texto...");
      const finalText = this.formatTextResults(texts, workingItems);

      return {
        statusCode: 200,
        body: `A imagem tem\n`.concat(finalText),
      };
    } catch (error) {
      console.log("Error", error.stack);
      return {
        statusCode: 500,
        body: "Internal server error!",
      };
    }
  }
}

const reko = new aws.Rekognition();
const translator = new aws.Translate();
const handler = new Handler({
  rekoSvc: reko,
  translatorSvc: translator,
});

module.exports.main = handler.main.bind(handler);
