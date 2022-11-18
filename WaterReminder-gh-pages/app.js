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
        //BACK CONSUMO DE AGUA IDEAL
        connection.query(' SELECT peso,altura,edad,Actividad_fisica FROM persona WHERE idPersona="'+req.session.idPersona+'"',(error,results)=>{
            if(error)throw error;
            req.session.peso=results[0].peso
            req.session.altura=results[0].altura
            req.session.Actividad_fisica=results[0].Actividad_fisica
        })

        const consumoIdeal2=parseFloat(req.session.peso)+parseFloat(req.session.altura)+parseFloat(req.session.Actividad_fisica)
        const consumoIdeal=66+(13.7*parseFloat(req.session.peso))+(5*parseFloat(req.session.altura))-(6.5*20)
        console.log(`Debes tomar ${consumoIdeal}`)


        //BACK DE CONSUMO DE AGUA TOTAL
        connection.query('SELECT SUM(Consumo_Total) FROM consumo_agua WHERE Persona_idPersona ="'+req.session.idPersona+'"',(error,results)=>{
            if(error)throw error;
            req.session.consumoTotal=results[0]
        })


        console.log('Sesion creada y existente-HOME')
        connection.query('SELECT * FROM consumo_agua WHERE Persona_idPersona="'+req.session.idPersona+'"',(error,results)=>{
            if(error)throw error;
            res.render('home',{consumoUser:results,nombre:req.session.nombre,tuAgua:consumoIdeal,totalAgua:req.session.consumoTotal})
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



//------BACK DE FUNCIONES DE REGISTRO E INICIO DE SESION------


//BACK DE REGISTRO DE USUARIO
//BACK DE REGISTRO
app.post('/registrarse', async (req, res) => {
    const nombre = req.body.name;
    const user = req.body.correo;
    const password = req.body.pass;
    const peso = req.body.peso;
    const altura = req.body.altura;
    const edad = req.body.edad;
    const meta_agua = '2300';
    const hora_desp = req.body.despertar;
    const hora_dormir = req.body.dormir;
    const taza = 0;
    const Actividad_fisica = req.body.actFisica;
    const sexo = req.body.sexo;
    const privilegio = 1;

    connection.query('INSERT INTO usuario SET ?', { Usuario: nombre, Password: password, email: user, Sesion: 0 }, async (error, results) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Usuario Registrado con exito')


            connection.query('select idUsuario from usuario where email = ? and Password = ? ', [user, password], async (error, results) => {
                if (error) return console.log("Error", error)

                var idUsuario = 0;
                idUsuario = results[0].idUsuario;
                console.log('el id recuperado' + results[0].idUsuario)

                connection.query('INSERT INTO persona SET ?', { peso: peso, altura: altura, edad: edad, meta_agua: meta_agua, hora_desp: hora_desp, hora_dormir: hora_dormir, tasa: taza, Actividad_fisica: parseInt(Actividad_fisica), Sexo_idsexo: parseInt(sexo), Privilegio_idPrivilegio: parseInt(privilegio), Usuario_idUsuario: idUsuario }, async (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Persona Registrada con exito')
                        res.redirect('/login')
                    }
                })


            })

        }

    })




})
//BACK DE LOGIN
app.post('/auth',async(req,res)=>{
    const Usuario=req.body.usuario;
    const Password=req.body.pass;
    
    if (Usuario&&Password) {
        connection.query('SELECT idPersona, idUsuario FROM persona INNER JOIN usuario ON persona.Usuario_idUsuario=usuario.idUsuario WHERE email="'+Usuario+'"',(error,respuesta,field)=>{
            console.log(`EL id de quien ingreso es: ${respuesta[0].idPersona}`)
            req.session.idPersona=respuesta[0].idPersona; //Guardando Id de persona en la sesion
        })

        connection.query('SELECT idUsuario FROM usuario WHERE email="'+Usuario+'"',(error,respuesta,field)=>{
            console.log(`EL idUsuario es : ${respuesta[0].idUsuario}`)
            req.session.idUsuario=respuesta[0].idUsuario; //Guardando Id de persona en la sesion
        })


        connection.query('SELECT email FROM usuario WHERE email="'+Usuario+'"',(error,respuesta,field)=>{
            if(respuesta[0].email===Usuario){
                console.log('Usuario existente')
            }else{
                res.redirect('/login')
                console.log('Usuario inexistente')
            }
        })

        connection.query('SELECT usuario FROM usuario WHERE email="'+Usuario+'"',(error,respuesta,field)=>{
            req.session.nombre=respuesta[0].usuario;
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

//----------BACK DE FUNCIONES DE GRUPO-------------
//Apartadfo de grupos
app.get('/grupo', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion existente')
        var idPersona = req.session.idPersona;
        var query = String("select persona_has_cgrupos.CGrupos_idCGrupos as 'codigo1', Cgrupos.idcGrupos as 'codigo2',persona_has_cgrupos.persona_idPersona as 'idPersona' , Cgrupos.Nombre_Grupo as 'nombreGrupo' from persona_has_cgrupos Inner join Cgrupos	on persona_has_cgrupos.CGrupos_idCGrupos = CGrupos.idCGrupos where persona_has_cgrupos.persona_idPersona = ?; ")
        connection.query(query, [idPersona], (error, respuesta) => {
            if (error) {
                console.log("errror al seleccionar" + error);
                throw error;
            } else {
                //console.log(respuesta[0].Persona_Grupoid);
                res.render('grupos', { respuesta: respuesta })
            }
        })

    } else {
        console.log('NO hay sesion activa Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }


})
//Participantes del grupo
app.post('/grupos', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion existente')
        var idGrupo = req.body.codigo;
        console.log('codigo obtenido:' + idGrupo)
        var query = String("select idUsuario as 'idUsuario', idPersona as 'idPersona', Usuario as 'nombre', email as 'email', meta_agua as 'meta_agua', CGrupos_idCGrupos as 'idGrupo', Nombre_Grupo as 'Nombre_Grupo' from USuario u inner join persona p on u.idUsuario = p.Usuario_idUsuario inner join persona_has_cgrupos pg on p.idPersona = pg.persona_idPersona inner join cgrupos g on pg.CGrupos_idCGrupos = g.idCGrupos where g.idCGrupos = ?;")
        connection.query(query, [idGrupo], (error, respuesta) => {
            if (error) {
                console.log("errror al seleccionar" + error);
                throw error;
            } else {
                //console.log(respuesta[0].Persona_Grupoid);
                var codigo = respuesta[0].idGrupo;
                var nombreGrupo = respuesta[0].Nombre_Grupo
                res.render('grupos1', { respuesta: respuesta, codigo, nombreGrupo })
            }
        })
    } else {
        console.log('NO hay sesion activa Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }

})




//crear un grupo

//Back
app.post('/crearGrupo1', (req, res) => {
    //crear un grupo
    var nombreGrupo = req.body.nombreGrupo;

    //este id se obtiene de la sesion
    var idPersona = req.session.idPersona;
    var idCgrupo = null;

    //insertar en grupos
    connection.query('INSERT INTO cgrupos SET ?', { idCgrupos: idCgrupo, Nombre_Grupo: nombreGrupo, estadoGrupo: 0, persona_idpersona: idPersona }, async (error, results) => {
        if (error) {
            console.log(error);
        } else {

            //obtener el codigo generado
            connection.query("SELECT LAST_INSERT_ID() as 'idCgrupos' ", (error, respuesta, field) => {
                console.log("el identificador del grupo es : " + respuesta[0].idCgrupos)
                var codigo = respuesta[0].idCgrupos;

                //relacionar la persona con el grupo en

                connection.query('INSERT INTO persona_has_CGrupos SET ?', { Persona_Grupoid: null, persona_idPersona: idPersona, CGrupos_idCGrupos: codigo }, async (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Usuario y grupo conectados con exito')
                        // res.redirect('/login')
                    }

                })


            })

            res.redirect('/grupo')
            console.log('grupo Registrado con exito')
        }

    })

})


//unirse a un grupo 
//pagina temporal (se supone que esto tiene que ser un modal)


app.post('/unirseGrupo1', (req, res) => {
    //codigo con el q se une
    var codigo = req.body.codigo;

    //obtener esta id de la sesion 
    var idPersona = req.session.idPersona;
    connection.query('INSERT INTO persona_has_CGrupos SET ?', { Persona_Grupoid: null, persona_idPersona: idPersona, CGrupos_idCGrupos: codigo }, async (error, results) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Usuario y grupo relacionados con exito')
            res.redirect('/grupo')
        }

    })

})
//


//DEPLOY EN EL PUERTO
app.listen(3150,(req,res)=>{
    console.log('Escuchando desde el puerto 3150')
})