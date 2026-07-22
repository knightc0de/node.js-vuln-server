/**
 * @file controllers/users.js
 * @description express router handling the user endpoint and gets mock data from a json file
 */

const userRouter = require('express').Router()
const fs = require('fs/promises')
const path = require('path')

/**
 * path to the mock user json data
 * @constant {string}
 */

const PATH = path.join(__dirname, '../data/users.json');
/**
 * GET /api/users/:id
 * @summary fetch the user by the id parameter and returns json
 * @description fetch the user data then search by id then send the corrisponding info
 *
 * @route GET /api/users/{id}
 * @param {Object} req - express request object containing the parameters
 * @param {string} req.params.id - the users id recived from the request
 * @param {Object} res - the response object
 * 
 * @returns {Promise<void>} resolves with json response:
 * - 200 ok: user obj
 * - 404 not found: `{ message: "user not found" }` or `{ error: "data not found" }`
 * - 500 internal server error: `{ error: "server error" }`
 */

userRouter.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const rawData = await fs.readFile(PATH, 'utf8')
    const parsedData = JSON.parse(rawData)
    const users = parsedData.users || []
    const user = users.find(u => String(u.id) === String(id))

    if (!user){
      return res.status(404).json({message:"user not found"})
    }

    res.json(user)
  } catch (err) {
    console.error(err)
    if (err.code == 'ENOENT'){
      return res.status(404).json({ error: 'data not found' })
    }
    return res.status(500).json({ error: 'server error' })
  }
})

/**
 * POST /api/users/:id/complete
 * @summary cheat prevention endpoint
 * @description adds validation
 *
 * @route POST /api/users/{id}/complete
 * @param {Object} req - express request object containing the params
 * @param {Object} req.params.id - the users id recived from the request
 * @param {Object} res - the response obj
 *
 * @returns {Promise<void>} resolves with json response:
 * - 200 ok: user obj
 * - 404 not found: `{ message:"user not found" }` or `{ error:"data not found" }`
 * - 500 internal server error: `{ error: "server error"}`
 */

userRouter.post('/:id/complete', async (req, res) =>{
  try {
    const id = req.params.id
    const rawData = await fs.readFile(PATH, 'utf8')
    const parsedData = JSON.parse(rawData)
    const users = parsedData.users || []
    const user = users.find(u => String(u.id) === String(id))

    if (!user){
      return res.status(404).json({message:"user not found"})
    }

    if (String(id) == '2'){
      return res.status(403).json({message:"nice try"})
    }

    res.json({
      success:true
    })

  } catch (err){
    console.error(err)
    if (err.code == 'ENOENT'){
      return res.status(404).json({error:"user not found"})
    }
    return res.status(500).json({error:"server error"})
  }
})



/**
 * express router singleton
 * @module controllers/users
 */

module.exports = userRouter
