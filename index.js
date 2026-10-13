const express = require('express')
const app = express()

const expenses = [
    {id: 1, title: "A lunch menu", category: "Food", amount: 12},
    {id: 2, title: "A shopping list", category: "Fashion", amount: 50}
]

app.get('/', function getrequest(req, res){
    res.send("Successful response")
})

app.get('/expenses', function getExpenses(req, res){
    res.json(expenses)
})

app.listen(3000, function onServerStart(){
    console.log("Server Started")
})