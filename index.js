const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let value = "";
let justCalculated = false;

function showValue() {
    display.value = value || "0";
}

function getCleanValue(text) {
    return text.replace(/[^0-9+\-*/%.]/g, "");
}

function addValue(text) {
    if (justCalculated && !"+-*/%".includes(text)) {
        value = "";
    }

    justCalculated = false;

    if (text === "." && value.split(/[+\-*/%]/).pop().includes(".")) {
        return;
    }

    value += text;
    showValue();
}

function clearValue() {
    value = "";
    justCalculated = false;
    showValue();
}

function deleteValue() {
    value = value.slice(0, -1);
    showValue();
}

function calculate() {
    if (!value) {
        return;
    }

    if (!/^[0-9+\-*/%. ]+$/.test(value)) {
        display.value = "Error";
        value = "";
        return;
    }

    try {
        const answer = Function("return " + value)();

        if (!Number.isFinite(answer)) {
            throw new Error();
        }

        value = String(answer);
        display.value = value;
        justCalculated = true;
    } catch {
        display.value = "Error";
        value = "";
    }
}

buttons.forEach(function (button) {
    button.addEventListener("click", function () {
        if (button.dataset.value) {
            addValue(button.dataset.value);
            return;
        }

        if (button.dataset.action === "clear") {
            clearValue();
            return;
        }

        if (button.dataset.action === "delete") {
            deleteValue();
            return;
        }

        if (button.dataset.action === "calculate") {
            calculate();
        }
    });
});

display.addEventListener("input", function () {
    value = getCleanValue(display.value);
    justCalculated = false;
    display.value = value;
});

display.addEventListener("focus", function () {
    if (display.value === "0") {
        display.select();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.target === display) {
        if (event.key === "Enter" || event.key === "=") {
            event.preventDefault();
            calculate();
        }

        if (event.key === "Escape") {
            event.preventDefault();
            clearValue();
        }

        return;
    }

    if ("0123456789.+-*/%".includes(event.key)) {
        addValue(event.key);
        return;
    }

    if (event.key === "Enter" || event.key === "=") {
        calculate();
        return;
    }

    if (event.key === "Backspace") {
        deleteValue();
        return;
    }

    if (event.key === "Escape") {
        clearValue();
    }
});
