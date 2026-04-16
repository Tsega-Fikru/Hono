import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()
//type
type user = {
  id: string;
  name: string;
  password: string;
  email: string;
}
//storage
const users : user[] = [];
app.get('/users', (c) => {
  return c.json (users)

} )
//get users by id and error response
app.get('/users/:id', (c) => {
  const id = c.req.param('id')
const foundUser = users.find((user) => user.id === id)

  if (!foundUser) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json(foundUser)
  //why not c.text?
})
const generateId = () => crypto.randomUUID()

//signup
app.post('/signup', async (c) => {
  const body = await c.req.json()
  const { name, email, password } = body

  const existingUser = users.find(u => u.email === email)
  if (existingUser) {
    return c.json({ error: 'Email already exists' }, 400)
  }

  const newUser: user = {
    id: crypto.randomUUID(),
    name,
    email,
    password
  }

  users.push(newUser)

  return c.json({
    message: 'User created',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  })
})
//Signin
app.post('/signin', async (c) => {
  const body = await c.req.json()
  const { email, password } = body

  const user = users.find(u => u.email === email)

  if (!user || user.password !== password) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  return c.json({
    message: 'Login successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  })
})
export default app



serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
