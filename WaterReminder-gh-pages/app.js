const express=require('express');
const app=express();

app.use(express.urlencoded({extended:false}));
app.use(express.json());

const dotenv=require('dotenv');
dotenv.config({path:'./env/.env'})

app.use('/resources',express.static('public'));
app.use('/resources',express.static(__dirname+'/public'));


//ESTABLECIENDO EL MOTOR DE PLANTILLAS
app.set('view engine','ejs');

//INVOCANDO BCRYPTJS
const bcryptjs=require('bcryptjs');

//Vars de sesion
const session=require('express-session');
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));


//INVOCAMOS A LA CON DE LA BD
const connection=require('./database/db');


//ESTABLECIENDO RUTAS

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/home',(req,res)=>{
    res.render('home',{msg:'1200mL'})
})

app.get('/registrarse',(req,res)=>{
    res.render('registrar')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/tazas',(req,res)=>{
    res.render('cambiar_taza')
})

app.get('/regAgua',(req,res)=>{
    res.render('registros')
})

app.get('/Bebidas',(req,res)=>{
    res.render('otrasbebidas')
})

app.get('/configuracion',(req,res)=>{
    res.render('configuraciones')
})

app.get('/pesoaltura',(req,res)=>{
    res.render('pesoaltura')
})

app.get('/changeContra',(req,res)=>{
    res.render('cambiarcontrasena')
})

//BACK DE REGISTRO
app.post('/registrarse',async(req,res)=>{
    const nombre=req.body.name;
    const user=req.body.correo;
    const password=req.body.pass;
    connection.query('INSERT INTO usuario SET ?',{Usuario:nombre,Password:password,email:user,Sesion:0},async(error,results)=>{
        if (error) {
            console.log(error);
        }res.send(`
        <a href="/login">Back</a>
        <br>
        <h1>Registro de ${nombre} exitoso</h1>`)
    })
})

//LOGIN
app.post('/auth',async(req,res)=>{
    const Usuario=req.body.usuario;
    const Password=req.body.pass;
    console.log(Usuario)
    if (Usuario&&Password) {
        console.log(`El usuario: ${Usuario} y la contra: ${Password}`)
        connection.query('SELECT Password FROM usuario WHERE email="'+Usuario+'"',(error,respuesta,field)=>{
            console.log(respuesta);
           

            if(respuesta[0].Password===Password){
                // res.send(`<a href="/home">Ingresar</a>
                // <h1>INGRESO EXITOSO</h1>
                // `)
                console.log('Ingreso exitoso al sistema')
                res.redirect('/home')
            }else{
                console.log(respuesta[0].Password)
                console.log('Error')
            }
        })
    }



})


app.listen(3150,(req,res)=>{
    console.log('Escuchando desde el puerto 3150')
})