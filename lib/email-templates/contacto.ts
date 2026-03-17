export const templateContacto = (nombre: string, emailUsuario: string, mensaje: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px; background: #f9fafb; border-radius: 0 0 8px 8px; }
    .info { background: white; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Nuevo Mensaje de Contacto</h1>
    </div>
    <div class="content">
      <div class="info">
        <p><strong>De:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${emailUsuario}</p>
      </div>
      <div class="info">
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
