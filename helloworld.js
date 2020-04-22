class Person {
    constructor(firstName, lastName, yearBorn) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.yearBorn = yearBorn;
    }
}

let allusers = [];

allusers.push(new Person('Jelle', 'Van den Eynde', 1985));
allusers.push(new Person('Muhammad', 'Ali', 1942));

console.log(allusers[0].lastName + ', ' + allusers[0].firstName);
console.log(allusers[1].firstName + ', ' + allusers[1].lastName);