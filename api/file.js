const faunadb = require('faunadb')
const client = new faunadb.Client({secret:"fnAEA7V-q5ACDLD3Shn7KWkAUywu77Ly8WRQMzKN"})
import express from 'express'
const app = express()
const {
    Paginate,
    Get, // GET
    Ref,
    Create, // POST
    Collection, 
    Update, // PUT
    Documents,
    Delete,
    Map,
    Match,
    Index,
    Lambda,
    Var

} = faunadb.query

const crypto = require('crypto')


// called every time an account is changed
async function authenticate(username, password){
    const today = new Date()
    let match = []
    const doc = await client.query(
        Map(
            Paginate(
                Match(Index("users_by_username"), username)
            ),
            Lambda("X", Get(Var("X")))
        )
    )
    // if no users with the username are found
    if(doc.data.length < 1){
        // ambiguous message for security
        return {statusCode: 403, body: JSON.stringify({message: "Error - authentication failed"})}
    }
    let data = doc.data[0].data
    let key = crypto.createHmac("sha512", data.salt).update(password).digest("hex")
    if(data.password == key){
        const {salt, hash} = await new_password(password)
        await client.query(
            Update(
                Ref(Collection("users"), String(doc.data[0].ref).split("\"")[3]),
                {
                    data:{
                        "accessed": today.toLocaleDateString('en-us', {timeZone:'America/Los_Angeles'}),
                        "salt": salt,
                        "password": hash
                    }
                }
            )
        )
        doc.data[0].id = String(doc.data[0].ref).split("\"")[3]
        if(data.enabled)
            return {statusCode: 200, body:JSON.stringify(doc.data[0])}
    }
    
    return {statusCode: 403, body:JSON.stringify({message: "Error - authentication failed"})}
}

async function new_password(plaintext){
    const salt = crypto.randomBytes(128).toString('base64');
    const sha256hasher = crypto.createHmac("sha512", salt)
    const password = sha256hasher.update(plaintext).digest("hex")
    return {salt: salt, hash: password, pass: plaintext }
}

