const express = require('express')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const UserRoutes = require('./routes/userRoutes')
const UnitRoutes = require('./routes/unitRoutes')
const RouteRoutes = require('./routes/routeRoutes')
const LineRoutes = require('./routes/lineRoutes')
const DriverRoutes = require('./routes/driverRoutes')
const EmployeeRoutes = require('./routes/employeeRoutes')
const ServiceRoutes = require('./routes/serviceRoutes')
const ModelRoutes = require('./routes/modelRoutes')
const BrandRoutes = require('./routes/brandRoutes')
const RoleRoutes = require('./routes/roleRoutes')
const ConductorRoutes = require('./routes/conductorRoutes')
const AuthorizedInsurerRoutes = require('./routes/authorizedInsurerRoutes')
const NotificationRoutes = require('./routes/notificationRoutes')
const { globalErrorHandler } = require('./middleware/errorHandler')

const app = express()

// Confiar en proxy inverso (Railway, Nginx, etc.) para IP real del cliente
app.set('trust proxy', 1)

// Seguridad: headers HTTP con CSP explícito (anula el <meta> tag del frontend)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://*.tile.openstreetmap.org', 'https://raw.githubusercontent.com', 'https://cdnjs.cloudflare.com'],
      connectSrc: ["'self'", 'https://router.project-osrm.org'],
      frameSrc: ["'none'"],
    }
  }
}))

// Compresión Gzip para respuestas
app.use(compression())

// CORS restringido a orígenes permitidos
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:3000']
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Origen no permitido por CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Parseo de cookies (para token httpOnly)
app.use(cookieParser())

// Rate limiting global: 1000 peticiones por ventana de 15 minutos por IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
  message: { message: 'Demasiadas peticiones. Intenta de nuevo más tarde.' }
})
app.use(globalLimiter)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Middleware de registro de peticiones para depuración
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

app.use('/api/users', UserRoutes)
app.use('/api/units', UnitRoutes)
app.use('/api/routes', RouteRoutes)
app.use('/api/lines', LineRoutes)
app.use('/api/drivers', DriverRoutes)
app.use('/api/employees', EmployeeRoutes)
app.use('/api/services', ServiceRoutes)
app.use('/api/models', ModelRoutes)
app.use('/api/brands', BrandRoutes)
app.use('/api/roles', RoleRoutes)
app.use('/api/conductores', ConductorRoutes)
app.use('/api/authorized-insurers', AuthorizedInsurerRoutes)
app.use('/api/notifications', NotificationRoutes)

app.get('/api/status', (req, res) => {
    res.json({
        status: 'operativo',
        municipio: 'San Cristóbal',
        entorno: 'Backend'
    })
})

// Middleware global de errores (debe ir después de las rutas)
app.use(globalErrorHandler)

module.exports = app