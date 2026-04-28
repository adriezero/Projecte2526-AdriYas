export interface Cliente {
  ID: number;
  NombreEmpresa: string;
}

export interface Informe {
  ID: number;
  FechaSubida: string;
}

export const getClientes = (): Cliente[] => [
  { ID: 1, NombreEmpresa: 'Transportes García S.L.' },
  { ID: 2, NombreEmpresa: 'Logística Martínez' },
  { ID: 3, NombreEmpresa: 'Distribuciones López' },
  { ID: 4, NombreEmpresa: 'Mercancías Rodríguez' },
];

export const getInformesPorEmpresa = (empresaId: string): Informe[] => {
  const informesPorEmpresa: Record<string, Informe[]> = {
    '1': [
      { ID: 1, FechaSubida: '2023-01-15' },
      { ID: 2, FechaSubida: '2023-02-20' },
      { ID: 3, FechaSubida: '2023-03-10' },
    ],
    '2': [
      { ID: 4, FechaSubida: '2023-01-05' },
      { ID: 5, FechaSubida: '2023-04-12' },
      { ID: 6, FechaSubida: '2023-05-25' },
      { ID: 7, FechaSubida: '2023-06-30' },
    ],
    '3': [
      { ID: 8, FechaSubida: '2023-02-14' },
      { ID: 9, FechaSubida: '2023-03-22' },
    ],
    '4': [
      { ID: 10, FechaSubida: '2023-01-08' },
      { ID: 11, FechaSubida: '2023-02-18' },
      { ID: 12, FechaSubida: '2023-03-28' },
      { ID: 13, FechaSubida: '2023-04-05' },
      { ID: 14, FechaSubida: '2023-05-15' },
    ],
  };
  return informesPorEmpresa[empresaId] || [];
};

export const enviarSolicitud = async (data: {
  servicio: string;
  cliente: string;
  email: string;
  detalles: string;
}) => {
  const response = await fetch('/api/solicitudes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.ok;
};

export const generarCSV = (
  informes: Informe[],
  empresaId: string,
  fechaDesde: string,
  fechaHasta: string
) => {
  const headers = ['ID', 'Fecha de Subida'];
  const rows = informes.map(inf => [
    inf.ID,
    new Date(inf.FechaSubida).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
  ]);
  
  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `informes_${empresaId}_${fechaDesde}_${fechaHasta}.csv`;
  link.click();
};

export const generarPDF = (
  informes: Informe[],
  empresaNombre: string,
  empresaId: string,
  fechaDesde: string,
  fechaHasta: string
) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Informe</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
      </style>
    </head>
    <body>
      <h1>Informe de ${empresaNombre}</h1>
      <p><strong>Período:</strong> ${new Date(fechaDesde).toLocaleDateString('es-ES')} - ${new Date(fechaHasta).toLocaleDateString('es-ES')}</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha de Subida</th>
          </tr>
        </thead>
        <tbody>
          ${informes.map(inf => `
            <tr>
              <td>${inf.ID}</td>
              <td>${new Date(inf.FechaSubida).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `informe_${empresaId}_${fechaDesde}_${fechaHasta}.html`;
  link.click();
};
