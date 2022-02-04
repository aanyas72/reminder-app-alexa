const Alexa = require("ask-sdk-core");
const { default: axios } = require("axios");

const API_URL = "http://ec2-44-192-112-233.compute-1.amazonaws.com ";
const username = "a";
const password = "123";

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
    const speakOutput =
      "Welcome! You can get your current reminders or join a parent or class. What would you like to do?";
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const JoinParentIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "JoinParentIntent"
    );
  },

  async handle(handlerInput) {
    let code = handlerInput.requestEnvelope.request.intent.slots.code.value;
    let alexaId = handlerInput.requestEnvelope.session.user.userId;

    const speakOutput = "Joining group " + code;

    try {
      await axios.post(
        `${API_URL}/users/${code}/recipients`,
        {
          alexaId: alexaId,
          recipientAlexaName: "Aanya Singh",
        },
        {
          auth: {
            username: username,
            password: password,
          },
        }
      );
    } catch (error) {
      console.log(error.message);
    }

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

const JoinClassIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "JoinClassIntent"
    );
  },
  async handle(handlerInput) {
    let code = handlerInput.requestEnvelope.request.intent.slots.code.value;
    let alexaId = handlerInput.requestEnvelope.session.user.userId;

    const speakOutput = "Joining class " + code;

    try {
      await axios.post(
        `${API_URL}/users/classes/recipients`,
        {
          alexaId: alexaId,
          recipientAlexaName: "test alexa",
          classs: {
            classsId: code,
          },
        },
        {
          auth: {
            username: username,
            password: password,
          },
        }
      );
    } catch (error) {
      console.log(error.message);
    }

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

const GetAllCurrentRemindersIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "GetAllCurrentRemindersIntent"
    );
  },
  async handle(handlerInput) {
    let alexaId = handlerInput.requestEnvelope.session.user.userId;

    let speakOutput = "Your current reminders are: ";

    try {
      const resp = await axios.get(`${API_URL}/users/recipients/reminders`, {
        params: {
          alexaId: alexaId,
        },
        auth: {
          username: username,
          password: password,
        },
      });

      for (let element of resp.data) {
        for (let elementTwo of element) {
          if (Array.isArray(elementTwo)) {
            for (let elementThree of elementTwo) {
              speakOutput = speakOutput + elementThree + ". ";
            }
          } else {
            speakOutput = speakOutput + elementTwo + ". ";
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = "How can I help?";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speakOutput = "Goodbye!";

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = "Sorry, I don't know about that. Please try again.";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "SessionEndedRequest"
    );
  },
  handle(handlerInput) {
    console.log(
      `~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`
    );
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
  },
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents
 * by defining them above, then also adding them to the request handler chain below
 * */
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
    );
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;

    return (
      handlerInput.responseBuilder
        .speak(speakOutput)
        //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse()
    );
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput =
      "Sorry, I had trouble doing what you asked. Please try again.";
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    GetAllCurrentRemindersIntentHandler,
    JoinParentIntentHandler,
    JoinClassIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
