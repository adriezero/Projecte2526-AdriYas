export const templateBienvenida = (nombre: string, rol: string, email: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px; background: #f9fafb; border-radius: 0 0 8px 8px; }
    .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>¡Bienvenido a TruckWave!</h1>
    </div>
    <div class="content">
      <h2>Hola ${nombre},</h2>
      <p>Gracias por unirte a TruckWave como <strong>${rol}</strong>.</p>
      <p>Tu cuenta ha sido creada exitosamente y ya puedes comenzar a usar nuestros servicios.</p>
      <p><strong>Email registrado:</strong> ${email}</p>
      <a href="${process.env.NEXTAUTH_URL}/auth/login" class="button">Iniciar Sesión</a>
      <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
    </div>
  </div>
</body>
</html>
`;
