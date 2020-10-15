import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

  function Square(props){
      return (
      <button className="square" onClick={props.onClick} style={props.highlight}>
        {props.value}
      </button>
      )
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      var highlight = {'color':'red'}
      return (
        <Square 
        key={i}
        value={this.props.squres[i]} 
        onClick={() => this.props.onClick(i)}
        highlight={this.props.isWinCooridateArr&&this.props.isWinCooridateArr.includes(i) ? highlight : {}}
        />
      ) 
    }

    render() {
        let layout = []
        for(let i = 0; i < 3; i++){
          let j = i * 3
          let row = []
          for(let k = 0; k < 3; k++){
             row.push(this.renderSquare(j + k))
          }
          layout.push(<div className='board-row' key = {i}>{row}</div>)
        }
        
      return (
        <div>
          {layout} 
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            history: [{
                squres: Array(9).fill(null),
                position: [0,0]
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    } 
    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squres.slice()
        let position = current.position.slice()
        if(calculateWinner(squares) || squares[i]){
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        let thecordateXY = [i % 3 + 1, parseInt(i / 3)  + 1]
        position = thecordateXY
        this.setState({
            history: history.concat([{
                squres: squares,
                position: position
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        })
    }
    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      })
    }
    render() {
        console.log('我game被调用了')
        const style = {'fontWeight': 'bold','color':'red'}
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squres)
        const moves = history.map((step, move) => {
            const desc = move ?
            'Go to move #' + move + ' coordinate [' + step.position + ']' :
            'Go to game start'
            return (
                <li key={move}>
                    <button style={move === this.state.stepNumber ? style: {}} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })
        let status
        if(winner){
            status = 'Winner: ' + current.squres[winner[0]]
        } else if(!winner && !current.squres.includes(null)) {
            status = '平局'
        }else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        
      return (
        <div className="game">
          <div className="game-board">
            <Board squres={current.squres} isWinCooridateArr={winner} onClick={(i) => this.handleClick(i)} />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return lines[i];
      }
    }
    return null;
  }
  
  // ===============root dom======================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );