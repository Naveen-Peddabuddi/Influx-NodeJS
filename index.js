const express = require('express')
const app = express()
app.use(express.json())


const itemMaster = []

// Post itemMaster

app.post("/items",(req,res)=> {
    if(typeof req.body.price !== 'number'){
        res.status(500).send("Please add price to item")
    }
    
    if(itemMaster.length > 0){
        var temp = 0
        for(let x = 0; x < itemMaster.length; x++){
            if(itemMaster[x].code === req.body.code){
                temp = 1
                res.send("The item is already present in the ItemMaster. Please try with different Product")
               
            }
        }
        if(temp === 0){
            itemMaster.push(req.body)
            res.status(201).send(itemMaster)
        }
    }
    else {
        itemMaster.push(req.body)
        return res.status(201).send(itemMaster)
    }
    
    
})

// Post usercart 

app.listen(8080,()=> {
    console.log("server started at port 8080")
})