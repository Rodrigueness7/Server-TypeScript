import * as http from 'http';
import {URL} from 'url';

const port : number  = 3000;
let data : string [] = []

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    const { method, url } = req;
    const parsedUrl = new URL(url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

   res.setHeader('content-type', 'application/json');

   if(method === 'GET' && pathname === '/findAllData') {
     res.statusCode = 200;
     res.end(JSON.stringify({data: data}))

   } else if(method === 'GET' && pathname.startsWith('/findData/')) {
        const id = parseInt(pathname.split('/')[2]);
        if(id >= 0 && id < data.length) {
            res.statusCode = 200;
            res.end(JSON.stringify({data: data[id]}))
        }

   } else if(method === 'POST' && pathname === '/addData') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            res.statusCode = 200;
            data.push(JSON.parse(body));
            res.end(JSON.stringify({received: JSON.parse(body)}));
           
        });

   } else if (method === 'PUT' && pathname.startsWith('/updateData/')) {
        const id = parseInt(pathname.split('/')[2]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            if(id >= 0 && id < data.length) {
                data[id] = JSON.parse(body);
                res.statusCode = 200;
                res.end(JSON.stringify({uptaded: data[id]}))
            }
        })
    } else if (method === 'DELETE' && pathname.startsWith('/deleteData/')) {
        const id = parseInt(pathname.split('/')[2]);
        if(id >= 0 && id < data.length) {
            const deleteItem = data.splice(id, 1);
            res.statusCode = 200;
            res.end(JSON.stringify({delete: deleteItem[0]}))
        }}
});

server.listen(port, () => {
    console.log(`Server running at port: ${port}`);
})