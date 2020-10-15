import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

// class Square extends React.Component {
//     render() {
//       return (
//         <button className="square" onClick={() => this.props.onClick()}>
//           {this.props.value}
//         </button>
//       );
//     }
//   }
  function Square(props){
      return (
      <button className="square" onClick={props.onClick} style={props.highlight}>
        {props.value}
      </button>
      )
  }
  
  class Board extends React.Component {
    // constructor(props){
    //     super(props)
    //     this.state = {
    //         squres: Array(9).fill(null),
    //         xIsNext: true
    //     }
    // }  
    renderSquare(i) {
      //isWinCooridateArr属性改变，每次点击Board九个格都要重新渲染一次
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
    //第二个循环渲染列每个方格
    // renderBoardRow (j) {
    //   let element = []
    //   for (let i = 0; i < 3; i++) {
    //     element.push(this.renderSquare(j + i))
    //   }
    //   return (<div className='board-row' key ={j}>{element}</div>)
    // }
    render() {
      //render方法会被调用多次,随着数据的改变它一直尝试渲染
      //每一次点击，整个board里的square都是重新渲染的，即9个square
      console.log('我board被调用了')
        // const winner = calculateWinner(this.state.squres)
        // let status
        // if(winner){
        //     status = 'Winner: ' + winner
        // } else {
        //     status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        // }


        // let layout = []
        // //第一个循环渲染行
        // for(let i = 0; i < 3; i++){
        //   layout.push(this.renderBoardRow(i * 3))
        // }
        
        //这样写两重循环没有分开写好
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
          {/* <div className="status">{status}</div> */}
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
            //changeOrder: false
        }
        //this.currentCor = 0
        //this.cordateXY = []
    } 
    handleClick(i){
        //slice 函数  返回一个新的数组，包含从 start 到 end （不包括该元素）的 arrayObject 中的元素
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        //如果不指定参数，则为复制,如果不复制，则所步骤用的都是一个squres,为了实现历史回退功能必须复制一份
        const squares = current.squres.slice()
        let position = current.position.slice()
        if(calculateWinner(squares) || squares[i]){
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        let thecordateXY = [i % 3 + 1, parseInt(i / 3)  + 1]
        position = thecordateXY
        this.setState({
          //push是把整个数组当作一个元素添加到第一个数组中，不能直接访问到element.squres,这里其实不一定必须要复制原对象
          //concat则是直接把后一个数组的元素直接拿过来作为新元素，且concat不修改原数组
            history: history.concat([{
                squres: squares,
                position: position
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        })
       // this.state.squres[i] = 'x'
    }
    // toggle(){
    //   this.setState({changeOrder: !this.state.changeOrder})
    // }
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
        // if(this.state.changeOrder){
        //   history.reverse()
        // }
        const current = history[this.state.stepNumber]
        //为何在render函数里检测是否有胜者？因为每次改变state[即有数据发生变化], 所有的render函数都执行一次
        const winner = calculateWinner(current.squres)
        //这里也是每次点击后所有的li都要根据history数组来重新渲染一次
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
        //let isWinCooridate = []
        if(winner){
            status = 'Winner: ' + current.squres[winner[0]]
        } else if(!winner && !current.squres.includes(null)) {
            status = '平局'
        }else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        //
        
      return (
        <div className="game">
          <div className="game-board">
            <Board squres={current.squres} isWinCooridateArr={winner} onClick={(i) => this.handleClick(i)} />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
          {/* <div className="sort_i">
           <button onClick={() => {this.toggle()}}>排序</button>
          </div> */}
          
        </div>
        
      );
    }
  }
  //学习这种优秀的写法
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
        // return squares[a];
        return lines[i];
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
//   var player = {score:1, name: 'jeff'}
//   //var newPlayer = Object.assign({}, player, {score: 2},{name: 'wang'})
//   var newPlayer1 = {...player, score: 22, name: 'zong'}
//   console.log(player)
//   console.log(newPlayer1)

// var arr1 = ["G","J","T"]
// var arr2 = ["J","A","M"]
// console.log(arr1.concat(arr2))
// console.log(arr1)
// console.log(arr2)