const express = require('express')
const app = express()
app.use(express.json())


const itemMaster = []

// Post itemMaster

app.post("/items",(req,res)=> {

    // checking given price is number or not
    if(typeof req.body.price !== 'number'){
        res.status(500).send("Please add price to item")
    }
    
    // validating if the code given is already present
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
    // if code is unique the we are accepting the req
    else {
        itemMaster.push(req.body)
        return res.status(201).send(itemMaster)
    }
    
    
})

// Post usercart 

const userCart = []

app.post('/order/:orderId',(req,res)=> {
    
    let temp = 0;
    // checking is the items present or not
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

// GET Summarize userCart


app.get('/order/:orderId/summarize', (req,res)=> {
    let temp = 0
    let summarize = []
    
    for(let x = 0;  x < userCart.length; x++){
       
        if(userCart[x].orderId === req.params.orderId){
           
            temp = 1
           
            for(let i = 0; i < userCart[x].orders.length; i++){
                
                if(i === 0){
                    summarize.push(userCart[x].orders[i])      
                }
                else {
                    let check = 0
                    for(let k = 0; k < summarize.length; k++){
                        if(summarize[k].code === userCart[x].orders[i].code){
                            check = 1
                            summarize[k].qty += userCart[x].orders[i].qty
                            summarize[k].totalAmt = summarize[k].qty * summarize[k].unitPrice
               
                        }
                    }
                    if(check === 0){
                        summarize.push(userCart[x].orders[i])
                        
                    }
                }
            }
            return res.send(summarize)
        }
    }
    if(temp === 0){
        return res.send("Please provide valid orderId")
    }
})
app.listen(8080,()=> {
    console.log("server started at port 8080")
})