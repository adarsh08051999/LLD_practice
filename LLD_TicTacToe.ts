class PieceSymbol {
    public symbolChar: string;
    constructor(symbolChar: string) {
        this.symbolChar = symbolChar;
    }
}

class ManageSymbol {
    public availableSymbol: string[];
    constructor() {
        this.availableSymbol = ['X', 'O'];
    }
    public fetchSymbol(): String | null | undefined {
        if (this.availableSymbol.length == 0) { return null; }
        return this.availableSymbol.pop();
    }
}

class Player {
    public name: string;
    public assigned_symbol: PieceSymbol;
    constructor(name: string, assigned_symbol: string) {
        this.name = name;
        this.assigned_symbol = new PieceSymbol(assigned_symbol);
    }
    public chooseBlock() {
        let x = prompt(`${this.name} put x`);
        let y = prompt(`${this.name} put y`);
        console.log(`choosed ${x} ${y} by ${this.name}`);
        return { x, y };
    }
}

class Spot {
    public row: number;
    public col: number;
    public symbol: PieceSymbol | null;
    constructor(x: number, y: number) {
        this.row = x;
        this.col = y;
        this.symbol = null; // will contain symbol object XSymbol or OSymbol
    }
    public isEmpty(): Boolean {
        return this.symbol === null ? true : false;
    }
    public setSymbol(symbol: PieceSymbol) {
        this.symbol = symbol;
    }
    public getSymbol() {
        return this.symbol?.symbolChar || '-';
    }
}

class Board {
    public board: Spot[][];
    public size: number;
    constructor(size: number) {
        this.board = [];
        this.size = size;
        for (let i = 0; i < size; i++) {
            let dummy_row: Spot[] = [];
            for (let j = 0; j < size; j++) {
                dummy_row.push(new Spot(i, j));
            }
            this.board.push(dummy_row);
        }
    }
    public insertPiece(x: number, y: number, player: Player) {
        if (!this.board[x][y].isEmpty()) { return false; }
        this.board[x][y].setSymbol(player.assigned_symbol);
        return true;
    }
    public checkWin(x: number, y: number) {
        let won: boolean = true;
        let curr_symbol = this.board[x][y].getSymbol();

        // check row with index -x 
        for (let i = 0; i < this.size; i++) {
            if (this.board[x][i].getSymbol() !== curr_symbol) { won = false; break; };
        }
        if (won) { return won; }
        won = true;

        // check column with index - y
        for (let i = 0; i < this.size; i++) {
            if (this.board[i][y].getSymbol() !== curr_symbol) { won = false; break; };
        }
        if (won) { return won; }

        // logic for diagonal
        if (x == y || x + y == this.size - 1) {
            won = true;
            // check 
            let i = 0, j = 0;
            while (i < this.size) {
                if (this.board[i][j].getSymbol() === curr_symbol) {
                    i = i + 1;
                    j = j + 1;
                }
                else {
                    won = false;
                    break;
                }
            }
            if (won) { return won; }
            won = true;
            i = this.size - 1, j = 0;
            while (j < this.size) {
                if (this.board[i][j].getSymbol() === curr_symbol) {
                    i = i - 1;
                    j = j + 1;
                }
                else {
                    won = false;
                    break;
                }
            }
            if (won) { return won; }
        }
        return false;
    }
    public printBoard() {
        for (let i = 0; i < this.size; i++) {
            let z = "";
            for (let j = 0; j < this.size; j++) {
                let x = this.board[i][j].getSymbol();
                z += (x);
            }
            console.log(z);
        }

    }
}

class Game {
    public size: number;
    public constructSymbol: ManageSymbol;
    public board: Board;
    public player: Player[];
    constructor(playerNames: string[], size: number) {
        this.board = new Board(size);
        this.size = size;
        this.constructSymbol = new ManageSymbol();

        this.player = [];
        for (let i = 0; i < playerNames.length; i++) {
            let symbolChar: any = this.constructSymbol.fetchSymbol();
            if (!symbolChar) { throw Error(`No character available`); }
            this.player.push(new Player(playerNames[i], symbolChar));
        }
    }

    playGame() {
        let playerCount = this.player.length;
        let currPlayerIndex = 0;
        let count = this.size * this.size;
        while (count > 0) {
            let curr_player = this.player[currPlayerIndex];
            let { x, y } = curr_player.chooseBlock();
            if (!(x && y) || parseInt(x) < 0 || parseInt(y) < 0 || parseInt(x) >= this.size || parseInt(y) >= this.size) {
                console.log(`Choose appropriate values`); continue;
            }
            let inserted = this.board.insertPiece(parseInt(x), parseInt(y), curr_player);
            if (!inserted) { continue; }
            this.board.printBoard();
            if (this.board.checkWin(parseInt(x), parseInt(y))) { return `${this.player[currPlayerIndex].name} win`; }
            currPlayerIndex = (currPlayerIndex + 1) % (playerCount);
        }
        return `Its a draw`;
    }
}

const game = new Game(["adarsh", "akash"], 3);
let result = game.playGame();
console.log(result);