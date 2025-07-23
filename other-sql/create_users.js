const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const generateUsers = async (count = 10) => {
    const users = [];

    for (let i = 0; i < count-1; i++) {
        const username = faker.internet.username().toLowerCase();
        const email = faker.internet.email(username).toLowerCase();
        const plainPassword = faker.internet.password(8);
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        users.push({
            username,
            email,
            plainPassword,
            hashedPassword,
            isAdmin: false,
            isDeleted: false,
        });
    }

    return users;
}

const outputSQL = async (count) => {
    const users = await generateUsers(count);

    console.log("INSERT INTO Users (username, email, userPassword, isAdmin, isDeleted) VALUES");
    i = 0;
    users.forEach(u => {
        console.log(`-- password: ${u.plainPassword}\n ('${u.username+i}', '${u.email+i}', '${u.hashedPassword}', ${u.isAdmin}, ${u.isDeleted}),`);
        i++;
    });
    console.log("-- password: finalguy\n('final2025','feffthegoat2025@mail.com','$2b$10$/ImRjPj9FV9n6qkr9XUzX.0f3yTCXMeaUk4zD2gey8rbU4xks0toy',false,false);");
};

const n = parseInt(process.argv[2]) || 10;
outputSQL(n);
