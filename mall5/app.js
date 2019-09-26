let User = require('./User');

let user = new User('zhangsan',13);


user.toString()

console.log(user.name)
console.log(user.age)

User.sayHello()