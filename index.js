const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// mongoDB connection
const dburl = "mongodb://localhost:27017/Employee"
mongoose.connect(dburl,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log("database connected")
})
.catch((error)=>{
    console.log("not connected")
})
 
// get route Simple For api testing
app.get("/",(req, res)=>{
    res.send("MongoDB Practice Server..")
    console.log("MongoDB Practice Server..")
})

// Employee Scheme
const employeeSchema = new  mongoose.Schema({
    "name" : String,
    "age" : Number,
    "address" : String,
    "phone" : Number
});

// Employee Model 
const employeemodel = mongoose.model("employee-data",employeeSchema );

// save data in mongoDB
app.post("/saveemployee", (req, res)=>{
    console.log("req data", req.body);
    const newemployee = new employeemodel ({
        "name" : req.body.name,
        "age" : req.body.age,
        "address" : req.body.address,
        "phone" : req.body.phone,
    });

    newemployee.save()
    .then(()=>{
        res.send("Employee Added");
    })
    .catch((error)=>{
        res.send("error while adding employee")
    })
})

// get all data from mongoDB
app.get("/getemployee",async (req,res)=>{
    try {
        const employeedata = await employeemodel.find({})
            console.log("data fetch done",employeedata)
            res.json(employeedata);
    } catch (error) {
        console.log("error", error)
    }
})

// get data by id from mongoDB
app.get("/getemployee/:id" , async (req, res)=>{
    const id = req.params.id;
    console.log(id)
    try {
        const employeedata = await employeemodel.findOne({ _id: id });
        console.log("data fetch done", employeedata);
        res.json(employeedata);
    } catch (error) {
        console.log("Error While Fetch Data", error);
    }
})

// update data from mongoDB by id
app.put("/updateemployee", async (req, res)=>{
    console.log("req data", req.body);
   const id = req.body.id;
   const name = req.body.name;
   const age = req.body.age;
   const address = req.body.address;
   const phone = req.body.phone;
try {
    const employeedata = await employeemodel.updateOne({_id:id}, { name , age , address, phone });
    console.log("update ok",employeedata);
    res.json(employeedata);
} catch (error) {
    console.log("error",error);
    res.send(error)
}
})

// delete data from mongoDB by id
app.delete("/deleteemployee/:id", async(req, res)=>{
    console.log("working");
    console.log("request data", req.params.id);
    const id = req.params.id;
    try {
        const deleteemployee = await employeemodel.deleteOne({_id:id});
        console.log("employee delete",deleteemployee);
        res.json("Employee Delete DOne");
    } catch (error) {
        console.log("error while employee delete");
        res.send("error while employee delete")
    }
})

app.listen(3001, () => {
    console.log("Server is running on port 3000");
});
