module.exports = function(app){
    
    var SerieTV = require("./serietv");
    var Users = require("./users");
    
    // GET
    findAllSeriesTV = function(err, res){
        SerieTV.find(function(err, seriestv){
            if(!err)
                res.send(seriestv);
            else
                console.log('Error '+ err);
        });
    }
    
    findByID = function(req, res){
        SerieTV.findById(req.params.id, function(err, serietv){
            if(!err)
                res.send(serietv);
            else
                console.log('Error '+ err);
        });
    }
    
    // POST
    addSerieTV = function(req, res){
        console.log(req.body);
        
        var serietv = new SerieTV({
            titulo: req.body.titulo,
            temporadas: req.body.temporadas,
            pais: req.body.pais,
            genero: req.body.genero
        });
        
        serietv.save(function(err){
            if(!err)
                console.log('¡Serie de TV Guardada!');
            else
                console.log('Error '+ err);
        });
        
        res.send(serietv);
    }
    
    // PUT (Update)
    updateSerieTV = function(req, res){
        SerieTV.findById(req.params.id, function(err, serietv){
            console.log(serietv);
            serietv.titulo = req.body.titulo;
            serietv.temporadas = req.body.temporadas;
            serietv.pais = req.body.pais;
            serietv.genero = req.body.genero;
            
            serietv.save(function(err){
                if(!err)
                    console.log('¡Serie de TV Actualizada!');
                else
                    console.log('Error '+ err);
            });
        });
        
    }
    
    deleteSerieTV = function(req, res){
        SerieTV.findById(req.params.id, function(err, serietv){
            serietv.remove(function(err){
                if(!err)
                    console.log('¡Serie de TV Borrada!');
                else
                    console.log('Error '+ err);
            });
        });
    }
    
    // Routes
    app.get('/', function(req, res){
        res.render('odontogram', {title: 'Aporte Medico - Odontograma 3D'});
        // var all_users = [];
        // Users.find(function(err, users){
        //     if(!err){
        //         all_users = users;
        //         res.render('home', {title: "home", users: all_users});
        //     }else{
        //         console.log('Error '+ err);
        //     }
        // });
    });
    app.get('/register', function(req, res){
        res.render('register', {title: 'Register'});
    });
    
    // ruta que me genera las caras del diente
    app.post('/generateImage', function(req, res){
        var fs = require('fs');
        
        var base64img = req.body.base64img;
        var nameTooth = req.body.nameTooth;
        var positionTooth = req.body.positionTooth;
        var sideTooth = req.body.sideTooth;
        var faceTooth = req.body.faceTooth;
        
        // console.log(req.body);
        var matches = base64img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        
        // Si no hay coincidencias
        if (matches.length !== 3) console.log("matches error");
        
        var data_image = {};
        
        data_image.type = matches[1];
        data_image.data = new Buffer(matches[2], 'base64');
        
        fs.writeFile('client/tooths_faces/' + nameTooth +"/"+ positionTooth +"/"+ sideTooth +"/"+ faceTooth + ".jpg", data_image.data, function(err) {
          //retorno null si es exitosa y viceversa
          if(!err){
              //termino la peticion mandando un estado al cleinte aqui se puede mandar la ruta estatica esta ves si sin clientxD
              res.end( JSON.stringify({
                  status:"OK",
                  msg: err
              }) );
          }else{
              res.end( JSON.stringify({
                  status:"FAIL",
                  msg: err
              }) );
          }
      });
    });
    
    app.post('/add_user', function(req, res){
        console.log(req.body);
        
        var users = new Users({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        
        users.save(function(err){
            if(!err)
                res.send('¡Usuario registrado!');
            else
                res.send('Error '+ err);
        });
    });
    app.get('/seriestv', findAllSeriesTV);
    app.get('/seriestv/:id', findByID);
    app.post('/seriestv', addSerieTV);
    app.put('/seriestv/:id', updateSerieTV);
    app.delete('/seriestv/:id', deleteSerieTV);
    app.get('/odontograma', function(req, res) {
        res.render('app', { title: 'Aporte Medico - Odontograma 3D' });
    });
}