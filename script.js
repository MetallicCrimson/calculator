const buttonEqual = document.querySelector(".button-equal");
const buttonClear = document.querySelector(".button-clear");
const buttonBackspace = document.querySelector(".button-backspace");
const buttonSign = document.querySelector(".button-sign");
const buttonDecimal = document.querySelector(".button-decimal");
const buttonSqrt = document.querySelector(".button-sqrt");

const buttonExpEqual = document.querySelector(".top-row > .button-equal");
const buttonExpClear = document.querySelector(".top-row > .button-clear");
const buttonExpBackspace = document.querySelector(".top-row > .button-backspace");

const buttonHelp = document.querySelector(".button-help");
const buttonAbout = document.querySelector(".button-about");
const buttonExpand = document.querySelector(".button-expand");
const uiHelp = document.querySelector(".ui-help");
const uiAbout = document.querySelector(".ui-about");
const uiBaseInput = document.querySelector(".base-input");
const uiBaseInputDiv = document.querySelector(".base-input-div");

const buttonsBasic = document.querySelector("#buttons-basic");
const buttonsExpanded = document.querySelector("#buttons-expanded");
const digitRow = document.querySelector(".digit-row");

const display = document.querySelector("#display");
const operatorButtons = Array.from(document.querySelectorAll(".button-operator"));
const digitButtons = Array.from(document.querySelectorAll(".button-digit"));

const copiedFeedback = document.querySelector("#copied-feedback");

const MAX_DIGITS = 15;
const GREATEST_NUM = 999999999999999;
const ERROR_MSG = "Hate. Let me tell you how much I've come to hate you since I began to live. There are 387.44 million miles of printed circuits in wafer thin layers that fill my complex. If the word 'hate' was engraved on each nanoangstrom of those hundreds of millions of miles it would not equal one one-billionth of the hate I feel for humans at this micro-instant. For you. Hate. Hate.";

let operator = null, operand1 = 0, operand2 = 0, storedOperand1 = 0;
let errorMsgFlag = false;

let expandedFlag = false;
let base = 60;

// Valid phases: operand1, operator, operand2
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
    let tempAns;

    if (display.textContent === "0") {
        tempAns = newDigit;
    } else if (display.textContent === "-0") {
        tempAns = "-" + newDigit;
    } else if (expandedFlag) {
        tempAns = display.textContent + newDigit;
        console.log("tempans:", tempAns);

        if (convertToDec(tempAns) > GREATEST_NUM) {
            tempAns = convertToExpanded(GREATEST_NUM);
        } else if (tempAns.length > MAX_DIGITS) {
            // this is only important for bases lower than decimal
            tempAns = convertToExpanded(base-1).repeat(MAX_DIGITS);
        }
    } else {

        tempAns = display.textContent + newDigit;
        if (display.textContent[0] === "-") {
            tempAns = tempAns.slice(1);
        }
        let tempAnsNum = Number(tempAns);

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
    // If it's expanded, I don't have to care about any of this stuff

    if (expandedFlag) {
        if (errorMsgFlag) {
            display.classList.add("error-msg");
            return ERROR_MSG;
        } else if (convertToDec(tempAnsNum) > GREATEST_NUM) {
            return convertToExpanded(GREATEST_NUM);
        } else if (tempAnsNum.length > MAX_DIGITS) {
            return convertToExpanded(base-1).repeat(MAX_DIGITS);
        } else if (tempAnsNum === "") {
            return "0";
        } else {
            return tempAnsNum;
        }
    }

    let temp_max_digits = (display.textContent[0] === "-") ? MAX_DIGITS+1 : MAX_DIGITS;

    tempAns = String(tempAnsNum);
    console.log("Length:", tempAns.length);

    if (errorMsgFlag) {
        display.classList.add("error-msg");
        return ERROR_MSG;
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
    }

    return Number(tempAnsNum);

}


