'use client'
import '@css/globals.css'
import { useEffect, useState } from 'react'

type Usuario = {
  ID: number
  Nombre: string
  Email: string | null
  tipo: string
  Estado?: string
  EstadoCuenta?: string
  Disponible?: boolean
}

export default function GestionUsersPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [pagina, setPagina] = useState(1)
  const porPagina = 6

  useEffect(() => {
    fetch('/api/auth/usaurios')
      .then(res => res.json())
      .then(data => {
        setUsuarios(data)
        setLoading(false)
      })
  }, [])

  const total = Math.ceil(usuarios.length / porPagina)
  const inicio = (pagina - 1) * porPagina
  const usuariosMostrar = usuarios.slice(inicio, inicio + porPagina)

  if (loading) return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center" style={{ marginLeft: '320px' }}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Cargando usuarios...</p>
      </div>
    </div>
  )
 

  return (
    <div className="bg-gray-50 p-8" style={{ marginLeft: '320px' }}>
      <div className="max-w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-2">Administra los usuarios del sistema</p>
        </div>
        
        <div className="mb-6 flex gap-4 items-center">
          <input
            type="text"
            placeholder="Buscar por nombre,email o rol ..."
            className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
             + Agregar nuevo rol
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usuariosMostrar.map((usuario) => (
                  <tr key={usuario.ID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{usuario.Nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{usuario.Email || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {usuario.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        usuario.Estado === 'Disponible' || usuario.EstadoCuenta === 'Disponible' || usuario.Disponible
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.Estado || usuario.EstadoCuenta || (usuario.Disponible ? 'Activo' : 'Inactivo')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-3">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button className="text-red-600 hover:text-red-800 font-medium">
                          <i className="bi bi-trash3-fill"></i>
                        </button>
                         <button className="text-gray-600 hover:text-black font-medium">
                          <i className="bi bi-list"></i>
                        </button>
                        
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">Mostrando {usuarios.length} usuarios</p>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setPagina(pagina - 1)} 
              disabled={pagina === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            
            {Array.from({ length: total }, (_, i) => i + 1).map(p => {
              const esActual = pagina === p
              return (
                <button 
                  key={p} 
                  onClick={() => setPagina(p)}
                  className={`px-4 py-2 border rounded-lg text-sm ${
                    esActual 
                      ? 'bg-blue-600 text-white' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              )
            })}
            
            <button 
              onClick={() => setPagina(pagina + 1)} 
              disabled={pagina === total}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
