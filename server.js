var express=require('express'),
    app=express(),
    bodyParser=require('body-parser'),
    port=process.env.PORT || 8080,
    router=express.Router(),
    models=require('./models');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


router.use(function(req,res,next){
  console.log("Something is happening");
  next();
});

router.get('/',function(req,res){
  res.json({message: 'welcome to my API!'});
});

router.route('/bears')
  .post(function(req,res){
    models.Bear.forge({
      name: req.body.name
    })
    .save()
    .then(function(bear){
      res.json({
        error: false,
        data: {id: bear.get('id'), name: bear.get('name')}
      })
    })
    .otherwise(function(err){
      res.status(500).json({
        error: true,
        data: {message: err.message}
      })
    })
  })
  .get(function(req,res){
    models.Bears.forge()
    .fetch()
    .then(function(bearArray){
      res.json({
        error: false,
        data: bearArray.toJSON()
      })
    })
    .otherwise(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    })
  });

router.route('/bears/:id')
  .get(function(req,res){
      models.Bear.forge({id: req.params.id})
    .fetch()
    .then(function(bear){
      if (!bear)
        res.status(404).json({ error: true, data: {} });
      res.json({
        error: false,
        data: bear.toJSON()
      })
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





app.use('/api',router);

app.listen(port);
console.log('Magic happens on port '+port);
