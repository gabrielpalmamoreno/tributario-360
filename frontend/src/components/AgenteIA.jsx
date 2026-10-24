import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import { Paperclip, X, AlertTriangle, ArrowUp } from 'lucide-react';

marked.setOptions({ breaks: true, gfm: true });

const TIPOS_ACEPTADOS = 'image/*,.pdf,.txt,.csv';
const MAX_BYTES = 10 * 1024 * 1024; // 10MB

function leerArchivoComoBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const resultado = reader.result;
      const base64 = resultado.slice(resultado.indexOf(',') + 1);
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const SUGERENCIAS = [
  '¿Cuándo vence el F29 de este mes?',
  '¿Cómo se calcula el IVA proporcional?',
  '¿Qué es la renta presunta?',
  '¿Cómo emito una boleta de honorarios electrónica?',
];

const MSG_BIENVENIDA = {
  rol: 'agente',
  texto: 'Hola, soy tu asistente tributario. Puedo ayudarte con dudas sobre el SII, formularios F29 y F22, IVA, renta y más. ¿En qué te ayudo?',
};

function storageKey(sesion) {
  return `t360_chats_${sesion?.empresa ?? 'admin'}`;
}

function cargarChats(sesion) {
  try {
    const raw = localStorage.getItem(storageKey(sesion));
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function guardarChats(sesion, chats) {
  try {
    localStorage.setItem(storageKey(sesion), JSON.stringify(chats));
  } catch {}
}

function tituloChat(mensajes) {
  const primer = mensajes.find(m => m.rol === 'usuario');
  if (!primer) return 'Nueva consulta';
  return primer.texto.slice(0, 48) + (primer.texto.length > 48 ? '…' : '');
}

function fechaCorta(iso) {
  const d = new Date(iso);
  const hoy = new Date();
  if (d.toDateString() === hoy.toDateString()) {
    return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
}

export default function AgenteIA({ sesion }) {
  const [chats, setChats] = useState(() => cargarChats(sesion));
  const [chatActual, setChatActual] = useState(null); // null = nuevo chat
  const [mensajes, setMensajes] = useState([MSG_BIENVENIDA]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [archivo, setArchivo] = useState(null); // { nombre, tipo, datos, previewUrl }
  const [errorArchivo, setErrorArchivo] = useState('');
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, cargando]);

  // Persistir cuando cambian los mensajes (solo si hay al menos una respuesta del usuario)
  useEffect(() => {
    if (mensajes.length <= 1) return;
    const tieneUsuario = mensajes.some(m => m.rol === 'usuario');
    if (!tieneUsuario) return;

    setChats(prev => {
      let actualizados;
      if (chatActual !== null) {
        actualizados = prev.map((c, i) =>
          i === chatActual ? { ...c, mensajes, updatedAt: new Date().toISOString() } : c
        );
      } else {
        const nuevo = { id: Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), mensajes };
        actualizados = [nuevo, ...prev];
        setChatActual(0);
      }
      guardarChats(sesion, actualizados);
      return actualizados;
    });
  }, [mensajes]);

  async function enviar(texto) {
    const pregunta = texto ?? input.trim();
    const adjunto = archivo;
    if ((!pregunta && !adjunto) || cargando) return;
    setInput('');
    setArchivo(null);
    setMensajes(prev => [
      ...prev,
      {
        rol: 'usuario',
        texto: pregunta || `Analiza el archivo adjunto: ${adjunto.nombre}`,
        archivo: adjunto ? { nombre: adjunto.nombre, tipo: adjunto.tipo, previewUrl: adjunto.previewUrl } : undefined,
      },
    ]);
    setCargando(true);
    try {
      const res = await fetch('/api/agente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pregunta,
          archivo: adjunto ? { nombre: adjunto.nombre, tipo: adjunto.tipo, datos: adjunto.datos } : undefined,
        }),
      });
      const data = await res.json();
      setMensajes(prev => [
        ...prev,
        { rol: 'agente', texto: data.respuesta ?? data.error ?? 'Sin respuesta.' },
      ]);
    } catch {
      setMensajes(prev => [
        ...prev,
        { rol: 'agente', texto: 'No se pudo conectar con el backend.', error: true },
      ]);
    } finally {
      setCargando(false);
    }
  }

  async function seleccionarArchivo(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setErrorArchivo('');
    if (file.size > MAX_BYTES) {
      setErrorArchivo('El archivo supera los 10MB.');
      return;
    }
    try {
      const datos = await leerArchivoComoBase64(file);
      setArchivo({
        nombre: file.name,
        tipo: file.type || 'application/octet-stream',
        datos,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      });
    } catch {
      setErrorArchivo('No se pudo leer el archivo.');
    }
  }

  function nuevoChat() {
    setChatActual(null);
    setMensajes([MSG_BIENVENIDA]);
    setInput('');
  }

  function abrirChat(idx) {
    setChatActual(idx);
    setMensajes(chats[idx].mensajes);
    setInput('');
  }

  function eliminarChat(e, idx) {
    e.stopPropagation();
    const actualizados = chats.filter((_, i) => i !== idx);
    guardarChats(sesion, actualizados);
    setChats(actualizados);
    if (chatActual === idx) nuevoChat();
    else if (chatActual > idx) setChatActual(chatActual - 1);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  }

  return (
    <div style={s.shell}>
      {/* Panel historial */}
      <div style={s.historial}>
        <div style={s.historialHeader}>
          <p style={s.historialTitulo}>Conversaciones</p>
          <button style={s.nuevoBtn} onClick={nuevoChat}>+ Nueva</button>
        </div>

        <div style={s.historialLista}>
          {chats.length === 0 && (
            <p style={s.historialVacio}>Sin conversaciones guardadas</p>
          )}
          {chats.map((c, i) => (
            <div
              key={c.id}
              style={{ ...s.chatItem, ...(chatActual === i ? s.chatItemActivo : {}) }}
              onClick={() => abrirChat(i)}
            >
              <div style={s.chatItemBody}>
                <p style={s.chatItemTitulo}>{tituloChat(c.mensajes)}</p>
                <p style={s.chatItemFecha}>{fechaCorta(c.updatedAt)}</p>
              </div>
              <button
                style={s.eliminarBtn}
                onClick={e => eliminarChat(e, i)}
                title="Eliminar"
              ><X size={13} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Área de chat */}
      <div style={s.chatArea}>
        <div style={s.header}>
          <div>
            <h1 style={s.titulo}>Agente Tributario IA</h1>
            <p style={s.subtitulo}>Normativa chilena · SII · F29 · F22 · Renta · Optimización</p>
          </div>
          <span style={s.badge}>Claude Sonnet 5</span>
        </div>

        {mensajes.length === 1 && (
          <div style={s.sugerencias}>
            {SUGERENCIAS.map(sg => (
              <button key={sg} style={s.chip} onClick={() => enviar(sg)}>{sg}</button>
            ))}
          </div>
        )}

        <div style={s.chat}>
          {mensajes.map((m, i) => (
            <div key={i} style={{ ...s.fila, justifyContent: m.rol === 'usuario' ? 'flex-end' : 'flex-start' }}>
              {m.rol === 'agente' && <div style={s.avatar}>T</div>}
              <div style={{
                ...s.burbuja,
                ...(m.rol === 'usuario' ? s.burbujaUsuario : s.burbujaAgente),
                ...(m.error ? s.burbujaError : {}),
              }}>
                {m.archivo && (
                  <div style={s.archivoChip}>
                    {m.archivo.previewUrl ? (
                      <img src={m.archivo.previewUrl} alt={m.archivo.nombre} style={s.archivoThumb} />
                    ) : (
                      <span style={s.archivoIcono}><Paperclip size={14} /></span>
                    )}
                    <span style={s.archivoNombre}>{m.archivo.nombre}</span>
                  </div>
                )}
                {m.error ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                    <span>{m.texto}</span>
                  </div>
                ) : m.rol === 'agente' ? (
                  <div className="md-content" dangerouslySetInnerHTML={{ __html: marked.parse(m.texto) }} />
                ) : (
                  m.texto.split('\n').map((linea, j) => (
                    <p key={j} style={{ margin: j > 0 ? '0.4rem 0 0' : 0 }}>{linea}</p>
                  ))
                )}
              </div>
            </div>
          ))}

          {cargando && (
            <div style={{ ...s.fila, justifyContent: 'flex-start' }}>
              <div style={s.avatar}>T</div>
              <div style={s.burbujaAgente}>
                <span className="typing"><span /><span /><span /></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {errorArchivo && <p style={s.errorArchivo}>{errorArchivo}</p>}

        {archivo && (
          <div style={s.adjuntoPreview}>
            {archivo.previewUrl ? (
              <img src={archivo.previewUrl} alt={archivo.nombre} style={s.archivoThumb} />
            ) : (
              <span style={s.archivoIcono}><Paperclip size={14} /></span>
            )}
            <span style={s.archivoNombre}>{archivo.nombre}</span>
            <button style={s.quitarAdjuntoBtn} onClick={() => setArchivo(null)} title="Quitar adjunto"><X size={13} /></button>
          </div>
        )}

        <div style={s.inputArea}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={seleccionarArchivo}
            accept={TIPOS_ACEPTADOS}
            style={{ display: 'none' }}
          />
          <button
            style={s.adjuntarBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={cargando}
            title="Adjuntar archivo"
            type="button"
          ><Paperclip size={16} /></button>
          <textarea
            style={s.textarea}
            placeholder={archivo ? 'Agrega instrucciones sobre el archivo (opcional)...' : 'Escribe tu consulta tributaria... (Enter para enviar)'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
            disabled={cargando}
          />
          <button
            style={{ ...s.enviarBtn, ...((!input.trim() && !archivo) || cargando ? s.enviarBtnDisabled : {}) }}
            onClick={() => enviar()}
            disabled={(!input.trim() && !archivo) || cargando}
          >
            {cargando ? '…' : <ArrowUp size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  shell: {
    display: 'flex',
    height: 'calc(100vh - 4rem)',
    gap: '1rem',
    maxWidth: '1100px',
  },
  // Historial
  historial: {
    width: '220px',
    minWidth: '220px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#111820',
    border: '1px solid #1E2D3D',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  historialHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.9rem 1rem',
    borderBottom: '1px solid #1E2D3D',
  },
  historialTitulo: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '700',
    fontSize: '0.82rem',
    color: '#E8EDF2',
  },
  nuevoBtn: {
    padding: '0.3rem 0.7rem',
    backgroundColor: 'rgba(0,200,150,0.1)',
    border: '1px solid rgba(0,200,150,0.25)',
    borderRadius: '6px',
    color: '#00C896',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.72rem',
    fontWeight: '600',
    cursor: 'pointer',
    WebkitAppearance: 'none',
  },
  historialLista: {
    flex: 1,
    overflowY: 'auto',
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  historialVacio: {
    fontSize: '0.75rem',
    color: '#4A5A6A',
    fontFamily: "'Montserrat', sans-serif",
    textAlign: 'center',
    padding: '1.5rem 0.5rem',
    lineHeight: 1.5,
  },
  chatItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.3rem',
    padding: '0.6rem 0.7rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  chatItemActivo: {
    backgroundColor: 'rgba(0,200,150,0.08)',
    border: '1px solid rgba(0,200,150,0.15)',
  },
  chatItemBody: {
    flex: 1,
    minWidth: 0,
  },
  chatItemTitulo: {
    fontSize: '0.75rem',
    color: '#C8D8E8',
    fontFamily: "'Montserrat', sans-serif",
    lineHeight: 1.4,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  chatItemFecha: {
    fontSize: '0.65rem',
    color: '#4A5A6A',
    fontFamily: "'Montserrat', sans-serif",
    marginTop: '0.2rem',
  },
  eliminarBtn: {
    background: 'none',
    border: 'none',
    WebkitAppearance: 'none',
    color: '#4A5A6A',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '2px 4px',
    borderRadius: '4px',
    flexShrink: 0,
    marginTop: '1px',
    lineHeight: 1,
  },
  // Chat
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.25rem',
  },
  titulo: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '800',
    fontSize: '1.75rem',
    color: '#E8EDF2',
    letterSpacing: '-0.04em',
  },
  subtitulo: {
    fontSize: '0.78rem',
    color: '#4A5A6A',
    marginTop: '0.3rem',
    fontFamily: "'Montserrat', sans-serif",
  },
  badge: {
    fontSize: '0.7rem',
    padding: '4px 10px',
    borderRadius: '20px',
    backgroundColor: 'rgba(0,200,150,0.1)',
    border: '1px solid rgba(0,200,150,0.2)',
    color: '#00C896',
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  sugerencias: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  chip: {
    padding: '0.4rem 0.85rem',
    borderRadius: '20px',
    border: '1px solid #1E2D3D',
    backgroundColor: '#111820',
    color: '#7A8FA6',
    fontSize: '0.76rem',
    fontFamily: "'Montserrat', sans-serif",
    cursor: 'pointer',
    WebkitAppearance: 'none',
  },
  chat: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    paddingRight: '0.25rem',
    marginBottom: '1rem',
  },
  fila: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.65rem',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    backgroundColor: '#00C896',
    color: '#0A0E14',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '800',
    fontSize: '0.8rem',
    flexShrink: 0,
    marginTop: '2px',
  },
  burbuja: {
    maxWidth: '75%',
    padding: '0.85rem 1.1rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    lineHeight: '1.65',
    fontFamily: "'Montserrat', sans-serif",
  },
  burbujaAgente: {
    backgroundColor: '#151D27',
    border: '1px solid #1E2D3D',
    color: '#C8D8E8',
    borderTopLeftRadius: '4px',
  },
  burbujaUsuario: {
    backgroundColor: 'rgba(0,200,150,0.12)',
    border: '1px solid rgba(0,200,150,0.2)',
    color: '#E8EDF2',
    borderTopRightRadius: '4px',
  },
  burbujaError: {
    backgroundColor: 'rgba(255,77,106,0.08)',
    border: '1px solid rgba(255,77,106,0.2)',
    color: '#FF4D6A',
  },
  inputArea: {
    display: 'flex',
    gap: '0.6rem',
    alignItems: 'flex-end',
    backgroundColor: '#111820',
    border: '1px solid #1E2D3D',
    borderRadius: '12px',
    padding: '0.7rem',
  },
  textarea: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#E8EDF2',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.875rem',
    lineHeight: '1.5',
    resize: 'none',
    padding: '0.2rem 0.4rem',
  },
  enviarBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#00C896',
    color: '#0A0E14',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'opacity 0.15s',
  },
  enviarBtnDisabled: {
    opacity: 0.35,
    cursor: 'not-allowed',
  },
  adjuntarBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1px solid #1E2D3D',
    backgroundColor: 'transparent',
    color: '#7A8FA6',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    WebkitAppearance: 'none',
  },
  adjuntoPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    marginBottom: '0.6rem',
    backgroundColor: '#111820',
    border: '1px solid #1E2D3D',
    borderRadius: '10px',
    width: 'fit-content',
    maxWidth: '100%',
  },
  errorArchivo: {
    fontSize: '0.75rem',
    color: '#FF4D6A',
    fontFamily: "'Montserrat', sans-serif",
    marginBottom: '0.5rem',
  },
  archivoChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    padding: '0.35rem 0.6rem',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: '8px',
    width: 'fit-content',
    maxWidth: '100%',
  },
  archivoThumb: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  archivoIcono: {
    display: 'flex',
    flexShrink: 0,
  },
  archivoNombre: {
    fontSize: '0.75rem',
    color: '#C8D8E8',
    fontFamily: "'Montserrat', sans-serif",
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  quitarAdjuntoBtn: {
    background: 'none',
    border: 'none',
    WebkitAppearance: 'none',
    color: '#4A5A6A',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '2px 4px',
    flexShrink: 0,
  },
};
