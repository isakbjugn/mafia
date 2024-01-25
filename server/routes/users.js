const express = require('express');
const { PrismaClient } = require('@prisma/client')

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch(err) {
    console.log(err)
  }
})

module.exports = router;
