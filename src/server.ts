import express from 'express';
import './database/connection';


import routes from './routes';


const app = express();
app.use(express.json());
app.use(routes);


app.listen(3333, () => console.log('\n\n\🔥 \ Server started at: http://localhost:3333'));