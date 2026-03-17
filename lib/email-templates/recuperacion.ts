export const templateRecuperacion = (nombre: string, token: string) => `
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
      <h1>Recuperar Contraseña</h1>
    </div>
    <div class="content">
      <h2>Hola ${nombre},</h2>
      <p>Has solicitado recuperar tu contraseña en TruckWave.</p>
      <p>Haz clic en el siguiente botón para restablecer tu contraseña:</p>
      <a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}" class="button">Restablecer Contraseña</a>
      <p>Si no solicitaste este cambio, ignora este correo.</p>
      <p>Este enlace expirará en 1 hora.</p>
    </div>
  </div>
</body>
</html>
`;
