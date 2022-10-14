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

// app.get('/',(req,res)=>{
//     res.render('index')
// })

app.get('/index',(req,res)=>{
    res.render('index')
})

app.get('/home',(req,res)=>{
    res.render('home',{msg:'1200mL'})
    req.session.usuario='Isma',
    req.session.visitas=req.session.visitas ? ++req.session.visitas:1;
    console.log(req.session);
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
        }else{
            console.log('Usuario Registrado con exito')
            res.redirect('/login')
        }
    })
})

//BACK DE LOGIN
app.post('/auth',async(req,res)=>{
    const Usuario=req.body.usuario;
    const Password=req.body.pass;
    console.log(Usuario)
    if (Usuario&&Password) {
        console.log(`El usuario: ${Usuario} y la contra: ${Password}`)
        
        connection.query('SELECT email FROM usuario WHERE email="'+Usuario+'"',(error,respuesta,field)=>{
            if(respuesta[0].email===Usuario){
                console.log('Usuario existente')
            }else{
                res.redirect('/')
                console.log('Usuario inexistente')
            }
        })
        
        connection.query('SELECT Password FROM usuario WHERE email="'+Usuario+'"',(error,respuesta,field)=>{
            
            if(respuesta[0].Password===Password){
                console.log('Ingreso exitoso al sistema')
                res.redirect('/home')
            }else{
                res.redirect('/')
                console.log('Contrasena incorrecta')
            }
        })
    }

    req.session.loggedin=true;



})

//CONFIRMAR SESIONES
app.get('/',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion creada')
        res.render('/configuracion',{
            login:true,
            name:req.session.Usuario
        })
    }else{
        console.log('NO hay sesion activa')
        res.render('index',{
            login:false,
            name:'Inicie Sesion'
        })
    }
})

//CERRAR SESION
app.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        console.log('Sesion cerrada')
        res.redirect('/')
    })
})


app.listen(3150,(req,res)=>{
    console.log('Escuchando desde el puerto 3150')
})