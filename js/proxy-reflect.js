//DOCS: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
//DOCS: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect

const me = {
  fname: "Aditya",
  lname: "Maurya",
  age: 19,
}

// const proxy1 = new Proxy(target, handler);
const myProxy = new Proxy(me, {
  get: (target, prop, receiver) => {
    /**
     * target: The target object (the object which the proxy virtualizes).
     * prop: The name of the property to get.
     * receiver: Either the proxy or an object that inherits from the proxy.
     */
    console.log(`GET ${prop}`);
    console.log(`Target: `, target);
    console.log(`Receiver: `, receiver);
    // return target[prop]; // Rather than returning target[prop] we can use Reflect.get() method which is ...(I don't know, go chech the docs 😅).
    // Reflect: The Reflect object provides the set of methods for interceptable (in built) JavaScript operations.
    return Reflect.get(target, prop, receiver);
  },

  set: (target, prop, value) => {
    console.log(`SET ${prop} = ${value}`);
    switch (prop) {
      case "fname":
      case "lname":
        if (typeof value !== "string") {
          throw new TypeError(`${prop} name must be a string.`);
        }
        break;
      case "age":
        if (typeof value !== "number") {
          throw new TypeError("Age must be a number.");
        }
        if (value < 18) {
          throw new RangeError("Age must be greater than 18.");
        }
        break;
    }
    // target[prop] = value; // Rather than setting target[prop] we can use Reflect.set() method which is ...(I don't know, go chech the docs 😅)
    return Reflect.set(target, prop, value);
  },

  deleteProperty: (target, prop) => {
    console.log(`DELETE ${prop}`);
    // delete target[prop]; // Rather than deleting target[prop] we can use Reflect.deleteProperty() method which is ...(I don't know, go chech the docs 😅)
    return Reflect.deleteProperty(target, prop);
  }
})

// console.log(myProxy.fname);
// myProxy.fname = "Adi";
// console.log(myProxy);
myProxy.age = 20
console.log(myProxy)


// Proxy: Just of it like a black box between your actual object and the proxy object which intercepts the operations on the proxy object and then you can do whatever you want with the operation.
// Reflect: Reflect is a built-in object that provides methods for interceptable JavaScript operations. The methods are the same as those of proxy handlers. Reflect is not a function object, so it's not constructible.