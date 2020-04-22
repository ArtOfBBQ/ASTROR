let user = 
{
    name: 'Jelle',
    year_born: 1985,
    country: 'Japan',
    nationality: 'Belgian', 
    handsomeness: 10
}

let allusers = [];

allusers.push(user);
allusers.push(user);

user.name = 'hello world from reference types!';

console.log(allusers[0].name);
console.log(allusers[1].name);