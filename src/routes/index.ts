import express from 'express';
import userROutes from './user'
import docRoutes from './document'


const router = express.Router();


const defaultRoutes = [
  {
    path: '/user',
    route: userROutes,
  },
  {
    path: '/documents',
    route: docRoutes,
  },

];

router.get("/",async(req,res):Promise<any>=>{
    return res.status(200).send({ status:true, message: "Api is running" });
});

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});



export default router;