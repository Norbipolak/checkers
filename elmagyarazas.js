class Checkers {
    table;
    highlighted;

    constructor() {
        this.table = document.querySelector("#table");
        this.highlighted = {
            row: -1,
            col: -1,
            player: null
        }
        this.generateFields();
        this.table.addEventListener("click", this.handleCellClick.bind(this));
    }

    generateFields() {
        for (let i = 1; i <= 64; i++) {
            const row = Math.ceil(i / 8);
            const col = (i - 1) % 8 + 1;
            const field = document.createElement("div");
            field.classList.add("field");

            this.step(field, row, col);

            if ((row % 2 === 1 && col % 2 === 0) || (row % 2 === 0 && col % 2 === 1)) {
                field.classList.add("black-bg");
                let player = document.createElement("div");
                player.classList.add("player");
                if (row < 3) {
                    player.classList.add("white-player");
                } else if (row >= 7) {
                    player.classList.add("black-player");
                }
                field.appendChild(player);
            }

            this.table.appendChild(field);
        }
    }

    handleCellClick(event) {
        const clickedCell = event.target.closest('.field');
        if (!clickedCell) return;

        const row = Math.ceil(parseInt(clickedCell.dataset.index) / 8);
        const col = (parseInt(clickedCell.dataset.index) - 1) % 8 + 1;
        
        if (this.canMove(row, col)) {
            this.movePlayerToCell(clickedCell);
            this.switchTurn();
        } else {
            alert("Invalid move!");
        }
    }

    canMove(row, col) {
        const rowDiff = this.highlighted.row - row;
        const colDiff = this.highlighted.col - col;
        
        if (this.highlighted.player && Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) {
            return true;
        }
        
        return false;
    }

    movePlayerToCell(targetCell) {
        targetCell.appendChild(this.highlighted.player);
        this.highlighted.player.classList.remove("highlight");
        this.highlighted = {
            row: -1,
            col: -1,
            player: null
        };
    }

    step(field, row, col) {
        field.dataset.index = (row - 1) * 8 + col;
    }
}
