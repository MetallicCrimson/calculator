const button0 = document.querySelector(".button-0");
const button1 = document.querySelector(".button-1");
const button2 = document.querySelector(".button-2");
const button3 = document.querySelector(".button-3");
const button4 = document.querySelector(".button-4");
const button5 = document.querySelector(".button-5");
const button6 = document.querySelector(".button-6");
const button7 = document.querySelector(".button-7");
const button8 = document.querySelector(".button-8");
const button9 = document.querySelector(".button-9");
const buttonDecimal = document.querySelector(".button-decimal");
const buttonAdd = document.querySelector(".button-add");
const buttonSubtract = document.querySelector(".button-subtract");
const buttonMultiply = document.querySelector(".button-multiply");
const buttonDivide = document.querySelector(".button-divide");
const buttonEqual = document.querySelector(".button-equal");
const buttonClear = document.querySelector(".button-clear");
const buttonBackspace = document.querySelector(".button-backspace");

const display = document.querySelector("#display");

const digitButtons = [button0, button1, button2, button3, button4, button5, button6, button7, button8, button9];

const operatorButtons = [buttonAdd, buttonSubtract, buttonMultiply, buttonDivide];

let operator, operand1 = 0, operand2 = 0;

// firstDigit or lastDigit
let phase = "firstDigit";

function digitPress(e) {
    let currentDigit = Number(e.target.textContent);

    if (phase === "firstDigit") {
        operand1 = operand1*10 + currentDigit;
        console.log(operand1);

        display.textContent = operand1;
    } else {
        operand2 = operand2*10 + currentDigit;

        display.textContent = operand2;
    }
}

function operatorPress(e) {
    console.log(phase);
    if (phase === "firstDigit") {
        phase = "lastDigit";
        e.target.style["background-color"] = "#6d126d";
        operator = e.target.textContent;
    } else {
        for (b of operatorButtons) {
            if (b !== e.target) {
                console.log("Heyo");
                b.style["background-color"] = "#000000";
            } else {
                b.style["background-color"] = "#6d126d";
            }
        }

        let ans = operate(operator, operand1, operand2);
        console.log(ans);


    }
}


for (b of digitButtons) {
    b.addEventListener("mousedown", digitPress);
}

for (b of operatorButtons) {
    b.addEventListener("mousedown", operatorPress);
}



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
    switch (operator) {
        case "+":
            return(add(a,b));
            break;
        case "-":
            return(subtract(a,b));
            break;
        case "*":
            return(multiply(a,b));
            break;
        case "/":
            return(divide(a,b));
            break;
    
        default:
            break;
    }
}

