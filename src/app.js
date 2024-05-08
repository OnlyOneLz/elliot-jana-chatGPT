import express from "express"
import path from "path"

const app = express()

// MIDDLEWARE
// Serve static files from the public directory
app.use(express.static(path.join(process.cwd(),"src", 'public')));

const PORT = 3000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`))