app.post('/', (req, res) => {
    console.log(req)
})
exports.handler = async(event, context)=>{
    const {username, password} = JSON.parse(event.body)
    const res = await authenticate(username, password)
    if(res.statusCode === 200){
        if(event.httpMethod === "POST"){
            const {action} = JSON.parse(event.body)
            if(action === "add_department"){
                let doc = await client.query(
                    Create(
                        Collection("departments"),
                        {
                            data:{
                                "name": '',
                                "description":'',
                                "img":'',
                                "products":[]
                            }
                        }
                    )
                )
                doc.data.id=String(doc.ref).split("\"")[3]
                return {statusCode: 200, body:JSON.stringify(doc)}
            }
            else if(action === "add_product"){
                const {parent} = JSON.parse(event.body)
                let doc = await client.query(
                    Create(
                        Collection("products"),
                        {
                            data:{
                                "name":'',
                                "model":'',
                                "assetTag":'',
                                "img":'',
                                "category":[]
                            }
                        }
                    )
                )
                doc.data.id=String(doc.ref).split("\"")[3]
                let department = await client.query(
                    Get(
                        Ref(Collection("departments"), parent)
                    )
                )
                department.data.products.push(doc.data.id)
                department = await client.query(
                    Update(
                        Ref(Collection("departments"), parent),
                        {
                            data:{
                                "products":department.data.products
                            }
                        }
                    )
                )
                return {statusCode: 200, body:JSON.stringify(doc)}
            }
            else if(action ==="add_category"){
                const {parent} = JSON.parse(event.body)
                let doc = await client.query(
                    Create(
                        Collection("category"),
                        {
                            data:{
                                "name":'',
                                "docs":[]
                            }
                        }
                    )
                )
                doc.data.id=String(doc.ref).split("\"")[3]
                let product = await client.query(
                    Get(
                        Ref(Collection("products"), parent)
                    )
                )
                product.data.category.push(doc.data.id)
                product = await client.query(
                    Update(
                        Ref(Collection("products"), parent),
                        {
                            data:{
                                "category":product.data.category
                            }
                        }
                    )
                )
                return {statusCode: 200, body:JSON.stringify(doc)}
            }
            else if(action === "add_document"){
                const {parent} = JSON.parse(event.body)
                let doc = await client.query(
                    Create(
                        Collection("documents"),
                        {
                            data:{
                                "name":'',
                                "data":''
                            }
                        }
                    )
                )
                doc.data.id=String(doc.ref).split("\"")[3]
                let category = await client.query(
                    Get(
                        Ref(Collection("category"), parent)
                    )
                )
                category.data.docs.push(doc.data.id)
                await client.query(
                    Update(
                        Ref(Collection("category"), parent),
                        {
                            data:{
                                "docs":category.data.docs
                            }
                        }
                    )
                )
                return {statusCode: 200, body:JSON.stringify(doc)}
            }
            else if(action === "edit_department"){
                const {id, name, img, description} = JSON.parse(event.body)
                const doc = await client.query(
                    Update(
                        Ref(Collection("departments"), id),
                        {
                            data:{
                                "name": name,
                                "img": img,
                                "description": description
                            }
                        }
                    )
                )
                return {statusCode: 200, body: JSON.stringify(doc)}
            }
            else if(action === "edit_product"){
                const {id, name, img, model, assetTag} = JSON.parse(event.body)
                const doc = await client.query(
                    Update(
                        Ref(Collection("products"), id),
                        {
                            data:{
                                "name":name,
                                "img":img,
                                "model":model,
                                "assetTag":assetTag
                            }
                        }
                    )
                )
                return {statusCode: 200, body: JSON.stringify(doc)}
            }
            else if(action === 'edit_category'){
                const {id, name} = JSON.parse(event.body)
                const doc = await client.query(
                    Update(
                        Ref(Collection("category"), id),
                        {
                            data:{
                                "name":name
                            }
                        }
                    )
                )
                return {statusCode: 200, body: JSON.stringify(doc)}
            }
            else if(action === "edit_document"){
                const{id, name, data} = JSON.parse(event.body)
                const doc = await client.query(
                    Update(
                        Ref(Collection("documents"), id),
                        {
                            data:{
                                "name":name,
                                "data":data
                            }
                        }
                    )
                )
                return {statusCode: 200, body: JSON.stringify(doc)}
            }
            else if(action === "get_department"){
                const {id} = JSON.parse(event.body)
                let doc = await client.query(
                Get(
                    Ref(Collection("departments"), id)
                )
                )
                doc.data.id=id
                return{statusCode:200, body:JSON.stringify(doc)}
            }
            else if(action === "get_product"){
                const {id} = JSON.parse(event.body)
                let doc = await client.query(
                Get(
                    Ref(Collection("products"), id)
                )
                )
                doc.data.id=id
                return{statusCode:200, body:JSON.stringify(doc)}
            }
            else if(action === "get_category"){
                const {id} = JSON.parse(event.body)
                let doc = await client.query(
                Get(
                    Ref(Collection("category"), id)
                )
                )
                doc.data.id=id
                return{statusCode:200, body:JSON.stringify(doc)}
            }
            else if(action === "get_document"){
                const {id} = JSON.parse(event.body)
                let doc = await client.query(
                Get(
                    Ref(Collection("documents"), id)
                )
                )
                doc.data.id=id
                return{statusCode:200, body:JSON.stringify(doc)}
            }
            else if(action === "get_all"){
                let dep = await client.query(
                    Map(
                        Paginate(
                            Match(Index("all_departments"))
                        ),
                        Lambda("X", Get(Var("X")))
                    )
                )
                let products = []
                let categories = []
                let docs = []
                let p, c, d
                for(let i = 0; i < dep.data.length; ++i){
                    dep.data[i].data.id = String(dep.data[i].ref).split("\"")[3] // add id to department
                    products = []
                    for(let j = 0; j < dep.data[i].data.products.length; ++j){ // get data of products in each department
                        categories = []
                        p = await client.query(
                            Get(
                                Ref(Collection("products"), dep.data[i].data.products[j])
                            )
                        )
                        p.data.id = String(p.ref).split("\"")[3]
                        for(let k = 0; k < p.data.category.length; ++k){ // get data of categories for each product
                            docs = []
                            c = await client.query(
                                Get(
                                    Ref(Collection("category"), p.data.category[k])
                                )
                            )
                            c.data.id = String(c.ref).split("\"")[3]
                            for(let l = 0; l < c.data.docs.length; ++l){
                                d = await client.query(
                                    Get(
                                        Ref(Collection("documents"), c.data.docs[l])
                                    )
                                )
                                d.data.id = String(d.ref).split("\"")[3]
                                docs.push(d)
                            }
                            c.data.docs = docs
                            categories.push(c)
                        }
                        p.data.category = categories // add categories to fiven product
                        products.push(p)
                    }
                    dep.data[i].data.products = products // add products to given department
                }
                return{statusCode: 200, body:JSON.stringify(dep)}
            }
            else if(action === 'delete_department'){
                const {id} = JSON.parse(event.body)
                let dep = await client.query(
                    Get(Ref(Collection("departments"), id))
                )
                let p
                for(let i = 0; i < dep.data.products.length; ++i){
                    console.log(dep.data.products[i])
                    p = await client.query(
                        Get(Ref(Collection("products"),dep.data.products[i]))
                    )
                    let c
                    for(let j = 0; j < p.data.category.length; ++j){
                        console.log(p.data.category[j])
                        c = await client.query(
                            Get(Ref(Collection("category"),p.data.category[j]))
                        )
                        for(let k = 0; k < c.data.docs.length; ++k){
                            console.log(c.data.docs[k])
                            await client.query(
                                Delete(Ref(Collection("documents"),c.data.docs[k]))
                            )
                        }
                        await client.query(
                            Delete(Ref(Collection("category"),p.data.category[j]))
                        )
                    }
                    await client.query(
                        Delete(Ref(Collection("products"),dep.data.products[i]))
                    )
                }
                const doc = await client.query(
                    Delete(Ref(Collection("departments"), id))
                )
                return{statusCode:200, body:JSON.stringify(doc)}
            }
            else if(action === 'delete_product'){
                const {id, parent} = JSON.parse(event.body)
                let pro = await client.query(
                    Get(Ref(Collection("products"), id))
                )
                for(let j = 0; j < pro.data.category.length; ++j){
                    c = await client.query(
                        Get(Ref(Collection("category"),pro.data.category[j]))
                    )
                    for(let k = 0; k < c.data.docs.length; ++k){
                        await client.query(
                            Delete(Ref(Collection("documents"),c.data.docs[k]))
                        )
                    }
                    await client.query(
                        Delete(Ref(Collection("category"),pro.data.category[j]))
                    )
                }
                let d = await client.query(
                    Get(Ref(Collection("departments"), parent))
                )
                d.data.products.splice(d.data.products.indexOf(id), 1)
                d = await client.query(
                    Update(
                        Ref(Collection("departments"), parent),
                        {
                            data:{
                                "products":d.data.products
                            }
                        }
                    )
                )
                const doc = await client.query(
                    Delete(Ref(Collection("products"), id))
                )
                return{statusCode:200, body:JSON.stringify(doc)}
            }
            else if(action === 'delete_category'){
                const {id, parent} = JSON.parse(event.body)
                let c = await client.query(
                    Get(Ref(Collection("category"),id))
                )
                console.log(c)
                for(let k = 0; k < c.data.docs.length; ++k){
                    await client.query(
                        Delete(Ref(Collection("documents"),c.data.docs[k]))
                    )
                }
                const doc = await client.query(
                    Delete(Ref(Collection("category"),id))
                )
                let d = await client.query(
                    Get(Ref(Collection("products"), parent))
                )
                d.data.category.splice(d.data.category.indexOf(id), 1)
                await client.query(
                    Update(
                        Ref(Collection("products"), parent),
                        {
                            data:{
                                "category":d.data.category
                            }
                        }
                    )
                )
                return{statusCode:200, body:JSON.stringify(doc)}
                
            }
            else if(action === 'delete_document'){
                const {id, parent} = JSON.parse(event.body)
                const doc = client.query(
                    Delete(Ref(Collection("documents"),id))
                )
                let d = await client.query(
                    Get(Ref(Collection("category"), parent))
                )
                d.data.docs.splice(d.data.docs.indexOf(id), 1)
                d = await client.query(
                    Update(
                        Ref(Collection("category"), parent),
                        {
                            data:{
                                "docs":d.data.docs
                            }
                        }
                    )
                )
                return{statusCode:200, body:JSON.stringify(doc)}
            }
            else if(action ==="get_all_departments"){
                let dep = await client.query(
                    Map(
                        Paginate(
                            Match(Index("all_departments"))
                        ),
                        Lambda("X", Get(Var("X")))
                    )
                )
                for(let i = 0; i < dep.data.length; ++i)
                    dep.data[i].data.id = String(dep.data[i].ref).split("\"")[3] // add id to department
                return {statusCode:200, body: JSON.stringify(dep)}
            }
            else if(action === "get_all_products"){
                let doc = await client.query(
                    Map(
                        Paginate(
                            Match(Index("all_products"))
                        ),
                        Lambda("X", Get(Var("X")))
                    )
                )
                for(let i = 0; i < doc.data.length; ++i)
                    doc.data[i].data.id = String(doc.data[i].ref).split("\"")[3] // add id to department
                return {statusCode:200, body: JSON.stringify(doc)}
            }
            else if(action ==="get_products_in_department"){
                const {department} = JSON.parse(event.body)
                let dep = await client.query(
                    Get(Ref(Collection("departments"), department))
                )
                let p = []
                for(let i = 0; i < dep.data.products.length; ++i){
                    p.push(await client.query(Get(Ref(Collection('products'),dep.data.products[i]))))
                    p[i].data.id = String(p[i].ref).split("\"")[3]
                }
                return {statusCode: 200, body: JSON.stringify(p)}
            }
            else if(action === "get_cats_in_product"){
                const {product} = JSON.parse(event.body)
                let dep = await client.query(
                    Get(Ref(Collection("products"), product))
                )
                let p = []
                let c
                for(let i = 0; i < dep.data.category.length; ++i){
                    c = await client.query(Get(Ref(Collection('category'),dep.data.category[i])))
                    p.push(c.data)
                    p[i].id = String(c.ref).split("\"")[3]
                }
                return {statusCode: 200, body: JSON.stringify(p)}
            }
            else if(action === "get_docs_in_cat"){
                const {category} = JSON.parse(event.body)
                let dep = await client.query(
                    Get(Ref(Collection("category"), category))
                )
                let p = []
                for(let i = 0; i < dep.data.docs.length; ++i){
                    p.push(await client.query(Get(Ref(Collection('documents'),dep.data.docs[i]))))
                    p[i].data.id = String(p[i].ref).split("\"")[3]
                }
                return {statusCode: 200, body: JSON.stringify(p)}

            }
            else {
                return {statusCode: 405, body:JSON.stringify({message: "Error - method not allowed"})}
    
            }
            
    
        }
        else{
            return {statusCode: 405, body:JSON.stringify({message: "Error - method not allowed"})}
    
        }
    }
    else{
        return {statusCode: 403, body: JSON.stringify({message:'Couldn\'t Authenticate'})}
    }
    
}

export default {
    path: '/api/file',
    handler: app
  }