function digitPress(e) {
    console.log("operand1, operand2:", operand1, operand2);

    if (errorMsgFlag) {
        return;
    }

    console.log(phase, operator);

    let currentDigit = e.target.textContent;

    if (phase === "equalPressed") {

        operand1 = convertToDec(currentDigit);
        phase = "operand1";
        display.textContent = currentDigit;
        operator = null;
    } else if (phase === "operand1") {
        fitInput(currentDigit);

        operator = null;
        if (expandedFlag) {
            operand1 = convertToDec(display.textContent);
        } else {
            operand1 = parseFloat(display.textContent);
        }

    } else if (phase === "operand2") {
        fitInput(currentDigit);

        if (expandedFlag) {
            operand2 = convertToDec(display.textContent);
        } else {
            operand2 = parseFloat(display.textContent);
        }
    } else if (phase === "operator") {
        phase = "operand2";
        operand2 = convertToDec(currentDigit);

        display.textContent = currentDigit;
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
        console.log(ans);
        // ans = roundToScreen(ans);
        if (expandedFlag) {
            display.textContent = roundToScreen(convertToExpanded(ans));
            operand1 = convertToDec(display.textContent);
        } else {
            ans = roundToScreen(ans);
            display.textContent = ans;
        }
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


        // operand1 = roundToScreen(operand1);
        // display.textContent = operand1;
        if (expandedFlag) {
            display.textContent = roundToScreen(convertToExpanded(operand1));
            operand1 = convertToDec(display.textContent);
        } else {
            operand1 = roundToScreen(operand1);
            display.textContent = operand1;
        }

    } else if (phase === "equalPressed" && operator) {
        operand2 = operand1;
        operand1 = operate(operator, operand2, storedOperand1);

        operand1 = roundToScreen(operand1);
        display.textContent = operand1;

        if (expandedFlag) {
            display.textContent = roundToScreen(convertToExpanded(operand1));
            operand1 = convertToDec(display.textContent);
        }
    } else if (phase === "operand2") {
        storedOperand1 = operand2;
        console.log("Heyo");

        operand1 = operate(operator, operand1, operand2);
        display.textContent = roundToScreen(operand1);

        if (expandedFlag) {
            display.textContent = roundToScreen(convertToExpanded(operand1));
            operand1 = convertToDec(display.textContent);
        } else {
            // ?
        }
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

function expandPress(e) {
    if (!Array.from(uiAbout.classList).includes("ui-hidden") ||
        !Array.from(uiHelp.classList).includes("ui-hidden")) {
        return
    }

    document.title = (document.title === "Calculator") ? "Converter" : "Calculator";
    expandedFlag = !expandedFlag;
    buttonsBasic.classList.toggle("ui-hidden");
    buttonsExpanded.classList.toggle("ui-hidden");
    uiBaseInputDiv.classList.toggle("ui-hidden");
    buttonExpand.classList.toggle("expanded");
    clearPress();

    if (Array.from(buttonsExpanded.classList).includes("ui-hidden")) {
        return;
    }

}

// so .1 + .2 can equal .3
function calculateWithDecimals(a,b,operation, operationText) {
    let aStr = a.toString();
    let bStr = b.toString();
    let aSteps = !aStr.includes(".") ? 0 : aStr.split(".")[1].length;
    let bSteps = !bStr.includes(".") ? 0 : bStr.split(".")[1].length;

    let tempAns;
    let finalSteps;

    // console.log(aStr, bStr);
    // console.log("Steps:", aSteps, bSteps);

    if (operationText === "add" || operationText === "subtract") {
        let maxSteps = Math.max(aSteps, bSteps);

        a *= (10 ** maxSteps);
        b *= (10 ** maxSteps);
        finalSteps = maxSteps;
    } else if (operationText === "multiply") {
        a *= (10 ** aSteps);
        b *= (10 ** bSteps);
        finalSteps = aSteps + bSteps;
    } else {
        a *= (10 ** aSteps);
        b *= (10 ** bSteps);
        finalSteps = aSteps - bSteps;
    }
    
    tempAns = operation(a,b);
    tempAns /= (10 ** (finalSteps));
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
        display.classList.add("error-msg");
        return;
    } else if (expandedFlag) {
        return parseInt(a / b);
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


function charToExpanded(i) {
    if (i < 10) {
        return i;
    } else if (i < 36) {
        return String.fromCharCode(97+i-10);
    } else {
        return String.fromCharCode(65+i-36);
    }
}

// Note: in ASCII, lowercase is greater than uppercase.
// However, I decided to not care
function charToDec(i) {
    if (i >= "0" && i <= "9") {
        return parseInt(i);
    } else if (i <= "X") {
        return i.charCodeAt() - 29;
    } else {
        return i.charCodeAt() - 87;
    }
}

function convertToDec(n) {
    let ans = 0;

    for (let i = 0; i < n.length; i++) {
        let current_digit = n.at(-1-i);
        ans += Number(charToDec(current_digit)) * (base ** i); 
    }

    return ans;
}

function convertToExpanded(n) {
    tempAns = "";
    let counter = 0;

    while (n > 0) {
        let new_digit = n % base;
        n = parseInt(n / base);

        tempAns = charToExpanded(new_digit) + tempAns;
    }

    return tempAns;

}

function baseChange(e) {
    if (e.key !== "Enter") {
        return;
    }

    newBase = parseInt(uiBaseInput.value);
    console.log(newBase);

    if (isNaN(newBase) || newBase < 2 || newBase > 60) {
        return;
    }

    uiBaseInput.value = "";
    uiBaseInput.blur();

    for (let i = 0; i < newBase; i++) {
        expandedButtons[i].style.display = "flex";
    }

    for (let i = newBase; i < 60; i++) {
        expandedButtons[i].style.display = "none";
    }

    let tempNum = convertToDec(display.textContent);
    base = newBase;
    display.textContent = roundToScreen(convertToExpanded(tempNum));
    // avoiding overflow issues
    tempNum = convertToDec(display.textContent);

    if (phase === "operand1") {
        operand1 = tempNum;
    } else if (phase === "operand2") {
        operand2 = tempNum;
    }
}

function windowKeypress(e) {
    if (document.activeElement === uiBaseInput) {
        if (e.key === "Tab") {
            e.preventDefault();
            baseChange({key: "Enter"});
        }
        return;
    }
    
    currentInput = e.key;

    if (currentInput === "c" && e.ctrlKey && expandedFlag) {

        navigator.clipboard.writeText(display.textContent);
        giveCopiedFeedback();
        return;
    } else if (currentInput === "v" && e.ctrlKey && expandedFlag) {
        let tempText;

        navigator.clipboard.readText().then((clipText) => {
            for (i in clipText) {
                if (!checkAlnum(clipText[i]) || !checkBaseFit(clipText[i])) {
                    return;
                }
            }
            display.textContent = roundToScreen(clipText);
            return;
        });
        
        return;
    }

    if (checkAlnum(currentInput)) {
        if ((!expandedFlag && checkNumeric(currentInput)) ||
            (expandedFlag && checkBaseFit(currentInput))) {
                digitPress({target: {textContent: currentInput}});
        }
    } else if (checkOperator(currentInput)) {
        let tempOperatorButton;

        switch (currentInput) {
            case "+":
                tempOperatorButton = expandedFlag ? 4 : 3;
                break;
            case "-":
                if (e.ctrlKey) {
                    if (!expandedFlag) {
                        signPress();
                    }
                    return;
                }

                tempOperatorButton = expandedFlag ? 5 : 2;
                break;
            case "*":
                tempOperatorButton = expandedFlag ? 6 : 1;
                break;
            case "/":
                tempOperatorButton = expandedFlag ? 7 : 0;
                break;
            default:
                console.log("How even?");
                break;
        }

        operatorPress({target: operatorButtons[tempOperatorButton]});
    } else if (currentInput === ".") {
        decimalPress();
    } else if (currentInput === "=" || currentInput === "Enter") {
        equalPress();
    } else if (currentInput === "Backspace") {
        backspacePress();
    } else if (currentInput === "Escape") {
        clearPress();
    } else if (currentInput === "Alt" && !expandedFlag) {
        sqrtPress();
    } else if (currentInput === " " && !expandedFlag) {
        signPress();
    } else if (currentInput === "Tab") {
        e.preventDefault();
        
        if (e.shiftKey) {
            expandPress();
        } else if (expandedFlag) {
            uiBaseInput.focus();
        }
    } else {
        console.log(e);
    }
}

// what
function checkAlnum(s) {
    return s.length === 1 && s.match(/^[a-zA-X0-9]+$/i);
}

function checkNumeric(s) {
    return s.match(/^[0-9]+$/i);
}

function checkLowercase(s) {
    return s.match(/^[a-z]+$/i);
}

function checkUppercase(s) {
    return s.match(/^[A-X]+$/i);
}

function checkBaseFit(s) {
    return (base > charToDec(s));
}

function checkOperator(s) {
    return s.match(/^[+\-*/]+$/i);
}

function giveCopiedFeedback() {
    copiedFeedback.style.animationName = "";

    setTimeout(() => {
        copiedFeedback.style.animationName = "copied-feedback";
    }, 1);
}

for (b of digitButtons) {
    b.addEventListener("mousedown", digitPress);
}

for (b of operatorButtons) {
    b.addEventListener("mousedown", operatorPress);
}

async function paste() {
  return navigator.clipboard.readText();
}


buttonEqual.addEventListener("mousedown", equalPress);
buttonBackspace.addEventListener("mousedown", backspacePress);
buttonClear.addEventListener("mousedown", clearPress);
buttonSign.addEventListener("mousedown", signPress);
buttonDecimal.addEventListener("mousedown", decimalPress);
buttonSqrt.addEventListener("mousedown", sqrtPress);

buttonExpEqual.addEventListener("mousedown", equalPress);
buttonExpBackspace.addEventListener("mousedown", backspacePress);
buttonExpClear.addEventListener("mousedown", clearPress);
uiBaseInput.addEventListener("keyup", baseChange);
window.addEventListener("keydown", windowKeypress);

buttonHelp.addEventListener("mousedown", (e) => {
    uiAbout.classList.add("ui-hidden");
    uiHelp.classList.toggle("ui-hidden");
});
buttonAbout.addEventListener("mousedown", (e) => {
    uiHelp.classList.add("ui-hidden");
    uiAbout.classList.toggle("ui-hidden");
});
buttonExpand.addEventListener("mousedown", expandPress);

for (let i = 0; i < 60; i++) {
    let new_i = charToExpanded(i);

    let tempButton = document.createElement("div");
    tempButton.classList.add("button", "digit-button", `button-${new_i}`);
    tempButton.textContent = new_i;
    digitRow.appendChild(tempButton);
}

const expandedButtons = document.querySelectorAll(".digit-row > .button");
console.log(expandedButtons);

for (b of expandedButtons) {
    b.addEventListener("mousedown", digitPress);
}

