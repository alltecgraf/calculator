function add(a, b) { return a + b; }

function subtract(a, b) { return a - b; }

function multiply(a, b) { return a * b; }

function divide(a, b) { return a / b; }

function setEmpty() { return ''; }

function resetTest() {
    clear();
    TEST_clearWasCalled = false;
}

Number.prototype.countDecimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
}

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
            clear();
            return;
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

    clearWasCalled = true;
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

let TEST_clearWasCalled = false // variável de teste

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
                break;
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


function validateReliability() {
    // somar dois números pequenos => gerar resultado exato
    let validateA = (operate(2, '+', 5) === 7);
    resetTestClearFlag();

    // realizar um cálculo com as 4 operações básicas => gerar resultado exato         
    let resultOne = operate(2, '+', 35); // partial result: 40 
    let resultTwo = operate(resultOne, '-', 43); // partial result: -3 
    let resultThree = operate(resultTwo, '/', 53); // partial result: -0.0566037736 
    let resultFour = operate(resultThree, '*', 7); // final result: -0.3962264151
    let validateB = (resultFour === -0.3962264151);
    resetTestClearFlag();

    // dividir um número muito pequeno com um número muito grande => gerar resultado com 10 casas decimais  => o operate é o responsável por arredondar o número
    let validateC = ((operate(3, '/', 9)).countDecimals() === 10);
    resetTestClearFlag();

    // dividir por 0 => throw error no console para não dividir por 0 e chamar o clear;           
    (operate(3, '/', 0))
    let validateD = TEST_clearWasCalled;
    resetTestClearFlag();

    // chamar o operador + - / ou * sem número => throw error no console e chamar o clear               
    (handleOperationInput('+'));
    let validateE = TEST_clearWasCalled;
    resetTestClearFlag();

    // colocar o mesmo operador duas vezes => nada acontecer e manter o mesmo operador e número já colocado   
    document.getElementById('+').click(); // simulei um evento para atualizar o previousInput, que faz parte do handling de inputs repetidos
    document.getElementById('+').click();
    let validateF = ((operator === '+') && !(TEST_clearWasCalled)); // testa se o clear não foi chamado e se o operador corresponde com o selecionado
    resetTestClearFlag();

    // colocar um operador e seguido de outro operador (diferente do primeiro) => substituir o operador antigo pelo novo 
    document.getElementById('+').click();
    document.getElementById('-').click();
    let validateG = (operator === '-'); // testa se o operador corresponde com o selecionado

    // apertar o REMOVE depois de clicar no igual => chamar o clear()               
    document.getElementById('=').click();
    document.getElementById('delete').click();
    let validateH = TEST_clearWasCalled;
    resetTest();

    // apertar o = sem input algum => nada acontecer e throw error no console        
    document.getElementById('=').click();
    let validateI = TEST_clearWasCalled;
    resetTestClearFlag();

    // apertar o = com apenas um input => manter o mesmo número como resultado          
    document.getElementById('9').click();
    document.getElementById('2').click();
    document.getElementById('=').click();
    let validateJ = (currentNum === 92);
    resetTest();

    // realizar alguma operação em cima de um resultado obtido => retornar o novo valor calculado
    document.getElementById('9').click();
    document.getElementById('2').click();
    document.getElementById('=').click();
    document.getElementById('+').click();
    document.getElementById('5').click();
    document.getElementById('=').click();
    let validateK = (currentNum === 97);
    resetTest();
}

