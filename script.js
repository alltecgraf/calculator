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
                errorDetected = true;
            }
            result = divide(num1, num2);
            break;
        default: alert("OPERATOR ERROR");
            return clear();
    }

    if (isNaN(result)) {
        handleError("Result was not a number");
    }

    result = Math.round(result * 10 ** 10) / 10 ** 10

    visorDisplay.textContent = result;
    return result;
}

function handleNumberInput(inputValue) {
    // Only update display to empty after the input of a new number
    if (!currentNum) {
        visorDisplay.textContent = '';
    }

    // check if number is already a float
    if ((inputValue === '.') && (currentNum % 1 != 0)) {
        return;
    }

    let joiningArray = [currentNum, inputValue];

    currentNum = joiningArray.join('');
    visorDisplay.textContent = currentNum;
}

function handleNumberRemove() {
    if (currentNum) {
        currentNum = Math.floor(currentNum / 10);
        visorDisplay.textContent = currentNum;
    }
}

function handleError(message) {
    clear();
    errorDetected = false;
    throw new Error(message)
}

function handleOperationInput(value) {
    // if i already have an operator, do calculation
    // else, store operator for use after the input of second number 
    if (previousInput === value) {
        return;
    }

    // if previous input was a operation, replace current operator
    if (regexCaptureOperation.test(previousInput)) {
        operator = value;
    } else {
        if ((operator === '=') && (currentNum === '') && (regexCaptureNumber.test(previousInput))) {
            handleError("No numbers to do the operation");
        }

        if (operator) {
            prevNum = operate(prevNum, operator, parseFloat(currentNum));
            if (errorDetected) {
                handleError("Unable to divide number by zero");
            }
        } else {
            prevNum = parseFloat(currentNum);
            if (isNaN(prevNum)) {
                handleError("No numbers to do the operation");
            }
        }

        currentNum = setEmpty();
        operator = value;
    }
}

function handleCalculateButton(value) {
    if (!(previousInput === value)) {
        // do pending calculation
        handleOperationInput(value);

        // Reset calculator to inital state, store result for next calculation
        operator = setEmpty();
        currentNum = prevNum;
        prevNum = setEmpty();
    }
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
let errorDetected = false;
let previousInput = null;
const regexCaptureNumber = /[0-9]/; // capturing numbers from interval "[0-9]" (inclusive)
const regexCaptureOperation = /([\-*+/])/; // capturing operators "+" "-" "*" "/"


input.forEach(element => {
    if (element.getAttribute("class") === "button-remove") {
        element.addEventListener('click', handleNumberRemove);
    }
    else if (element.getAttribute("class") === "button-number"
        || element.getAttribute("class") === "button-operation") {
        element.addEventListener('click', inputToValue)
    }
    else if (element.getAttribute("class") === "button-reset") {
        element.addEventListener('click', clear);
    }
    else if (element.getAttribute("id") === "=") {
        element.addEventListener('click', handleCalculateButton)
    }
});

document.addEventListener('keydown', inputToValue)

function inputToValue(event) {
    let inputClass = null;
    let input = null;
    let inputStringToNumber = null;

    if (event.type === "keydown") {
        input = event.key;
        inputStringToNumber = parseInt(input);
    } else {
        inputClass = event.target.className;
        input = event.target.id;
        inputStringToNumber = parseInt(input);
    }

    if (regexCaptureNumber.test(inputStringToNumber) || inputClass === "button-number") {
            if (isNaN(inputStringToNumber)) {
                throw new Error("Input not a number");
            }
            handleNumberInput(inputStringToNumber);
        
    }
    else if (regexCaptureOperation.test(input) || inputClass === "button-operation") {
        handleOperationInput(input);
    }
    else if (inputClass === "button-calculate") {
        handleCalculateButton(input);
    } else {
        switch (input) {
            case '.':
                handleNumberInput(input);
            case "Enter":
            case '=':
                handleCalculateButton('=');
                break;
            case "Backspace":
                handleNumberRemove();
                break;
            case "Escape":
                clear();
                break;
            default: handleError("Input not defined");
        }
    }
    previousInput = input;
}

/* tests:
- somar dois números pequenos => gerar resultado exato                                                               OK!
- realizar um cálculo com as 4 operações básicas => gerar resultado exato                                            OK!
- dividir um número muito pequeno com um número muito grande => gerar resultado com 10 casas decimais                OK!
- dividir por 0 => throw error no console para não dividir por 0 e chamar o clear;                                   OK!
- chamar o operador + - / ou * sem número => throw error no console e chamar o clear                                 OK!
- colocar o mesmo operador duas vezes => nada acontecer e manter o mesmo operador e número já colocado               OK!
- colocar um operador e seguido de outro operador (diferente do primeiro) => substituir o operador antigo pelo novo  OK!
- apertar o REMOVE depois de clicar no igual => chamar o clear()                                                     OK!
- apertar o = sem input algum => nada acontecer e throw error no console                                             OK!
- apertar o = apenas um número => manter o mesmo número como resultado                                               OK!
- realizar alguma operação em cima de um resultado obtido => retornar o novo valor calculado                         OK!    
*/