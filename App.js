// import Board from "./modules/Board"
// import Node from "./modules/Node"

//Board Class
class Board{
    //Board constructor
    constructor(State){
        this.State = State;
        this.x = this.findX();
        this.y = this.findY();
    }

    //Simple function to copy board
    copyState(Subject){
        var copy = [[],[],[]];
        for(var y = 0; y < 3; y++){
            for(var x = 0; x < 3; x++){
                copy[x][y] = Subject[x][y];
            }
        }
        return copy;
    }

    //Function to print out the board's puzzle
    printPuzzle(){
        var out = "";
        for(var y = 0; y < this.State.length; y++){
            for(var x = 0; x < this.State.length; x++){
                out+= this.State[x][y] + " ";
            }
            out += "\n";
        }
        out += "\n";
        return out;
    }

    //Find X function, finds the X value of 0.
    findX(){
        var find = Number.MAX_SAFE_INTEGER;
        for(var j = 0; j < this.State.length; j++){
            for(var i = 0; i < this.State.length; i++){
                if(this.State[i][j] == 0){
                    find = i;
                }
            }
        }
        return find;
    }

    //Find Y function, finds the Y value of 0.
    findY(){
        var find = Number.MAX_SAFE_INTEGER;
        for(var j = 0; j < this.State.length; j++){
            for(var i = 0; i < this.State.length; i++){
                if(this.State[i][j] == 0){
                    find = j;
                }
            }
        }
        return find;
    }

    //Comparison function, returns true if the Compare board's puzzle is equal to this Boards puzzle.
    isEqual(compare){
        var count = 0;
        for(var col = 0; col < 3; col++){
            for(var row = 0; row < 3; row++){
                if(this.State[row][col] == compare.State[row][col]){
                    count++;
                }
            }
        }
        if(count == 9){
            return true;
        }
        else {
            return false;
        }
    }

	//Generates a new board where the values are swapped left, if it cannot, it returns Null.
    generateLeft(){
        var tempState = this.copyState(this.State);
        if(this.x-1 == 0 || this.x-1 == 1){
            tempState[this.x][this.y] = this.State[this.x-1][this.y];
            tempState[this.x-1][this.y] = 0;
            var newBoard = new Board(tempState);
            return newBoard;
        }
        else return null;
    }

    //Generates a new board where the values are swapped right, if it cannot, it returns Null.
    generateRight(){
        var tempState = this.copyState(this.State);
		if(this.x+1 == 1 || this.x+1 == 2) {
			tempState[this.x][this.y] = this.State[this.x+1][this.y];
			tempState[this.x+1][this.y] = 0;
			var newBoard = new Board(tempState);
			return newBoard;
		}
		else return null;
    }

    //Generates a new board where the values are swapped up, if it cannot, it returns Null.
    generateUp(){
		var tempState = this.copyState(this.State);
		if(this.y-1 == 0 || this.y-1 == 1) {
			tempState[this.x][this.y] = this.State[this.x][this.y-1];
			tempState[this.x][this.y-1] = 0;
			var newBoard = new Board(tempState);
			return newBoard;
		}
		else return null;
	}

    //Generates a new board where the values are swapped down, if it cannot, it returns Null.
    generateDown(){
		var tempState = this.copyState(this.State);
		if(this.y+1 == 1 || this.y+1 == 2) {
			tempState[this.x][this.y] = this.State[this.x][this.y+1];
			tempState[this.x][this.y+1] = 0;
			var newBoard = new Board(tempState);
			return newBoard;
		}
		else return null;
		}
}

//Node Helper Class
class Node {
	//Constructor for the board, sets all the needed states, g = 0 as initial board is farthest away, sets h as total Manhattan distance to solution,
	//f to g + h, and initializes the childList as a new list.
	constructor(Start,Solution){
		this.Start = Start;
		this.Solution = Solution;
		this.g=0;
		this.h = this.distance(Start, Solution);
		this.f = this.g + this.h;
		this.childList = [];
        var parent = null;
	}


