import request from 'supertest'
import app from '../app'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongo: MongoMemoryServer

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.connection.close()
  await mongo.stop()
})

afterEach(async () => {
  const collections = await mongoose.connection.db!.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

describe('POST /register', () => {
  it('should register a user successfully', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password.123',
    }

    const response = await request(app)
      .post('/api/users/register')
      .send(userData)

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('User created')
  })

  it('should return an error if the data is invalid', async () => {
    const userData = {
      username: 'testuser',
      email: 'invalid-email',
      password: 'password123',
    }

    const response = await request(app)
      .post('/api/users/register')
      .send(userData)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Validation error')
    expect(Array.isArray(response.body.issues)).toBe(true)
    expect(response.body.issues.length).toBeGreaterThan(0)
  })
})
describe('POST /login', () => {
  const userData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password.123',
  }

  beforeAll(async () => {
    await request(app).post('/api/users/register').send(userData)
  })

  it('should log in a user successfully', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ email: userData.email, password: userData.password })

    expect(response.status).toBe(200)
    expect(response.body.token).toBeDefined()
  })
  it('should return an error if the user does not exist', async () => {
    const userData = {
      email: 'nonexistentuser@example.com',
      password: 'password.123',
    }

    const response = await request(app).post('/api/users/login').send(userData)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Wrong credentials.')
  })
  it('should return an error if the password does not match', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'wrongpassword',
    }

    const response = await request(app).post('/api/users/login').send(userData)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Wrong credentials.')
  })
})

describe('GET /verify-token', () => {
  let token: string

  beforeAll(async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password.123',
    }

    const registerResponse = await request(app)
      .post('/api/users/register')
      .send(userData)
    const loginResponse = await request(app).post('/api/users/login').send({
      email: userData.email,
      password: userData.password,
    })

    token = loginResponse.body.token
  })

  it('should return true if the token is valid', async () => {
    const response = await request(app)
      .get('/api/users/verify-token')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.isValid).toBe(true)
  })

  it('should return false if the token is invalid', async () => {
    const invalidToken = 'invalidtoken'
    const response = await request(app)
      .get('/api/users/verify-token')
      .set('Authorization', `Bearer ${invalidToken}`)

    expect(response.status).toBe(200)
    expect(response.body.isValid).toBe(false)
  })
})
