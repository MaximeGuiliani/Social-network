import { createServer } from 'http';
import app from './app.js';

const port = process.env.PORT || 3000;

const server = createServer(app);

server.listen(port , () => console.log(`Server is running on port ${port}  \n http://localhost:${port}`));