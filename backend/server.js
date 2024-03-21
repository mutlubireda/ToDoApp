const express = require('express');
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json()); // JSON verilerini işle

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '1234',
    database: 'todoapp'
})

app.get('/', (req, res) => {
    const sql = "SELECT * FROM todos";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.post('/create', (req,res)=> {
    const { task } = req.body; // req.body'den task özelliğini al
    const sql = "INSERT INTO todos (todo_desc, todo_completed) VALUES (?, ?)";
    const values = [task, false]; // todo_completed varsayılan olarak false
    db.query(sql, values, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.put('/update/:todo_id', (req,res)=> {
    const { todo_completed } = req.body;
    const id = req.params.todo_id;
    const sql = "UPDATE todos SET todo_completed = ? WHERE todo_id = ?";
    const values = [todo_completed, id];
    db.query(sql, values , (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.delete('/delete/:todo_id', (req,res)=> {
    const todo_id = req.params.todo_id; // req.params.todo_id'yi kullan
    if (!todo_id) {
        return res.status(400).json({ error: 'Invalid todo_id' }); // Geçersiz todo_id durumunda hata döndür
    }
    const sql = "DELETE FROM todos WHERE todo_id = ?";
    db.query(sql, [todo_id] , (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.listen(8081, () => {
    console.log("listening");
})