	//Calculates the total Manhattan distance of each misplaced piece on the board to the solution board.
    distance(Start, Solution){
		var d=0;
		var x1=0;
        var x2=0;
        var y2=0;
        var y1=0;
		var find;

		for(var j = 0; j < 3 ; j++) {
			for(var i = 0; i < 3; i++)
			{
				x1 = i;
				y1 = j;
				find = Start.State[i][j];
				for(var col = 0; col < 3; col++) {
					for(var row = 0; row < 3; row++) {
						if(Solution.State[row][col] == find) {
							x2 = row;
							y2 = col;
						}
					}
				}
				d += Math.abs(x2 - x1) + Math.abs(y2 - y1);
			}	
		}
		return d;
	}

    //Check for if the board is the solution of the puzzle.
	isSolution() {
		if(this.Start.isEqual(this.Solution)){
			return true;
		}
		else return false;
	}   
}	

//A* Algorithm
function aStar(thisNode) {
		//Initializes 3 lists, openList, closedList, and usedPuzzles.
		var openList = [];
		var closedList = [];
		var usedPuzzles = [];
		//adds initial board 'this' to the open list, and sets it to current.
		openList.push(thisNode);
		var current = thisNode;


		//Starts loop for algorithm, while the openList is not empty this will continue running.
		while(openList.length>0) {
        //for(var q = 0; q < 20; q++){
			//This block will find the node in openList with the lowest f value.
			var minF = Number.MAX_SAFE_INTEGER;
			var nodeNum = Number.MAX_SAFE_INTEGER;
			for(var p = 0 ; p < openList.length; p++) {
				if(openList[p].f < minF) {
					minF = openList[p].f;
					nodeNum = openList.indexOf(openList[p]);
				}
			}
			
			//Set current to node with lowest f value, and add it to the usedPuzzles, as we dont want to keep checking puzzles we've already seen.
			var current = openList[nodeNum];
			usedPuzzles.push(current.Start);

			//Check if current is the solution.
			if(current.isSolution()){
				var out = [];
				//Initializes list which will store all the nodes to the solution.
				var finalList = [];
				while(current.parent != null) {
					finalList.push(current);
					current = current.parent;
				}
				
				//prints the finalList backwards, as the starting node will be the solution, and the end is the beginning.
				current.Start.printPuzzle();
				for(var z = finalList.length - 1; z > -1; z--) {
					out.push(finalList[z].Start.State);
				}
				//Returns full string of path
				return out;
			}
			
			//Generates left if possible, sets its parent to the current node, increments g value, and if the puzzle hasn't been used, add it to childList.
			if(current.Start.generateLeft() != null){
				var l = new Node(current.Start.generateLeft(),thisNode.Solution);
				l.parent = current;
				l.g++;
				if(!usedPuzzles.includes(l.Start)) {
					current.childList.push(l);
				}
			}
			
			//Generates right if possible, sets its parent to the current node, increments g value, and if the puzzle hasn't been used, add it to childList.
			if(current.Start.generateRight() != null){
				var r = new Node(current.Start.generateRight(),thisNode.Solution);
				r.parent = current;
				r.g++;
				if(!usedPuzzles.includes(r.Start)) {
					current.childList.push(r);
				}
			}
			
			//Generates up if possible, sets its parent to the current node, increments g value, and if the puzzle hasn't been used, add it to childList.
			if(current.Start.generateUp() != null){
				var u = new Node(current.Start.generateUp(),thisNode.Solution);
				u.parent = current;
				u.g++;
				if(!usedPuzzles.includes(u.Start)) {
					current.childList.push(u);
				}
			}
			
			//Generates down if possible, sets its parent to the current node, increments g value, and if the puzzle hasn't been used, add it to childList.
			if(current.Start.generateDown() != null){
				var d = new Node(current.Start.generateDown(),thisNode.Solution);
				d.parent = current;
				d.g++;
				if(!usedPuzzles.includes(d.Start)) {
                    current.childList.push(d);
				}
			}
			
            //runs through childList, and adds them to the open list.
            for(var i = 0; i < current.childList.length; i++){
                if(!openList.includes(current.childList[i])){
                    openList.push(current.childList[i]);
                }
            }


            var tempArray = [];
            for(var m = 0; m < openList.length; m++){
                if(m!=nodeNum){
                    tempArray.push(openList[m]);
                }
            }
            openList = tempArray;

            closedList.push(current);
		}
		return "No Solution";
}

