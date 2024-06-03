// Modules
import fetch from 'node-fetch';

// Helpers
import {slackToken} from '../config';

const sendMessage = (channel: string, message: string) => {
  return fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    body: JSON.stringify({
      channel,
      text: message,
      token: slackToken,
      as_user: false,
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${slackToken}`,
    },
  });
};

const slackAtAirflowTest = (message: string) => {
  return sendMessage('airflow-test', message);
};

export {slackAtAirflowTest};
