const buttonEqual = document.querySelector(".button-equal");
const buttonClear = document.querySelector(".button-clear");
const buttonBackspace = document.querySelector(".button-backspace");

const display = document.querySelector("#display");
const operatorButtons = Array.from(document.querySelectorAll(".button-operator"));
const digitButtons = Array.from(document.querySelectorAll(".button-digit"));

let operator, operand1 = 0, operand2 = 0;

// operand1, operator, operand2
let phase = "operand1";


function digitPress(e) {
    let currentDigit = Number(e.target.textContent);

    if (phase === "operand1") {
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
        operator = e.target.textContent;
    } else if (phase === "operator") {
        for (b of operatorButtons) {
            if (b !== e.target) {
                b.style["background-color"] = "#000000";
            } else {
                b.style["background-color"] = "#6d126d";
            }
        }

        operator = e.target.textContent;
    } else {
        for (b of operatorButtons) {
            if (b !== e.target) {
                b.style["background-color"] = "#000000";
            } else {
                b.style["background-color"] = "#6d126d";
            }
        }

        let ans = operate(operator, operand1, operand2);
        operand1 = ans;
        operand2 = 0;
        operator = e.target.textContent;
        phase = "operator";

    }
}

function equalPress(e) {

}

console.log(typeof(Array.from(document.querySelectorAll(".button-digit"))));

// what
for (b of digitButtons) {
    b.addEventListener("mousedown", digitPress);
}

for (b of operatorButtons) {
    b.addEventListener("mousedown", operatorPress);
}


buttonEqual.addEventListener("mousedown", equalPress);


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

