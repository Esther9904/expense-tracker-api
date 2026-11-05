const express = require('express')
const app = express()


const expenses = [
    {id: 1, title: "A lunch menu", category: "Food", amount: 12},
    {id: 2, title: "A shopping list", category: "Fashion", amount: 50}
]

app.use(express.json())

app.get('/', function getrequest(req, res){
    res.send("Successful response")
})

app.get('/expenses', function getExpenses(req, res){
    res.json(expenses)
})

app.get('/expenses/:id', function OneExpense(req, res){
    const readId = Number(req.params.id)
    const getOneExpense = expenses.find((exp) => {
        return exp.id === readId
    })
    if (!getOneExpense){
        res.status(404).json({ message: "Expense not found"})
        return
    }
    res.json(getOneExpense)
})

app.post('/expenses', function makeExpense(req, res){
    console.log(req.body)
    res.status(201).json(req.body)
})

app.listen(3000, function onServerStart(){
    console.log("Server Started")
})