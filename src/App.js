import './App.css';
import { useKeycloak } from '@react-keycloak/web';
import PrivateRoute from './helpers/PrivateRoute';
import axios from 'axios';
import { useState } from 'react';
import { Board } from './components/Board/Board';
import ScoreBoard from './components/ScoreBoard/ScoreBoard';


function App() {

  const {keycloak} = useKeycloak();
  const [message,setMessage] = useState('XO game');

  // Uncomment to show keycloak object (contains main elements like token , username, roles , etc.)
  //console.log(keycloak);

  //Method to call the express API and retrieve a message (authorized for a user with admin role only)
  //You can change the endpoint to '/user' to retrieve a message for all authenticated users
  const fetchApi = () => {
    axios.get('http://localhost:3200/admin', {
      headers: {
        'Authorization': `bearer ${keycloak.token}`
      }
    })
    .then((res) => {
      setMessage(res.data)
      console.log("message is set");
    })
    .catch((error) => {
      console.log("Could not get data");
    })
  }



  //check if keycloak user is authenticated
  if(keycloak.authenticated){
    console.log("User is authenticated, generating data from API...");
    fetchApi();
  }
  else{
    console.log("Please login to generate data");
  }

  const [board,setBoard] = useState(Array(9).fill(null));
  const [xIsPlaying, setXIsPlaying] = useState(true);
  const [xScore,setXScore] = useState(0);
  const [oScore,setOScore] = useState(0);
  const [gameOver,setGameOver] = useState(false);
  const [tie, setTie] = useState(0);
  const [winner, setWinner] = useState(null); // Winner status
  const [isTie, setIsTie] = useState(false); // Tie status

  const WIN_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const handleBoxClick = (boxID) => {

    const updatedBoard = board.map((value, id) => {
      if(id === boxID){
        return xIsPlaying === true ? "X" : "O";
      }
      else{
        return value;
      }
    })
    console.log("update", updatedBoard[0])
    setBoard(updatedBoard);
    setXIsPlaying(!xIsPlaying);
    const winner = checkWinner(updatedBoard); 
    setWinner(winner);
    
    if(winner){
      if(winner === "X"){  
        setXScore(xScore+1);
        setGameOver(true);
      }
      else{
        setOScore(oScore+1);
        setGameOver(true);
      }
    }

    let filled = true;
    updatedBoard.map((item) => {
      if (item === null) {
        filled = false;
        return filled;
      }
      return null;
    });

    if (filled && winner !== "X" && winner !== "O") {
      filled = true;
      setIsTie(true); // Set the tie status
      setTie(tie + 1);
      return filled;
    }
  };

  const checkWinner = (updatedBoard) => {
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const [x,y,z] = WIN_CONDITIONS[i]; //[0,1,2]

      if(
        updatedBoard[x] &&
        updatedBoard[x] === updatedBoard[y] &&
        updatedBoard[y] === updatedBoard[z]
      ){
        console.log("winner");
        return updatedBoard[x];
      }
    }

  };

  const reset = () => {
    setGameOver(false);
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsTie(false);
  };

  const restartGame = () => {
    setGameOver(false);
    setBoard(Array(9).fill(null));
    setOScore(0);
    setXScore(0);
    setTie(0);
    setWinner(null);
    setIsTie(false);

  };
  

    return (
      <>
        <div className="App">
        <nav className="navbar">
          <h3 className="navbar__title">
            {keycloak.authenticated ? 'Welcome to our game ' + keycloak.tokenParsed?.preferred_username : "Let's play a game "}
          </h3>
          {!keycloak.authenticated && (
            <button className="navbar__button" onClick={() => keycloak.login()}>Login</button>
          )}
          {keycloak.authenticated && (
            <button className="navbar__button" onClick={() => keycloak.logout()}>Logout</button>
            
          )}
        </nav>
          {!keycloak.authenticated && (
             
              <div class="card">
                <div class="card-header">
                <h1 class="title">
                  <span class="tic">Tic-</span>
                  <span class="tac">Tac-</span>
                  <span class="toe">Toe</span>
                </h1>
                </div>
                <div class="card-body">
                  <p class="card-description">
                    Tic Tac Toe is a classic paper-and-pencil game played between two players. The board consists of a 3x3 grid, and the players take turns marking X or O in the empty cells. The goal is to form a line of three consecutive marks (horizontally, vertically, or diagonally) before the opponent does. The game ends in a draw if all cells are filled and no player has won.
                  </p>
                  <p class="card-description">
                    Tic Tac Toe is a simple yet strategic game that can be enjoyed by people of all ages. It helps improve critical thinking, spatial awareness, and decision-making skills. Whether you're a beginner or a seasoned player, Tic Tac Toe is a great way to have fun and challenge yourself.
                  </p>
                </div>
              </div>
                        )}
            {/* the private component won't load if the user is not authenticated */}
            {/* Look at the helpers/PrivateRoute.jsx to understand */}
            <PrivateRoute>
              {/* <h3>{message}</h3> */}
              <h1 class="title">
                <span class="tic">Tic-</span>
                <span class="tac">Tac-</span>
                <span class="toe">Toe</span>
              </h1>
              <ScoreBoard xScore={xScore} oScore={oScore} tie={tie} playing = {xIsPlaying}/>
              {winner && (
                <p className={`winner-label ${winner === "X" ? "red" : "blue"}`}>
                  The winner is player : {winner}
                </p>
              )} {/* Display the winner status */}
              {isTie && <p className="tie-label">It's a tie!</p>} {/* Display the tie status */}
              <Board board={board} 
              onClick={gameOver === true ? reset : handleBoxClick}/>
              <button className="btn" onClick={reset}>Play Again</button>
              <button className="btn" onClick={restartGame}>Restart Game</button>

            </PrivateRoute>
            
            
        
        </div>

      </>
    
  );
}

export default App;
