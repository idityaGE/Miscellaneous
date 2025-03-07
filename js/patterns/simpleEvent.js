

const doSomething = async (event = {}) => {
  console.log("Doing Something...")

  try {
    await new Promise((res, rej) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          res("Done !")
        } else {
          rej("Fucked up !!")
        }
      }, 2000);
    })

    if (event.onSucess && typeof event.onSucess === 'function') {
      event.onSucess("Operation was success")
    }
  } catch (error) {
    if (event.onFailure && typeof event.onFailure === "function") {
      event.onFailure(error)
    }
  }
}

doSomething({
  onSucess: (result) => console.log("Success handler:", result),
  onFailure: (error) => console.log("Error handler", error)
})