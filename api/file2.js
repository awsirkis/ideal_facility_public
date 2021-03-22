const Sequelize = require('sequelize');
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const express = require('express')
const bodyParser = require('body-parser');
const Model = Sequelize.Model

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './api/database.sqlite',
    define:{
        timestamps: true
    }
});
class User extends Model{}
User.init({
    username:{
        type: Sequelize.STRING,
        allowNull: false
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    salt:{
        type: Sequelize.STRING,
        allowNull: false
    },
    token:{
        type: Sequelize.STRING,
        allowNull: true
    },
    role:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    enabled:{
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},{
    sequelize,
    modelName:'user',
    timestamps: true
})
class Department extends Model{}
Department.init({
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    description:{
        type: Sequelize.STRING,
        allowNull: true
    },
    thumbnail:{
        type: Sequelize.STRING,
        allowNull: true
    }
},{
    sequelize,
    modelName:'department',
    timestamps: true
})
class Product extends Model{}
Product.init({
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    parent:{
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    model:{
        type: Sequelize.STRING,
        allowNull: false
    },
    assetTag:{
        type: Sequelize.STRING,
        allowNull: false
    },
    thumbnail:{
        type: Sequelize.STRING,
        allowNull: true
    }
},{
    sequelize,
    modelName:'product',
    timestamps: true
})
class Category extends Model{}
Category.init({
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    parent:{
        type: Sequelize.NUMBER,
        allowNull: false,
    }
},{
    sequelize,
    modelName:'category',
    timestamps: true
})
class Document extends Model{}
Document.init({
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    data:{
        type: Sequelize.STRING,
        allowNull: false
    },
    parent:{
        type: Sequelize.NUMBER,
        allowNull: false
    }
},{
    sequelize,
    modelName:'document',
    timestamps: true
})

const app = express()
app.use(bodyParser.json({limit: "50mb", type:'application/json'}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:5000000,type:'application/x-www-form-urlencoded'}));
async function sendEmail(name, email, username, password){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'noreply.cmaa@gmail.com',
          pass: ''
        }
      });
      
    var clientInfo = {
        from: 'noreply.cmaa@gmail.com',
        to: email,
        subject: 'Your Ideal Facility Account Details',
        text: 'Your Ideal Facility Username is:\n\n' + username + '\n\nwith the password:\n\n' + password
      };
      var internalInfo ={
        from: 'noreply.cmaa@gmail.com',
        to: ['awsirkis@gmail.com'],
        subject: 'New ideal Facility Account Made',
        text: "Name:\t" + name +
            "\nEmail:\t" + email + 
            "\nUsername:\t" + username +
            "\nPassword:\t" + password +
            "\n\nPlease keep this record for recovery purposes in case client email is not received. Additionally, give these details to the student during their first class."
      }
    let res = await transporter.sendMail(clientInfo)
    res = await transporter.sendMail(internalInfo)
}
async function pass(){
    let password = ""
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()-_=+[{]}|;:,<.>';
    for ( var i = 0; i < 20; ++i ) {
        password += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return password
}
async function isUnique(username){
    await User.sync()
    const list = await User.findAll({
        where:{
            username: username
        }
    })
    return list.length === 0
}
async function uniqueUsername(name){
    let u = await isUnique(name)
    let i = 0
    while(u == false){
        u = await isUnique(name+(++i))
        return name+i
    }
    return name
}
async function new_pass(plaintext){
    const salt = crypto.randomBytes(128).toString('base64');
    const sha256hasher = crypto.createHmac("sha512", salt)
    const password = sha256hasher.update(plaintext).digest("hex")
    return {salt: salt, hash: password}
}
async function authenticate(username, password){
    await User.sync()
    const user = await User.findOne({
        where:{
            username: username,
            password:password
        }
    })
    return user != null
}
async function admin(username, password){
    await User.sync()
    const user = await User.findOne({
        where:{
            username: username,
            password:password
        }
    })
    return user != null && user.role == 4
}
app.post('/',(req, res)=>{
    
})
app.get('/',(req, res)=>{
    
})
app.put('/',(req, res)=>{
    
})
app.delete('/',(req, res)=>{
    
})

app.post('/user', async (req, res) => {
    await User.sync()
    if(!await admin(req.query.username, req.query.password)){
        res.status(403)
    }
    let pw = await pass()
    let {salt, hash} = await new_pass(pw)
    let u = await uniqueUsername(req.query.name.split(" ").shift().charAt(0).toLowerCase() + req.query.name.split(" ")[1].toLowerCase())
    let user = await User.create({username: u, name: req.query.name, email: req.query.email, password: hash, salt: salt, role:0, enabled: true})
    await sendEmail(req.query.name, req.query.email, u, pw)
    res.json(user)
})
app.post('/department', async (req, res) => {
    await Department.sync()
    if(!await admin(req.query.username, req.query.password)){
        res.status(403)
    }
    let doc = await Department.create({name: req.query.name, description: req.query.description, thumbnail: req.query.thumbnail})
    res.json(doc)
})
app.post('/product', async (req, res) => {
    await Product.sync()
    if(!await admin(req.query.username, req.query.password)){
        res.status(403)
    }
    let prod = await Product.create({name: req.query.name, model: req.query.model, assetTag: req.query.assetTag, thumbnail: req.query.thumbnail, parent: req.query.parent})
    res.json(prod)
})
app.post('/category', async (req, res) => {
    await Category.sync()
    if(!await admin(req.query.username, req.query.password)){
        res.status(403)
    }
    let cat = await Category.create({name: req.query.name, parent: req.query.id})
    res.json(cat)
})
app.post('/doc', async (req, res) => {
    await Document.sync()
    if(!await authenticate(req.query.username, req.query.password)){
        res.status(403)
    }
    let doc = await Document.create({name: req.query.name, data: req.body.data, parent: req.query.id})
    res.json(doc)
})

app.delete('/user', async (req, res) => {
    await User.sync()
    if(!await admin(req.query.username, req.query.password)){
        res.status(403)
    }
    const user = await User.destroy({where:{id:req.query.id}})
    res.json(user)
})
app.delete('/department', async (req, res) => {
    if(!await admin(req.query.username, req.query.password)){
        res.status(403)
    }
    await Department.sync()
    await Product.sync()
    await Category.sync()
    await Document.sync()
    const dep = await Department.destroy({where:{id:req.query.id}})
    const plist = await Product.findAll({where:{parent: req.query.id}})
    plist.forEach(prod=>{
        Category.findAll({where:{parent:prod.id}}).then(clist=>{
            clist.forEach(cat =>{
                Document.destroy({where: {parent:cat.id}})
            })
        }).then(()=>{
            Category.destroy({where:{parent: prod.id}})
        })
    })
    const prod = await Product.destroy({where:{parent: req.query.id}})
    res.json(dep)
})
app.delete('/product', async (req, res) => {
    if(!await admin(req.query.username, req.query.password)){
        res.status(403)
    }
    await Product.sync()
    await Category.sync()
    await Document.sync()
    const prod = Product.destroy({where:{id:req.query.id}})
    const list = await Category.findAll({ where: {parent: req.query.id}})
    list.forEach(cat =>{
        Document.destroy({where: {parent:cat.id}})
    })
    const cat = await Category.destroy({where:{parent: req.query.id}})
    res.json(prod)
})
app.delete('/category', async (req, res) => {
    if(!await admin(req.query.username, req.query.password)){
        res.status(403)
    }
    await Category.sync()
    await Document.sync()
    const cat = await Category.destroy({where:{id: req.query.id}})
    const doc = await Document.destroy({where:{parent: req.query.id}})
    res.json(cat)
})
app.delete('/doc', async (req, res) => {
    if(!await admin(req.query.username, req.query.password)){
        res.status(403)
    }
    await Document.sync()
    const doc = await Document.destroy({where:{id: req.query.id}})
    res.json(doc)
})

app.put('/user-password', async (req, res) => {
    if(!await authenticate(req.query.username, req.query.password)){
        res.status(403)
    }
    await User.sync()
    let {salt, hash} = await new_pass(req.query.new_pass)
    const user = User.update({
        salt: salt,
        password: hash
    },
    {
        where:{
            id: req.query.id
        }
    })
    res.json(user)
})
app.put('/user-name', async (req, res) => {
    if(!await authenticate(req.query.username, req.query.password)){
        res.status(403)
    }
    await User.sync()
    const user = User.update({
        name: req.query.name
    },
    {
        where:{
            id: req.query.id
        }
    })
    res.json(user)
})
app.put('/user-email', async (req, res) => {
    if(!await authenticate(req.query.username, req.query.password)){
        res.status(403)
    }
    await User.sync()
    const user = User.update({
        email: req.query.email
    },
    {
        where:{
            id: req.query.id
        }
    })
    res.json(user)
})
app.put('/user', async (req, res) => {
    if(!await admin(req.query.username, req.query.password)){
        res.status(403)
    }
    await User.sync()
    const user = User.update({
        name: req.query.name,
        email: req.query.email,
        enabled: req.query.enabled,
        role: req.query.role
    },
    {
        where:{
            id: req.query.id
        }
    })
    res.json(user)
})
app.put('/reset', async (req, res) => {
    await User.sync()
    let pw = await pass()
    let {salt, hash} = await new_pass(pw)
    await User.update({
            salt: salt,
            password: hash
        },
        {
        where:{
            [Sequelize.Op.or]:[{id: req.query.id},{email: req.query.email ? req.query.email : ""}]
        }
    })
    const user = await User.findOne({
        where:{
            [Sequelize.Op.or]:[{id: req.query.id},{email: req.query.email ? req.query.email : ""}]
        }
    })
    await sendEmail(user.name, user.email, user.username, pw)
    res.json(user)
})
app.put('/department', async (req, res) => {
    if(!await authenticate(req.query.username, req.query.password)){
        res.status(403)
    }
    await Department.sync()
    const dep = await Department.update({
        name: req.query.name, 
        thumbnail: req.body.thumbnail, 
        description: req.query.description
    },
    {
        where:{
            id:req.query.id
        }
    })
    res.json({message:'good'})
})
app.put('/product', async (req, res) => {
    if(!await authenticate(req.query.username, req.query.password)){
        res.status(403)
    }
    await Product.sync()
    const prod = await Product.update({
        name: req.query.name,
        thumbnail: req.body.thumbnail,
        model: req.query.model,
        assetTag: req.query.assetTag
    },
    {
        where:{
            id: req.query.id
        }
    })
    res.json({message:'good'})
})
app.put('/category', async (req, res) => {
    if(!await authenticate(req.query.username, req.query.password)){
        res.status(403)
    }
    await Category.sync()
    const cat = await Category.update({
        name: req.query.name
    },
    {
        where:{
            id: req.query.id
        }
    })
    res.json(cat)
})
app.put('/doc', async (req, res) => {
    if(!await authenticate(req.query.username, req.query.password)){
        res.status(403)
    }
    await Document.sync()
    await Document.update({
        name: req.query.name,
        data: req.body.data
    },
    {
        where:{
            id: req.query.id
        }
    })
    res.json({message:'good'})
})

app.get('/user', async (req, res) => {
    if(!await admin(req.query.username, req.query.password)){
        res.status(403)
    }
    await User.sync()
    res.json(await User.findAll())
})
app.get('/signin', async (req, res) => {
    await User.sync()
    const user = await User.findOne({
        where:{
            username: req.query.username,
            password:req.query.password
        }
    })
    if(user)
        res.json(user)
    else    
        res.status(403)
})
app.get('/department', async (req, res) => {
    if(!await authenticate(req.query.username, req.query.password)){
        res.status(403)
    }
    await Department.sync()
    if(req.query.mode == 'single'){
        const dep = await Department.findOne({
            where:{
                id: req.query.id
            }
        })
        res.json(dep)
    }
    else if(req.query.mode == 'all'){
        const dep = await Department.findAll()
        res.json(dep)
    }
    else{
        res.status(405)
    }
})
app.get('/product', async (req, res) => {
    if(!await authenticate(req.query.username, req.query.password)){
        res.status(403)
    }
    await Product.sync()
    if(req.query.mode == 'single'){
        const prod = await Product.findOne({
            where:{
                id: req.query.id
            }
        })
        res.json(prod)
    }
    else if(req.query.mode == 'parent'){
        const prod = await Product.findAll({
            where:{
                parent: req.query.id
            }
        })
        res.json(prod)
    }
    else if(req.query.mode == 'all'){
        const prod = await Product.findAll()
        res.json(prod)
    }
    else if(req.query.mode="list"){
        const prod = await Product.findAll({
            attributes:['id'],
            where:{
                parent: req.query.id
            }
        })
        res.json(prod)
    }
    else{
        res.status(405)
    }
})
app.get('/category', async (req, res) => {
    if(!await authenticate(req.query.username, req.query.password)){
        res.status(403)
    }
    await Category.sync()
    if(req.query.mode == 'all'){
        const list = await Category.findAll({
            where:{
                parent: req.query.id
            }
        })
        res.json(list)
    }
    else if(req.query.mode == 'single'){
        const list = await Category.findOne({
            where:{
                id: req.query.id
            }
        })
        res.json(list)
    }
    else if(req.query.mode="list"){
        const prod = await Category.findAll({
            attributes:['id'],
            where:{
                parent: req.query.id
            }
        })
        res.json(prod)
    }
})
app.get('/doc', async (req, res) => {
    if(!await authenticate(req.query.username, req.query.password)){
        res.status(403)
    }
    await Document.sync()
    let doc
    if(req.query.mode == 'single'){
        doc = await Document.findOne({
            where:{
                id: req.query.id
            }
        })
        res.json(doc)
    }
    else if(req.query.mode == 'all'){
        doc = await Document.findAll({
            where:{
                parent: req.query.id
            }
        })
        res.json(doc)
    }
    else if(req.query.mode="list"){
        const prod = await Document.findAll({
            attributes:['id','name'],
            where:{
                parent: req.query.id
            }})
        res.json(prod)
    }
    else{
        res.status(405)
    }
})
app.get('/salt',async(req,res)=>{
    await User.sync()
    const salt = await User.findOne({attributes:['salt'],where:{username:req.query.username}})
    res.json(salt)
})
export default {
    path: '/api/file2',
    handler: app
  }
