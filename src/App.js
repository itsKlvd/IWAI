import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import "./App.css";
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />


function App() {
  const [data, setData] = useState([]);
  const [randomScore, setRandomScore] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = () => {
    fetch("http://212.106.184.211/score?game=RA&limit=1000&offset=0")
      .then((response) => response.json())
      .then((actualData) => {
        setData(actualData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateRandomScore = () => {
    setIsLoading(true); // Ustawia isLoading na true, aby rozpocząć animację kółka ładowania
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomItem = data[randomIndex];
      setRandomScore(randomItem);
      setShowResult(true);
      setIsLoading(false); // Ustawia isLoading na false, aby zakończyć animację kółka ładowania
    }, 2000); // Generuje losowy wynik po 2 sekundach
  };

  const hideResult = () => {
    setShowResult(false);
  };

  const handleMouseEnter = (index, event) => {
    const rowRect = event.target.getBoundingClientRect();
    const tooltipTop = rowRect.top + window.scrollY + rowRect.height;
    const tooltipLeft = rowRect.left + window.scrollX;
    setTooltipIndex(index);
    setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
  };

  const handleMouseLeave = () => {
    setTooltipIndex(null);
  };

  const handleMouseMove = (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    setTooltipPosition({ top: mouseY, left: mouseX });
  };

  const renderScoreRows = () => {
    return data.map((item, index) => {
      const isBestScore = index < 3;
      const previousScore = index > 0 ? data[index - 1].score : 0;
      const scoreDifference = item.score - previousScore;
      const hasVcode = !!item.vcode;

      return (
        <tr
          key={index}
          onMouseEnter={(event) => handleMouseEnter(index, event)}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <td>
            {isBestScore && index === 0 && (
              <i className="fas fa-crown" style={{ marginRight: "5px" }}></i>
            )}
            {item.game}
          </td>
          <td>{item.created_at}</td>
          <td>{item.score}</td>
          <td className="score-difference">{scoreDifference}</td>
        </tr>
      );
    });
  };

  return (
    <div className="App">
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />
      </Helmet>

      <nav className="navbar">
        <div className="navbar-brand">
          <h1 className="navbar-heading">GameDev - Score</h1>
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item">Home</li>
          <li className="navbar-item">Score</li>
        </ul>
      </nav>

      <div className="score-container">
        <table className="score-table">
          <thead>
            <tr>
              <th className="first-row">Game</th>
              <th className="first-row">Date</th>
              <th className="first-row">Score</th>
              <th className="first-row">Points difference</th>
            </tr>
          </thead>
          <tbody>{renderScoreRows()}</tbody>
        </table>
      </div>

      {tooltipIndex !== null && (
        <div
          className="tooltip"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          <p>
            <strong>Vcode:</strong> {data[tooltipIndex].vcode}
          </p>
        </div>
      )}

      <div className="random-score-container">
        <div className="random-score-section">
          {showResult ? (
            <div>
              <h2>Wylosowany wynik:</h2>
              {randomScore && (
                <div>
                  <p>
                    <strong>Game:</strong> {randomScore.game}
                  </p>
                  <p>
                    <strong>Date:</strong> {randomScore.created_at}
                  </p>
                  <p>
                    <strong>Score:</strong> {randomScore.score}
                  </p>
                </div>
              )}
              <button
                onClick={generateRandomScore}
                disabled={isLoading} // Wyłącza przycisk, gdy isLoading jest true
                className={isLoading ? "loading-button" : ""}
              >
                {isLoading ? ( // Wyświetla kółko ładowania, gdy isLoading jest true
                  <i className="fa fa-circle-o-notch fa-spin"></i>
                ) : (
                  "Losuj wynik"
                )}
              </button>
              <button onClick={hideResult}>Schowaj wynik</button>
            </div>
          ) : (
            <div>
              <button
                onClick={generateRandomScore}
                disabled={isLoading} // Wyłącza przycisk, gdy isLoading jest true
                className={isLoading ? "loading-button" : ""}
              >
                {isLoading ? ( // Wyświetla kółko ładowania, gdy isLoading jest true
                  <i className="fa fa-circle-o-notch fa-spin"></i>
                ) : (
                  "Losuj wynik"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
