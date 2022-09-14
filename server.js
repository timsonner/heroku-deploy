// imports
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const { bots, playerRecord } = require('./data')
const { shuffleArray } = require('./utils')

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '522c6acc4aab4c7fa8f2c79f391c555b',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('🟢 Server.js started')

// middleware
app.use(express.json())
app.use(cors())
app.use(rollbar.errorHandler())

// endpoints
app.get('/styles', (req, res) => {
  try {
    res.status(200).sendFile(path.join(__dirname, '/public/index.css'))
  } catch (error) {
    console.log('ERROR GETTING INDEX.CSS', error)
    res.sendStatus(400)
  }
})

app.get('/js', (req, res) => {
  try {
    res.status(200).sendFile(path.join(__dirname, '/public/index.js'))
  } catch (error) {
    console.log('ERROR GETTING INDEX.JS', error)
    res.sendStatus(400)
  }
})

app.get('/', (req, res) => {
  try {
    rollbar.log("🟢 Endpoint '/' Success")
    res.status(200).sendFile(path.join(__dirname, '/public/index.html'))
  } catch (error) {
    console.log('ERROR GETTING INDEX.HTML', error)
    rollbar.log("🔴 Endpoint '/' Failure")
    res.sendStatus(400)
  }
})

app.get('/api/robots', (req, res) => {
  try {
    res.status(200).send(bots)
    rollbar.log("🟢 Endpoint '/api/robots' Success - .send(bots)")
  } catch (error) {
    console.log('ERROR GETTING BOTS', error)
    rollbar.log("🔴 Endpoint '/api/robots' Failure")
    res.sendStatus(400)
  }
})

app.get('/api/robots/five', (req, res) => {
  try {
    let shuffled = shuffleArray(bots)
    let choices = shuffled.slice(0, 5)
    let compDuo = shuffled.slice(6, 8)
    rollbar.log(
      "🟢 Endpoint '/api/robots/five' Success - Send({choices, compDuo}"
    )
    res.status(200).send({ choices, compDuo })
  } catch (error) {
    rollbar.log("🔴 Endpoint '/api/robots' Failure")
    console.log('ERROR GETTING FIVE BOTS', error)
    res.sendStatus(400)
  }
})

app.post('/api/duel', (req, res) => {
  try {
    // getting the duos from the front end
    let { compDuo, playerDuo } = req.body

    // adding up the computer player's total health and attack damage
    let compHealth = compDuo[0].health + compDuo[1].health
    let compAttack =
      compDuo[0].attacks[0].damage +
      compDuo[0].attacks[1].damage +
      compDuo[1].attacks[0].damage +
      compDuo[1].attacks[1].damage

    // adding up the player's total health and attack damage
    let playerHealth = playerDuo[0].health + playerDuo[1].health
    let playerAttack =
      playerDuo[0].attacks[0].damage +
      playerDuo[0].attacks[1].damage +
      playerDuo[1].attacks[0].damage +
      playerDuo[1].attacks[1].damage

    // calculating how much health is left after the attacks on each other
    let compHealthAfterAttack = compHealth - playerAttack
    let playerHealthAfterAttack = playerHealth - compAttack

    // comparing the total health to determine a winner
    if (compHealthAfterAttack > playerHealthAfterAttack) {
      playerRecord.losses++
      rollbar.log("🟢 Endpoint '/api/duel' Success - Send('You lost!')")
      res.status(200).send('You lost!')
    } else {
      playerRecord.wins++
      rollbar.log("🟢 Endpoint '/api/duel' Success - Send('You won!')")
      res.status(200).send('You won!')
    }
  } catch (error) {
    rollbar.log("🔴 Endpoint '/api/duel' Failure")
    console.log('ERROR DUELING', error)
    res.sendStatus(400)
  }
})

app.get('/api/player', (req, res) => {
  try {
    rollbar.log("🟢 Endpoint '/api/player' Success - Send(playerRecord)")
    res.status(200).send(playerRecord)
  } catch (error) {
    rollbar.log("🔴 Endpoint '/api/player' Failure")
    console.log('ERROR GETTING PLAYER STATS', error)
    res.sendStatus(400)
  }
})

const port = process.env.PORT || 3000 // important for heroku integration

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
