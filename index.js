const pool = require('./db')
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

app.get('/expenses', async function getExpenses(req, res){
    try{
        const result = await pool.query(`SELECT id, title, category, amount::float AS amount, to_char(expense_date,  'YYYY-MM-DD') AS expense_date FROM expenses`)
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Something went wrong"})
    }
})

app.get('/expenses/:id', async function OneExpense(req, res){
    try{
        const readId = Number(req.params.id)
        if(!Number.isInteger(readId) || readId < 1){
            res.status(400).json({ message: "Invalid expense id"})
            return
        }
        const result = await pool.query(
            `SELECT id, title, category, amount::float AS amount, to_char(expense_date,  'YYYY-MM-DD') AS expense_date FROM expenses WHERE id = $1`,
            [readId]
        )
        if(result.rows.length === 0){
            res.status(404).json({ message: "Expense not found"})
            return
        }
        res.json(result.rows[0])
    } catch (error){
        console.error(error)
        res.status(500).json({ message: "Something went wrong"})
    }

})

app.post('/expenses', function makeExpense(req, res){
    console.log(req.body)
    const newId = expenses[expenses.length - 1].id + 1
    const newItem = {id: newId, title: req.body["title"], category: req.body["category"], amount: req.body["amount"]}
    expenses.push(newItem)
    res.status(201).json(newItem)
})

app.listen(3000, function onServerStart(){
    console.log("Server Started")
})