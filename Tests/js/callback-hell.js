// Callback hell in js is the situation in which multiple nested callbacks are used to handle an asynchronous operations.
// these callback hell make the code dificult to understand, maintain and make it error prone

// When it happen: lets assume you have series of task to do where next result is dependent on previous one.

function fetchData(onFetchComplete) {
  setTimeout(() => {
    console.log("Data fetched")
    onFetchComplete((onProcessComplete) => {
      console.log("Processing data ...")
      setTimeout(() => {
        onProcessComplete(() => {
          setTimeout(() => {
            console.log("Process Complete")
          }, 1000);
        })
      }, 1000)
    })
  }, 1000)
}

fetchData((onFetchComplete) => {
  onFetchComplete((onProcessComplete) => {
    onProcessComplete(() => {
    })
  })
})

// Solution there are two 
/**
 * 1. Promises
 * 2. async/await
 */

// 1. Promises

function fetchData() {
  return new Promise((res, rej) => { // simulating an asynchronus process
    setTimeout(() => {
      console.log("Data Fetched")
      res("result1")
    }, 1000)
  })
}
function processData() {
  return new Promise((res, rej) => { // simulating an asynchronus process
    setTimeout(() => {
      console.log("Processing Data...")
      res("result2")
    }, 1000)
  })
}
function onProcessComplete() {
  return new Promise((res, rej) => { // simulating an asynchronus process
    setTimeout(() => {
      console.log("Data process complete")
      res("result3")
    }, 1000)
  })
}

fetchData()
  .then(() => processData())
  .then(() => onProcessComplete())
  .catch((error) => console.log("error occured", error))



// 2. Async/ Await

async function executeTask() {
  try {
    const result1 = await fetchData()
    const result2 = await processData(result1)
    const result3 = await onProcessComplete(result2)
    console.log(result3)
  } catch (error) {
    console.log(error)
  }
}