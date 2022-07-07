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
        let temp = 0
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

const userCart = []

app.post('/order/:orderId',(req,res)=> {
    
    let temp = 0;
    if(itemMaster.length === 0){
        return res.send("itemMaster is empty")
    }
    for(let x = 0; x < itemMaster.length; x++){
        if(req.body.code === itemMaster[x].code){
            temp = 1
            if(userCart.length > 0){
                let checker = 0
                for(let i = 0; i < userCart.length; i++){
                    if(userCart[i].orderId === req.params.orderId){
                        checker = 1
                        let orderobj = {
                            "code" : req.body.code,
                            "qty" : req.body.qty,
                            "unitPrice" : itemMaster[x].price,
                            "totalAmt" : itemMaster[x].price * req.body.qty
                        }
                        userCart[i].orders.push(orderobj)
                        return res.send(userCart)
                    }
                }
                if (checker === 0){
                    let obj = {
                        "orderId" : req.params.orderId,
                        "orders" : [
                           { 
                            "code" : req.body.code,
                            "qty" : req.body.qty,
                            "unitPrice" : itemMaster[x].price,
                            "totalAmt" : itemMaster[x].price * req.body.qty
                            }
                        ]
                    }
    
                    userCart.push(obj)
                    return res.send(userCart)
                }    
            }
            else if(userCart.length === 0){
                
                let obj = {
                    "orderId" : req.params.orderId,
                    "orders" : [
                       { 
                        "code" : req.body.code,
                        "qty" : req.body.qty,
                        "unitPrice" : itemMaster[x].price,
                        "totalAmt" : itemMaster[x].price * req.body.qty
                        }
                    ]
                }

                userCart.push(obj)
                return res.send(userCart)
            }
            
        }
    }
    if(temp === 0){
       return res.status(500).send("Please enter valid code")
    }
})
app.listen(8080,()=> {
    console.log("server started at port 8080")
})