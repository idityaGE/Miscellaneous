// callback are the fuction which is passed as an argument to another highorder fuction.
// callback fuction which perform some task which is performed when the highorder fuction done performing the some task

function great(name, callback) {
  console.log(`Hello, ${name}`)
  callback()
}

function sayGoodBye() {
  console.log("GoodBye")
}

great("Aditya", sayGoodBye)

const calculate = (a, b, callback) => {
  const result = a + b
  setTimeout(() => {
    callback(result)
  }, 2000);
}

function printResult(result) {
  console.log("the result is :", result)
}

calculate(5, 8, printResult)


// callback is also popular in Dom manipulation

document.getElementById("myButton").addEventListener("click", () => {
  console.log("myButton is Clicked")
})