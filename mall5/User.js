class User{

    constructor(name,age){
        this._age = age;
        this._name = name;
    }

    toString(){
        console.log(this._name+" "+this._age)
    }

    static sayHello(){
        console.log("hello")
    }


    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get age() {
        return this._age;
    }

    set age(value) {
        this._age = value;
    }



}


module.exports = User