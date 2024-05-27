import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// Компонент Square отображает отдельную клетку на игровом поле
class Square extends React.Component {
  render() {
    return (
      // Кнопка для клетки, значение которой определяется пропсами
      <button
        className={`square ${this.props.isWinning ? "winning" : ""}`}
        onClick={this.props.onClick}
      >
        {this.props.value}
      </button>
    );
  }
}

// Компонент Board отображает игровое поле, состоящее из клеток
class Board extends React.Component {
  // Метод для рендера отдельной клетки
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]} // Значение клетки (X, O или null)
        onClick={() => this.props.onClick(i)} // Обработчик клика по клетке
        isWinning={this.props.winningSquares.includes(i)} // Проверка, является ли клетка частью выигрышной комбинации
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// Компонент Game контролирует всё состояние игры и логику
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }], // История ходов
      stepNumber: 0, // Текущий шаг
      xIsNext: true, // Чей ход (X или O)
    };
  }

  // Обработчик клика по клетке
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // История до текущего шага
    const current = history[history.length - 1]; // Текущее состояние клеток
    const squares = current.squares.slice(); // Копия текущего состояния клеток

    // Если уже есть победитель или клетка занята, ничего не делаем
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // Устанавливаем значение клетки (X или O)
    squares[i] = this.state.xIsNext ? "X" : "O";

    // Обновляем состояние игры
    this.setState({
      history: history.concat([{ squares: squares }]), // Добавляем новый ход в историю
      stepNumber: history.length, // Обновляем номер текущего шага
      xIsNext: !this.state.xIsNext, // Меняем игрока
    });
  }

  // Метод для перехода к определённому ходу в истории
  jumpTo(step) {
    this.setState({
      stepNumber: step, // Устанавливаем текущий шаг
      xIsNext: step % 2 === 0, // Определяем чей ход (X или O)
    });
  }

  render() {
    const history = this.state.history; // Вся история ходов
    const current = history[this.state.stepNumber]; // Текущее состояние клеток
    const result = calculateWinner(current.squares); // Определяем победителя и выигрышную линию
    const winner = result ? result.winner : null; // Победитель (если есть)
    const winningSquares = result ? result.line : []; // Выигрышная линия (если есть)

    // Формируем список ходов для отображения
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    // Определяем статус игры (кто победил или чей следующий ход)
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (!current.squares.includes(null)) {
      status = "Draw!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares} // Текущее состояние клеток
            onClick={(i) => this.handleClick(i)} // Обработчик клика по клетке
            winningSquares={winningSquares} // Выигрышная линия
          />
        </div>
        <div className="game-info">
          <div>{status}</div> {/* Статус игры */}
          <ol>{moves}</ol> {/* Список ходов */}
        </div>
      </div>
    );
  }
}

// Функция для определения победителя
function calculateWinner(squares) {
  // Все возможные выигрышные комбинации
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

  // Проверяем все выигрышные комбинации
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // Если есть выигрышная комбинация, возвращаем победителя (X или O) и выигрышную линию
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }

  // Если победителя нет, возвращаем null
  return null;
}

// Рендерим компонент Game на странице
ReactDOM.render(<Game />, document.getElementById("root"));
