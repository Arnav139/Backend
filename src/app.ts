// user route 
import userRoutes from './routes/user.router';
import express from 'express';
import Documentrouter from './routes/document.router';
import userRouter from './routes/user.router';
import envConf from './config/envConf';

const app = express();
const port = parseInt(envConf.port, 10) || 3000;

app.use('/api/users',Documentrouter);

// app.use('/api/users',userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
