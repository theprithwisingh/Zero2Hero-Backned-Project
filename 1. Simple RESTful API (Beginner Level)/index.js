import express from "express";
import connectDB from "./config/db.js";
import Todo from "./models/todoSchema.js";
const app = express();
app.use(express.json());
connectDB();

let num = 0;
//add task
app.post("/addTask",async function(req,res){
  const {title, description} = req.body;
  if(!title ||!description){
    return res.status(400).json({message:"Somthing missing in input"})
  }
  try {
    num++;
    const newUser = await Todo.create({id:num, title, description });
    await newUser.save();

    return res.status(201).json({ task:newUser, message: "Task added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
  
})

//read all task
app.get("/getAllTask",async function(req,res){
 try {
    const allTasks = await Todo.find();
    console.log(allTasks)
    return res.status(200).json({
        success: true,
        count: allTasks.length,
        data: allTasks
      });
      
 } catch (error) {
        console.error(error.message);
        return res.status(500).json({ 
        success: false,
        message: error.message || "Something went wrong" 
    });
 }
 
})

//Get a specific task by its ID
app.get("/task/:id",async function(req,res){
    const id = req.params.id;
    const getTask = await Todo.findOne({id:Number(id)})
    console.log(getTask)
    if (!getTask){
        return res.status(404).json({message:"Task Not found"})
    }
    return  res.status(200).json({getTask,message:"I have get this task with a specific ID"})
})

// Delete a specific task by its ID
app.delete("/task/:id",async function(req,res){
    const id = req.params.id;
    const deletedTask  = await Todo.findOneAndDelete({id:Number(id)})
    if(!deletedTask){
        return res.status(404).json({message:"Task Not found"});
    }
    return  res.status(200).json({deletedTask , message:"delete succesfully"});
})
app.put("/task/:id", async function(req, res) {
  const id = req.params.id;      // URL se id le rahe hain
  const { title, description } = req.body;   // Body se new data le rahe hain

  try {
    const updatedTask = await Todo.findOneAndUpdate(
      { id: Number(id) },        // Find ka criteria
      { title, description },    // Update jo fields user bhej raha hai
      { new: true }              // Yeh option updated document return karega
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task Not Found" });
    }

    return res.status(200).json({ message: "Task Updated Successfully", updatedTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

//server connection
const PORT = 3002;
app.listen(PORT, function () {
  console.log(`This server is running on ${PORT}`);
});