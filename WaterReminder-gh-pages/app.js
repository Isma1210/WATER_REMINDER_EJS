const express=require('express');
const app=express();

app.use(express.urlencoded({extended:false}));
app.use(express.json());

const dotenv=require('dotenv');
dotenv.config({path:'./env/.env'})

app.use('/resources',express.static('public'));
app.use('/resources',express.static(__dirname+'/public')); //RUTA DE CARPETA DE RECURSOS EXTERNOS


//------ESTABLECIENDO EL MOTOR DE PLANTILLAS EJS------
app.set('view engine','ejs');

//------INVOCANDO BCRYPTJS------
const bcryptjs=require('bcryptjs');

//------VARS DE SESION
const session=require('express-session');
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

//------INVOCAMOS A LA CONEXION DE LA BD------
const connection=require('./database/db');



//------RUTAS DE LAS PAGINAS------
//RUTA RAIZ
app.get('/',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion creada y existente-HOME')
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
//REGISTRO DE USUARIO--
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
//INICIO DE SESION--
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
//HOME--CONFIRMAR CONSUMO DE AGUA Y TABLA DE CONSUMO
app.get('/home',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion creada y existente-HOME')
        connection.query('SELECT * FROM consumo_agua WHERE Persona_idPersona="'+req.session.idPersona+'"',(error,results)=>{
            if(error)throw error;
            res.render('home',{consumoUser:results})
        })
    }else{
        console.log('NO hay sesion activa-Login')
        res.render('login',{
            login:false,
            name:'Inicie Sesion'
        })
    }
})
//REGISTROS DE CONSUMO DE AGUA
app.get('/regAgua',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion creada y existente-graficaAgua')
        res.render('registros')
    }else{
        console.log('NO hay sesion activa-Login')
        res.render('login',{
            login:false,
            name:'Inicie Sesion'
        })
    }
    
})
//OTRAS BEBIDAS--
app.get('/Bebidas',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion creada y existente-otrasBebidas')
        res.render('otrasbebidas')
    }else{
        console.log('NO hay sesion activa-Login')
        res.render('login',{
            login:false,
            name:'Inicie Sesion'
        })
    }
})
//CONFIGURACIONES DEL USUARIO--
app.get('/configuracion',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion creada y existente-Configuracion')
        res.render('configuraciones')
    }else{
        console.log('NO hay sesion activa-Login')
        res.render('login',{
            login:false,
            name:'Inicie Sesion'
        })
    }
})
//CAMBIAR PESO Y ALTURA--
app.get('/pesoaltura',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion creada y existente-PesoAlt')
        res.render('pesoaltura')
    }else{
        console.log('NO hay sesion activa-Login')
        res.render('login',{
            login:false,
            name:'Inicie Sesion'
        })
    }
})
//CAMBIAR CONTRASENAS--
app.get('/changeContra',(req,res)=>{
    if(req.session.loggedin){
        console.log('Sesion creada y existente-Contrasena')
        res.render('cambiarcontrasena')
    }else{
        console.log('NO hay sesion activa-Login')
        res.render('login',{
            login:false,
            name:'Inicie Sesion'
        })
    }
})
//GRUPOS--
app.get('/grupo',(req,res)=>{
    res.render('grupos')
})
//DENTRO DEL GRUPO--
app.get('/grupos',(req,res)=>{
    res.render('grupos1')
})


//------BACK DE FUNCIONES DE REGISTRO E INICIO DE SESION------


//BACK DE REGISTRO DE USUARIO
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
        }

    })

    connection.query('INSERT INTO persona SET ?',{peso:peso,altura:altura,edad:edad,meta_agua:meta_agua,hora_desp:hora_desp,hora_dormir:hora_dormir,tasa:taza,Actividad_fisica:parseInt(Actividad_fisica),Sexo_idsexo:parseInt(sexo),Privilegio_idPrivilegio:parseInt(privilegio),Usuario_idUsuario:3},async(error,results)=>{
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
        connection.query('SELECT idPersona FROM persona INNER JOIN usuario ON persona.Usuario_idUsuario=usuario.idUsuario WHERE email="'+Usuario+'"',(error,respuesta,field)=>{
            console.log(`EL id de quien ingreso es: ${respuesta[0].idPersona}`)
            req.session.idPersona=respuesta[0].idPersona; //Guardando Id de persona en la sesion
        })

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
                req.session.loggedin=true; //Creando la sesion
                req.session.usuario=Usuario; //Guardando nombre de usuario en la sesion
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


//CERRAR SESION
app.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        console.log('Sesion cerrada')
        res.redirect('/')
    })
})

//------BACK DE FUNCIONES DEL SISTEMA------

//AGREGAR CONSUMO DE AGUA
app.post('/addWater',(req,res)=>{
    const cantidad=req.body.taza;
    const fechaHora=new Date();
    const anio=fechaHora.getFullYear()
    const mes=fechaHora.getMonth()
    const dia=fechaHora.getDate()

    connection.query(`INSERT INTO consumo_agua (Consumo_Total,Fecha,Persona_idPersona,datos_bebida_idRegistro_bebida,datos_bebida_CTipo_bebida_idCTipo_bebida) VALUES (${parseInt(cantidad)},'${anio}-${mes}-${dia}',${req.session.idPersona},1,1)`,(err,respuesta,fields)=>{
        if (err)return console.log("Error",err)
        return res.redirect('/home');
    })

})


//ELIMINAR CONSUMO DE AGUA
app.get('/delWater/:id',(req,res)=>{
    const idRegistro=req.params.id

    connection.query('DELETE FROM consumo_agua WHERE idConsumo_Agua="'+idRegistro+'"',(err,respuesta,fields)=>{
        if (err)return console.log("Error",err)
        return res.redirect('/home');
    })

})

//CAMBIAR CONTRASENA
app.post('/changeContra',(req,res)=>{
    const contra=req.body.pass2
    const contra2=req.body.pass1
    if (contra===contra2) {
        connection.query(`UPDATE usuario SET Password=${contra} WHERE idUsuario=${req.session.idPersona}`,(err,respuesta,fields)=>{
            if (err)return console.log("Error",err)
            return res.redirect('/home');
            
        })
    }else{
        res.redirect('/configuracion');
    }

    

})

//CAMBIAR PESO
app.post('/changePeso',(req,res)=>{
    const peso=req.body.peso
    connection.query(`UPDATE persona SET peso=${peso} WHERE Usuario_idUsuario=${req.session.idPersona}`,(err,respuesta,fields)=>{
        if (err)return console.log("Error",err)
        return res.redirect('/configuracion');
        
    })

})

//CAMBIAR ALTURA
app.post('/changeAltura',(req,res)=>{
    const altura=req.body.altura
    connection.query(`UPDATE persona SET altura=${altura} WHERE Usuario_idUsuario=${req.session.idPersona}`,(err,respuesta,fields)=>{
        if (err)return console.log("Error",err)
        return res.redirect('/configuracion');
        
    })

})


//DEPLOY EN EL PUERTO
app.listen(3150,(req,res)=>{
    console.log('Escuchando desde el puerto 3150')
})