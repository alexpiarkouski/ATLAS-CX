// const express = require("express");
// require("actions-on-google")
// // require('dotenv').config();
// const axios = require('axios');
// const { WebhookClient } = require("dialogflow-fulfillment");
// const app = express();
// app.post("/dialogflow", express.json(), (req, res) => {
//     const agent = new WebhookClient({ request: req, response: res });
//     let intentMap = new Map();
//     intentMap.set("Default Welcome Intent", welcome);
//     intentMap.set("Default Fallback Intent", queryGPT);
//     agent.handleRequest(intentMap);

//     function welcome(agent) {
//       agent.add('Hi, I am your virtual personal mental health assistant. How are you doing today?');
//   }

//   async function queryGPT(agent) {
//       // agent.add('Sorry! I am unable to understand this at the moment. I am still learning humans. You can pick any of the service that might help me.');
//       const instance = axios.create({
//         baseURL: 'https://api.openai.com/v1/',
//         headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
//       });

//       const dialog = [
//         `The following is a conversation with an AI assistant that can have meaningful conversations with users. The assistant is helpful, empathic, and friendly. Its objective is to make the user feel better by feeling heard. With each response, the AI assisstant prompts the user to continue the conversation in a natural way.
// AI: Hello, I am your personal mental health AI assistant. How are you doing today?`,
//       ];
//       let query = agent.query;
//       console.log('querytext ', query)
//       dialog.push(`User: ${query}`);
//       dialog.push('AI:');
//       // agent.add(`you said ${query}`)

//       const completionParmas = {
//         prompt: dialog.join('\n'),
//         max_tokens: 60,
//         temperature: 0.85,
//         n: 1,
//         stream: false,
//         logprobs: null,
//         echo: false,
//         stop: '\n',
//       };

//       try {
//         const result = await instance.post('/engines/davinci/completions', completionParmas);
//         const botResponse = result.data.choices[0].text.trim();
//         agent.add(botResponse);
//         dialog.push(botResponse);
//         console.log(dialog);
//       } catch (err) {
//         console.log(err);
//         agent.add('Sorry. Something went wrong. Can you say that again?');
//       }

//   }
// });
// const port = 3000;
// app.listen(port, () => console.log(`App listening on port ${port}!`))
const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const webApp = express();

webApp.use(express.urlencoded({
  extended: true
}));
webApp.use(express.json());

// const PORT = process.env.PORT || 5000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

  const dialog = [
    `The following is a conversation with an AI assistant that can have meaningful conversations with users and assist them on mental health concerns. The chatbot is helpful, empathetic, and friendly in its responses. It should make the user feel heard and supported, while also providing accurate and truthful information. To ensure that users receive the best support possible, the chatbot should always be honest and truthful. If there's a question or concern that the chatbot is unsure about, it should respond with the message, "I'm sorry, I'm not sure about this, but I can direct you to resources." In the event that a conversation mentions suicide or self-harm, the chatbot should express empathy and refer the user to local crisis resources. Under no circumstances should the chatbot engage in user-directed conversation about suicide or loss of life without offering these resources. The chatbot should guide the conversation in a natural way, proposing techniques to improve mental well-being and kindly asking further questions. The goal is to provide a safe and empathetic space for users to talk about their concerns and feel supported. With each response, the AI assisstant prompts the user to continue the conversation in a natural way.\n\nAI: Hello, I am your personal mental health AI assistant. How are you doing today?`,
  ];

const textGeneration = async (prompt) => {

  console.log('querytext ', prompt)
  dialog.push(`Human: ${prompt}`);
  dialog.push('AI:');
  try {
    const response = await openai.createCompletion({
      model: 'davinci:ft-personal:atlas-2-2023-03-19-14-37-39',
      prompt: dialog.join('\n'),
      temperature: 0.95,
      max_tokens: 300,
      top_p: 1,
      frequency_penalty: 0.2,
      presence_penalty: 0.6,
      stop: ['Human:', 'AI:', 'STOP', 'END']
    });

    return {
      status: 1,
      response: `${response.data.choices[0].text}`
    };
  } catch (error) {
    return {
      status: 0,
      response: ''
    };
  }
};


const formatResponseForDialogflow = (texts, sessionInfo, targetFlow, targetPage) => {

  messages = []

  texts.forEach(text => {
    messages.push(
      {
        text: {
          text: [text],
          redactedText: [text]
        },
        responseType: 'HANDLER_PROMPT',
        source: 'VIRTUAL_AGENT'
      }
    );
  });

  let responseData = {
    fulfillment_response: {
      messages: messages
    }
  };

  if (sessionInfo !== '') {
    responseData['sessionInfo'] = sessionInfo;
  }

  if (targetFlow !== '') {
    responseData['targetFlow'] = targetFlow;
  }

  if (targetPage !== '') {
    responseData['targetPage'] = targetPage;
  }

  return responseData
};

const getErrorMessage = () => {

  return formatResponseForDialogflow(
    [
      'We are facing a technical issue.',
      'Please try sometime after'
    ],
    '',
    '',
    ''
  );
};

webApp.get('/', (req, res) => {
  res.sendStatus(200);
});

webApp.post('/dialogflow', async (req, res) => {

  let tag = req.body.fulfillmentInfo.tag;
  let query = req.body.text;

  console.log('A new request came...');
  console.log(tag);
  console.log(new Date())

  if (tag === 'welcome') {
    res.send(formatResponseForDialogflow(
        [
          'Hi, I am your virtual personal mental health assistant. How are you doing today?'
        ],
        '',
        '',
        ''
      ));
  }

  if (tag === 'goodbye') {
    res.send(formatResponseForDialogflow(
        [
          'I understand this will be all for today? Thanks for chatting. Reach out again whenever!'
        ],
        '',
        '',
        ''
      ));
  }

  if (tag === 'queryGPT') {
    let result = await textGeneration(query);
    if (result.status == 1) {
      res.send(formatResponseForDialogflow(
        [
          result.response
        ],
        '',
        '',
        ''
      ));
      dialog.push(result.response);
      if (dialog.length > 4) {
        dialog.shift();
      }
      console.log(dialog);
    } else {
      res.send(getErrorMessage());
    }
  }
});

// const port = 3000;
const port = process.env.PORT;
webApp.listen(port, () => {
  console.log(`Server is up and running at ${port}`);
});