// Try to link this file to index.html and then see the output in the devTools console

// Every thing in JS is an object


let x = 10
let y = 10.5
let a = true

let z = "Hello"
let z1 = new String("Hello")
/**
 * Both are same, when we declare a variable in JS, it automatically get with a wraper class of that type 
 * same for the other variables and the other types like Array, Object, etc
 */

// Prototype is a property of an object, which is a reference to another object
// Here the String is the class and the prototype contains all the methods of that class
console.log(String.prototype)
console.log(String.prototype.__proto__) // Even this class has a prototype which is Object class and the Object class has a prototype of null
console.log(Object.prototype.__proto__) // null

// __proto__ is a reference to the prototype of the object which String in this case
console.log(z.__proto__)
console.log(z1)

// We can add our own methods to the prototype of the class
// Its not a good practice to add methods to the prototype of the class
String.prototype.show = function () {
  console.log("Hello")
}
z1.show()


// Objects

const me = {
  fname: "Aditya",
  lname: "Maurya",
  age: 21,
  // greet: function () {
  //   console.log("Hello")
  // }
  // __proto__:  --> this points to the prototype of the object
}

console.log(me)
// now this object has a prototype of Object class which has a prototype of Object class again and then null

console.log(me.__proto__)

me.__proto__.greet = () => {
  console.log("Inside the __proto__")
}

// when we first use some property of the object, it first checks in the object itself, if not found then it checks in the prototype of the object and so on

me.greet()

// Lets you want to inherit the properties of the object 'me' 
// then you can use the prototype of the object 'me' and then add the properties to it

// const you = {}
// you.__proto__ = me
// OR
let you = Object.create(me)
console.log(you)
console.log(you.fname)