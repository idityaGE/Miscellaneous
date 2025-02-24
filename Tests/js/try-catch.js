

const getData = async () => {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await res.json();
    console.log("Original Try Catch :", data);
  } catch (error) {
    console.log(error);
  }

  // // New Syntax: 1
  // try [err, res] = await fetch('https://jsonplaceholder.typicode.com/posts');
  // if (err) {
  //   console.log(err);
  // } else {
  //   const data = await res.json();
  //   console.log("New Syntax: 1", data);
  // }

  // // New Syntax: 2
  // const [err, res] ?= await fetch('https://jsonplaceholder.typicode.com/posts');
  // if (err) {
  //   console.log(err);
  // } else {
  //   const data = await res.json();
  //   console.log("New Syntax: 2", data);
  // }

}