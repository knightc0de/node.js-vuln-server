/**
 * @file app.js
 * @description exports express app singleton and setups middleware
 */

const express = require('express')
const userRouter = require('./controllers/users')
const morgan = require('morgan')
/**
 * initalise app singleton
 * @type {Object}
 */
const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use('/api/users', userRouter)

/**
 * exports app
 * @module app
 */

module.exports = app
