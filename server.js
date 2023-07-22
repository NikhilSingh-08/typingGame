const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + "/public"));

const lobbies = {};

function generateLobbyId() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 6;
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function generateReferralCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 6;
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function startGameForLobby(lobbyId) {
    const players = lobbies[lobbyId].players;
  
    // Inform all players in the lobby to start the game
    players.forEach(playerId => {
      io.to(playerId).emit('startGame');
    });
  
}

io.on("connection", (socket) => {
  let lobbyId = null;
  let referralCode = null;

  socket.on("createLobby", () => {
      // Generate a new lobby ID and referral code
      lobbyId = generateLobbyId();
      referralCode = generateReferralCode();

      // Create the lobby with an empty list of players
      lobbies[lobbyId] = {
          players: [],
          referralCode: referralCode
      };

      // Join the lobby
      socket.join(lobbyId);

      // Send the lobby ID and referral code back to the client
      socket.emit("lobbyCreated", { lobbyId, referralCode });
  });

    socket.on('joinLobby', (requestedLobbyId, requestedReferralCode) => {
        // Check if the requested lobby exists and has space for another player
        if (lobbies[requestedLobbyId] && lobbies[requestedLobbyId].players.length < 2) {
          // Check if the referral code matches
          if (requestedReferralCode === lobbies[requestedLobbyId].referralCode) {
            lobbyId = requestedLobbyId;
    
            // Join the lobby
            socket.join(lobbyId);
    
            // Add the player to the lobby's player list
            lobbies[lobbyId].players.push(socket.id);
    
            // Inform the other players in the lobby that a new player has joined
            socket.to(lobbyId).emit('playerJoined', socket.id);
    
            // If the lobby is now full, start the game for all players in the lobby
            if (lobbies[lobbyId].players.length === 2) {
              startGameForLobby(lobbyId); // Start the game for the lobby
            }
          } else {
            // Referral code does not match, notify the client
            socket.emit('lobbyJoinFailed', 'Referral code does not match.');
          }
        } else {
          // Lobby is full or does not exist, notify the client
          socket.emit('lobbyJoinFailed', 'Lobby is full or does not exist.');
        }
      });

    socket.on("disconnect", () => {
        if (lobbyId) {
            // Remove the player from the lobby's player list
            lobbies[lobbyId].players = lobbies[lobbyId].players.filter((playerId) => playerId !== socket.id);

            // Notify the other players in the lobby that a player has left
            socket.to(lobbyId).emit("playerLeft", socket.id);

            // If the lobby is now empty, delete it
            if (lobbies[lobbyId].players.length === 0) {
                delete lobbies[lobbyId];
            }
        }
    });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
