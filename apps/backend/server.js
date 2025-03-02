// server.js
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: __dirname + '/../../.env' });
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');
const app = express();
app.use(express.json());


// CORS

app.use(cors());

const corsOptions = {
    origin: 'http://localhost:5171', // React app URL
    optionsSuccessStatus: 200
  };
  
  app.use(cors(corsOptions));


// Import Mongoose models (assume these are defined in separate files)
const Customer = require('./models/Customer');
const Policy = require('./models/Policy');
const Task = require('./models/Task');

// Load Swagger document
const swaggerDocument = YAML.load('./swagger.yaml');



// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

console.log(process.env.DB_HOST);
// Connect to MongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_PARAMS}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error(err));

/**
 * Email configuration and sending function.
 * Configure with your email service credentials.
 */
const sendRenewalEmail = async (policy) => {
    const transporter = nodemailer.createTransport({
        service: 'YourEmailService', // e.g., 'Gmail'
        auth: {
            user: 'youremail@example.com',
            pass: 'yourpassword'
        }
    });

    const mailOptions = {
        from: 'youremail@example.com',
        to: policy.customerEmail, // Assumes policy object holds customer's email
        subject: 'Policy Renewal Reminder',
        text: `Your policy with number ${policy.policyNumber} is due for renewal soon.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

/**
 * Schedules a renewal email reminder.
 * Here, we schedule the reminder to be sent at 9 AM on the reminder date,
 * which is calculated as 30 days before the policy expiry date.
 */
const scheduleRenewalEmail = (policy) => {
    const reminderDate = new Date(policy.expiryDate);
    reminderDate.setDate(reminderDate.getDate() - 30);

    // Build a cron expression: "minute hour day month *"
    // Note: Month in JS is 0-indexed, so add 1.
    const cronExpression = `0 9 ${reminderDate.getDate()} ${reminderDate.getMonth() + 1} *`;

    cron.schedule(cronExpression, async () => {
        console.log(`Sending renewal email for policy: ${policy.policyNumber}`);
        await sendRenewalEmail(policy);
    });
};

/* --------------------------
   Customer API Endpoints
---------------------------*/
function generateGuid() {
    const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return guid;
}

// Create a new customer
app.post('/api/customers', async (req, res) => {
    try {
        const customer = new Customer({ id: generateGuid(), ...req.body });
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all customers
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint: Search customers by name (partial match)
app.get('/api/customers/search', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Query parameter "name" is required.' });
    }
    try {
        // Create a regex to match names starting with the provided value, case-insensitive
        const customers = await Customer.find({
            name: { $regex: '^' + name, $options: 'i' }
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific customer by ID
app.get('/api/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a customer
app.put('/api/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a customer
app.delete('/api/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});






/* --------------------------
   Policy API Endpoints
---------------------------*/

// Create a new policy and attach it to a customer
app.post('/api/policies', async (req, res) => {
    try {
        // req.body should include policy details and a customerId field
        const policy = new Policy(req.body);
        await policy.save();

        // Optionally, retrieve customer details to include email if not provided
        const customer = await Customer.findById(policy.customerId);
        if (customer) {
            policy.customerEmail = customer.email;
        }

        // Schedule the renewal email reminder based on policy expiry
        scheduleRenewalEmail(policy);

        // Create a renewal task in the database
        const task = new Task({
            policyNumber: policy.policyNumber,
            expiryDate: policy.expiryDate,
            customerId: policy.customerId
        });
        await task.save();

        res.status(201).json(policy);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all policies
app.get('/api/policies', async (req, res) => {
    try {
        const policies = await Policy.find();
        res.json(policies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific policy by ID
app.get('/api/policies/:id', async (req, res) => {
    try {
        const policy = await Policy.findById(req.params.id);
        if (!policy) return res.status(404).json({ error: 'Policy not found' });
        res.json(policy);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a policy
app.put('/api/policies/:id', async (req, res) => {
    try {
        const policy = await Policy.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!policy) return res.status(404).json({ error: 'Policy not found' });
        res.json(policy);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a policy
app.delete('/api/policies/:id', async (req, res) => {
    try {
        const policy = await Policy.findByIdAndDelete(req.params.id);
        if (!policy) return res.status(404).json({ error: 'Policy not found' });
        res.json({ message: 'Policy deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




/* --------------------------
   Tasks API Endpoint
---------------------------*/

// Get tasks, optionally filtering by customerId (query parameter)
app.get('/api/tasks', async (req, res) => {
    try {
        const query = {};
        if (req.query.customerId) {
            query.customerId = req.query.customerId;
        }
        const tasks = await Task.find(query);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



/* --------------------------
   Start the Server
---------------------------*/

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
