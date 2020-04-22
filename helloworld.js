class Person {
    constructor(firstName, lastName, yearBorn) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.yearBorn = yearBorn;
    }

    talk()
    {
        console.log("Hello, I'm just a person");
    }
}

class FamousPerson extends Person 
{
    // This override of the base constructor was
    // given in an example, but it's not necessary apparently
    // constructor(firstName, lastName, yearBorn) 
    // {
    //     super(firstName, lastName, yearBorn);
    // }

    talk()
    {
        console.log("I'm sorry, do I know you?")
    }
}

let allusers = [];
allusers.push(new Person('Jelle', 'Van den Eynde', 1985));
allusers.push(new FamousPerson('Muhammad', 'Ali', 1942));
allusers.push(new FamousPerson('George', 'Martin', 1948));
allusers.push(new FamousPerson('Warren', 'Buffett', 1930));
allusers.push(new FamousPerson('John', 'Carmack', 1970));
allusers.push(new FamousPerson('Phil', 'Ivey', 1977));

// We can also just initialize an array of objects without a definition
allproducts =
[
    {name: 'TOK Probability', iosLink: 'https://apps.apple.com/us/app/easy-probability/id1503574851'},
    {name: 'TOK Poker', iosLink: 'https://apps.apple.com/us/app/learn-poker/id1494263170'}
];

allusers.sort( compareFn = function(x, y) { return x.yearBorn - y.yearBorn; } );

for (i = 0; i < allusers.length; i++) 
{
    allusers[i].talk();
}
