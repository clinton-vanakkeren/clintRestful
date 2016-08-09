var express=require('express'),
    app=express(),
    bodyParser=require('body-parser'),
    port=process.env.PORT || 8080,
    router=express.Router(),
    connect=require('connect'),
    methodOverride=require('method-override'),
    models=require('./models');

app.set('view engine', 'jade');
app.set('views', __dirname+'/VIEWS/BEARS');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
router.use(function(req,res,next){
  console.log("Something is happening");
  next();
});

router.get('/',function(req,res){
  res.render('new', {message: 'welcome to my API!', title:'Home'});
});
function getBearRoute(req,res){
  models.Bears.forge()
  .fetch()
  .then(function(bearArray){
    // console.log('INSIDE GET:', req);
    res.render('index', {
      bears : bearArray.toJSON()
    })
  })
  .otherwise(function (err) {
    res.status(500).json({ error: true, data: { message: err.message } });
  })
}

router.route('/bears')
  // .post(function(req,res){
  //   models.Bear.forge({
  //     name: req.body.name
  //   })
  //   .save()
  //   .then(function(bear){
  //     res.json({
  //       error: false,
  //       data: {id: bear.get('id'), name: bear.get('name')}
  //     })
  //   })
  //   .otherwise(function(err){
  //     res.status(500).json({
  //       error: true,
  //       data: {message: err.message}
  //     })
  //   })
  // })
  // .put(function(req, res){
  //   console.log('INSIDE PUT', req.method)
  //   res.send('sup hoe');
  //})
  .get(getBearRoute);

router.route('/bears/new')
  .get(function(req,res){
    res.render('new', {message: 'BUILD A BEAR', title:'ADD BEAR'});
  })
  .post(function(req,res){
    models.Bear.forge({name: req.body.name})
   .save()
    .then(function(bear){
      console.log('INSIDE POST:',req.method)
      res.format({
        html: function(){
          res.location("bears");
          res.redirect("/api/bears");
        },
        json: function(){
          res.json(bear);
        }
      });
    })
  });

  router.route('/bears/:id')
    .get(function(req,res){
        models.Bear.forge({id: req.params.id})
      .fetch()
      .then(function(bear){
        if (!bear)
          res.status(404).json({ error: true, data: {} });
        res.render('show', {message:'Look a Dis Bear', bear: bear.toJSON()})
      })
      .otherwise(function (err) {
        res.status(500).json({ error: true, data: { message: err.message } });
      })
    })
    .put(function(req,res){
        models.Bear.forge({id: req.params.id})
      .fetch({require: true})
      .then(function(bear){
        bear.save({name: req.body.name})
        .then(function(bear){
          res.json({message:'Bear Name Updated!',data: bear.toJSON()})
        })
      })
      .otherwise(function (err) {
        res.status(500).json({ error: true, data: { message: err.message } });
      })
    })
    .delete(function(req,res){
      models.Bear.forge({id: req.params.id})
      .fetch()
      .then(function(bear){
        if (!bear){
          res.status(404).json({ error: true, data: {} });
        }
        bear.destroy()
        .then(function(bear){
          res.json({message: 'Bear Deleted!'})
        })
      })
      .otherwise(function (err) {
        res.status(500).json({ error: true, data: { message: err.message } });
      })
    });

router.route('/bears/:id/edit')
  .get(function(req,res){
    models.Bear.forge({id:req.params.id})
    .fetch()
    .then(function(bear){
      res.render('edit', {message: 'Edi ta bear!', bear: bear.toJSON()});
    })
  })
  .put([function(req,res,next){
    models.Bear.forge({id: req.params.id})
    .fetch()
    .then(function(bear){
      bear.save({name:req.body.name})
      .then(function(bear){
        next()
      })
    })
  },getBearRoute]);

router.route('/bears/:id/delete')
  .get(function(req,res){
    models.Bear.forge({id:req.params.id})
    .fetch()
    .then(function(bear){
      res.render('delete', {bear:bear.toJSON()});
    })
  })
  .delete([function(req,res,next){
    models.Bear.forge({id:req.params.id})
    .fetch()
    .then(function(bear){
      bear.destroy()
      .then(function(bear){
        next()
      })
    })
  },getBearRoute]);









app.use('/api',router);

app.listen(port);
console.log('Magic happens on port '+port);
