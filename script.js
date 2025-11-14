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

function logTest(testName, operation, result, expected, expectedBehavior, verdict) {
    const logDiv = document.createElement("div");
    logDiv.setAttribute('class', 'log-text')
    logDiv.style.whiteSpace = 'pre-wrap';
    logDiv.style.width = '300px';
    logDiv.style.margin = '0 5px';
    logDiv.textContent = `\n${testName}`
        + `\nOperation Order: ${operation}`
        + `\nResult: ${result}`
        + `\nExpected: ${expected}`
        + `\nExpected Behavior: ${expectedBehavior}`
        + `\nTest Approved: `;

    const verdictSpan = document.createElement('span');
    verdictSpan.textContent = (verdict ? "true" : "false");
    verdictSpan.style.color = (verdict ? "green" : "red");

    logDiv.appendChild(verdictSpan);
    testContainer.appendChild(logDiv);
}

function validateReliability() {
    if (validateAlreadyPressed) {
        const logDivList = document.querySelectorAll('class', 'log-text')
        logDivList.forEach(element => element.removeChild())
    }

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

    let numberA = 142;
    let numberB = 21.42365;
    // somar dois números pequenos => gerar resultado exato

    let calculatorSumResult = operate(numberA, '+', numberB)
    let sumResult = numberA + numberB;

    validateSmallSum = (calculatorSumResult === sumResult);
    logTest("Sum of floats", `${numberA} + ${numberB}`, calculatorSumResult, sumResult, "Return exact sum", validateSmallSum);
    resetTest();

    // realizar um cálculo com as 4 operações básicas => gerar resultado exato  
    let a = 5;
    let b = 35;
    let c = 43;
    let d = 24;       
    let resultOne = operate(a, '+', b); // partial result: 40 
    let resultTwo = operate(resultOne, '-', c); // partial result: -3 
    let resultThree = operate(resultTwo, '/', d); // partial result: -0.125
    let resultFour = operate(resultThree, '*', resultThree); // final result: 0.015625
    let finalResult = 0.015625;
    validateAllOperations = (resultFour === finalResult);
    logTest("Use All Operations", `${a} + ${b} - ${c} / ${d} * ${resultThree}`, resultFour, finalResult, "Return exact calculation", validateAllOperations);
    resetTest();

    // dividir um número muito pequeno com um número muito grande => gerar resultado com 10 casas decimais  => o operate é o responsável por arredondar o número
    let numberCalcDivision = (operate(numberA, '/', numberB));
    let numberDivision = Math.round((numberA / numberB) * 10 ** 10) / (10 ** 10)
    validateDivRounding = (numberCalcDivision === numberDivision);
    logTest("Rounding in random division", `${numberA} / ${numberB}`, numberCalcDivision, numberDivision, "Return a rounded division with 10 decimal places", validateDivRounding);
    resetTest();

    // dividir por 0 => throw error no console para não dividir por 0 e chamar o clear;           
    try {
        (operate(numberA, '/', 0));
    }
    catch (e) {
        validateDivByZero = true;
    }
    logTest("Division by zero", `${numberA} / 0`, "See Verdict", "true", "Throw error on Console and call Clear function", validateDivByZero);
    resetTest();

    // chamar o operador + - / ou * sem número => throw error no console e chamar o clear               
    try {
        handleOperationInput('/');
    } catch (e) {
        validateEmptyInputOperation = true;
    }
    logTest("Call operator without input", '/', "N/A", "true", "Throw error on Console and call Clear function", validateEmptyInputOperation);
    resetTest();

    // colocar o mesmo operador duas vezes => nada acontecer e manter o mesmo operador e número já colocado   
    handleNumberInput(numberA);
    handleOperationInput('+');
    previousInput = '+'; // precisei setar previous input por fazer parte do handling de inputs repetidos
    handleOperationInput('+');
    handleNumberInput(numberB);
    previousInput = numberB;
    handleCalculateButton();
    let sameOpResult = currentNum;
    validateRepeatOperation = (sameOpResult === sumResult); // testa se o clear não foi chamado e se o operador corresponde com o selecionado
    logTest("Call same operator twice", `${numberA} + + ${numberB} = `, sameOpResult, sumResult, "Keep operator", validateRepeatOperation);
    resetTest();

    // colocar um operador seguido de outro operador (diferente do primeiro) => substituir o operador antigo pelo novo 
    handleNumberInput(numberA);
    handleOperationInput('+');
    previousInput = '+';
    handleOperationInput('-');
    previousInput = '-';
    handleNumberInput(numberB);
    previousInput = numberB;
    handleCalculateButton();
    let replaceOpResult = currentNum;
    let subtractNumbers = numberA - numberB;
    validateReplaceOperation = (replaceOpResult === subtractNumbers); // testa se o clear não foi chamado e se o operador corresponde com o selecionado
    logTest("Call different operators in succession", `${numberA} + - ${numberB}`, replaceOpResult, subtractNumbers, "Keep last operator", validateReplaceOperation);

    resetTest();

    // apertar o REMOVE depois de clicar no igual => verificar se foi removido o último digito do resultado               
    handleNumberInput(a);
    handleOperationInput('+');
    handleNumberInput(b);
    handleCalculateButton();
    previousInput = '=';
    handleNumberRemove();
    let expectedValue = Math.floor((a + b)/10); // removing last digit of 11
    validateDelAfterCalc = (currentNum === expectedValue);
    logTest("Call RMV immediately after obtaining calculation results", `${a} + ${b} = RMV`, currentNum, expectedValue, "Remove last digit of result", validateDelAfterCalc);
    resetTest();

    // apertar o = sem input algum => nada acontecer visualmente e throw error no console        
    try {
        handleOperationInput('=')
    } catch (e) {
        validateEmptyInputCalc = true;
    }
    logTest("Call calculate with no input", "=", "N/A", "N/A", "Throw error on console", validateEmptyInputCalc);
    resetTest();

    // apertar o = com apenas um input => manter o mesmo número como resultado          
    handleNumberInput(a);
    handleNumberInput(b);
    handleCalculateButton();
    let expectedInput = parseFloat(`${a}` + `${b}`);
    validateOneInputCalc = (currentNum === expectedInput);
    logTest("Calculate with only one input", `${a}${b} = `, currentNum, expectedInput, "Return same number as result", validateOneInputCalc);
    resetTest();

    // realizar alguma operação em cima de um resultado obtido => retornar o novo valor calculado
    handleNumberInput(a);
    handleOperationInput('+');
    handleNumberInput(b);
    handleCalculateButton();
    previousInput = '=';
    handleOperationInput('+');
    handleNumberInput(c);
    previousInput = c;
    handleCalculateButton();
    let expectedCalc = a + b + c
    validateOperateOverCalc = (currentNum === expectedCalc);
    logTest("Operation over result", `${a} + ${b} + ${c}`, currentNum, expectedCalc, "Do new operation directly after calculation result", validateOperateOverCalc);
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
let validateAlreadyPressed = false
const testContainer = document.querySelector(".reliability-container");