# typingGame
Description : Speed Typing game application where players can practice and compete against each other.
# functionalities
     Practice/Solo Mode: 
         • A game mode for player to practice and improve their typing skills.
         • Player can choose the level of difficulty and game duration.
         • Player can visualize the typed text progress and real-time typing speed.
         • Once the game ends, the results (e.g., accuracy and typing speed) will be shown
            to the player.
     Multi-Player Mode:
         • A game mode to test your skills against other speedsters.
         • Player can choose the level of difficulty and will be put in a lobby with other
             players who choose the same difficulty.
         • In a particular lobby, all players are shown the same paragraph as the typing
             challenge.
         • In addition to the player's personal progress, they can also visualize other
              players' progress.
         • On game end, the results (e.g., accuracy, typing speed and lobby rank of each player) of all the players in the lobby will be displayed.
# challenges
         I have listed down some design and architectural questions that I consider while
         building my project, into three broad categories:
         • Gameplay:
             − How many players can play at once in a lobby?
             − What happens if all players finished before time?
             − What happens if required number of players are not filled fast enough into a
                lobby?
             − Does the game start with limited players?
         • Session Management and Scalability:
             − How to creating lobbies on demand?
             − All the players of a session have abandoned it. How will the session
               termination happen in this scenario?
             − The Thorough planning on handling large data sets of real-time data as the
               number of live games being played on your application scales up?
         • Resiliency and Fault-Tolerance:
             − What happens to the multi-player session when one of the players
               loses their connection or crashes?
             − How to handle a player refreshing or re-opening their application midgame?
         • User Experience :
             − The application will be intuitive for a first-time player to hop on and understand
               the various game modes?
             − The responsiveness of application to player actions?
            
