const buttonEqual = document.querySelector(".button-equal");
const buttonClear = document.querySelector(".button-clear");
const buttonBackspace = document.querySelector(".button-backspace");
const buttonSign = document.querySelector(".button-sign");

const display = document.querySelector("#display");
const operatorButtons = Array.from(document.querySelectorAll(".button-operator"));
const digitButtons = Array.from(document.querySelectorAll(".button-digit"));

let operator = null, operand1 = 0, operand2 = 0, storedOperand1 = 0;

// operand1, operator, operand2
let phase = "operand1";

function colorOperator(newOperatorButton) {
   for (b of operatorButtons) {
            if (b !== newOperatorButton) {
                b.style["background-color"] = "#000000";
            } else {
                b.style["background-color"] = "#6d126d";
            }
        } 
}


function digitPress(e) {
    console.log(phase);

    let currentDigit = Number(e.target.textContent);

    if (phase === "equalPressed") {
        operand1 = currentDigit;
        phase = "operand1";
        display.textContent = operand1; 
    } else if (phase === "operand1") {
        operand1 = operand1*10 + currentDigit;
        console.log(operand1);

        display.textContent = operand1;
    } else {
        phase = "operand2";
        operand2 = operand2*10 + currentDigit;

        display.textContent = operand2;
    }
}

function operatorPress(e) {
    console.log(phase);
    
    if (phase === "operand1") {
        phase = "operator";
        e.target.style["background-color"] = "#6d126d";
    } else if (phase === "operator") {
        colorOperator(e.target);
    } else if (phase === "operand2") {
        colorOperator(e.target);
        
        let ans = operate(operator, operand1, operand2);
        operand1 = ans;
        operand2 = 0;
        phase = "operator";
        
    } else if (phase === "equalPressed") {
        colorOperator(e.target);
        phase = "operator";
    }

    operator = e.target.textContent;
    console.log("Operator:", operator);
}

function equalPress(e) {
    console.log(phase);
    console.log("Operator:", operator, operand1, operand2);

    if (phase === "operand1") {
        operand1 = 0;
        return;
    } else if (phase === "operator") {
        storedOperand1 = operand1;
        operand2 = operand1;
        operand1 = operate(operator, operand1, operand2);
    } else if (phase === "equalPressed") {
        operand2 = operand1;
        operand1 = storedOperand1;

        operand1 = operate(operator, operand2, operand1);
    } else if (phase === "operand2") {
        storedOperand1 = operand2;
        console.log("Heyo");

        operand1 = operate(operator, operand1, operand2);
    }
    
    phase = "equalPressed";
    operand2 = 0;
    colorOperator(null);

}

function backspacePress(e) {
    if (phase === "operand1") {
        operand1 = Math.floor(operand1 / 10);
        display.textContent = operand1; 
    } else if (phase === "operator") {
        colorOperator(null);
        phase = "operand1";
    } else if (phase === "operand2") {
        if (operand2 === 0) {
            phase = "operator";
            display.textContent = operand1;
        } else {
            operand2 = Math.floor(operand2 / 10);
            display.textContent = operand2;
        }
    } else {
        // only equalPressed...?
        clearPress();
    }
}

function clearPress(e) {
    phase = "operand1";
    operand1 = 0;
    operand2 = 0;
    operator = null;
    display.textContent = operand1;
    colorOperator(null);
}

function signPress() {
    if (phase === "operand1" || phase === "operator") {
        operand1 *= -1;
        display.textContent = operand1;
    } else if (phase === "operand2") {
        operand2 *= -1;
        display.textContent = operand2;
    }
}

// what
for (b of digitButtons) {
    b.addEventListener("mousedown", digitPress);
}

for (b of operatorButtons) {
    b.addEventListener("mousedown", operatorPress);
}


buttonEqual.addEventListener("mousedown", equalPress);
buttonBackspace.addEventListener("mousedown", backspacePress);
buttonClear.addEventListener("mousedown", clearPress);
buttonSign.addEventListener("mousedown", signPress);



function add(a,b) {
    return a+b;
}

function subtract(a,b) {
    return a-b;
}

function multiply(a,b) {
    return a*b;
}

function divide(a,b) {
    return a/b;
}

function operate(operator,a,b) {
    let ans;

    switch (operator) {
        case "+":
            ans = add(a,b);
            break;
        case "-":
            ans = subtract(a,b);
            break;
        case "*":
            ans = multiply(a,b);
            break;
        case "/":
            ans = divide(a,b);
            break;
    
        default:
            break;
    }

    display.textContent = ans;
    return ans;
}

