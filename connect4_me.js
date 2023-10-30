/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.width = 7;
        this.height = 7;
        this.currPlayer = p1;
        this.board = [];
        this.makeBoard();
        this.makeHtmlBoard()
    }

    /** makeBoard: create in-JS board structure:
     *   board = array of rows, each row is array of cells  (board[y][x])
     */
    makeBoard() {
        for (let y = 0; y < this.height; y++) {
        this.board.push(Array.from({ length: this.width }));
        }
    }

    /** makeHtmlBoard: make HTML table and row of column tops. */
    makeHtmlBoard() {
        const board = document.getElementById('board');

        // make column tops (clickable area for adding a piece to that column)
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');

        this.handleClick = this.handleClick.bind(this);
        top.addEventListener('click', this.handleClick);

        let color = this.p1.color;

        for (let x = 0; x < this.width; x++) {
            const headCell = document.createElement('td');
            headCell.setAttribute('id', x);
            top.append(headCell);

            $(headCell).on("mouseover", function () {
                $(this).css("background-color", color);
            });
            $(headCell).on("mouseout", function () {
                $(this).css("background-color", "");
            });
        }

        board.append(top);

        // make main part of board
        for (let y = 0; y < this.height; y++) {
            const row = document.createElement('tr');

            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `${y}-${x}`);
                row.append(cell);
            }

            board.append(row);
        }
    }

    /** findSpotForCol: given column x, return top empty y (null if filled) */
    findSpotForCol(x) {
        for (let y = this.height - 1; y >= 0; y--) {
            if (!this.board[y][x]) {
                return y;
            }
        }
        return null;
    }

    /** placeInTable: update DOM to place piece into HTML table of board */
    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.backgroundColor = this.currPlayer.color;
        piece.style.top = -50 * (y + 2);

        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }

    /** endGame: announce game end */
    endGame(msg) {
        alert(msg);
        const top = document.querySelector("#column-top");
        top.removeEventListener("click", this.handleClick);
    }

    /** handleClick: handle click of column top to play piece */
    handleClick(evt) {

        // get x from ID of clicked cell
        const x = +evt.target.id;

        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) {
            return;
        }

        // place piece in board and add to HTML table
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);

        // check for win
        if (this.checkForWin()) {
            return this.endGame(`Player ${this.currPlayer.color} won!`);
        }

        // check for tie
        if (this.board.every(row => row.every(cell => cell))) {
            return this.endGame('Tie!');
        }

        // switch players
        this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;

        let color = this.currPlayer.color;
        $("#column-top td").on("mouseover", function () {
            $(this).css("background-color", color);
        });
        $("#column-top td").on("mouseout", function () {
            $(this).css("background-color", "");
        });
    }

    /** checkForWin: check board cell-by-cell for "does a win start here?" */
    checkForWin() {
            // Check four cells to see if they're all color of current player
            //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer

        const _win = cells =>
            cells.every(
                ([y, x]) =>
                y >= 0 &&
                y < this.height &&
                x >= 0 &&
                x < this.width &&
                this.board[y][x] === this.currPlayer
            );

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // get "check list" of 4 cells (starting here) for each of the different
                // ways to win
                const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
                const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
                const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
                const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

                // find winner (only checking each win-possibility as needed)
                if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                    return true;
                }
            }
        }
    }
}

// create the Player class
class Player {
    constructor(color) {
        this.color = color;
    }
}

// selected the form and input tags
const FORM = document.querySelector("form");
const INPUT = document.querySelectorAll("input");

// added an event listerner to the form tag
FORM.addEventListener("click", function (e) {

    // prevent the page to reload after the user input
    e.preventDefault();

    // the users inputs
    const player1 = new Player(INPUT[0].value);
    const player2 = new Player(INPUT[1].value);

    // check if the users inputs are valid
    if ((!INPUT[0].value || !INPUT[1].value) || (INPUT[0].value === INPUT[1].value)) {
        return;
    }

    // to restart the game
    if (e.target.innerText === "Restart") {
        window.location.reload(true);
    }

    // start the game and change the innerText of the button
    if (e.target.tagName === "BUTTON" && e.target.innerText === "Start") {
        e.target.innerText = "Restart"
        new Game(player1, player2);
    }
});