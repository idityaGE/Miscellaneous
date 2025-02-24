const boilWater = async () => {
  console.log("Boiling Start :")
  let now = Date.now();
  setTimeout(() => { // setTimeout is an asynchronus prosess where the main thread doesn't wait for the this to complete it contiues to excute the next line
    console.log("Boiling Complete")
    console.log("Time Taken", Date.now() - now, "mili sec")
  }, 3000);
}

boilWater()
console.log("Going to chop vegies")

/**
 * PS D:\Tests> node .\asynchronus.js
// Boiling Start :
// Going to chop vegies
// Boiling Complete
// Time Taken 3011 mili sec
 */

const fetchData = async () => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1")
    const data = await res.json()
    console.log("Data: ",data)
  } catch (error) {
    console.error(error)
  }
} 
fetchData()
console.log("Other Task ...")

// PS D: \Tests > node.\asynchronus.js
// Other Task ...
// Data: { userId: 1, id: 1, title: 'delectus aut autem', completed: false }

