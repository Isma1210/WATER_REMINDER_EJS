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

    //connection.query('SELECT*FROM consumo_agua',(error,results)=>{
    connection.query('SELECT*FROM prueba',(error,results)=>{
        if(error)throw error;
        res.render('home',{consumo:results})
    })

    
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
app.get('/grupo',(req,res)=>{
    res.render('grupos')
})
app.get('/grupos',(req,res)=>{
    res.render('grupos1')
})
//BACK DE REGISTRO
app.post('/registrarse',async(req,res)=>{
    const nombre=req.body.name;
    const user=req.body.correo;
    const password=req.body.pass;
    const peso=req.body.peso;
    const altura=req.body.altura;
    const edad=req.body.edad;
    const meta_agua='2300';
    const hora_desp=req.body.despertar;
    const hora_dormir=req.body.dormir;
    const taza=0;
    const Actividad_fisica=req.body.actFisica;
    const sexo=req.body.sexo;
    const privilegio=1;

    connection.query('INSERT INTO usuario SET ?',{Usuario:nombre,Password:password,email:user,Sesion:0},async(error,results)=>{
        if (error) {
            console.log(error);
        }else{
            console.log('Usuario Registrado con exito')
            // res.redirect('/login')
        }

    })
    

    connection.query('INSERT INTO persona SET ?',{peso:peso,altura:altura,edad:edad,meta_agua:meta_agua,hora_desp:hora_desp,hora_dormir:hora_dormir,tasa:taza,Actividad_fisica:parseInt(Actividad_fisica),Sexo_idsexo:parseInt(sexo),Privilegio_idPrivilegio:parseInt(privilegio),Usuario_idUsuario:4},async(error,results)=>{
        if (error) {
            console.log(error);
        }else{
            console.log('Persona Registrada con exito')
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

        connection.query('SELECT*FROM usuario')
        
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



//BACK DE FUNCIONES DEL SISTEMA

//AGREGAR CONSUMO DE AGUA
app.post('/addWater',(req,res)=>{
    const cantidad=req.body.taza;

    connection.query('INSERT INTO prueba(consumo) VALUES ("'+parseInt(cantidad)+'");',(err,respuesta,fields)=>{
        if (err)return console.log("Error",err)
        return res.redirect('/home');
    })

})


//ELIMINAR CONSUMO DE AGUA
app.post('/delWater',(req,res)=>{
    const cantidad=req.body.taza;

    connection.query('DELETE FROM prueba WHERE id="'+parseInt(cantidad)+'";',(err,respuesta,fields)=>{
        if (err)return console.log("Error",err)
        return res.redirect('/home');
    })

})



app.listen(3150,(req,res)=>{
    console.log('Escuchando desde el puerto 3150')
})