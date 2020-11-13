const express = require('express');
const UserController = require('./controllers/UserController')
const routes = express.Router();
const SessionController = require('./controllers/SessionController')
const authMiddleware = require('./middleware/auth');

routes.get("/users", UserController.index);
routes.get("/users/:id", authMiddleware, UserController.indexOne)
routes.post("/users", authMiddleware, UserController.create);
routes.put("/users/:id", authMiddleware, UserController.update);
routes.delete("/users/:id", authMiddleware,UserController.delete);

routes.post('/sessions', SessionController.store)

module.exports = routes;