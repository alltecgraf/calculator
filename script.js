function add(a, b) { return a + b; }

function subtract(a, b) { return a - b; }

function multiply(a, b) { return a * b; }

function divide(a, b) { return a / b; }

function setEmpty() { return ''; }

function operate(num1, operator, num2) {
    let result = 0;

    switch (operator) {
        case '+':
            result = add(num1, num2);
            break;
        case '-':
            result = subtract(num1, num2);
            break;
        case '*':
            result = multiply(num1, num2);
            break;
        case '/':
            if (num2 === 0) {
                alert("You shouldn't be doing that, dummy!");
                return null;
            }
            result = divide(num1, num2);
            break;
        default: alert("OPERATOR ERROR");
    }

    result = Math.round(result * 10 ** 10) / 10 ** 10

    visorDisplay.textContent = result;
    return result;
}

function handleNumberInput(event) {
    // Only update display to empty after the input of a new number
    if (!currentNum) {
        visorDisplay.textContent = '';
    }

    let input = event.target.textContent;

    if (input === '.' && currentNum.includes('.')) {
        return;
    }

    currentNum += input;
    visorDisplay.textContent = currentNum;
}

function handleNumberRemove(event) {
    if (currentNum) {
        currentNum = currentNum.substring(0, currentNum.length - 1);
        visorDisplay.textContent = currentNum;
    }
}

function handleOperationInput(event) {
    // if i already have an operator, do calculation
    // else, store operator for use after the input of second number 
    if (operator) {
        prevNum = operate(prevNum, operator, parseFloat(currentNum));
        if (prevNum === null) {
            return clear();
        }
    } else {
        prevNum = parseFloat(currentNum);
    }

    currentNum = setEmpty();
    operator = event.target.textContent;
}

function handleCalculateButton(event) {
    // do pending calculation
    handleOperationInput(event);

    // Reset calculator to inital state, store result for next calculation
    operator = setEmpty();
    currentNum = prevNum;
    prevNum = setEmpty();
}

function clear(event) {
    visorDisplay.textContent = '';
    prevNum = setEmpty();
    operator = setEmpty();
    currentNum = setEmpty();
}


const visorDisplay = document.querySelector('#visor');
const input = document.querySelectorAll('button');

let prevNum = setEmpty();
let operator = setEmpty();
let currentNum = setEmpty();

input.forEach(element => {
    if (element.getAttribute("class") === "button-reset") {
        element.addEventListener('click', clear);
    }
    else if (element.getAttribute("class") === "button-remove") {
        element.addEventListener('click', handleNumberRemove);
    }
    else if (element.getAttribute("class") === "button-number") {
        element.addEventListener('click', handleNumberInput)
    }
    else if (element.getAttribute("class") === "button-operation") {
        element.addEventListener('click', handleOperationInput);
    }
    else if (element.classList.contains("button-calculate")) {
        element.addEventListener('click', handleCalculateButton)
    }
});