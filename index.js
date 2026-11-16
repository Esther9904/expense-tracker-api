const pool = require('./db')
const express = require('express')
const app = express()




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

app.post('/expenses', async function makeExpense(req, res){
    try{
        const titleData = req.body["title"];
        const categoryData = req.body["category"] || "General";
        const amountData = req.body["amount"];
        if(typeof titleData !== "string" || titleData.trim() === ""){
            res.status(400).json({ message: "Title required"})
            return
        }
        if(typeof amountData !== "number" || amountData <= 0){
            res.status(400).json({ message: "Amount is not a positive number"})
            return
        }
        const result = await pool.query(
            `INSERT INTO expenses (title, amount, category) VALUES ($1, $2, $3) RETURNING id, title, category, amount::float AS amount, to_char(expense_date, 'YYYY-MM-DD') AS expense_date`,
            [titleData, amountData, categoryData]
        )
        res.status(201).json(result.rows[0])
    } catch (error){
        console.error(error)
        res.status(500).json({ message: "Something went wrong"})
    }
})

app.delete('/expenses/:id', async function deleteExpense(req,res){
    try{
        const readId = Number(req.params.id);
        if(!Number.isInteger(readId) || readId < 1){
            res.status(400).json({message: "Invalid expense id"})
            return
        }
        const result = await pool.query(
            `DELETE FROM expenses WHERE id = $1 RETURNING id`,
            [readId]
        )
        if(result.rows.length === 0){
            res.status(404).json({message: "Expense not found"})
            return
        }
        res.status(204).send()
    } catch (error){
        console.error(error)
        res.status(500).json({message: "Something went wrong"})
    }
})

app.listen(3000, function onServerStart(){
    console.log("Server Started")
})