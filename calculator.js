let operator;
let operator_status = "-1";
let dot_status = "0";
let is_equal = false;
let res;

const last_operation = document.querySelector(".last_operation");
const result = document.querySelector(".result");

const nums_opers = document.querySelectorAll("[data-key], [data-operator]");
nums_opers.forEach((el) => el.addEventListener("click", setOperand));

const equal = document.querySelector("#equal");
equal.addEventListener("click", operate);

const del = document.querySelector("#del");
del.addEventListener("click", deleter);

const clear_all = document.querySelector("#ac");
clear_all.addEventListener("click", cleaner);

const dot_button = document.querySelector("#dot");
dot_button.addEventListener("click", set_dot);

document.addEventListener("keydown", handleKeyboardInput);

function handleKeyboardInput(e) {
  if (e.key >= 0 && e.key <= 9) setOperand(e);
  if (e.key === ".") set_dot();
  if (e.key === "=" || e.key === "Enter") operate();
  if (e.key === "Backspace") deleter();
  if (e.key === "Escape") cleaner();
  if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
    setOperand(e);
  }
}

function setOperand(e) {
  let type;
  let value;
  if (e.target.dataset?.operator) {
    type = "operator";
    value = e.target.textContent;
  } else if (["+", "-", "*", "/"].includes(e.key)) {
    type = "operator";
    value = e.key;
  } else if (e.target.dataset?.key) {
    type = "key";
    value = e.target.textContent;
  } else if (0 <= +e?.key <= 9) {
    type = "key";
    value = e.key;
  }
  if (type && value) {
    if (type === "key" && !is_equal) {
      if (operator_status === "-1") {
        operator_status = "0";
      } else if (operator_status === "1") {
        operator = last_operation.textContent.at(-2);
        operator_status = "2";
      }
      last_operation.textContent += value;
    } else if (type === "operator") {
      if (operator_status === "-1") {
        last_operation.textContent += " " + value + " ";
        operator_status = "0";
      } else if (operator_status === "0") {
        operator_status = "1";
        dot_status = "1";
        last_operation.textContent += " " + value + " ";
      } else if (operator_status === "1") {
        last_operation.textContent =
          last_operation.textContent.slice(0, -3) + " " + value + " ";
      } else if (operator_status === "2" && is_equal) {
        cleaner();
        operator_status = "1";
        dot_status = "1";
        last_operation.textContent = res + " " + value + " ";
        operator = value;
      }
    }
  }
}

function operate() {
  let minus_ind = last_operation.textContent.indexOf("-");
  let [n1, n2] = last_operation.textContent
    .split(operator)
    .filter((el) => !["", " "].includes(el))
    .map((el, ind) => {
      if ([0, 1].includes(minus_ind)) {
        tmp = el.replaceAll(" ", "");
        if (ind == 0 && operator == "-") return +("-" + tmp);
        return +tmp;
      }
      return +el;
    });
  if (!is_equal && operator_status === "2") {
    is_equal = true;
    switch (operator) {
      case "/":
        if (n2 == 0) {
          is_equal = false;
          alert("NO!!!");
          return;
        } else res = n1 / n2;
        break;
      case "*":
        res = n1 * n2;
        break;
      case "-":
        res = n1 - n2;
        break;
      case "+":
        res = n1 + n2;
        break;
    }
    res = String(res).indexOf(".") != -1 ? res.toFixed(2) : res;
    result.textContent = res;
  }
}

function cleaner() {
  operator = "";
  operator_status = "-1";
  dot_status = "0";
  is_equal = false;
  last_operation.textContent = "";
  result.textContent = "";
}

function deleter() {
  console.log(dot_status);
  if (!is_equal) {
    if (last_operation.textContent.at(-1) == " ") {
      last_operation.textContent = last_operation.textContent.slice(0, -3);
      operator_status = "0";
    } else if (last_operation.textContent.lastIndexOf(".") != -1) {
      if (dot_status === "2") {
        dot_status = "1";
      } else if (dot_status === "1") {
        dot_status = "0";
      }
      last_operation.textContent = last_operation.textContent.slice(0, -1);
    } else {
      last_operation.textContent = last_operation.textContent.slice(0, -1);
    }
  }
}

function set_dot() {
  if (dot_status === "0" && operator_status === "-1") {
    last_operation.textContent += "0.";
    operator_status = "0";
    dot_status = "1";
  } else if (dot_status === "0" && operator_status === "0") {
    if ([" "].includes(last_operation.textContent.at(-1))) {
      last_operation.textContent += "0.";
    } else last_operation.textContent += ".";
    dot_status = "1";
  } else if (dot_status === "1" && operator_status === "1") {
    operator_status = "2";
    dot_status = "2";
    operator = last_operation.textContent.at(-2);
    last_operation.textContent += "0.";
  } else if (operator_status === "2" && dot_status === "1") {
    dot_status = "2";
    last_operation.textContent += ".";
  }
}
