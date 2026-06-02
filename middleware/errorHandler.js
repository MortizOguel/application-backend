const { validationResult } = require('express-validator')

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Datos inválidos',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    })
  }
  next()
}

const globalErrorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`)

  if (err.message === 'Origen no permitido por CORS') {
    return res.status(403).json({ message: 'Origen no permitido' })
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'El payload excede el límite permitido' })
  }

  res.status(err.status || 500).json({
    message: 'Error interno del servidor'
  })
}

module.exports = { handleValidationErrors, globalErrorHandler }
