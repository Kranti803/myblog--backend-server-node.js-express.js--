import express from 'express';
import {config} from 'dotenv';
import ErrorMiddleware  from './middlewares/Error.js';
import cookieParser from 'cookie-parser';

config({
    path:'./config/config.env'
})

const app = express();

//using middlewares..

app.use(express.json());
app.use(
    express.urlencoded({
        extended:true,
    })
)
app.use(cookieParser());

//importing and using routes
import blogRoutes from './routes/blogRoutes.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

app.use('/api/v1',blogRoutes);
app.use('/api/v1',userRoutes);
app.use('/api/v1',adminRoutes);



export default app;

app.use(ErrorMiddleware);
