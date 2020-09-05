const express = require('express');
const server = express();

const db = require('./database/db');

server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }));


const nunjucks = require('nunjucks');
nunjucks.configure('src/views', {
    express: server,
    noCache: true
})

server.get('/', (req, res) => {
    return res.render('index.html', {title: 'Um título'});
});

server.get('/create-point', (req, res) => {

    return res.render('create-point.html');
});

server.post('/savepoint', (req, res) => {
    
    // console.log(req.body);

    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `;
    
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
        ];
    
    

    function afterInsertData(err){
        if(err){
            console.log(err);
            return res.render('create-point.html', { error: true });
        }

        console.log('Cadastrado com sucesso');
        console.log(this);
        
        return res.render('create-point.html', { saved: true });
    }
    
   
    db.run(query, values, afterInsertData);  
    
})

server.get('/search', (req, res) => {
    
    const search = req.query.search;
    console.log(search);

    if(search == null){
        return res.render('search-results.html', { total: 0 })
    }

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){

        if(err){
            return console.log(err);
        };

        console.log('Aqui estão seus registros');
        console.log(rows);

        const total = rows.length;

        //rows é um array com lista de objetos
        return res.render('search-results.html', { places: rows, total }); 
    });

                      
  
});




server.listen(3000);