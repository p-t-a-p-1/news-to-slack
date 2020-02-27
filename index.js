/**
 * NewsAPIで取得したニュースをSlackへ流す
 */
'use strict'
const dotenv = require('dotenv')
const NewsAPI = require('newsapi')
dotenv.config()

// Slackアプリ名
const SLACK_APP_NAME = process.env.SLACK_APP_NAME
// Slackアプリトークン
const SLACK_TOKEN = process.env.SLACK_TOKEN
// SlackチャンネルID
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID

const Slack = require('slack')
const slack = new Slack()

slack.chat
  .postMessage({
    token: SLACK_TOKEN,
    channel: SLACK_CHANNEL_ID,
    text: 'コロナに関するニュース'
  })
  .then(console.log)
  .catch(console.error)

sendTopNews()

/**
 * 国内topニュース取得
 */
function sendTopNews() {
  const NEWS_API_KEY = process.env.NEWS_API_KEY
  const newsapi = new NewsAPI(NEWS_API_KEY)
  newsapi.v2
    .topHeadlines({
      category: 'general',
      country: 'jp',
      pageSize: '3',
      q: 'コロナ'
    })
    .then(news => {
      news['articles'].forEach(item => {
        // ニュースごとの処理
        console.log(item.title)
        //bot.postMessageToChannel('テスト', item.title)
        // Slackにニュース投稿
        slack.chat
          .postMessage({
            token: SLACK_TOKEN,
            channel: SLACK_CHANNEL_ID,
            text: item.title,
            attachments: [
              {
                callback_id: 'post_button',
                text: '',
                actions: ['投稿する'].map(v => ({
                  type: 'button',
                  text: v,
                  name: v
                }))
              }
            ]
          })
          .then(console.log)
          .catch(console.error)
      })
    })
}
