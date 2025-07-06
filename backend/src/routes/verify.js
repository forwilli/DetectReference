import express from 'express'
import { body, validationResult } from 'express-validator'
import { verifyReferencesController } from '../controllers/verifyController.js'
import { verifyReferencesSSEController } from '../controllers/verifyControllerSSE.js'

const router = express.Router()

// 测试端点
router.get('/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() })
})

router.post('/verify-references', 
  [
    body('references').isArray().withMessage('References must be an array'),
    body('references').notEmpty().withMessage('References array cannot be empty'),
    body('references.*').isString().withMessage('Each reference must be a string')
  ],
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  verifyReferencesController
)

router.post('/verify-references-stream', 
  [
    body('references').isArray().withMessage('References must be an array'),
    body('references').notEmpty().withMessage('References array cannot be empty'),
    body('references.*').isString().withMessage('Each reference must be a string')
  ],
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  verifyReferencesSSEController
)

export default router