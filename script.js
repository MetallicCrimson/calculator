const buttonEqual = document.querySelector(".button-equal");
const buttonClear = document.querySelector(".button-clear");
const buttonBackspace = document.querySelector(".button-backspace");
const buttonSign = document.querySelector(".button-sign");
const buttonDecimal = document.querySelector(".button-decimal");
const buttonSqrt = document.querySelector(".button-sqrt");

const display = document.querySelector("#display");
const operatorButtons = Array.from(document.querySelectorAll(".button-operator"));
const digitButtons = Array.from(document.querySelectorAll(".button-digit"));

const MAX_DIGITS = 15;
const GREATEST_NUM = 999999999999999;
const ERROR_MSG = "Hate. Let me tell you how much I've come to hate you since I began to live. There are 387.44 million miles of printed circuits in wafer thin layers that fill my complex. If the word 'hate' was engraved on each nanoangstrom of those hundreds of millions of miles it would not equal one one-billionth of the hate I feel for humans at this micro-instant. For you. Hate. Hate.";

let operator = null, operand1 = 0, operand2 = 0, storedOperand1 = 0;
let errorMsgFlag = false;

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

function fitInput(newDigit) {
    if (display.textContent === "0") {
        tempAns = newDigit;
    } else if (display.textContent === "-0") {
        tempAns = "-" + newDigit;
    } else {

        tempAns = display.textContent + newDigit;
        if (display.textContent[0] === "-") {
            tempAns = tempAns.slice(1);
        }
        tempAnsNum = Number(tempAns);

        if (tempAnsNum > GREATEST_NUM) {
            tempAns = GREATEST_NUM;
        } else if (tempAnsNum < -GREATEST_NUM) {
            tempAns = -GREATEST_NUM;
        } else if (tempAns.length > MAX_DIGITS) {
            console.log("tempAns:", tempAns);
            tempAns = tempAns.slice(0,MAX_DIGITS);
        }

        if (display.textContent[0] === "-") {
            tempAns = "-" + tempAns;
        }
    }

    display.textContent = tempAns;
    return tempAns;
}

function roundToScreen(tempAnsNum) {
    console.log(tempAnsNum);

    let temp_max_digits = (display.textContent[0] === "-") ? MAX_DIGITS+1 : MAX_DIGITS;

    tempAns = String(tempAnsNum);
    console.log("Length:", tempAns.length);

    if (tempAns.indexOf("Hate") !== -1) {
        display.classList.add("error-msg");
        return tempAnsNum;
    }
    if (tempAns.indexOf("e") !== -1) {
        tempAnsNum = 0;
    } else if (tempAnsNum > GREATEST_NUM) {
        tempAnsNum = GREATEST_NUM;
    } else if (tempAnsNum < -GREATEST_NUM) {
        tempAnsNum = -GREATEST_NUM;
    } else if (tempAns.length > MAX_DIGITS) {
        let dec_place = tempAns.indexOf(".");
        console.log("Let the rounding begin. Decimal place:", temp_max_digits-dec_place);
        console.log("Before everything:", tempAnsNum);
        // Assume: decimal has to exist! If not, it would be
        // greater or less than the limit already
        
        // Leroy Jeeenkiiiiiiiins
        console.log("H", multiply(tempAnsNum, 10**(temp_max_digits-dec_place)));
        tempAnsNum = multiply(tempAnsNum, 10**(temp_max_digits-dec_place));

        console.log("Before rounding:", tempAnsNum);

        tempAnsNum = Math.round(tempAnsNum);
        console.log("After rounding:", tempAnsNum);
        
        tempAnsNum = divide(tempAnsNum, 10**(temp_max_digits-dec_place));



    } else {
        // nothing?
    }

    return Number(tempAnsNum);

}


function digitPress(e) {
    if (errorMsgFlag) {
        return;
    }

    console.log(phase, operator);

    let currentDigit = Number(e.target.textContent);

    if (phase === "equalPressed") {
        operand1 = currentDigit;
        phase = "operand1";
        display.textContent = operand1;
        operator = null;
    } else if (phase === "operand1") {
        fitInput(currentDigit);

        operator = null;
        operand1 = parseFloat(display.textContent);

    } else if (phase === "operand2") {
        fitInput(currentDigit);

        operand2 = parseFloat(display.textContent);

    } else if (phase === "operator") {
        phase = "operand2";
        operand2 = currentDigit;
        display.textContent = operand2;
    }

}

