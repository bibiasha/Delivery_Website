const express = require('express');
const route = require('./routes/route')
const mongoose = require('mongoose')

const app = express();

app.use(express.json())

mongoose.connect("mongodb+srv://asha:asha@cluster0.xhvp1qr.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser:true})

.then(()=>console.log("mongodb connected"))
.catch(err => console.log(err))

app.use('/',route)

app.listen(process.env.PORT || 3000,function(){
    console.log('express app running on port '+ (process.env.PORT || 3000))
})