const express = require('express');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const path = require('path');
const app = express();
const port = 3000;

// Variables globales
let formEnabled = false;
let desperdicioActual = 0;
let clients = [];

// Configuración del puerto serial
const serialPort = new SerialPort({
    // Ajusta esto según tu sistema (COM3 en Windows, /dev/ttyUSB0 en Linux)
    // path: 'COM3', 
    // ojo: en mac debe partir con /dev/, el primer slash no aparece en arduino ide
    // asi que no olvidarlo
    path: '/dev/cu.wchusbserial8310', 
    baudRate: 9600,
}, err => {
    if (err) {
        console.error('Error al abrir el puerto serial:', err);
    } else {
        console.log('Conexión serial establecida');
    }
});



const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

serialPort.on('open', () => {
    console.log('Puerto serial abierto');
});

parser.on('data', (data) => {
    const message = data.trim();
    
    // Mostrar todo lo que llega
    console.log('Mensaje recibido:', message);
    
    // Procesar solo si empieza con !
    if (message.startsWith('!')) {
        const command = message.charAt(1);  // Toma el carácter después del !
        //console.log('\n\nComando detectado: %s\n\n', command);

        setTimeout(() => {
            switch(command) {
                case 'S':
                    console.log('Arduino Iniciado');
                    break;
                case 'A':
                    console.log("\n\nVaso Lleno\n\n")
                    formEnabled = true;
                    sendUpdateToAll({
                        form_enabled: formEnabled,
                        desperdicio: desperdicioActual
                    });
                    break;
                case 'V':
                    console.log('Vaciando Vaso desde Arduino');
                    break;
                case 'T':
                    console.log('Vaciando Vaso después de un tiempo');
                    formEnabled = false;
                    sendUpdateToAll({
                        form_enabled: formEnabled,
                        desperdicio: desperdicioActual
                    });
                    break;
            }
        }, 500);
    }
});


console.log('Formulario habilitado por señal Arduino');

// Configuración de Express
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de vistas
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));

// Función para enviar actualizaciones a todos los clientes
function sendUpdateToAll(data) {
    clients.forEach(client => {
        client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
}

// Ruta principal
app.get('/', (req, res) => {
    res.render('index', {
        nombre: 'juan',
        desperdicio: desperdicioActual,
        form_enabled: false
    });
});

// Ruta SSE
app.get('/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const clientId = Date.now();
    const newClient = {
        id: clientId,
        res
    };
    clients.push(newClient);

    res.write(`data: ${JSON.stringify({
        form_enabled: formEnabled,
        desperdicio: desperdicioActual
    })}\n\n`);

    req.on('close', () => {
        clients = clients.filter(client => client.id !== clientId);
    });
});

// Rutas para el panel de control
app.get('/toggle_form/:state', (req, res) => {
    formEnabled = (req.params.state === 'enable');
    
    sendUpdateToAll({
        form_enabled: formEnabled,
        desperdicio: desperdicioActual
    });
    
    res.json({ success: true, form_enabled: formEnabled });
});

app.get('/update_desperdicio/:valor', (req, res) => {
    desperdicioActual = parseInt(req.params.valor);
    
    sendUpdateToAll({
        form_enabled: formEnabled,
        desperdicio: desperdicioActual
    });
    
    res.json({ success: true, valor: desperdicioActual });
});

app.get('/toggle_form/check', (req, res) => {
    res.json({ success: true, form_enabled: formEnabled });
});

app.get('/gallery', (req, res) => {
    const images = [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/400?random=2',
        'https://picsum.photos/300/400?random=3',
        'https://picsum.photos/400/500?random=4',
        'https://picsum.photos/500/300?random=5',
        'https://picsum.photos/400/400?random=6'
    ];
    
    
    
    res.render('gallery', { images });
});

app.get('/loading', (req, res) => {
    
    // Enviar señal 'B' al Arduino cuando se accede a la galería
    serialPort.write('B', (err) => {
        if (err) {
            console.error('Error al enviar señal B al Arduino:', err);
        } else {
            console.log('Señal B enviada al Arduino');
        }
    });

    res.render('loading');
});

app.get('/thanks', (req, res) => {
    formEnabled = false;
    res.render('thanks');
});

app.get('/test', (req, res) => {
    res.render('test');
});

// Manejo de errores del puerto serial
serialPort.on('error', (err) => {
    console.error('Error en el puerto serial:', err);
});

// Limpieza al cerrar la aplicación
process.on('SIGINT', () => {
    serialPort.close((err) => {
        if (err) {
            console.error('Error al cerrar el puerto serial:', err);
        } else {
            console.log('Puerto serial cerrado correctamente');
        }
        process.exit();
    });
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});