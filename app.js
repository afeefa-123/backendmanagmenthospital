const jwt = require("jsonwebtoken");
const express = require('express')
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const app=express()
const port=4001
const mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1/hospital')
const db=mongoose.connection
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json()); 


// app.get('/l',function (req,res,next){
//     let obj= {

//         name:'dsdsd',
//         age:'dfdf'
    
//     }
//     res.json(obj)
//     })

app.post('/login',async function(req,res,next){
    const{username,password}=req.body
    await db.collection('login').findOne().then(response=>{
        if(username==response.username && password==response.password){
            console.log('login succesful')
            token = jwt.sign(
                { userId: response.id, email: response.username },
                "secretkeyappearshere",
                { expiresIn: "1h" }
              );
            res.json({success:true,
                data: {
                    userId: response.id,
                    username: response.username,
                    token: token,
                  },});
        }   
        else{
            console.log('invalid username or password')
            res.json({message:'invalid password',success:false})
        
        }
        
    })
})
const auth=(req,res,next)=>{
    console.log('authentication');
    // console.log(req.headers);
    console.log(req.headers.authorization.split(' '));
    const [bearer, token] = req.headers.authorization.split(' ');
    console.log(token);
    jwt.verify(token, 'secretkeyappearshere', function(err, decoded) {
        // console.log(decoded.foo,'fo---------') // bar
        console.log(decoded,'decoded');
        if(decoded){
            next()
            // res.json({status:true,mesasge:"ok"})
        }
        else{
            console.log(err.message);
            res.json({status:false,message:err.message})
        }
    
      });

}
app.post('/add_department',async function(req,res,next){
    await db.collection('Department').insertOne(req.body)
    console.log(req.body);
    
    res.json('added')
})
app.post('/forgot',async function(req,res,next){
    await db.collection('login').updateOne({username:'admin'},{$set:req.body})
    console.log(req.body);
    res.json({message:'successful'})
})
app.get('/view_department',auth, async function(req,res,next){
    let data=await db.collection('Department').find().toArray()
    console.log(data);
    res.json(data)
   
})
app.get('/userview_department',async function(req,res,next){
    let data=await db.collection('Department').find().toArray()
    console.log(data);
    res.json(data)
})
app.get('/view_employe',auth,async function(req,res,next){
    let data=await db.collection('Employees').find().toArray()
    console.log(data);
    res.json(data)
})

app.get('/userview_employe',async function(req,res,next){
    let data=await db.collection('Employees').find().toArray()
    console.log(data);
    res.json(data)
})
app.post('/delete_department/:id',async function(req,res,next){
    const objectid=new ObjectId(req.params)
    let data=await db.collection('Department').deleteOne({_id:objectid  })
    res.json(data)
})
app.post('/delete_department_head/:id',async function(req,res,next){
    const objectid=new ObjectId(req.params)
    let data=await db.collection('Department_heads').deleteOne({_id:objectid  })
    res.json(data)
})

app.post('/delete_employee/:id',async function(req,res,next){
    const objectid=new ObjectId(req.params)
    let data=await db.collection('Employees').deleteOne({_id:objectid  })
    res.json(data)
})

app.get('/view_employees/:id',async function(req,res,next){
    const objectid=new ObjectId(req.params)
    let data=await db.collection('Employees').findOne({_id:objectid})
    res.json(data)
})

app.get('/view_department_heads',auth,async function(req,res,next){

    let data=await db.collection('Department_heads').find().toArray()
    res.json(data)
})

app.get('/userview_department_heads',async function(req,res,next){

    let data=await db.collection('Department_heads').find().toArray()
    res.json(data)
})

app.get ('/edit_department/:id',async function(req,res,next){
    const objectid=new ObjectId(req.params)
    console.log(req.params);
    console.log(objectid,'id');
    let data=await db.collection('Department').findOne({_id:objectid})
    res.json(data)
})

app.get ('/edit_view_department_heads/:id',async function(req,res,next){
    const objectid=new ObjectId(req.params)
    console.log(req.params);
    console.log(objectid,'id');
    let data=await db.collection('Department_heads').findOne({_id:objectid})
    res.json(data)
})

app.get ('/viewmore_department_head/:id',async function(req,res,next){
    const objectid=new ObjectId(req.params)
    console.log(req.params);
    console.log(objectid,'id');
    let data=await db.collection('Department_heads').findOne({_id:objectid})
    res.json(data)
})
app.get ('/viewmore_department/:id',async function(req,res,next){
    const objectid=new ObjectId(req.params)
    console.log(req.params);
    console.log(objectid);
    let data=await db.collection('Department').findOne({_id:objectid})
    res.json(data)
})
app.get ('/edit_employee_view/:id',async function(req,res,next){
    const objectid=new ObjectId(req.params)
    console.log(req.params);
    console.log(objectid,'id');
    let data=await db.collection('Employees').findOne({_id:objectid})
    res.json(data)
})
app.get ('/viewmore_department_link/:id',async function(req,res,next){
    const objectid=req.params
    console.log(req.params);
    console.log(objectid);
    let data=await db.collection('Department').findOne({Dept_Name:objectid.id})
    res.json(data)
    
})
app.get ('/viewmore_department_head_link/:id',async function(req,res,next){
    const objectid=req.params
    console.log(req.params);
    console.log(objectid);
    let data=await db.collection('Department_heads').findOne({Name:objectid.id})
    res.json(data)
    
})
app.post('/edit_post_depart/:id',async function(req,res,next){
    const objectid=new ObjectId(req.params)
    console.log(req.params);
    console.log(req.body,'update value');
    let data=await db.collection('Department').updateOne({_id:objectid},{$set:req.body})
    console.log(data);
   
})
app.post('/edit_post_depart_head/:id',async function(req,res,next){
    const objectid=new ObjectId(req.params)
    console.log(req.params);
    console.log(req.body,'update value');
    let data=await db.collection('Department_heads').updateOne({_id:objectid},{$set:req.body})
    console.log(data);
   
})

app.post('/add_dept_head',async function(req,res,next){
    await db.collection('Department_heads').insertOne(req.body)
    res.json('added')
})

app.post('/add_employees',async function(req,res,next){
    await db.collection('Employees').insertOne(req.body)
    res.json('added')
})
app.post('/edit_employees/:id',async function(req,res,next){
    const objectid=new ObjectId(req.params)
    await db.collection('Employees').updateOne({_id:objectid},{$set:req.body})
    res.json('added')
})

app.get('/view_department_head/:Dept_Name',async function(req,res,next){
    const dept_name=req.params
    console.log(dept_name);
    console.log(dept_name.Dept_Name);
    let data=await db.collection('Department_heads').find({Dept_Name:dept_name.Dept_Name}).toArray()
    console.log(data);
    res.json(data)
})
app.get('/logout',function(req,res,next){
    jwt.destroy(token)
})





app.listen(port,()=>{
    console.log('example app listening on port',{port});
})  
