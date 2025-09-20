// 🔹 Object ke andar class define karna
const dog = {
  // Car class as a property of dog object
  Car: class {
    constructor(name, color) {
      this.name = name;
      this.color = color;
    }

    start() {
      console.log(`${this.name} the ${this.color} car is starting...`);
    }
  }
};

// 🔹 New instance of Car using object property
const myCar = new dog.Car("Buddy", "Red"); // ✅ Works
myCar.start(); // Output: Buddy the Red car is starting...

// 🔹 Dusra instance
const anotherCar = new dog.Car("Max", "Blue");
anotherCar.start(); // Output: Max the Blue car is starting...

// 🔹 Check properties
console.log(myCar.name);   // Buddy
console.log(myCar.color);  // Red
console.log(anotherCar.name); // Max
console.log(anotherCar.color); // Blue
