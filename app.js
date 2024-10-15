var express = require('express');
const mongoose = require('mongoose');
var morgan= require('morgan');
var app = express();
require("dotenv").config()

app.use(express.json())
app.use(morgan("dev"));

// connection
mongoose.connect(process.env.mongo_url)
.then(()=>{
    console.log("db is connected")
})
.catch((err)=>{
    console.log(err);
});
//Employee schema and model
const employeeSchema = new mongoose.Schema({
    name: String,
    address: String,
    job: String,
    salary: Number
});

const Employee = mongoose.model('Employ', employeeSchema);

// post method

app.post('/api/employees', async (req, res) => {
    const employee = new Employee({
        name: req.body.name,
        address: req.body.address,
        job: req.body.job,
        salary: req.body.salary
    });

    try {
        const newEmployee = await employee.save();
    res.status(200).json( {message: 'data added successfully' });
        
    } catch (err) {
        res.status(400).json({ message: err.message });
      
    }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single employee by ID
app.get('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Update 
app.put('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        employee.name = req.body.name || employee.name;
        employee.address = req.body.position || employee.address;
        employee.job = req.body.department || employee.job;
        employee.salary = req.body.salary || employee.salary;

        const updatedEmployee = await employee.save();
        // res.status(200).json(updatedEmployee);
        res.status(200).json( {message: 'data updated successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete 
app.delete('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        await Employee.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
