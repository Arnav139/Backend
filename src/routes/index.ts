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

router.get("/google", async (req, res): Promise<any> => {
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Google API Call</title>
      </head>
      <body>
          <h1>Google API Call</h1>
          <button id="callGoogleApi">Call Google API</button>

          <script>
              document.getElementById('callGoogleApi').addEventListener('click', function() {
                  fetch('http://localhost:8000/user/google-login?code=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJpYXQiOjE3Mjg1NDgzMDUsImV4cCI6MTcyODYzNDcwNX0.u5qexkzW6zDIINGvnEhVUKfVwQOQTsODT5576Hl1GAg')
                      .then(response => response.json())
                      .then(data => {
                          console.log('Success:', data);
                          alert('Google API Response: ' + JSON.stringify(data));
                      })
                      .catch((error) => {
                          console.error('Error:', error);
                          alert('Failed to call Google API');
                      });
              });
          </script>
      </body>
      </html>
  `;  
  return res.status(200).send(htmlContent);
});


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});



export default router;