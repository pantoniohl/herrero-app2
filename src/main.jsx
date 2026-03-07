import React from 'react'
import ReactDOM from 'react-dom/client'
import AppOficina from './AppOficina.jsx'
import AppAlumno from './AppAlumno.jsx'

// Router simple: /alumno?token=xxx → app alumno, resto → app oficina
const path = window.location.pathname
const isAlumno = path.startsWith('/alumno')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAlumno ? <AppAlumno /> : <AppOficina />}
  </React.StrictMode>
)
