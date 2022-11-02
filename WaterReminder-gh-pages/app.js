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


// app.get('/index',(req,res)=>{
//     res.render('index')
// })

app.get('/home',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion creada y existente')
        connection.query('SELECT*FROM prueba',(error,results)=>{
            if(error)throw error;
            res.render('home',{consumo:results})
        })
        
    }else{
        console.log('NO hay sesion activa-Login')
        res.render('login',{
            login:false,
            name:'Inicie Sesion'
        })
    }

    //connection.query('SELECT*FROM consumo_agua',(error,results)=>{
    // connection.query('SELECT*FROM prueba',(error,results)=>{
    //     if(error)throw error;
    //     res.render('home',{consumo:results})
    // })

    
    // req.session.usuario='Isma',
    // req.session.visitas=req.session.visitas ? ++req.session.visitas:1;
    // console.log(req.session);
})

app.get('/registrarse',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion existente')
        res.render('home',{
            login:true,
            name:req.session.Usuario

        })
    }else{
        console.log('NO hay sesion activa-Registro')
        res.render('registrar',{
            login:false,
            name:'Inicie Sesion'
        })
    }
})

app.get('/login',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion existente')
        res.render('home',{
            login:true,
            name:req.session.Usuario

        })
    }else{
        console.log('NO hay sesion activa Login')
        res.render('login',{
            login:false,
            name:'Inicie Sesion'
        })
    }

})



app.get('/tazas',(req,res)=>{
    res.render('cambiar_taza')
})

app.get('/regAgua',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion creada y existente')
        connection.query('SELECT*FROM prueba',(error,results)=>{
            if(error)throw error;
            res.render('registros')
        })
        
    }else{
        console.log('NO hay sesion activa-Login')
        res.render('login',{
            login:false,
            name:'Inicie Sesion'
        })
    }
    
})

app.get('/Bebidas',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion creada y existente')
        connection.query('SELECT*FROM prueba',(error,results)=>{
            if(error)throw error;
            res.render('otrasbebidas',{consumo:results})
        })
        
    }else{
        console.log('NO hay sesion activa-Login')
        res.render('login',{
            login:false,
            name:'Inicie Sesion'
        })
    }
})

app.get('/configuracion',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion creada y existente')
        connection.query('SELECT*FROM prueba',(error,results)=>{
            if(error)throw error;
            res.render('configuraciones',{consumo:results})
        })
        
    }else{
        console.log('NO hay sesion activa-Login')
        res.render('login',{
            login:false,
            name:'Inicie Sesion'
        })
    }
})

app.get('/pesoaltura',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion creada y existente')
        connection.query('SELECT*FROM prueba',(error,results)=>{
            if(error)throw error;
            res.render('pesoaltura',{consumo:results})
        })
        
    }else{
        console.log('NO hay sesion activa-Login')
        res.render('login',{
            login:false,
            name:'Inicie Sesion'
        })
    }
})

app.get('/changeContra',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion creada y existente')
        connection.query('SELECT*FROM prueba',(error,results)=>{
            if(error)throw error;
            res.render('cambiarcontrasena',{consumo:results})
        })
        
    }else{
        console.log('NO hay sesion activa-Login')
        res.render('login',{
            login:false,
            name:'Inicie Sesion'
        })
    }
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
    
    if (Usuario&&Password) {
        console.log(`El usuario: ${Usuario} y la contra: ${Password}`)

        // connection.query('SELECT*FROM usuario')
        
        connection.query('SELECT email FROM usuario WHERE email="'+Usuario+'"',(error,respuesta,field)=>{
            if(respuesta[0].email===Usuario){
                console.log('Usuario existente')
            }else{
                res.redirect('/login')
                console.log('Usuario inexistente')
            }
        })
        
        connection.query('SELECT Password FROM usuario WHERE email="'+Usuario+'"',(error,respuesta,field)=>{
            
            if(respuesta[0].Password===Password){
                console.log('Ingreso exitoso al sistema')
                req.session.loggedin=true;
                req.session.usuario=Usuario
                console.log(req.session.usuario)
                res.redirect('/home')
            }else{
                res.redirect('/login')
                console.log('Contrasena incorrecta')
            }
        })
    }else{
        res.redirect('/login')
    }

    



})

//CONFIRMAR SESIONES
app.get('/',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion creada y existente')
        
        res.render('home',{
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