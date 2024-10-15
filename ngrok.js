const  http  = require('http');
const ngrok  = require('@ngrok/ngrok');

// Create webserver
http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end('Congrats you have created an ngrok web server');
}).listen(9000, () => console.log('Node.js web server at 8080 is running...'));

// Get your endpoint online
ngrok.connect({ addr: 8000, authtoken:'2iSUKeynH36MCeIqUX0apk2PIcj_5j4mZGy3WcCVcRktwu2ct' })
	.then(listener => console.log(`Ingress established at: ${listener.url()}`));