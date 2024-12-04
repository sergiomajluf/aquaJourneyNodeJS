# Guía de Instalación - Proyecto Agua

Esta aplicación proporciona una interfaz web para concientización sobre el uso del agua, con integración Arduino para instalaciones interactivas. Incluye una versión de producción con comunicación serial Arduino y una versión de prueba para desarrollo.

## Requisitos Previos

- Node.js (v14 o superior)
- npm (viene con Node.js)
- Arduino (para versión de producción)

## Instalación

1. Clona o descarga este repositorio
2. Navega al directorio del proyecto
3. Instala las dependencias:

```bash
npm init -y
npm install express ejs serialport
```

## Estructura del Proyecto

```
proyecto/
│
├── public/
│   └── js/
│       ├── sse-handler.js
│       └── test-panel.js
│
├── views/
│   ├── index.html
│   ├── gallery.html
│   ├── thanks.html
│   └── test.html
│
├── app.js        # Versión de producción (con Arduino)
├── appTest.js    # Versión de prueba (no requiere Arduino)
└── README.md
```

## Ejecutar la Aplicación

### Versión de Prueba (Sin Arduino)
Para ejecutar la versión de prueba:

```bash
node appTest.js
```

Esta versión incluye:
- Comunicación serial simulada
- Panel de control en /test para simular señales del Arduino
- Toda la funcionalidad disponible vía interfaz web

### Versión de Producción (Con Arduino)
Para ejecutar la versión de producción:

```bash
node app.js
```

Antes de ejecutar, asegúrate de:
1. Conectar tu Arduino
2. Identificar tu puerto serial:
   - Windows:
     ```javascript
     const serialPort = new SerialPort({
         path: 'COM3', // o COM4, COM5, etc.
         baudRate: 9600
     });
     ```
   - Mac:
     ```javascript
     const serialPort = new SerialPort({
         path: '/dev/tty.usbmodem14201', // El número puede variar
         baudRate: 9600
     });
     ```

## Características

- Control de formulario en tiempo real vía señales Arduino
- Visualización interactiva de uso de agua
- Galería con redirección automática
- Server-Sent Events (SSE) para actualizaciones en tiempo real
- Panel de control para pruebas

## Rutas

- `/` - Página principal con formulario interactivo
- `/gallery` - Galería de imágenes (20s de visualización)
- `/thanks` - Página de agradecimiento (20s de visualización)
- `/test` - Panel de control para pruebas

## Comunicación Arduino

La aplicación utiliza dos señales:
- **Señal A**: Recibida desde Arduino para habilitar el formulario
- **Señal B**: Enviada a Arduino cuando el usuario llega a la galería

## Desarrollo

Para modificar o extender la aplicación:

1. Comienza con `appTest.js` para desarrollo
2. Prueba funcionalidades usando el panel de control en `/test`
3. Una vez que todo funcione, pasa a `app.js` para integración con Arduino

## Solución de Problemas

1. **Problemas con Puerto Serial**
   - **Windows**: 
     - Verifica en Administrador de Dispositivos > Puertos (COM y LPT)
     - El puerto suele aparecer como "Arduino UNO (COM3)"
   - **Mac**:
     - Abre Terminal y ejecuta: `ls /dev/tty.*`
     - Busca algo como `/dev/tty.usbmodem14201`
   - Intenta desconectar y reconectar el Arduino
   - Reinicia la aplicación

2. **Problemas de Conexión**
   - Verifica que Arduino esté conectado correctamente
   - Comprueba que el baudRate coincida con la configuración del Arduino
   - Reinicia la aplicación y el Arduino

3. **Problemas con el Formulario**
   - Revisa la consola del navegador para errores
   - Verifica que la conexión SSE esté activa
   - Prueba usando el panel de control en `/test`

## Notas de Funcionamiento

- El campo de entrada del formulario siempre está habilitado para escribir
- Solo el botón de envío se habilita/deshabilita con las señales
- La galería y la página de agradecimiento tienen temporizadores de 20 segundos
- El panel de pruebas permite simular todas las funcionalidades sin Arduino

## Configuración del Puerto Serial

### Windows
1. Abre el Administrador de Dispositivos
2. Busca en "Puertos (COM y LPT)"
3. Identifica el puerto Arduino (ej: COM3)
4. Actualiza `app.js` con el puerto correcto

### Mac
1. Abre Terminal
2. Ejecuta: `ls /dev/tty.*`
3. Identifica el puerto Arduino (ej: /dev/tty.usbmodem14201)
4. Actualiza `app.js` con el puerto correcto

## Soporte

Para problemas o preguntas:
1. Verifica la conexión del Arduino
2. Comprueba los logs del servidor
3. Usa el panel de control en `/test` para verificar la funcionalidad básica
