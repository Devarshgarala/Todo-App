const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/todos', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = await prisma.todo.create({
      data: { title, description }
    });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, title, description } = req.body;

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        ...(completed !== undefined && { completed }),
        ...(title && { title }),
        ...(description !== undefined && { description })
      }
    });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.todo.delete({ where: { id } });
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Clean Prisma shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
