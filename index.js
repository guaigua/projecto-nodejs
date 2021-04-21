const express = require('express')
const app = express()
app.set('view engine', 'ejs')

const { Sequelize, DataTypes } = require('sequelize')

const Task = require('./models/todolists')

const sequelize = new Sequelize({ dialect: 'sqlite', storage: './to-do-list.db' })

const tasks = Task(sequelize, DataTypes)
const cors = require("cors")
app.use(cors())
app.use(express.json())

// List tasks 
app.get('/tasks', async (req, res) => {
    const taskList =  await tasks.findAll();
    res.json({ action: 'Show Tasks ', tasks: taskList })
})

// Show task for ID
app.get('/tasks/:id', async  (req, res) => {
    const taskId = req.params.id
    const taskList =  await tasks.findByPk(taskId);
    res.json({ action: 'Show Task for ID ', tasks: taskList })
})

// Create one task
app.post('/tasks', async (req, res) => { 
    var errors=[]
    if (!req.body.description){
        errors.push("Descrição não enviada");
    }
    if (!req.body.ready){
        errors.push("Status não enviada");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    const tasksCreate = await tasks.create({             
        description: req.body.description,
        ready: req.body.ready
    })

    console.log(tasksCreate);
 
    res.json({ action: 'Task Create ', tasksCreate})
})

// update one task

app.put('/tasks/:id', async (req, res) =>{
    try{
        const taskId = req.params.id
        const body = req.body
        const taskList = await tasks.findByPk(taskId)
        taskList.update({
            description: body.description,
            ready: body.ready
        });        
        res.send({ action: 'Task Modify ', taskList:taskList })
    } catch (e) {
        console.log(e);
        return res.send({ error: e})
    }
})

// delete one task
app.delete('/tasks/:id', async (req, res) => {
    try{
        const taskId = req.params.id
        const taskRemove = await tasks.destroy({ where: { id: taskId  } })
        res.send({ action: 'Task Remove ', taskRemove: taskRemove })
    } catch (e) {
        console.log(e);
        return res.send({ error: e})
    }
})

app.listen(8080, () => {
  console.log('Iniciando o ExpressJS na porta 8080')
})
