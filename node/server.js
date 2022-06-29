const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use('/public',express.static('public'))

var db;
MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.94xmh.mongodb.net/?retryWrites=true&w=majority',function(err,client){

if (err) return console.log(err)
       db = client.db('app');
        app.listen(8000,function(){
        console.log('start server')
    })
}) 
app.get('/write',function(req,res){
    //res.sendFile(__dirname + '/write.html')
    res.render('write.ejs')
})
app.post('/ok',function(req,res){
    db.collection("counter").findOne({name:'countername'},function(err,result){
     var totalrecord = result.totalPost;   
    db.collection('memo').insertOne({_id : (totalrecord + 1), title : req.body.title, name : req.body.name, wdate : req.body.wdate, memo : req.body.memo},function(err,result){
        db.collection("counter").updateOne({name :'countername'},{ $inc: {totalPost:1}},function(err,result){
   
        console.log("입력완료");
        res.redirect('/list')

            })
        })
    }) 
 
});

app.get('/edit/:id',function(req,res){
    db.collection('memo').findOne({_id:parseInt(req.params.id)},function(err,result){
    res.render('edit.ejs',{data : result})
    })
});

app.put('/edit',function(req,res){
    db.collection('memo').updateOne({_id:parseInt(req.body.id)},{$set : { title : req.body.title,name : req.body.name, wdate : req.body.wdate, memo : req.body.memo}},function(err,result){
        
        
        console.log("수정완료");
        res.redirect('/list')
        
    })
})

app.get('/list',function(req,res){
    db.collection('memo').find().skip(0).limit(10).sort({"amount":1,"_id":-1}).toArray(function(err,result){
       // console.log(result)    
    res.render('list.ejs',{memos:result});
    })
    
})

app.get('/view/:id',function(req,res){
    db.collection('memo').findOne({_id:parseInt(req.params.id)},function(err,result){
        res.render('view.ejs',{data : result})
    })   
});

app.delete('/delete',function(req,res){
    req.body._id = parseInt(req.body._id)
    db.collection('memo').deleteOne(req.body,function(err,result){
        console.log(req.body)
        
    })
    res.send('삭제완료')
   
})

app.get('/search', function(req,res){
    //console.log(req.query)
    db.collection('memo').find({title : RegExp(req.query.value)}).toArray(function(err,result){
        res.render('search.ejs',{memos : result})
    })
})

app.get('/shop',function(req,res){
    res.sendFile(__dirname + '/shop.html')
})

app.get('/news',function(req,res){
    res.sendFile(__dirname + '/news.html')
})

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html')
})


