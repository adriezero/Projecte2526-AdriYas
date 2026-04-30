import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Cliente, Informe, Ruta, EstadisticasCliente } from '@interfaces/interfaces';

export const getClienteCompleto = async (clienteId: string): Promise<Cliente | null> => {
  const response = await fetch(`/api/clientes/${clienteId}`);
  if (!response.ok) return null;
  return response.json();
};

export const getClientes = async (): Promise<Cliente[]> => {
  const response = await fetch('/api/clientes');
  if (!response.ok) return [];
  return response.json();
};

export const getInformesPorEmpresa = async (empresaId: string): Promise<Informe[]> => {
  const response = await fetch(`/api/informes?clienteId=${empresaId}`);
  if (!response.ok) return [];
  return response.json();
};

export const getRutasPorCliente = async (clienteId: string): Promise<Ruta[]> => {
  const response = await fetch(`/api/rutas?clienteId=${clienteId}`);
  if (!response.ok) return [];
  return response.json();
};

export const calcularEstadisticas = (rutas: Ruta[]): EstadisticasCliente => {
  const totalEntregas = rutas.length;
  const entregasFinalizadas = rutas.filter(r => r.Estado === 'Finalizado').length;
  const porcentajeCumplimiento = totalEntregas > 0 ? (entregasFinalizadas / totalEntregas) * 100 : 0;
  const ingresosGenerados = totalEntregas * 1250;
  const promedioTiempoEntrega = 3.5;

  return {
    totalEntregas,
    porcentajeCumplimiento: Math.round(porcentajeCumplimiento * 100) / 100,
    ingresosGenerados,
    promedioTiempoEntrega
  };
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
    body: JSON.stringify({
      tipo: data.servicio,
      cliente: data.cliente,
      asunto: data.servicio,
      descripcion: data.detalles
    }),
  });
  return response.ok;
};

export const generarCSV = (
  informes: Informe[],
  empresaId: string,
  fechaDesde: string,
  fechaHasta: string
) => {
  const headers = ['ID', 'Fecha de Subida', 'Tipo', 'Formato'];
  const rows = informes.map(inf => [
    inf.ID,
    new Date(inf.FechaSubida).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
    inf.Tipo,
    inf.Formato || 'N/A'
  ]);
  
  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `informes_${empresaId}_${fechaDesde}_${fechaHasta}.csv`;
  link.click();
};

const normalizarNombre = (texto: string): string => {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_');
};

export const generarPDF = async (
  informes: Informe[],
  empresaNombre: string,
  empresaId: string,
  fechaDesde: string,
  fechaHasta: string
) => {
  const doc = new jsPDF();
  const cliente = await getClienteCompleto(empresaId);
  const rutas = await getRutasPorCliente(empresaId);
  const estadisticas = calcularEstadisticas(rutas);
  
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246);
  doc.text('INFORME DE CLIENTE', 105, 15, { align: 'center' });
  
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  if (cliente) {
    doc.text(`Empresa: ${cliente.NombreEmpresa} | Contacto: ${cliente.Nombre} | Razón Social: ${cliente.RazonSocial || 'N/A'}`, 14, 25);
    doc.text(`Email: ${cliente.Email || 'N/A'} | Teléfono: ${cliente.Telf} | Estado: ${cliente.EstadoCuenta}`, 14, 29);
  }
  
  doc.line(14, 32, doc.internal.pageSize.width - 14, 32);
  
  doc.setFontSize(10);
  doc.text(
    `Período: ${new Date(fechaDesde).toLocaleDateString('es-ES')} - ${new Date(fechaHasta).toLocaleDateString('es-ES')}`,
    14,
    38
  );

  doc.setFontSize(12);
  doc.text('Estadísticas del Período', 14, 46);
  doc.setFontSize(10);
  doc.text(`Total de Entregas: ${estadisticas.totalEntregas}`, 14, 52);
  doc.text(`Porcentaje de Cumplimiento: ${estadisticas.porcentajeCumplimiento}%`, 14, 58);
  doc.text(`Ingresos Generados: ${estadisticas.ingresosGenerados.toLocaleString('es-ES')}€`, 14, 64);
  doc.text(`Promedio Tiempo de Entrega: ${estadisticas.promedioTiempoEntrega} días`, 14, 70);

  doc.setFontSize(12);
  doc.text('Informes Generados', 14, 78);
  
  const informesData = informes.map(inf => [
    inf.ID.toString(),
    new Date(inf.FechaSubida).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
    inf.Tipo,
    inf.Formato || 'N/A'
  ]);

  autoTable(doc, {
    head: [['ID', 'Fecha de Subida', 'Tipo', 'Formato']],
    body: informesData,
    startY: 83,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || 83;
  doc.setFontSize(12);
  doc.text('Rutas del Cliente', 14, finalY + 10);
  
  const rutasData = rutas.map((ruta: Ruta) => [
    ruta.ID.toString(),
    ruta.Origen,
    ruta.Destino,
    ruta.Estado || 'N/A',
    new Date(ruta.FechaInicio).toLocaleDateString('es-ES'),
    ruta.Cargas
  ]);

  autoTable(doc, {
    head: [['ID', 'Origen', 'Destino', 'Estado', 'Fecha Inicio', 'Cargas']],
    body: rutasData,
    startY: finalY + 15,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
  });

  const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${pageCount} - Generado el ${new Date().toLocaleDateString('es-ES')}`,
      105,
      290,
      { align: 'center' }
    );
  }

  const nombreArchivo = normalizarNombre(empresaNombre);
  doc.save(`informe_${nombreArchivo}_${fechaDesde}_${fechaHasta}.pdf`);
};
