const express = require('express')
const app = express()
app.set('view engine', 'ejs')

const { Sequelize, DataTypes } = require('sequelize')

const Task = require('./models/todolists')

const sequelize = new Sequelize({ dialect: 'sqlite', storage: './to-do-list.db' })

const tasks = Task(sequelize, DataTypes)

app.use(express.json())

// List tasks
app.get('/tasks', async (req, res) => {
    const taskList =  await tasks.findAll();
    res.json({ tasks: taskList })
})

// Show task
app.get('/tasks/:id', async  (req, res) => {
    const taskId = req.params.id
    const taskList =  await tasks.findByPk(taskId);
    res.json({ tasks: taskList })
})

// Create task
app.post('/tasks', async (req, res) => {      
    console.log(req.body);
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
    // var data = {
    //     description: req.body.description,
    //     ready: req.body.description
    // }
    // var sql ='INSERT INTO tasks (description, ready) VALUES (?,?)'
    // var params =[data.description, data.ready]
    // db.run(sql, params, function (err, result) {
    //     if (err){
    //         res.status(400).json({"error": err.message})
    //         return;
    //     }
    //     res.json({
    //         "message": "success",
    //         "data": data,
    //         "id" : this.lastID
    //     })
    // });
    // const body = req.body
    // res.json(body)
  })

app.get('/fotos', (req, res) => {
    res.render( 'tasks', {  nome: req.query.nome})
    //res.send('<html><body><h1>Rspondendo uma requisicao GET TASKS!</h1></body></html>')
//   res.json({ action: 'Listing tasks' })
})

app.get('/tasks2', (req, res) => {
    const task =  tasks.findByPk(1)
    res.render( 'tasks', { description: task.description, ready: task.ready  })
    //res.send('<html><body><h1>Rspondendo uma requisicao GET TASKS!</h1></body></html>')
//   res.json({ action: 'Listing tasks' })
})

// Create task
app.post('/tasks', (req, res) => {    
    res.send('<html><body><h1>Rspondendo uma requisicao POST TASKS!</h1></body></html>')
    // const body = req.body
    // res.json(body)
})

// // Show task
// app.get('/tasks/:id', (req, res) => {
//   const taskId = req.params.id

//   res.send({ action: 'Showing task', taskId: taskId })
// })

// // Update task
// app.put('/tasks/:id', (req, res) => {
//   const taskId = req.params.id

//   res.send({ action: 'Updating task', taskId: taskId })
// })

// // Delete task
// app.delete('/tasks/:id', (req, res) => {
//   const taskId = req.params.id

//   res.send({ action: 'Deleting task', taskId: taskId })
// })

app.listen(8080, () => {
  console.log('Iniciando o ExpressJS na porta 8080')
})
