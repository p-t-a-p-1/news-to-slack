/**
 * NewsAPIで取得したニュースをSlackへ流す
 */
'use strict'
const SlackBot = require('slackbots')
const axios = require('axios')
const dotenv = require('dotenv')
const NewsAPI = require('newsapi')
dotenv.config()

// Slackアプリ名
const SLACK_APP_NAME = process.env.SLACK_APP_NAME
// Slackアプリトークン
const SLACK_TOKEN = process.env.SLACK_TOKEN

// Slack の bot インスタンス作成
const bot = new SlackBot({
  token: `${SLACK_TOKEN}`,
  name: SLACK_APP_NAME
})

bot.on('message', data => {
  if (data.type !== 'message') {
    // 投稿以外の場合は何もしない
    return
  }
  sendMessage(data.text)
})

bot.on('error', err => {
  console.log('エラー : ' + err)
})

/**
 *
 * @param {string} message
 */
function sendMessage(message) {
  if (message.includes('topnews')) {
    // topnewsコマンドでNEWSAPI用いてトップニュース取得
    sendTopNews()
  } else {
    // それ以外はヘルプ表示
    sendHelp()
  }
}

/**
 * NEWSAPI のキーをもとに newsapi インスタンス生成
 */
const NEWS_API_KEY = process.env.NEWS_API_KEY
const newsapi = new NewsAPI(NEWS_API_KEY)

/**
 * 国内topニュース取得
 */
function sendTopNews() {
  newsapi.v2
    .topHeadlines({
      category: 'general',
      country: 'jp'
    })
    .then(news => {
      news['articles'].forEach(item => {
        // ニュースごとの処理
        console.log(item.title)
        bot.postMessageToChannel('テスト', item.title)
      })
    })
}

/**
 * HELP送信
 */
function sendHelp() {
  bot.postMessageToChannel('テスト', 'topnews => 国内トップニュース取得')
}
