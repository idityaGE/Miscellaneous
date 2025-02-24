
let url = "https://jsonplaceholder.typicode.com/todos/1"

const fetchData = async (url) => {
  try {
    const res = await fetch(url)
    const data = await res.json()
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}

const debounce = (delay, func) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    console.log("Timer cleared")
    timer = setTimeout(() => {
      func(...args)
      console.log("Calling")
    }, delay)
  }
}

// Debounced function with a 500ms delay
const debouncedFetchData = debounce(500, fetchData);

// Testing: Multiple calls in quick succession
debouncedFetchData(url);
debouncedFetchData(url);
debouncedFetchData(url);