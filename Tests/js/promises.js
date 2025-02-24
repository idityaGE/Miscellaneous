// promises in js meanins a value may be available now, in future or never.
// promises are used to handkle asynchronus proesses


const doOperation = async () => {
  const randInt = Math.floor(Math.random() * 10 + 1);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randInt > 5) {
        resolve(`Geater than 5, Num : ${randInt}`)
      } else {
        reject(`Not greater then 5, Num : ${randInt}`)
      }
    }, 1500);
  })
}

doOperation()
  .then((data) => console.log(data))
  .catch((error) => console.log(error))