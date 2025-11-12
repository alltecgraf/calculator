function add(a, b) { return a + b; }

function subtract(a, b) { return a - b; }

function multiply(a, b) { return a * b; }

function divide(a, b) { return a / b; }

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
            result = divide(num1, num2);
            break;
        default: alert("OPERATOR ERROR");
    }

    visorDisplay.textContent = result;
    return result;
}

function handleNumberInput(event) {
    // Only update display to empty after the input of a new number
    if (!currentNum) {
        visorDisplay.textContent = '';
    }

    let input = event.target.textContent;
    currentNum += input;
    visorDisplay.textContent = currentNum;
}

function handleOperationInput(event) {
    // if i already have an operator, do calculation
    // else, store operator for use after the input of second number 
    if (operator) {
        prevNum = operate(prevNum, operator, parseFloat(currentNum));
    } else {
        prevNum = parseFloat(currentNum); 
    }

    currentNum = resetNum();
    operator = event.target.textContent;
}

function handleCalculateButton(event) {
    // do pending calculation
    handleOperationInput(event);

    // Reset calculator to inital state, store result for next calculation
    operator = null;
    currentNum = prevNum;
    prevNum = resetNum()
}

function clear(event) {
    visorDisplay.textContent = '';
    prevNum;
    currentNum = resetNum();
}

function resetNum() { return ''; }

const visorDisplay = document.querySelector('#visor');
const input = document.querySelectorAll('button');

let prevNum;
let operator;
let currentNum = resetNum();

input.forEach(element => {
    if (element.getAttribute("class") === "button-reset") {
        element.addEventListener('click', clear);
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