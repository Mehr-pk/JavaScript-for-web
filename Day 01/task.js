const usersJSON = `
[
  { "id": "1", "name": "Ali", "age": "22", "isActive": true },
  { "id": 2, "name": "Sara", "age": 19, "isActive": false },
  { "id": "3", "name": "Ahmed", "age": "17", "isActive": true },
  { "id": 4, "name": "Zain", "age": 25, "isActive": true }
]
`;

try {
    
    const users = JSON.parse(usersJSON);
    console.log("Type of user data:", typeof users); 
    console.log("is users an array?", Array.isArray(users)); 

    let validUsers = [];
    let activeCount = 0;

   
    for (let user of users) {
        
        user.id = Number(user.id);
        user.age = Number(user.age);

        
        if (user.isActive === true) {
            activeCount++;
        }

       
        if (user.age >= 18 && user.isActive === true) {
            validUsers.push(user);
        }
    }

    
    const summary = {
        totalUsers: users.length,
        activeUsers: activeCount,
        validUsers: validUsers.length
    };

  
    console.log("Valid Users:", validUsers);
    console.log("Summary:", summary);

} catch (error) {
    
    console.log("invalid data");
}