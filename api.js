const client = require('./app')
const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');


app.use(express.static(path.join(__dirname)));


app.listen(3300, ()=>{
    console.log("Sever is now listening at port 3300");
})

const bodyParser = require("body-parser");
app.use(bodyParser.json());

client.connect();


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});



app.get('/users', (req, res)=>{
    client.query(`Select * from users`, (err, result)=>{
        if(!err){
            res.send(result.rows);   
            // console.log(result)         
        }
    });
    client.end;
  
})

app.get('/users/:id', (req, res)=>{
    client.query(`Select * from users where id=${req.params.id}`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})


app.post('/users', async (req, res) => {
    const user = req.body;

    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10); // 10 is the cost factor
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // Use the hashed password instead of the plain text
        let insertQuery = `INSERT INTO users (id, name, login, password, balance) 
                           VALUES (${user.id}, '${user.name}', '${user.login}', '${hashedPassword}', ${user.balance})`;

        client.query(insertQuery, (err, result) => {
            if (!err) {
                res.send('User added successfully with a secure password.');
            } else {
                console.error(err.message);
                res.status(500).send('Error adding user.');
            }
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send('Error securing the password.');
    }
});


app.post('/login', async (req, res) => {
   
    const { login, password } = req.body;
    // console.log(req);
    try {
        // Query the database for the user
        const query = `SELECT * FROM users WHERE login = '${login}'`;
        client.query(query, async (err, result) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error during login.');
                return;
            }

            if (result.rows.length === 0) {
                res.status(404).send('User not found.');
                return;
            }

            const user = result.rows[0];

            // Compare the plain text password with the hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                res.send('Login successful!');
            } else {
                res.status(401).send('Invalid password.');
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error during login.');
    }
});

