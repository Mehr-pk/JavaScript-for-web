async function fetchUsersFromAPI() {
    try {
        const response = await fetch('https://dummyjson.com/users');
        if (!response.ok) {
            throw new Error("Unable to fetch users");
        }
        const data = await response.json();
        return data.users;
    } catch (error) {
        throw error; 
    }
}

function simulateNetworkDelay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const isValidUser = (user) => {
    return (
        typeof user.id === 'number' &&
        user.firstName && user.firstName.trim() !== '' &&
        user.email && user.email.includes('@') &&
        (user.role === 'admin' || user.role === 'moderator')
    );
};

function extractSafeUser(user) {
    return {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        companyName: user.company.name
    };
}

function processUsers(users) {
    let processedUsers = [];
    for (let user of users) {
        if (!isValidUser(user)) {
            continue;
        }
        const safeUser = extractSafeUser(user);
        processedUsers.push(safeUser);
    }
    return processedUsers;
}

async function startUserProcessing() {
    console.log("Starting user processing...");
    
    try {
        await simulateNetworkDelay(2000);
        const users = await fetchUsersFromAPI();
        const processedUsers = processUsers(users);

        console.log(`Total users fetched: ${users.length}`);
        console.log(`Total valid users: ${processedUsers.length}`);
        console.log("Processed Users:", processedUsers);
        
    } catch (error) {
        console.log("Processing failed: " + error.message);
    } finally {
        console.log("User processing completed");
    }
}

startUserProcessing();