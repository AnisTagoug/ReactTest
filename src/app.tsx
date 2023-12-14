import React from "react"
import ReactDOM from "react-dom"
import LoanCalculator from './LoanCalculator'
import "./index.css"


const App: React.FC = () => {
    return (
      <div className="App">
        <header className="App-header">
        
        </header>
        <main>
          <LoanCalculator />
        </main>
      </div>
    );
  }
ReactDOM.render(<App />, document.getElementById("root"))
