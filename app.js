const express = require('express')
const path = require('path')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
app.use(express.json())
const dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null
module.exports = app
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is running at localhost3000')
    })
  } catch (e) {
    console.log(`DB Error : ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()
// Return all list of players in a team
app.get('/players/', async (request, response) => {
  const playersQuery = `SELECT * FROM cricket_team;`
  const playersList = await db.all(playersQuery)
  response.send(playersList)
})
// create a new player in the team
app.post('/players/', async (request, response) => {
  const getDetails = request.body
  const {playerName, jerseyNumber, role} = getDetails
  const getPlayerQuery = `INSERT INTO cricket_team(player_name,jersey_number,role) values('${playerName}',${jerseyNumber},'${role}')`
  const dbResponse = await db.run(getPlayerQuery)
  response.send('Player Added to Team')
})
// Returns a Player Based on a Player Id
app.get('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `select * from cricket_team where player_id = ${playerId};`
  const playerDetails = await db.get(getPlayerQuery)
  response.send(playerDetails)
})
// update a player
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getDetails = request.body
  const {playerName, jerseyNumber, role} = getDetails
  const getPlayerQuery = `UPDATE cricket_team  set player_name='${playerName}',jersey_number=${jerseyNumber},role='${role}' where player_id=${playerId};`
  const dbResponse = await db.run(getPlayerQuery)
  response.send('Player Details Updated')
})
// Delete A Player from Table
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayer = `DELETE from cricket_team where player_id= ${playerId};`
  const dbResponse = await db.run(deletePlayer)
  response.send('Player Removed')
})
