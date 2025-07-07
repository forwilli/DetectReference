import app from './app.js'

const PORT = process.env.PORT || 3001

// Local development
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})