import express from "express"
import mysql from "mysql"
import cors from "cors"

const app = express()

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test",
});

// Check the database connection before each query
function handleDisconnect() {
    db.connect(function(err) {
        if(err) {
            console.log("Error connecting to database:", err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    db.on('error', function(err) {
        console.log('Database error:', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.json("hell am a clemency frm cleme devs!")
});

//ck complete handler

app.use(express.json())
//cors for allow data to be used by react
app.use(cors())

app.get("/", (req, res) => {
    res.json("hell am a clemency frm cleme devs!")
})

app.get("/books", (req, res) => {
    const q = "SELECT * FROM books"
    db.query(q, (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})


app.post("/books", (req, res)=>{
    const q = "INSERT INTO books (title, description, price, cover) VALUES (?, ?, ?, ? )"
    const values = [
         req.body.title,
         req.body.description,
         req.body.price,
         req.body.cover,
        ];

    db.query(q, values, (err, data)=>{
        if(err) return res.json(err);
        return res.json("book created successfull");

    });
});

app.delete("/books/:id", (req,res) => {
    const bookId = req.params.id;

    const q = "DELETE FROM books WHERE id = ?"

    db.query(q, [bookId], (err,data) => {
        if(err) return res.json(err);
        return res.json("book deleted successfull");
    } );

});


app.put("/books/:id", (req,res) => {
    const bookId = req.params.id;

    const q = "UPDATE books SET `title`=?, `description`=?, `price`=?, `cover`=? WHERE id=?"

    const values = [
        req.body.title,
        req.body.description,
        req.body.price,
        req.body.cover,
       ];

    db.query(q, [...values,bookId], (err,data) => {
        if(err) return res.json(err);
        return res.json("book updated successfull");
    } );

});



app.listen(8800, () => {
    console.log('your connected to backend123')
}) 
