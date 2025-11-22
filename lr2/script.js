// файл script.js
window.onload = function(){ 

let a = ''
let b = ''
let expressionResult = ''
let selectedOperation = null
let lastResult = '' // Для хранения предыдущего результата

// окно вывода результата
outputElement = document.getElementById("result")

// список объектов кнопок циферблата (id которых начинается с btn_digit_)
digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]')

function onDigitButtonClicked(digit) {
    if (!selectedOperation) {
        if ((digit != '.') || (digit == '.' && !a.includes(digit))) { 
            a += digit
        }
        outputElement.innerHTML = a
    } else {
        if ((digit != '.') || (digit == '.' && !b.includes(digit))) { 
            b += digit
            outputElement.innerHTML = b        
        }
    }
}

// устанавка колбек-функций на кнопки циферблата по событию нажатия
digitButtons.forEach(button => {
    button.onclick = function() {
        const digitValue = button.innerHTML
        onDigitButtonClicked(digitValue)
    }
});

// установка колбек-функций для кнопок операций
document.getElementById("btn_op_mult").onclick = function() { 
    if (a === '') return
    // Если есть предыдущая операция, выполняем её перед установкой новой
    if (selectedOperation && b !== '') {
        calculateResult()
    }
    selectedOperation = 'x'
}
document.getElementById("btn_op_plus").onclick = function() { 
    if (a === '') return
    // Если есть предыдущая операция, выполняем её перед установкой новой
    if (selectedOperation && b !== '') {
        calculateResult()
    }
    selectedOperation = '+'
}
document.getElementById("btn_op_minus").onclick = function() { 
    if (a === '') return
    // Если есть предыдущая операция, выполняем её перед установкой новой
    if (selectedOperation && b !== '') {
        calculateResult()
    }
    selectedOperation = '-'
}
document.getElementById("btn_op_div").onclick = function() { 
    if (a === '') return
    // Если есть предыдущая операция, выполняем её перед установкой новой
    if (selectedOperation && b !== '') {
        calculateResult()
    }
    selectedOperation = '/'
}

// кнопка очищения
document.getElementById("btn_op_clear").onclick = function() { 
    a = ''
    b = ''
    selectedOperation = ''
    expressionResult = ''
    lastResult = ''
    outputElement.innerHTML = 0
}

// функция вычисления результата (вынесена для повторного использования)
function calculateResult() {
    if (a === '' || !selectedOperation)
        return
        
    // Если b пустое, используем предыдущее значение b или a для накапливаемых операций
    if (b === '' && lastResult !== '') {
        b = lastResult
    } else if (b === '') {
        return // Нельзя выполнить операцию без второго числа
    }
    
    switch(selectedOperation) { 
        case 'x':
            expressionResult = (+a) * (+b)
            break;
        case '+':
            expressionResult = (+a) + (+b)
            break;
        case '-':
            expressionResult = (+a) - (+b)
            break;
        case '/':
            if (b === '0') {
                outputElement.innerHTML = 'Ошибка'
                a = ''
                b = ''
                selectedOperation = null
                return
            }
            expressionResult = (+a) / (+b)
            break;
    }
    
    lastResult = b // Сохраняем второе число для накапливаемых операций
    a = expressionResult.toString()
    b = ''
    
    outputElement.innerHTML = a
}

// кнопка расчёта результата
document.getElementById("btn_op_equal").onclick = function() { 
    calculateResult()
    selectedOperation = null
    lastResult = '' // Сбрасываем после нажатия равно
}

document.getElementById("btn_op_sign").onclick = function() {
    if (!selectedOperation) {
        if (a !== '') {
            if (a === '0') {
                outputElement.innerHTML = a;
            }
            if (a.startsWith('-')) {
                a = a.slice(1);    // Убираем первый символ (минус)
                outputElement.innerHTML = a;
            } else {
                a = '-' + a;       // Добавляем минус в начало
                outputElement.innerHTML = a;
            }
        }
    } else {
        if (b !== '') {
            if (b === '0') {
                outputElement.innerHTML = b;
            }
            if (b.startsWith('-')) {
                b = b.slice(1);    // Убираем первый символ (минус)
                outputElement.innerHTML = b;
            } else {
                b = '-' + b;       // Добавляем минус в начало
                outputElement.innerHTML = b;
            }
        }
    }
}

document.getElementById("btn_op_percent").onclick = function() {
    if (!selectedOperation) {
        if (a !== '') {
            a = a / 100
            outputElement.innerHTML = a;
        }
    } else {
        if (b !== '') {
            b = b / 100
            outputElement.innerHTML = b;
        }
    }
}

document.getElementById('btn_darktheme').addEventListener('click', function() {
    const currentTheme = document.body.className;
    if (currentTheme === 'light-theme') {
        document.body.className = 'dark-theme';
    } else {
        document.body.className = 'light-theme';
    }
});

document.getElementById("btn_root").onclick = function() {
    if (!selectedOperation){
        if (a != ''){
            a = a ** 0.5
            outputElement.innerHTML = a;
        }
    } else {
        if (b != ''){
            b = b ** 0.5
            outputElement.innerHTML = b;
        }
    }
}

document.getElementById("btn_square").onclick = function() {
    if (!selectedOperation){
        if (a != ''){
            a = a ** 2
            outputElement.innerHTML = a;
        }
    } else {
        if (b != ''){
            b = b ** 2
            outputElement.innerHTML = b;
        }
    }

}

document.getElementById("btn_fact").onclick = function() {
    if (!selectedOperation){
        if (a != 0){
            let a1 = 1
            for (let i = 1; i <= a; i++) {
                a1 *= i
            }
            outputElement.innerHTML = a1;
        }
    } else {
        if (b != 0){
            let b1 = 1
            for (let i = 1; i <= b; i++) {
                b1 *= i
            }
            outputElement.innerHTML = b1;
        }
    }
}

document.getElementById("btn_3zero").onclick = function() {
    if (!selectedOperation){
        if (a != ''){
            a = a + '000'
            outputElement.innerHTML = a;
        }
    } else {
        if (b != ''){
            b = b + '000'
            outputElement.innerHTML = b;
        }
    }

}

document.getElementById("btn_pi").onclick = function() {
    if (!selectedOperation){
        if (true){
            a = Math.PI
            outputElement.innerHTML = a;
        }
    } else {
        if (true){
            b = Math.PI
            outputElement.innerHTML = b;
        }
    }

}

document.getElementById("btn_change").onclick = function() {
    const resultElement = document.getElementById("result");
    
    // Если сейчас серый - меняем на желтый, и наоборот
    if (resultElement.classList.contains('grey')) {
        resultElement.classList.remove('grey');
        resultElement.classList.add('yellow');
    } else {
        resultElement.classList.remove('yellow');
        resultElement.classList.add('grey');
    }
}

};