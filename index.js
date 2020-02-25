/**
 * NewsAPIで取得したニュースをSlackへ流す
 */
'use strict'
const SlackBot = require('slackbots')
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const SLACK_APP_NAME = process.env.SLACK_APP_NAME
const SLACK_TOKEN = process.env.SLACK_TOKEN

console.log(SLACK_TOKEN)
