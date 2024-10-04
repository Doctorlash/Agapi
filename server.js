const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;
app.use(bodyParser.json());

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Create MySQL connection pool
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'feyisayo2014&',  // Replace with your MySQL password
    database: 'agapi'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Handle scheduling request
app.post('/schedule.html', async (req, res) => {
    const { therapist, date, time, clientName, clientEmail } = req.body;

    try {
        // Step 1: Check if the time slot is already booked for the therapist
        const [existingAppointment] = await db.execute(
            'SELECT * FROM appointments WHERE therapist = ? AND date = ? AND time = ?',
            [therapist, date, time]
        );

        if (existingAppointment.length > 0) {
            return res.status(400).json({ message: 'The therapist is not available at this time slot.' });
        }

        // Step 2: Save the appointment to the MySQL database
        await db.execute(
            'INSERT INTO appointments (therapist, date, time, clientName, clientEmail) VALUES (?, ?, ?, ?, ?)',
            [therapist, date, time, clientName, clientEmail]
        );

        // Step 3: Send email notifications to both client and therapist
        sendEmailNotification(clientName, clientEmail, therapist, date, time);
        res.status(200).json({ message: 'Appointment successfully scheduled!' });

    } catch (error) {
        console.error('Error saving appointment:', error);
        res.status(500).json({ message: 'Failed to schedule appointment. Please try again later.' });
    }
});

// Step 3: Email notification function
function sendEmailNotification(clientName, clientEmail, therapist, date, time) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'moimdrlash@gmail.com',  // Replace with your email
            pass: 'feyisayo2014'    // Replace with your password
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: [clientEmail, 'therapist-email@example.com'],  // Send to both client and therapist
        subject: 'Appointment Confirmation - Agapi',
        text: `Hello ${clientName},\n\nYour appointment with ${therapist} has been scheduled for ${date} at ${time}.\n\nBest regards,\nAgapi Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files like HTML, CSS, JS, and images
app.use(express.static(path.join(__dirname, 'public')));

// Routes for pages
app.get('header.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/header.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/profile.html'));
});

app.get('/counselor-profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/counselor-profile.html'));
});

app.get('/chat.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/chat.html'));
});

app.get('/schedule.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/schedule.html'));
});

app.post('/send-message', (req, res) => {
    const { name, email, message } = req.body;
    console.log(`Message from ${name} (${email}): ${message}`);
    res.send('Message received!');
});

// Handle registration request
app.post('/register', async (req, res) => {
    const { userType, name, email, password, specialization } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        if (userType === 'therapist') {
            await db.execute(
                'INSERT INTO therapists (name, email, password, specialization) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, specialization]
            );
        } else if (userType === 'client') {
            await db.execute(
                'INSERT INTO clients (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword]
            );
        }

        res.status(200).json({ message: 'Registration successful!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email is already registered.' });
        }
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Failed to register. Please try again later.' });
    }
});

// Handle login request
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check in both therapists and clients table
        const [therapist] = await db.execute('SELECT * FROM therapists WHERE email = ?', [email]);
        const [client] = await db.execute('SELECT * FROM clients WHERE email = ?', [email]);

        const user = therapist[0] || client[0];  // If therapist not found, check client

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Successful login
        res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Failed to login. Please try again later.' });
    }
});