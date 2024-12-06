const SerialPort = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const port = new SerialPort.SerialPort({
    path: '/dev/cu.wchusbserial8310',  // Ajusta según tu puerto
    baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
    console.log('Puerto serial abierto');
});

parser.on('data', (data) => {
    const receivedChar = data.trim();
    console.log('Recibido:', receivedChar);

    switch(receivedChar) {
        case 'A':
            console.log('Enviando B');
            port.write('B\n');
            break;
        case 'C':
            console.log('Enviando D');
            port.write('D\n');
            break;
    }
});