function puzzleFactory(puzzle){
    var x = "<div class='grid'><div class='cell'> " + puzzle[0][0] + " </div><div class='cell'>" + puzzle[1][0] + "</div><div class='cell'>" + puzzle[2][0] + "</div><div class='cell' >" + puzzle[0][1] + "</div><div class='cell'>" + puzzle[1][1] + "</div><div class='cell' >" + puzzle[2][1] + "</div><div class='cell'>" + puzzle[0][2] + "</div><div class='cell' >" + puzzle[1][2] + "</div><div class='cell'>" + puzzle[2][2] + "</div></div>";
    return x;
}

function solvePuzzle(){
    var puzzle = [[],[],[]];
    var solvedPuzzle = [[],[],[]];
    var x = document.getElementById("uslot1").value;


    puzzle[0][0] = document.getElementById("uslot1").value;
    puzzle[1][0] = document.getElementById("uslot2").value;
    puzzle[2][0] = document.getElementById("uslot3").value;
    puzzle[0][1] = document.getElementById("uslot4").value;
    puzzle[1][1] = document.getElementById("uslot5").value;
    puzzle[2][1] = document.getElementById("uslot6").value;
    puzzle[0][2] = document.getElementById("uslot7").value;
    puzzle[1][2] = document.getElementById("uslot8").value;
    puzzle[2][2] = document.getElementById("uslot9").value;

    solvedPuzzle[0][0] = document.getElementById("slot1").value;
	solvedPuzzle[1][0] = document.getElementById("slot2").value;
	solvedPuzzle[2][0] = document.getElementById("slot3").value;
	solvedPuzzle[0][1] = document.getElementById("slot4").value;
	solvedPuzzle[1][1] = document.getElementById("slot5").value;
	solvedPuzzle[2][1] = document.getElementById("slot6").value;
	solvedPuzzle[0][2] = document.getElementById("slot7").value;
	solvedPuzzle[1][2] = document.getElementById("slot8").value;
	solvedPuzzle[2][2] = document.getElementById("slot9").value;

    myBoard = new Board(puzzle);
    console.log("Initial Board:\n" + myBoard.printPuzzle());
    let Solved = new Board(solvedPuzzle);
    console.log("Solution Board:\n" + Solved.printPuzzle());
    let puzzleSolver = new Node(myBoard,Solved);
    let finalPath = (aStar(puzzleSolver));
    
    var output = "";
    for(var x in finalPath){
        output+= puzzleFactory(finalPath[x]);
    }

    document.getElementById("output").style = ".gridContainer width: 96%;margin: 10px; background-color:grey;padding: 10px;border-radius: 10px;"

    document.getElementById("output").innerHTML = output;

}


main();

function main(){
    var puzzle = [[],[],[]];
    var solvedPuzzle = [[],[],[]];
    puzzle[0][0] = 2;
    puzzle[1][0] = 8;
    puzzle[2][0] = 3;
    puzzle[0][1] = 1;
    puzzle[1][1] = 6;
    puzzle[2][1] = 4;
    puzzle[0][2] = 7;
    puzzle[1][2] = 0;
    puzzle[2][2] = 5;

    solvedPuzzle[0][0] = 1;
	solvedPuzzle[1][0] = 2;
	solvedPuzzle[2][0] = 3;
	solvedPuzzle[0][1] = 8;
	solvedPuzzle[1][1] = 0;
	solvedPuzzle[2][1] = 4;
	solvedPuzzle[0][2] = 7;
	solvedPuzzle[1][2] = 6;
	solvedPuzzle[2][2] = 5;

    myBoard = new Board(puzzle);
    console.log("Initial Board:\n" + myBoard.printPuzzle());
    let Solved = new Board(solvedPuzzle);
    console.log("Solution Board:\n" + Solved.printPuzzle());
    let puzzleSolver = new Node(myBoard,Solved);
    let finalPath = (aStar(puzzleSolver));
    for(var x in finalPath){
        console.log(finalPath[x].printPuzzle())

    }
}
