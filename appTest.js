const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Variables globales
let formEnabled = false;
let desperdicioActual = 0;

// Configuración de Express
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de vistas
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));

// Almacenar las conexiones SSE activas
let clients = [];

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
        form_enabled: formEnabled
    });
});

// Ruta SSE
app.get('/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Añadir este cliente a la lista
    const clientId = Date.now();
    const newClient = {
        id: clientId,
        res
    };
    clients.push(newClient);

    // Enviar estado inicial
    res.write(`data: ${JSON.stringify({
        form_enabled: formEnabled,
        desperdicio: desperdicioActual
    })}\n\n`);

    // Remover cliente cuando se desconecte
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

app.get('/thanks', (req, res) => {
    res.render('thanks');
});

app.get('/test', (req, res) => {
    res.render('test');
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});