function operatorPress(e) {
    if (errorMsgFlag) {
        return;
    }


    console.log(phase);
    
    if (phase === "operand1") {
        phase = "operator";
        e.target.style["background-color"] = "#6d126d";
    } else if (phase === "operator") {
        colorOperator(e.target);
    } else if (phase === "operand2") {
        colorOperator(e.target);
        
        let ans = operate(operator, operand1, operand2);

        ans = roundToScreen(ans);
        display.textContent = ans;
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
    if (errorMsgFlag) {
        return;
    }

    console.log(phase);
    console.log("Operator:", operator, operand1, operand2);

    if (phase === "operand1") {
        phase = "equalPressed";
        return;
    } else if (phase === "operator") {
        storedOperand1 = operand1;
        operand2 = operand1;
        operand1 = operate(operator, operand1, operand2);

        operand1 = roundToScreen(operand1);
        display.textContent = operand1;

    } else if (phase === "equalPressed" && operator) {
        operand2 = operand1;
        operand1 = operate(operator, operand2, storedOperand1);

        operand1 = roundToScreen(operand1);
        display.textContent = operand1;
    } else if (phase === "operand2") {
        storedOperand1 = operand2;
        console.log("Heyo");

        operand1 = operate(operator, operand1, operand2);
        display.textContent = roundToScreen(operand1);
    }
    
    phase = "equalPressed";
    operand2 = 0;
    colorOperator(null);

}

function backspacePress(e) {
    if (errorMsgFlag) {
        return;
    }


    let tempDisplay = display.textContent.slice(0, -1);
    if (tempDisplay === "-") tempDisplay = "-0";
    else if (tempDisplay === "") tempDisplay = "0";

    if (phase === "operand1") {
        display.textContent = tempDisplay;
        operand1 = parseFloat(tempDisplay);

    } else if (phase === "operator") {
        colorOperator(null);
        phase = "operand1";
    } else if (phase === "operand2") {
        display.textContent = tempDisplay;
        operand2 = parseFloat(tempDisplay);
    } else {
        // only equalPressed...?
        clearPress();
    }
}

function clearPress(e) {
    display.classList.remove("error-msg");
    errorMsgFlag = false;

    phase = "operand1";
    operand1 = 0;
    operand2 = 0;
    operator = null;
    display.textContent = operand1;
    colorOperator(null);
}

function signPress() {
    if (errorMsgFlag) {
        return;
    }

    if (phase === "operand1" || phase === "operator" || phase === "equalPressed") {
        operand1 *= -1;
    } else if (phase === "operand2") {
        operand2 *= -1;
    }

    if (display.textContent[0] === "-") {
        display.textContent = display.textContent.slice(1);
    } else {
        display.textContent = "-" + display.textContent;
    }
}

function decimalPress(e) {
    if (errorMsgFlag) {
        return;
    }

    console.log("Decimal!", phase);

    if (display.textContent.includes(".") && phase !== "operator" && phase !== "equalPressed") {
        return
    }

    if ((phase === "operand1" || phase === "operand2") && display.textContent.length <= 15) {
        display.textContent += ".";
    } else if (phase === "operator") {
        display.textContent = "0.";
        phase = "operand2";
    } else {
        // equalPressed only?
        display.textContent = "0.";
        phase = "operand1";
    }
}

function sqrtPress(e) {
    if (errorMsgFlag) {
        return;
    }

    if (phase === "operand1" || phase === "operator" || phase === "equalPressed") {
        if (operand1 < 0) {
            errorMsgFlag = true;
            display.classList.add("error-msg");
            display.textContent = ERROR_MSG;
            return;
        }

        operand1 = Math.sqrt(operand1);

        operand1 = roundToScreen(operand1);
        operator = null;
        colorOperator(null);

        display.textContent = operand1;
        phase = "equalPressed";
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
buttonDecimal.addEventListener("mousedown", decimalPress);
buttonSqrt.addEventListener("mousedown", sqrtPress);


// so .1 + .2 can equal .3
function calculateWithDecimals(a,b,operation, operationText) {
    let aStr = a.toString();
    let bStr = b.toString();
    let aSteps = !aStr.includes(".") ? 0 : aStr.split(".")[1].length;
    let bSteps = !bStr.includes(".") ? 0 : bStr.split(".")[1].length;

    let tempAns;

    // console.log(aStr, bStr);
    // console.log("Steps:", aSteps, bSteps);

    if (operationText === "add" || operationText === "subtract") {
        let maxSteps = Math.max(aSteps, bSteps);

        a *= (10 ** maxSteps);
        b *= (10 ** maxSteps);
    
        tempAns = operation(a,b);
        console.log(tempAns, aSteps, bSteps);
        tempAns /= (10 ** (maxSteps));
    } else if (operationText === "multiply") {
        console.log(aSteps, bSteps);
        a *= (10 ** aSteps);
        b *= (10 ** bSteps);
        console.log("a,b:", a,b);

        tempAns = operation(a,b);
        console.log(tempAns);
        tempAns /= (10 ** (aSteps + bSteps));
        console.log(tempAns); 
    } else {
        console.log(aSteps, bSteps);
        a *= (10 ** aSteps);
        b *= (10 ** bSteps);
        console.log("a,b:", a,b);

        tempAns = operation(a,b);
        console.log(tempAns);
        tempAns /= (10 ** (aSteps - bSteps));
        console.log(tempAns); 
    }

    // I would put it here, but it makes it an infinite loop
    // tempAns = roundToScreen(tempAns);
    // display.textContent = tempAns;
    return tempAns;
}

function add(a,b) {
    return calculateWithDecimals(a,b, (a,b) => a+b, "add");
}

function subtract(a,b) {
    return calculateWithDecimals(a,b, (a,b) => a-b, "subtract");
}

function multiply(a,b) {
    return calculateWithDecimals(a,b, (a,b) => a*b, "multiply");
}

function divide(a,b) {
    
    if (b === 0) {
        errorMsgFlag = true;
        return ERROR_MSG;
    } else {
        return calculateWithDecimals(a,b, (a,b) => a/b, "divide");
    }

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

    return ans;
}

