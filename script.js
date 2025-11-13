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

function handleNumberInput(value) {
    // Only update display to empty after the input of a new number
    if (!currentNum) {
        visorDisplay.textContent = '';
    }

    if (value === '.' && currentNum.includes('.')) {
        return;
    }

    currentNum += value;
    visorDisplay.textContent = currentNum;
}

function handleNumberRemove() {
    if (previousInput === '=') {
        clear();
    }
    else if (currentNum) {
        currentNum = currentNum.substring(0, currentNum.length - 1);
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
const regexCaptureNumber = /([0-9.])/g; // capturing numbers from interval "[0-9]" (inclusive) and the "." operator
const regexCaptureOperation = /([\-*+/])/g; // capturing operators "+" "-" "*" "/"


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

    if (event.type === "keydown") {
        input = event.key
    } else {
        inputClass = event.target.className;
        input = event.target.id;
    }

    if (regexCaptureNumber.test(input) || event.target.className === "button-number") {
        if (input === '.') {
            handleNumberInput(input);
        } else {
            let number = parseFloat(input);

            if (isNaN(number)) {
                throw new Error("Input not a number");
            }
            handleNumberInput(number);
        }
    }
    else if (regexCaptureOperation.test(input) || inputClass === "button-operation") {
        handleOperationInput(input);
    }
    else if (inputClass = "button-calculate") {
        handleOperationCalculate(input);
    }
    else if (input === "Enter") {
        handleOperationCalculate('=');
    }
    else if (input === "Backspace") {
        handleNumberRemove();
    }
    else if (input === "Escape") {
        clear();
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
- realizar alguma operação em cima de um resultado obtido => retornar o novo valor calculado


Boa tarde, @canal! Seguindo no projeto de calculadora, construí em conjunto com o Miguel uma série de testes que a calculadora deveria reproduzir de forma satisfatória, lidando com comportamentos adiversos (como divisões por 0, repetição de operadores,  cálculos com inputs faltantes, etc).

Além disso, foram inclusas algumas novas funcionalidades, como:
suporte a input pelo teclado;
botão RMV, para remover um dígito do número sendo digitado;
botão CLEAR para reiniciar a calculadora;
botão de "." para operações com decimais.

Segue vídeo demonstrativo! 
*/

// chamar as funções de forma individual com os valores para ver se retorna o que é esperado