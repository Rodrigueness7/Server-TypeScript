"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var url_1 = require("url");
var port = 3000;
var data = [];
var server = http.createServer(function (req, res) {
    var method = req.method, url = req.url;
    var parsedUrl = new url_1.URL(url, "http://".concat(req.headers.host));
    var pathname = parsedUrl.pathname;
    res.setHeader('content-type', 'application/json');
    if (method === 'GET' && pathname === '/findAllData') {
        res.statusCode = 200;
        res.end(JSON.stringify({ data: data }));
    }
    else if (method === 'GET' && pathname.startsWith('/findData/')) {
        var id = parseInt(pathname.split('/')[2]);
        if (id >= 0 && id < data.length) {
            res.statusCode = 200;
            res.end(JSON.stringify({ data: data[id] }));
        }
    }
    else if (method === 'POST' && pathname === '/addData') {
        var body_1 = '';
        req.on('data', function (chunk) {
            body_1 += chunk.toString();
        });
        req.on('end', function () {
            res.statusCode = 200;
            data.push(JSON.parse(body_1));
            res.end(JSON.stringify({ received: JSON.parse(body_1) }));
        });
    }
    else if (method === 'PUT' && pathname.startsWith('/updateData/')) {
        var id_1 = parseInt(pathname.split('/')[2]);
        var body_2 = '';
        req.on('data', function (chunk) {
            body_2 += chunk.toString();
        });
        req.on('end', function () {
            if (id_1 >= 0 && id_1 < data.length) {
                data[id_1] = JSON.parse(body_2);
                res.statusCode = 200;
                res.end(JSON.stringify({ uptaded: data[id_1] }));
            }
        });
    }
    else if (method === 'DELETE' && pathname.startsWith('/deleteData/')) {
        var id = parseInt(pathname.split('/')[2]);
        if (id >= 0 && id < data.length) {
            var deleteItem = data.splice(id, 1);
            res.statusCode = 200;
            res.end(JSON.stringify({ delete: deleteItem[0] }));
        }
    }
});
server.listen(port, function () {
    console.log("Server running at port: ".concat(port));
});
