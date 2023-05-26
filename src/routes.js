import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date(),
        updated_at: null,
        completed_at: null
      }

      database.insert('tasks', task);
          
      return res.writeHead(201).end(JSON.stringify(task))
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {      

      const tasks = database.select('tasks');
          
      return res.writeHead(201).end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {      
      try {
        const { id } = req.params
        const { title, description } = req.body;

        const updatedTask = {}
        
        if (title) {
          updatedTask.title = title
        }

        if (description) {
          updatedTask.description = description
        }

        if (!title && !description) {        
          return res.writeHead(400).end(JSON.stringify({error: 'Informe o Title ou a description para atualizar'}))
        }

        updatedTask.updated_at = new Date()

        database.update('tasks', id, updatedTask)      
            
        return res.writeHead(204).end()
      } catch(err) {
        return res.writeHead(500).end(JSON.stringify({error: 'Erro desconhecido'}))
      }
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {      
      try {
        const { id } = req.params    
        
        const taksExists = database.findById('tasks', id)

        if (!taksExists) {
          return res.writeHead(400).end(JSON.stringify({error: 'A task informada não existe'}))  
        }

        database.delete('tasks', id)      
            
        return res.writeHead(204).end()
      } catch(err) {
        return res.writeHead(500).end(JSON.stringify({error: 'Erro desconhecido'}))
      }
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {      
      try {
        const { id } = req.params
        
        const taksExists = database.findById('tasks', id)

        if (!taksExists) {
          return res.writeHead(400).end(JSON.stringify({error: 'A task informada não existe'}))  
        }

        const isComplete = taksExists.completed_at === null ? new Date() : null


        database.update('tasks', id, { completed_at: isComplete })      
            
        return res.writeHead(204).end()
      } catch(err) {
        return res.writeHead(500).end(JSON.stringify({error: 'Erro desconhecido'}))
      }
    }
  }
]