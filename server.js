const { static } = require("express")
const express = require("express")
const mongodb = require("mongodb")
const sanitizeHTML = require("sanitize-html")

const server = express()
let db

server.use(static("public"))

let connectionString = "mongodb+srv://appAdmin:appAdmin@cluster0.npnjf.mongodb.net/todo-app?retryWrites=true&w=majority"

mongodb.connect(connectionString, {useNewUrlParser: true}, function(error, client){
    db = client.db()
    server.listen(serverPort, function() {
        console.log(`server is running on port ${serverPort}`)
    })
})

const serverPort = process.env.PORT || 3000

server.use(express.json())
server.use(express.urlencoded({extended: false}))

function passwordProtected(req, res, next){
    res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"')
    console.log(req.headers.authorization)
    if(req.headers.authorization == "Basic dXNlcjp0ZXN0MTIzMzIx"){
        next()
    }
    else{
        res.status(401).send("Authentication required")
    }
}

server.use(passwordProtected)

server.get("/", passwordProtected, function(request, response) {
    // READ Operation
    db.collection("item").find().toArray(function(error, item) {
        response.send(
            `<!DOCTYPE html>
                <html>
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Simple To-Do App</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
                </head>
                <body>
                    <div class="container">
                        <h1 class="display-4 text-center py-1">To-Do App</h1>
                        
                        <div class="jumbotron p-3 shadow-sm">
                        <form id="create-form" action="/create-item" method="POST">
                            <div class="d-flex align-items-center">
                            <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                            <button class="btn btn-primary">Add New Item</button>
                            </div>
                        </form>
                        </div>
                        
                        <ul id="create-item" class="list-group pb-5">
                            
                        </ul>
                        
                    </div>
                    
                    <script>
                        let item = ${JSON.stringify(item)}
                    </script>

                    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
                    <script src="/browser.js"></script>
                </body>
                </html>`
                )
    })
    
    })

server.post("/create-item", function(req, res) {
    let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
    db.collection("item").insertOne({text: safeText}, function(err, info){
        res.json(info.ops[0])
    })
})

server.post("/updated-item", function(req, res){
    let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
    db.collection("item").findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: safeText}}, function(){
        res.send("success")
    })
})

server.post("/delete-item", function(req, res) {
    db.collection("item").deleteOne({_id: new mongodb.ObjectId(req.body.id)}, function(){
        res.send("success")
    })
})