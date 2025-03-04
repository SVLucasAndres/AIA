const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configurar transporte de correo (Usa tus credenciales)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lucassangurima2@gmail.com',
    pass: 'yxhn ibee zqfz ojti'
  }
});

// Ruta para recibir los datos del pedido y enviar el correo
app.post('/send-email', (req, res) => {
  const { productos, cliente, cedula, celular,retiro,  metodo, imag } = req.body;
  let mensaje = `<h2>Nuevo Pedido</h2>
                 <p><strong>Cliente:</strong> ${cliente}</p>
                 <p><strong>Cédula:</strong> ${cedula}</p>
                 <p><strong>Teléfono:</strong> ${celular}</p>
                 <p><strong>Retiro:</strong> ${retiro}</p>
                 <p><strong>Método de Pago:</strong> ${metodo}</p>
                 <p><strong>Imagen de transferencia:</p>
                 <img src="${imag}" alt="No hay imagen de transferencia" width="200px" />
                 <p><strong>PEDIDO:</p>
                 <ul>`;

  productos.forEach(prod => {
    mensaje += `<li>${prod.nombre} - Cantidad: ${prod.cantidad}</li>`;
  });

  mensaje += `</ul>
  <p>Consulte la aplicación de Pedidos para más info</p>`;

  const mailOptions = {
    from: 'no-reply@tiendaaia.com',
    to: 'lucassangurima2@gmail.com', // Puedes enviar a varios destinatarios si lo necesitas
    subject: 'Nuevo Pedido Recibido',
    html: mensaje
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: error.toString() });
    }
    res.status(200).json({ message: 'Correo enviado con éxito' });
  });
});

app.post('/send-email-card', (req, res) => {
    const { productos, cliente, cedula, celular,retiro,  metodo, imag } = req.body;
    let mensaje = `<h2>Nuevo Pedido</h2>
                   <p><strong>Cliente:</strong> ${cliente}</p>
                   <p><strong>Cédula:</strong> ${cedula}</p>
                   <p><strong>Teléfono:</strong> ${celular}</p>
                   <p><strong>Retiro:</strong> ${retiro}</p>
                   <p><strong>Método de Pago:</strong> ${metodo}</p>
                   <p><strong>Imagen de transferencia:</p>
                   <img src="${imag}" alt="No hay imagen de transferencia" width="200px" />
                   <p><strong>PEDIDO:<strong></p>
                   <p>${productos}</p>
    <p>Consulte la aplicación de Pedidos para más info</p>`;
  
    const mailOptions = {
      from: 'no-reply@tiendaaia.com',
      to: 'lucassangurima2@gmail.com', // Puedes enviar a varios destinatarios si lo necesitas
      subject: 'Nuevo Pedido Recibido',
      html: mensaje
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: error.toString() });
      }
      res.status(200).json({ message: 'Correo enviado con éxito' });
    });
  });

// Iniciar servidor
app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));
