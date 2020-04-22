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
allusers.push(new Person('George', 'Martin', 1948));
allusers.push(new Person('Warren', 'Buffett', 1930));
allusers.push(new Person('John', 'Carmack', 1970));
allusers.push(new Person('Phil', 'Ivey', 1977));

// We can also just initialize without a definition
allproducts =
[
    {name: 'TOK Probability', iosLink: 'https://apps.apple.com/us/app/easy-probability/id1503574851'},
    {name: 'TOK Poker', iosLink: 'https://apps.apple.com/us/app/learn-poker/id1494263170'}
];

// weird to me but js has a foreach loop
// as a method of the array itself
// I read that this will break your code on some very old browsers
allproducts.forEach(x => console.log(x.name));


console.log('************* Before sorting *************');

// classic for loop
for (i = 0; i < allusers.length; i++) 
{
    console.log(allusers[i].lastName + ', ' + allusers[i].firstName);
}


console.log('************* After sorting *************');


allusers.sort( compareFn = function(x, y) { return x.yearBorn - y.yearBorn; } );

for (i = 0; i < allusers.length; i++) 
{
    console.log(allusers[i].lastName + ', ' + allusers[i].firstName);
}
