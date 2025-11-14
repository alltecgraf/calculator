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
            clear();
            return;
    }

    if (isNaN(result) || (errorDetected)) {
        handleError("Result was not a number");
    }

    result = Math.round(result * 10 ** 10) / (10 ** 10)

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

function handleCalculateButton() {
    if (!(previousInput === '=')) {
        // do pending calculation
        handleOperationInput('=');

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
        handleCalculateButton();
    } else {
        switch (input) {
            case '.':
                handleNumberInput(input);
                break;
            case "Enter":
            case '=':
                handleCalculateButton();
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

function resetTest() {
    clear();
    TEST_clearWasCalled = false;
    errorDetected = false;
    previousInput = null;
}

function logTest(testName, result, expected, verdict) {
    const logDiv = document.createElement("div");
    logDiv.style.whiteSpace = 'pre-wrap';
    logDiv.textContent = `\n${testName}`
        + `\nResult: ${result}`
        + `\nExpected: ${expected}`
        + `\nTest Approved: `;

    const verdictSpan = document.createElement('span');
    verdictSpan.textContent = (verdict ? "true" : "false");
    verdictSpan.style.color = (verdict ? "green" : "red");

    logDiv.appendChild(verdictSpan);

    testContainer.appendChild(logDiv)

    testContainer.appendChild(logDiv);
}

function validateReliability() {
    // existe forma melhor de inicializar todas dessa forma?
    let validateSmallSum = false;
    let validateAllOperations = false;
    let validateDivRounding = false;
    let validateDivByZero = false;
    let validateEmptyInputOperation = false;
    let validateRepeatOperation = false;
    let validateReplaceOperation = false;
    let validateDelAfterCalc = false;
    let validateEmptyInputCalc = false;
    let validateOneInputCalc = false;
    let validateOperateOverCalc = false;

    let numberA = (Math.random() * 100);
    let numberB = (Math.random() * 100);

    // somar dois números pequenos => gerar resultado exato
    let calculatorSumResult = operate(numberA, '+', numberB)
    let roundedSumResult = Math.round((numberA + numberB) * 10 ** 10) / 10 ** 10

    validateSmallSum = (calculatorSumResult === roundedSumResult);
    logTest("Sum of Random Numbers", calculatorSumResult, roundedSumResult, validateSmallSum);
    resetTest();

    // realizar um cálculo com as 4 operações básicas => gerar resultado exato         
    let resultOne = operate(5, '+', 35); // partial result: 40 
    let resultTwo = operate(resultOne, '-', 43); // partial result: -3 
    let resultThree = operate(resultTwo, '/', 24); // partial result: -0.125
    let resultFour = operate(resultThree, '*', resultThree); // final result: 0.015625
    let finalResult = 0.015625;
    validateAllOperations = (resultFour === finalResult);
    logTest("Use All Operations", resultFour, finalResult, validateAllOperations);
    resetTest();

    // dividir um número muito pequeno com um número muito grande => gerar resultado com 10 casas decimais  => o operate é o responsável por arredondar o número
    let randomCalcDivision = (operate(numberA, '/', 9));
    let randomDivision = Math.round((numberA / 9) * 10 ** 10) / (10 ** 10)
    validateDivRounding = (randomCalcDivision === randomDivision);
    logTest("Rounding in random division", randomCalcDivision, randomDivision, validateDivRounding);
    resetTest();

    // dividir por 0 => throw error no console para não dividir por 0 e chamar o clear;           
    try {
        (operate(3, '/', 0));
    }
    catch (e) {
        validateDivByZero = true;
    }
    logTest("Division by zero", "See Verdict", "Throw error on Console and call Clear function", validateDivByZero);
    resetTest();

    // chamar o operador + - / ou * sem número => throw error no console e chamar o clear               
    try {
        operate(3, '/', 0);
    } catch (e) {
        validateEmptyInputOperation = true;
    }
    logTest("Call operator without input", "See Verdict", "Throw error on Console and call Clear function", validateEmptyInputOperation);
    resetTest();

    // colocar o mesmo operador duas vezes => nada acontecer e manter o mesmo operador e número já colocado   
    handleNumberInput(numberA);
    handleOperationInput('+');
    previousInput = '+'; // precisei setar previous input por fazer parte do handling de inputs repetidos
    handleOperationInput('+');
    validateRepeatOperation = ((operator === '+') && (!(TEST_clearWasCalled))); // testa se o clear não foi chamado e se o operador corresponde com o selecionado
    logTest("Call same operator twice", "See Verdict", "Keep operator", validateRepeatOperation);
    resetTest();

    // colocar um operador seguido de outro operador (diferente do primeiro) => substituir o operador antigo pelo novo 
    handleNumberInput(numberB);
    handleOperationInput('+');
    previousInput = '+';
    handleOperationInput('-');
    validateReplaceOperation = ((operator === '-') && (!(TEST_clearWasCalled))); // testa se o clear não foi chamado e se o operador corresponde com o selecionado
    logTest("Call different operators in succession", "See Verdict", "Keep last operator", validateReplaceOperation);

    resetTest();

    // apertar o REMOVE depois de clicar no igual => verificar se foi removido o último digito do resultado               
    handleNumberInput(9);
    handleOperationInput('+');
    handleNumberInput(2);
    handleCalculateButton();
    previousInput = '=';
    handleNumberRemove();
    let expectedValue = 1; // removing last digit of 11
    validateDelAfterCalc = (currentNum === expectedValue);
    logTest("Call RMV immediately after obtaining calcutation results", currentNum, expectedValue, validateDelAfterCalc);
    resetTest();

    // apertar o = sem input algum => nada acontecer visualmente e throw error no console        
    try {
        handleOperationInput('=')
    } catch (e) {
        validateEmptyInputCalc = true;
    }
    logTest("Call calculate with no input", "See Verdict", "Throw error on console", validateEmptyInputCalc);
    resetTest();

    // apertar o = com apenas um input => manter o mesmo número como resultado          
    handleNumberInput(9);
    handleNumberInput(2);
    handleCalculateButton();
    let expectedInput = 92;
    validateOneInputCalc = (currentNum === expectedInput);
    logTest("Call calculate with only one number on input", validateOneInputCalc, expectedInput, validateOneInputCalc);
    resetTest();

    // realizar alguma operação em cima de um resultado obtido => retornar o novo valor calculado
    handleNumberInput(6);
    handleOperationInput('+');
    handleNumberInput(5);
    handleCalculateButton();
    previousInput = '=';
    handleOperationInput('+');
    handleNumberInput(4);
    previousInput = 4;
    handleCalculateButton();
    let opAfterCalcResult = currentNum;
    let expectedCalc = 6 + 5 + 4
    validateOperateOverCalc = (opAfterCalcResult === expectedCalc);
    logTest("Do new operation directly after calculation result", opAfterCalcResult, expectedCalc, validateOperateOverCalc);
    resetTest();
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
        element.addEventListener('click', inputToValue);
    }
    else if (element.getAttribute("class") === "button-reset") {
        element.addEventListener('click', clear);
    }
    else if (element.getAttribute("id") === "=") {
        element.addEventListener('click', handleCalculateButton);
    }
});

document.addEventListener('keydown', inputToValue);

validateButton = document.querySelector(".validate-reliability");

validateButton.addEventListener('click', validateReliability);
const testContainer = document.querySelector(".reliability-container");