import { useState } from 'react'

// ─── TYPES ────────────────────────────────────────────────────────────────────

type ViewMode    = 'skeleton' | 'sim'
type OverlayMode = 'none' | 'zones' | 'areas'
type SeloType    = 'none' | 'frete' | 'click' | 'whatsapp' | 'revendedora' | 'app' | 'escolha' | 'loja'
type TabId       = 'formatos' | 'selos'

// Layout position variants
type LogoPos   = 'left' | 'right'   // always bottom; selo is always the opposite side
type AnforaPos = 'left' | 'right'   // same side as text → below TXT2; opposite → mid-height
type TextPos   = 'left' | 'right'
// Selo position is derived: always the opposite side of LogoPos

// ─── BRAND ICONS ─────────────────────────────────────────────────────────────

const ANFORA_URL = 'https://app.smartly.io/filestore/images/2e192375-8c4c-4c26-b1ee-2a3b158d75b7/blob'

function Anfora({ px }: { px: number }) {
  return (
    <img
      src={ANFORA_URL}
      alt="Ânfora oBoticário"
      style={{
        height: px,
        width: 'auto',
        display: 'block',
        filter: 'brightness(0) invert(1)',
        objectFit: 'contain',
      }}
    />
  )
}

const OB_LOGO_URL = 'https://logodownload.org/wp-content/uploads/2014/10/boticario-logo-1.png'

function LogoMarca({ px = 20, white = true }: { px?: number; white?: boolean }) {
  return (
    <img
      src={OB_LOGO_URL}
      alt="oBoticário"
      style={{
        height: px,
        width: 'auto',
        display: 'block',
        // força branco puro em fundos escuros/foto
        filter: white ? 'brightness(0) invert(1)' : 'none',
        objectFit: 'contain',
      }}
    />
  )
}

// ─── SELOS ────────────────────────────────────────────────────────────────────

const SELOS_LIST: { id: SeloType; label: string }[] = [
  { id: 'none',        label: 'Sem Selo' },
  { id: 'frete',       label: 'Frete Grátis' },
  { id: 'click',       label: 'Clique & Retire' },
  { id: 'whatsapp',    label: 'Compre pelo WhatsApp' },
  { id: 'revendedora', label: 'Compre com uma Revendedora' },
  { id: 'app',         label: 'Compre pelo App' },
  { id: 'escolha',     label: 'Escolha onde Comprar' },
  { id: 'loja',        label: 'Encontre uma Loja' },
]

/**
 * Selo — badge horizontal estilo etiqueta/lacre.
 * D é o tamanho de referência (antigo diâmetro). A altura do badge = D * 0.44.
 * Formato: ícone à esquerda | divisória | texto à direita.
 */
function Selo({ type, D }: { type: SeloType; D: number }) {
  if (type === 'none') return null

  const H      = Math.round(D * 0.44)          // altura do badge
  const radius = Math.round(H * 0.22)           // arredondamento dos cantos
  const stroke = Math.max(1.5, H * 0.028)       // espessura da borda
  const iconW  = Math.round(H * 1.05)           // largura da célula do ícone (quadrada)
  const iconSz = Math.round(H * 0.46)           // tamanho do SVG dentro
  const padH   = Math.round(H * 0.18)           // padding horizontal do texto
  const bigF   = Math.round(H * 0.30)
  const midF   = Math.round(H * 0.22)
  const smallF = Math.round(H * 0.17)

  const badge = (borderColor = 'rgba(255,255,255,0.88)', bg = 'rgba(8,8,8,0.60)'): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'stretch',
    height: H, borderRadius: radius,
    border: `${stroke}px solid ${borderColor}`,
    backgroundColor: bg,
    backdropFilter: 'blur(10px)',
    overflow: 'hidden', boxSizing: 'border-box',
  })

  const iconCell = (bg = 'rgba(255,255,255,0.08)'): React.CSSProperties => ({
    width: iconW, flexShrink: 0,
    backgroundColor: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRight: `${stroke}px solid rgba(255,255,255,0.18)`,
  })

  const textCell: React.CSSProperties = {
    display: 'flex', flexDirection: 'column',
    alignItems: 'flex-start', justifyContent: 'center',
    padding: `0 ${padH}px`, gap: Math.round(H * 0.04),
  }

  const sup = (color = 'rgba(255,255,255,0.55)'): React.CSSProperties => ({
    fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 400,
    fontSize: smallF, letterSpacing: '0.12em',
    color, textTransform: 'uppercase', lineHeight: 1, whiteSpace: 'nowrap',
  })

  const main = (sz = bigF, color = '#fff'): React.CSSProperties => ({
    fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 900,
    fontSize: sz, letterSpacing: '0.04em',
    color, textTransform: 'uppercase', lineHeight: 1, whiteSpace: 'nowrap',
  })

  if (type === 'frete') return (
    <div style={badge()}>
      <div style={iconCell()}>
        <svg width={iconSz} height={Math.round(iconSz * 0.72)} viewBox="0 0 28 20" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="17" height="12" rx="1.5"/>
          <path d="M18 7h5l3 4v5h-8V7z"/>
          <circle cx="6" cy="17" r="2" fill="rgba(255,255,255,0.88)" stroke="none"/>
          <circle cx="22" cy="17" r="2" fill="rgba(255,255,255,0.88)" stroke="none"/>
        </svg>
      </div>
      <div style={textCell}>
        <div style={sup()}>FRETE</div>
        <div style={main()}>GRÁTIS</div>
      </div>
    </div>
  )

  if (type === 'click') return (
    <div style={badge()}>
      <div style={iconCell()}>
        <svg width={iconSz} height={iconSz} viewBox="0 0 28 28" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 10V7a6 6 0 0112 0v3"/>
          <rect x="4" y="10" width="20" height="15" rx="1.5"/>
          <path d="M11 17l3 3 3-3M14 14v6"/>
        </svg>
      </div>
      <div style={textCell}>
        <div style={sup()}>COMPRA</div>
        <div style={main()}>CLIQUE &amp; RETIRE</div>
      </div>
    </div>
  )

  if (type === 'whatsapp') return (
    <div style={badge('rgba(37,211,102,0.85)', 'rgba(0,22,8,0.70)')}>
      <div style={iconCell('rgba(37,211,102,0.12)')}>
        <svg width={iconSz} height={iconSz} viewBox="0 0 24 24" fill="rgba(37,211,102,0.95)">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </div>
      <div style={textCell}>
        <div style={sup('rgba(37,211,102,0.65)')}>COMPRE PELO</div>
        <div style={main(bigF, 'rgba(37,211,102,1)')}>WHATSAPP</div>
      </div>
    </div>
  )

  if (type === 'revendedora') return (
    <div style={badge()}>
      <div style={iconCell()}>
        <svg width={iconSz} height={iconSz} viewBox="0 0 28 28" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="14" cy="8" r="4.5"/>
          <path d="M4 24c0-5.5 4.5-9 10-9s10 3.5 10 9"/>
          <path d="M21 3l.6 1.8h1.9l-1.5 1.1.6 1.8-1.6-1.1-1.6 1.1.6-1.8-1.5-1.1h1.9z" fill="rgba(255,255,255,0.88)" stroke="none"/>
        </svg>
      </div>
      <div style={textCell}>
        <div style={sup()}>COMPRE COM UMA</div>
        <div style={main()}>REVENDEDORA</div>
      </div>
    </div>
  )

  if (type === 'app') return (
    <div style={badge()}>
      <div style={iconCell()}>
        <svg width={Math.round(iconSz * 0.62)} height={iconSz} viewBox="0 0 18 28" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="1" width="16" height="26" rx="3"/>
          <line x1="7" y1="23.5" x2="11" y2="23.5" strokeWidth="2.2"/>
          <line x1="5" y1="5" x2="13" y2="5" strokeWidth="1.2" strokeOpacity="0.45"/>
        </svg>
      </div>
      <div style={textCell}>
        <div style={sup()}>COMPRE PELO</div>
        <div style={main()}>APP</div>
      </div>
    </div>
  )

  if (type === 'escolha') return (
    <div style={badge()}>
      <div style={iconCell()}>
        <svg width={iconSz} height={iconSz} viewBox="0 0 28 28" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2C10.1 2 7 5.1 7 9c0 5.2 7 14 7 14s7-8.8 7-14c0-3.9-3.1-7-7-7z"/>
          <circle cx="14" cy="9" r="2.5"/>
          <path d="M6 22c-2 .5-3 1.2-3 1.8 0 1 4.9 1.8 11 1.8s11-.8 11-1.8c0-.6-1-1.3-3-1.8" strokeWidth="1.3" strokeOpacity="0.5"/>
        </svg>
      </div>
      <div style={textCell}>
        <div style={sup()}>ESCOLHA</div>
        <div style={main(midF)}>ONDE COMPRAR</div>
      </div>
    </div>
  )

  if (type === 'loja') return (
    <div style={badge()}>
      <div style={iconCell()}>
        <svg width={iconSz} height={Math.round(iconSz * 0.9)} viewBox="0 0 28 24" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 8l2-6h20l2 6"/>
          <path d="M2 8c0 2.2 1.8 4 4 4s4-1.8 4-4c0 2.2 1.8 4 4 4s4-1.8 4-4c0 2.2 1.8 4 4 4s4-1.8 4-4"/>
          <path d="M4 12v10h20V12"/>
          <rect x="10" y="16" width="8" height="6" rx="1"/>
        </svg>
      </div>
      <div style={textCell}>
        <div style={sup()}>ENCONTRE</div>
        <div style={main()}>UMA LOJA</div>
      </div>
    </div>
  )

  return null
}

// ─── ZONE SYSTEM ─────────────────────────────────────────────────────────────

const Z = {
  bg:       { label: 'BG — Foto de Fundo',    bg: 'rgba(80,110,180,0.20)',  bd: 'rgba(100,140,230,0.65)', tx: 'rgba(140,180,255,1)' },
  campanha: { label: 'Logo Campanha',          bg: 'rgba(220,120,20,0.20)', bd: 'rgba(240,150,30,0.7)',  tx: 'rgba(255,175,55,1)'  },
  marca:    { label: 'Logo Marca',             bg: 'rgba(30,170,90,0.20)',  bd: 'rgba(40,200,110,0.7)',  tx: 'rgba(70,225,135,1)'  },
  anfora:   { label: 'Ânfora',                 bg: 'rgba(150,70,220,0.20)', bd: 'rgba(180,100,240,0.7)', tx: 'rgba(205,135,255,1)' },
  txt1:     { label: 'TXT 1 — Headline',       bg: 'rgba(210,50,50,0.20)',  bd: 'rgba(240,70,70,0.7)',   tx: 'rgba(255,115,115,1)' },
  txt2:     { label: 'TXT 2 — Segmentação',    bg: 'rgba(200,160,10,0.20)', bd: 'rgba(230,190,30,0.7)',  tx: 'rgba(252,215,55,1)'  },
  selo:     { label: 'Selo (opcional)',         bg: 'rgba(20,180,200,0.20)', bd: 'rgba(30,210,230,0.7)',  tx: 'rgba(70,235,252,1)'  },
  juridico: { label: 'Texto Jurídico',          bg: 'rgba(180,80,160,0.20)', bd: 'rgba(210,100,190,0.7)', tx: 'rgba(240,140,220,1)' },
} as const
type ZK = keyof typeof Z

const SHORT: Record<ZK, string> = {
  bg: 'BG', campanha: 'LOGO\nCAMPANHA', marca: 'LOGO\nMARCA',
  anfora: 'ÂNFORA', txt1: 'TXT 1', txt2: 'TXT 2', selo: 'SELO', juridico: 'JURÍDICO',
}

// ─── LAYOUT METRICS ──────────────────────────────────────────────────────────

function mx(W: number, H: number, isS: boolean, st: number, sb: number) {
  const pad   = 72
  const cTop  = isS ? st + 60 : pad
  const cBot  = isS ? sb + 60 : pad
  const campH = Math.round(H * (isS ? 0.148 : 0.178))
  const t1H   = Math.round(H * (isS ? 0.128 : 0.148))
  const t2H   = Math.round(H * (isS ? 0.098 : 0.108))
  const gap   = Math.round(H * 0.036)
  const t1Y   = cTop  + campH + gap
  const t2Y   = t1Y   + t1H   + gap
  const seloD = Math.round(W * 0.20)   // 20% of width = 216px at 1080
  return { pad, cTop, cBot, campH, t1H, t2H, gap, t1Y, t2Y, seloD }
}

// ─── ZONE LAYER (element boxes) ──────────────────────────────────────────────

function ZoneLayer({ W, H, fmt, selo, layout = DEFAULT_LAYOUT }: { W: number; H: number; fmt: Format; selo: SeloType; layout?: Layout }) {
  const isS    = fmt.id === 'stories'
  const m      = mx(W, H, isS, fmt.safeTop, fmt.safeBottom)
  const s      = W / 1080
  const fs  = Math.round(W / 1080 * 15)
  const contentLeft = layout.textPos === 'left'
  const contentEdge = contentLeft ? { left: m.pad } : { right: m.pad }
  const anforaSameSide = (layout.anforaPos === 'left') === contentLeft
  const anforaStyle: React.CSSProperties = anforaSameSide
    ? { top: m.t2Y + m.t2H + Math.round(H * 0.025), width: Math.round(W * 0.085), height: Math.round(W * 0.14), ...(layout.anforaPos === 'left' ? { left: m.pad } : { right: m.pad }) }
    : { top: '50%', transform: 'translateY(-50%)', width: Math.round(W * 0.085), height: Math.round(W * 0.14), ...(layout.anforaPos === 'left' ? { left: m.pad } : { right: m.pad }) }
  const marcaStyle: React.CSSProperties = {
    bottom: m.cBot,
    ...(layout.logoPos === 'left' ? { left: m.pad } : { right: m.pad }),
    width: Math.round(W * 0.30), height: Math.round(H * 0.055),
  }
  // Selo always opposite side of logo
  const seloStyle: React.CSSProperties = {
    bottom: m.cBot,
    ...(layout.logoPos === 'left' ? { right: m.pad } : { left: m.pad }),
  }

  function Box({ zk, style }: { zk: ZK; style: React.CSSProperties }) {
    const c = Z[zk]
    return (
      <div style={{ position: 'absolute', backgroundColor: c.bg, border: `2px dashed ${c.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', ...style }}>
        <span style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 800, fontSize: fs, letterSpacing: '0.12em', color: c.tx, textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.25, whiteSpace: 'pre-line' }}>
          {SHORT[zk]}
        </span>
      </div>
    )
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 9, pointerEvents: 'none' }}>
      {/* BG outline only */}
      <div style={{ position: 'absolute', inset: 0, border: `2px dashed ${Z.bg.bd}`, pointerEvents: 'none' }}>
        <span style={{ position: 'absolute', bottom: 10, right: 12, fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 800, fontSize: fs - 1, letterSpacing: '0.14em', color: Z.bg.tx, textTransform: 'uppercase' }}>BG</span>
      </div>
      <Box zk="campanha" style={{ top: m.cTop, ...contentEdge, width: Math.round(W * 0.43), height: m.campH }} />
      <Box zk="txt1"     style={{ top: m.t1Y,  ...contentEdge, width: Math.round(W * 0.45), height: m.t1H  }} />
      <Box zk="txt2"     style={{ top: m.t2Y,  ...contentEdge, width: Math.round(W * 0.43), height: m.t2H  }} />
      <Box zk="anfora"   style={anforaStyle} />
      {selo !== 'none' && (
        <Box zk="selo" style={{ ...seloStyle, width: Math.round(m.seloD * 2.2), height: Math.round(m.seloD * 0.44), borderRadius: 4 }} />
      )}
      <Box zk="marca" style={marcaStyle} />
      <Box zk="juridico" style={{ bottom: Math.round(H * 0.012), left: m.pad, right: m.pad, height: Math.round(H * 0.028), borderRadius: 2 }} />

      {/* Moldura zones */}
      {layout.moldura && (() => {
        const fw = Math.round(70 * s)
        const ft = Math.round(96 * s)
        const fb = Math.round(58 * s)
        const pH = H - ft - fb
        const pW = W - 2 * fw
        const zc = Z.juridico  // reuse a color; could add dedicated zone
        return (
          <>
            {/* Frame boundary */}
            <div style={{ position: 'absolute', top: ft, left: fw, width: pW, height: pH,
              border: `2px dashed rgba(255,255,255,0.5)`, pointerEvents: 'none', zIndex: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 800, fontSize: fs - 2, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>FOTO (DENTRO DA MOLDURA)</span>
            </div>
            {/* Top strip - logo */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: ft,
              border: `2px dashed ${zc.bd}`, backgroundColor: zc.bg, pointerEvents: 'none', zIndex: 20,
              display: 'flex', alignItems: 'center', justifyContent: layout.logoPos === 'left' ? 'flex-start' : 'flex-end', padding: `0 ${fw}px` }}>
              <span style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 800, fontSize: fs - 2, letterSpacing: '0.12em', color: zc.tx, textTransform: 'uppercase' }}>LOGO MARCA</span>
            </div>
            {/* Side strip - ânfora */}
            <div style={{ position: 'absolute', top: ft, bottom: fb, width: fw,
              ...(layout.anforaPos === 'left' ? { left: 0 } : { right: 0 }),
              border: `2px dashed ${Z.anfora.bd}`, backgroundColor: Z.anfora.bg, pointerEvents: 'none', zIndex: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 800, fontSize: fs - 3, letterSpacing: '0.12em', color: Z.anfora.tx, textTransform: 'uppercase', writingMode: 'vertical-rl' }}>ÂNFORA</span>
            </div>
            {/* Bottom strip - legal */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: fb,
              border: `2px dashed ${Z.bg.bd}`, backgroundColor: Z.bg.bg, pointerEvents: 'none', zIndex: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 800, fontSize: fs - 2, letterSpacing: '0.12em', color: Z.bg.tx, textTransform: 'uppercase' }}>TEXTO JURÍDICO</span>
            </div>
          </>
        )
      })()}
    </div>
  )
}

// ─── AREAS LAYER (composition guide ONLY — completely isolated) ──────────────

function AreasLayer({ W, H, fmt }: { W: number; H: number; fmt: Format }) {
  const isS = fmt.id === 'stories'
  const { safeTop: st, safeBottom: sb } = fmt
  const fs  = Math.round(W / 1080 * 20)

  // Content zone: left 52%
  // Photo zone:   right 56% (overlap in center is intentional)
  const contentW = Math.round(W * 0.52)
  const photoX   = Math.round(W * 0.46)

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 12, pointerEvents: 'none' }}>

      {/* ── Área de Conteúdo (left) ── */}
      <div style={{
        position: 'absolute',
        top: isS ? st : 0, bottom: isS ? sb : 0,
        left: 0, width: contentW,
        backgroundColor: 'rgba(190,40,40,0.28)',
        borderRight: '3px solid rgba(230,60,60,0.85)',
      }}>
        <div style={{ position: 'absolute', top: 20, left: 20 }}>
          <div style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 900, fontSize: fs, letterSpacing: '0.12em', color: 'rgba(255,100,100,1)', textTransform: 'uppercase', lineHeight: 1.2 }}>ÁREA DE{'\n'}CONTEÚDO</div>
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: fs * 0.55, color: 'rgba(255,130,130,0.8)', marginTop: 10, lineHeight: 1.6 }}>Logos, textos{'\n'}e selos vivem aqui</div>
        </div>
      </div>

      {/* ── Área da Foto (right) ── */}
      <div style={{
        position: 'absolute',
        top: isS ? st : 0, bottom: isS ? sb : 0,
        left: photoX, right: 0,
        backgroundColor: 'rgba(30,100,210,0.22)',
        borderLeft: '3px solid rgba(60,140,250,0.8)',
      }}>
        <div style={{ position: 'absolute', top: 20, right: 20 }}>
          <div style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 900, fontSize: fs, letterSpacing: '0.12em', color: 'rgba(90,165,255,1)', textTransform: 'uppercase', lineHeight: 1.2, textAlign: 'right' }}>ÁREA DA{'\n'}FOTO</div>
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: fs * 0.55, color: 'rgba(100,170,255,0.8)', marginTop: 10, lineHeight: 1.6, textAlign: 'right' }}>Pessoa + produto{'\n'}posicionados aqui</div>
        </div>
      </div>

      {/* ── Overlap marker ── */}
      <div style={{
        position: 'absolute',
        top: '50%', left: contentW - Math.round(W * 0.06),
        transform: 'translateY(-50%)',
        width: Math.round(W * 0.12),
        backgroundColor: 'rgba(0,0,0,0.72)',
        borderRadius: 4, padding: '8px 10px', textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 700, fontSize: Math.round(fs * 0.58), letterSpacing: '0.1em', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', lineHeight: 1.4, whiteSpace: 'pre-line' }}>ZONA{'\n'}MISTA</div>
      </div>

      {/* ── Safe zones (stories only) ── */}
      {isS && st > 0 && (
        <>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: st, backgroundColor: 'rgba(255,205,0,0.2)', borderBottom: '3px dashed rgba(255,215,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 800, fontSize: Math.round(fs * 0.7), letterSpacing: '0.16em', color: 'rgba(255,220,0,1)', textTransform: 'uppercase' }}>SAFE ZONE TOP — {st}px</span>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: sb, backgroundColor: 'rgba(255,205,0,0.2)', borderTop: '3px dashed rgba(255,215,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 800, fontSize: Math.round(fs * 0.7), letterSpacing: '0.16em', color: 'rgba(255,220,0,1)', textTransform: 'uppercase' }}>SAFE ZONE BOTTOM — {sb}px</span>
          </div>
        </>
      )}
    </div>
  )
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CAMPAIGNS = [
  { id: 'ameixa', logoCampanha: 'AMEIXA\nINTENSA', txt1: 'DEIXE\nA INTENSIDADE\nTE ENVOLVER.', txt2: 'A nova fragrância floral\ncom acorde de ameixa negra',
    bgSquare: '/assets/ameixa-bg.jpg',
    bgFeed:   '/assets/ameixa-bg.jpg',
    bgStory:  '/assets/ameixa-bg.jpg', bgColor: '#1a0520' },
  { id: 'glamour', logoCampanha: 'GLAMOUR\nINTENSE', txt1: 'SINTA A\nINTENSIDADE\nDO SEU GLAMOUR.', txt2: 'Experimente a nova fragrância\ncom 18% off',
    bgSquare: 'https://app.smartly.io/filestore/images/bfa77310-a764-4f24-b0e9-e6543bef676e/blob',
    bgFeed:   'https://app.smartly.io/filestore/images/bfa77310-a764-4f24-b0e9-e6543bef676e/blob',
    bgStory:  'https://app.smartly.io/filestore/images/bfa77310-a764-4f24-b0e9-e6543bef676e/blob', bgColor: '#0f0408' },
  { id: 'floratta', logoCampanha: 'FLORATTA\nBLUE CRYSTAL', txt1: 'NOVO FLORATTA\nBLUE CRYSTAL.', txt2: 'Deixe o amor\nentrar em cena.',
    bgSquare: 'https://app.smartly.io/filestore/images/d589e496-2ef8-4207-9b0b-69dffc84e063/blob',
    bgFeed:   'https://app.smartly.io/filestore/images/d589e496-2ef8-4207-9b0b-69dffc84e063/blob',
    bgStory:  'https://app.smartly.io/filestore/images/d589e496-2ef8-4207-9b0b-69dffc84e063/blob', bgColor: '#060f20' },
]

const FORMATS = [
  { id: 'square',  label: '1:1',  desc: 'Feed Square',    w: 1080, h: 1080, safeTop: 0,   safeBottom: 0   },
  { id: 'feed',    label: '4:5',  desc: 'Feed Portrait',  w: 1080, h: 1350, safeTop: 0,   safeBottom: 0   },
  { id: 'stories', label: '9:16', desc: 'Stories / Reels',w: 1080, h: 1920, safeTop: 250, safeBottom: 340 },
]

type Campaign = (typeof CAMPAIGNS)[0]
type Format   = (typeof FORMATS)[0]

function getBg(c: Campaign, f: Format) {
  if (f.id === 'square') return c.bgSquare
  if (f.id === 'feed')   return c.bgFeed
  return c.bgStory
}

// ─── SKELETON PIECE ───────────────────────────────────────────────────────────

function SkeletonPiece({ fmt, selo, overlay, layout = DEFAULT_LAYOUT }: { fmt: Format; selo: SeloType; overlay: OverlayMode; layout?: Layout }) {
  const { w: W, h: H } = fmt
  const isS = fmt.id === 'stories'
  const { safeTop: st, safeBottom: sb } = fmt

  return (
    <div style={{ width: W, height: H, position: 'relative', backgroundColor: '#14141c', overflow: 'hidden' }}>
      {/* BG placeholder */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: Z.bg.bg }} />

      {/* Zones always shown in skeleton */}
      <ZoneLayer W={W} H={H} fmt={fmt} selo={selo} layout={layout} />

      {/* Safe zone for skeleton (always shown in stories, unless areas overlay is active) */}
      {isS && st > 0 && overlay !== 'areas' && (
        <>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: st, backgroundColor: 'rgba(255,205,0,0.14)', borderBottom: '3px dashed rgba(255,215,0,0.85)', zIndex: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 800, fontSize: Math.round(W / 1080 * 15), letterSpacing: '0.15em', color: 'rgba(255,220,0,1)', textTransform: 'uppercase' }}>SAFE ZONE TOP — {st}px</span>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: sb, backgroundColor: 'rgba(255,205,0,0.14)', borderTop: '3px dashed rgba(255,215,0,0.85)', zIndex: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 800, fontSize: Math.round(W / 1080 * 15), letterSpacing: '0.15em', color: 'rgba(255,220,0,1)', textTransform: 'uppercase' }}>SAFE ZONE BOTTOM — {sb}px</span>
          </div>
        </>
      )}

      {/* Areas overlay (isolated — replaces safe zone view) */}
      {overlay === 'areas' && <AreasLayer W={W} H={H} fmt={fmt} />}
    </div>
  )
}

// ─── SIMULATION PIECE ─────────────────────────────────────────────────────────

// Per-campaign accent color for the gradient tint
const CAMPAIGN_TINT: Record<string, string> = {
  ameixa:  '80,10,100',
  glamour: '80,0,20',
  floratta: '0,25,70',
}
// Per-campaign photo focus point [square/feed, stories]
// Vertical focus per campaign: [landscape Y, story Y]
// Horizontal handled by anchoring img to photo-side column
const CAMPAIGN_POS: Record<string, [string, string]> = {
  ameixa:  ['65%', '60%'],
  glamour: ['center', '30%'],
  floratta: ['45%', '40%'],
}

interface Layout { logoPos: LogoPos; anforaPos: AnforaPos; textPos: TextPos; moldura: boolean }

const DEFAULT_LAYOUT: Layout = { logoPos: 'left', anforaPos: 'right', textPos: 'left', moldura: false }

function SimPiece({ campaign, fmt, selo, overlay, layout = DEFAULT_LAYOUT }: {
  campaign: Campaign; fmt: Format; selo: SeloType; overlay: OverlayMode; layout?: Layout
}) {
  const { w: W, h: H } = fmt
  const isS = fmt.id === 'stories'
  const s   = W / 1080
  const m   = mx(W, H, isS, fmt.safeTop, fmt.safeBottom)
  const tint = CAMPAIGN_TINT[campaign.id] ?? '0,0,0'
  const [posLandscape, posStory] = CAMPAIGN_POS[campaign.id] ?? ['center', 'center']

  const { logoPos, anforaPos, textPos, moldura } = layout

  // Content side = text side. Photo side = opposite.
  const contentLeft  = textPos === 'left'
  const contentEdge  = contentLeft ? { left:  m.pad } : { right: m.pad }
  const photoEdge    = contentLeft ? { right: m.pad } : { left:  m.pad }
  const txtAlign     = contentLeft ? 'left' as const   : 'right' as const

  // gradient direction follows text side
  const gradAngle  = contentLeft ? '105deg' : '285deg'
  const gradAngleS = contentLeft ? '90deg'  : '270deg'

  // Logo: always at the bottom edge, side chosen by user
  const logoStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: m.cBot,
    ...(logoPos === 'left' ? { left: m.pad } : { right: m.pad }),
  }

  // Selo: always opposite side of logo, same bottom level
  const seloStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: m.cBot,
    ...(logoPos === 'left' ? { right: m.pad } : { left: m.pad }),
  }

  // Ânfora: same side as text → just below TXT2; opposite side → vertical center
  const anforaSameSide = (anforaPos === 'left') === contentLeft
  const anforaStyle: React.CSSProperties = anforaSameSide
    ? {
        position: 'absolute',
        top: m.t2Y + m.t2H + Math.round(H * 0.025),
        ...(anforaPos === 'left' ? { left: m.pad } : { right: m.pad }),
      }
    : {
        position: 'absolute',
        top: '50%', transform: 'translateY(-50%)',
        ...(anforaPos === 'left' ? { left: m.pad } : { right: m.pad }),
      }

  // Text bounds: occupies content side, ~44% reserved for photo
  const txtNear = { ...contentEdge }
  const txtFar  = contentLeft ? { right: '44%' } : { left: '44%' }

  // ── MOLDURA LAYOUT ─────────────────────────────────────────────────────────
  if (moldura) {
    // Frame dimensions (native 1080px, scaled by s)
    const fw  = Math.round(70 * s)   // left/right frame strip
    const ft  = Math.round(96 * s)   // top frame strip (logo lives here)
    const fb  = Math.round(58 * s)   // bottom frame strip (legal text)
    const pH  = H - ft - fb          // inner photo height
    const pW  = W - 2 * fw           // inner photo width
    const frameColor = campaign.bgColor

    // Logo: in top frame strip, follows logoPos
    const mLogoStyle: React.CSSProperties = {
      position: 'absolute',
      top: Math.round(ft * 0.5), transform: 'translateY(-50%)',
      ...(logoPos === 'left' ? { left: fw } : { right: fw }),
    }

    // Ânfora: in left or right frame strip, vertically centered to photo area
    const anforaInStrip: React.CSSProperties = {
      position: 'absolute',
      top: ft + Math.round(pH * 0.5), transform: 'translateY(-50%)',
      ...(anforaPos === 'left'
        ? { left: Math.round(fw * 0.5), transform: 'translateX(-50%) translateY(-50%)' }
        : { right: Math.round(fw * 0.5), transform: 'translateX(50%) translateY(-50%)' }),
    }

    // Text inside photo: same left/right logic but relative to photo container
    const photoTxtEdge = contentLeft ? { left: Math.round(60 * s) } : { right: Math.round(60 * s) }
    const photoTxtFar  = contentLeft ? { right: '40%' } : { left: '40%' }
    const mTxtAlign    = contentLeft ? 'left' as const : 'right' as const
    const mGradAngle   = contentLeft ? '105deg' : '285deg'

    // Campaign name top position inside photo
    const mCampTop  = Math.round(pH * 0.07)
    const mTxt1Top  = Math.round(pH * 0.30)
    const mHairTop  = Math.round(pH * 0.56)
    const mTxt2Top  = Math.round(pH * 0.59)

    return (
      <div style={{ width: W, height: H, position: 'relative', backgroundColor: frameColor, overflow: 'hidden' }}>

        {/* ── INNER PHOTO FRAME ── */}
        <div style={{
          position: 'absolute',
          top: ft, left: fw,
          width: pW, height: pH,
          overflow: 'hidden',
        }}>
          <img src={getBg(campaign, fmt)} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: `${contentLeft ? '65%' : '35%'} ${isS ? posStory : posLandscape}`,
            transform: 'scale(1.12)', transformOrigin: 'center center',
          }} />

          {/* Gradient over photo */}
          <div style={{ position: 'absolute', inset: 0, background:
            `linear-gradient(${mGradAngle},
              rgba(0,0,0,0.82) 0%,
              rgba(0,0,0,0.65) 20%,
              rgba(0,0,0,0.32) 42%,
              rgba(0,0,0,0.06) 62%,
              rgba(0,0,0,0.0)  78%
            )`
          }} />
          <div style={{ position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, rgba(${tint},0.22) 0%, rgba(${tint},0.0) 60%)`,
          }} />

          {/* LOGO CAMPANHA */}
          <div style={{ position: 'absolute', top: mCampTop, ...photoTxtEdge, ...photoTxtFar, textAlign: mTxtAlign }}>
            {(() => {
              const [mainLine, ...subLines] = campaign.logoCampanha.split('\n')
              return (
                <>
                  <div style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 900, fontSize: 72 * s, letterSpacing: '0.14em', lineHeight: 0.9, color: '#fff', textTransform: 'uppercase' }}>
                    {mainLine}
                  </div>
                  {subLines.length > 0 && (
                    <div style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 700, fontSize: 28 * s, letterSpacing: '0.20em', lineHeight: 1.2, color: '#fff', textTransform: 'uppercase', marginTop: 3 * s }}>
                      {subLines.join('\n')}
                    </div>
                  )}
                </>
              )
            })()}
          </div>

          {/* TXT 1 */}
          <div style={{ position: 'absolute', top: mTxt1Top, ...photoTxtEdge, ...photoTxtFar, textAlign: mTxtAlign }}>
            <div style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 700, fontSize: 38 * s, letterSpacing: '0.05em', lineHeight: 1.22, color: '#fff', textTransform: 'uppercase', whiteSpace: 'pre-line' }}>
              {campaign.txt1}
            </div>
          </div>

          {/* Hairline */}
          <div style={{ position: 'absolute', top: mHairTop, ...photoTxtEdge, width: 44 * s, height: 1.5, backgroundColor: 'rgba(255,255,255,0.38)' }} />

          {/* TXT 2 */}
          <div style={{ position: 'absolute', top: mTxt2Top, ...photoTxtEdge, ...photoTxtFar, textAlign: mTxtAlign }}>
            <div style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontStyle: 'italic', fontSize: 26 * s, letterSpacing: '0.02em', lineHeight: 1.5, color: 'rgba(255,255,255,0.82)', whiteSpace: 'pre-line' }}>
              {campaign.txt2}
            </div>
          </div>

          {/* SELO inside photo */}
          {selo !== 'none' && (
            <div style={{ position: 'absolute', bottom: Math.round(pH * 0.04), ...(logoPos === 'left' ? { right: Math.round(60 * s) } : { left: Math.round(60 * s) }) }}>
              <Selo type={selo} D={Math.round(m.seloD * 0.85)} />
            </div>
          )}
        </div>

        {/* ── FRAME ELEMENTS (outside photo) ── */}

        {/* Logo oBoticário — top strip */}
        <div style={mLogoStyle}>
          <LogoMarca px={Math.round(32 * s)} white={false} />
        </div>

        {/* Ânfora — side strip */}
        <div style={anforaInStrip}>
          <img src={ANFORA_URL} alt="Ânfora" style={{ height: Math.round(52 * s), width: 'auto', display: 'block', objectFit: 'contain', filter: 'brightness(0)' }} />
        </div>

        {/* Texto jurídico — bottom strip */}
        <div style={{
          position: 'absolute',
          bottom: Math.round(fb * 0.5), transform: 'translateY(50%)',
          left: fw, right: fw,
          textAlign: 'center',
          fontFamily: 'Lato, sans-serif', fontSize: Math.round(14 * s),
          fontWeight: 400, letterSpacing: '0.02em',
          color: 'rgba(0,0,0,0.45)',
        }}>
          Imagens meramente ilustrativas. Sujeito a disponibilidade de estoque. Oferta válida enquanto durar o estoque.
        </div>

        {overlay === 'zones' && <ZoneLayer W={W} H={H} fmt={fmt} selo={selo} layout={layout} />}
        {overlay === 'areas' && <AreasLayer W={W} H={H} fmt={fmt} />}
      </div>
    )
  }

  return (
    <div style={{ width: W, height: H, position: 'relative', backgroundColor: campaign.bgColor, overflow: 'hidden' }}>

      {/* Photo anchored to the photo-side column — product stays opposite text */}
      <img src={getBg(campaign, fmt)} alt="" style={{
        position: 'absolute', top: 0, bottom: 0,
        ...(contentLeft ? { right: 0, left: 'auto' } : { left: 0, right: 'auto' }),
        width: '80%', height: '100%',
        objectFit: 'cover',
        objectPosition: `center ${isS ? posStory : posLandscape}`,
        transform: 'scale(1.18)',
        transformOrigin: 'center center',
      }} />

      {/* Gradient follows text side */}
      <div style={{ position: 'absolute', inset: 0, background: isS
        ? `linear-gradient(${gradAngleS},
            rgba(0,0,0,0.82) 0%,
            rgba(0,0,0,0.68) 18%,
            rgba(0,0,0,0.38) 38%,
            rgba(0,0,0,0.10) 58%,
            rgba(0,0,0,0.0)  100%
          ),
          linear-gradient(180deg,
            rgba(0,0,0,0.50) 0%,
            rgba(0,0,0,0.06) 15%,
            rgba(0,0,0,0.0)  50%,
            rgba(0,0,0,0.18) 75%,
            rgba(0,0,0,0.60) 100%
          )`
        : `linear-gradient(${gradAngle},
            rgba(0,0,0,0.98) 0%,
            rgba(0,0,0,0.92) 18%,
            rgba(0,0,0,0.72) 30%,
            rgba(0,0,0,0.38) 45%,
            rgba(0,0,0,0.08) 62%,
            rgba(0,0,0,0.0)  78%
          )`,
      }} />

      <div style={{ position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, rgba(${tint},0.28) 0%, rgba(${tint},0.08) 45%, rgba(${tint},0.0) 100%)`,
      }} />

      {/* LOGO CAMPANHA */}
      <div style={{ position: 'absolute', top: m.cTop, ...txtNear, ...txtFar, textAlign: txtAlign }}>
        {(() => {
          const [mainLine, ...subLines] = campaign.logoCampanha.split('\n')
          return (
            <>
              <div style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 900, fontSize: 82 * s, letterSpacing: '0.15em', lineHeight: 0.9, color: '#fff', textTransform: 'uppercase' }}>
                {mainLine}
              </div>
              {subLines.length > 0 && (
                <div style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 700, fontSize: 34 * s, letterSpacing: '0.20em', lineHeight: 1.2, color: '#fff', textTransform: 'uppercase', marginTop: 4 * s }}>
                  {subLines.join('\n')}
                </div>
              )}
            </>
          )
        })()}
        <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11 * s, color: 'rgba(255,255,255,0.26)', marginTop: 8 * s, letterSpacing: '0.08em' }}>↑ LOGO CAMPANHA</div>
      </div>

      {/* TXT 1 */}
      <div style={{ position: 'absolute', top: m.t1Y, ...txtNear, ...txtFar, textAlign: txtAlign }}>
        <div style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontWeight: 700, fontSize: 42 * s, letterSpacing: '0.06em', lineHeight: 1.22, color: '#fff', textTransform: 'uppercase', whiteSpace: 'pre-line' }}>
          {campaign.txt1}
        </div>
      </div>

      {/* Hairline */}
      <div style={{ position: 'absolute', top: m.t2Y - Math.round(H * 0.018),
        ...contentEdge,
        width: 48 * s, height: 1.5, backgroundColor: 'rgba(255,255,255,0.38)' }} />

      {/* TXT 2 */}
      <div style={{ position: 'absolute', top: m.t2Y, ...txtNear, ...txtFar, textAlign: txtAlign }}>
        <div style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontStyle: 'italic', fontSize: 32 * s, letterSpacing: '0.02em', lineHeight: 1.5, color: 'rgba(255,255,255,0.82)', whiteSpace: 'pre-line' }}>
          {campaign.txt2}
        </div>
      </div>

      {/* ÂNFORA */}
      <div style={anforaStyle}>
        <Anfora px={64 * s} />
      </div>

      {/* SELO */}
      {selo !== 'none' && (
        <div style={seloStyle}>
          <Selo type={selo} D={m.seloD} />
        </div>
      )}

      {/* LOGO MARCA */}
      <div style={logoStyle}>
        <LogoMarca px={Math.round(36 * s)} white />
      </div>

      {/* TEXTO JURÍDICO */}
      <div style={{
        position: 'absolute',
        bottom: Math.round(H * 0.012),
        left: m.pad, right: m.pad,
        textAlign: 'center',
        fontFamily: 'Lato, sans-serif',
        fontSize: Math.round(17 * s),
        fontWeight: 400,
        letterSpacing: '0.02em',
        lineHeight: 1.4,
        color: 'rgba(255,255,255,0.75)',
      }}>
        Imagens meramente ilustrativas. Sujeito a disponibilidade de estoque. Oferta válida enquanto durar o estoque.
      </div>

      {overlay === 'zones' && <ZoneLayer  W={W} H={H} fmt={fmt} selo={selo} />}
      {overlay === 'areas' && <AreasLayer W={W} H={H} fmt={fmt} />}
    </div>
  )
}

// ─── THUMBNAIL ────────────────────────────────────────────────────────────────

const THUMB_H = 380

function Thumb({ campaign, fmt, mode, selo, overlay, layout, active, onClick }: {
  campaign: Campaign; fmt: Format; mode: ViewMode; selo: SeloType
  overlay: OverlayMode; layout: Layout; active: boolean; onClick: () => void
}) {
  const scale = THUMB_H / fmt.h
  const tw    = Math.round(fmt.w * scale)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <button onClick={onClick} style={{
        width: tw, height: THUMB_H, padding: 0, border: 'none', borderRadius: 4,
        overflow: 'hidden', cursor: 'pointer', position: 'relative', flexShrink: 0,
        outline: active ? '2.5px solid #1A1A1A' : '1.5px solid #D0CCC5',
        outlineOffset: 3, transition: 'outline 0.15s',
        backgroundColor: mode === 'skeleton' ? '#14141c' : '#111',
      }}>
        <div style={{ width: fmt.w, height: fmt.h, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
          {mode === 'skeleton'
            ? <SkeletonPiece fmt={fmt} selo={selo} overlay={overlay} layout={layout} />
            : <SimPiece campaign={campaign} fmt={fmt} selo={selo} overlay={overlay} layout={layout} />}
        </div>
      </button>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: active ? '#1A1A1A' : '#666', textTransform: 'uppercase' }}>{fmt.desc}</div>
        <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#AAA', marginTop: 2 }}>{fmt.w} × {fmt.h}</div>
      </div>
    </div>
  )
}

// ─── SELOS TAB ────────────────────────────────────────────────────────────────

function SelosTab() {
  const [preview, setPreview] = useState<SeloType>('frete')
  const seloItems = SELOS_LIST.filter(s => s.id !== 'none')

  const label: React.CSSProperties = {
    fontFamily: 'Domaine Sans Text, Montserrat, sans-serif',
    fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
    textTransform: 'uppercase', color: '#BBBBBB',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 26, fontWeight: 800, letterSpacing: '-0.01em', color: '#1A1A1A', margin: 0 }}>Selos</h1>
        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 14, color: '#999', marginTop: 6, lineHeight: 1.7, margin: '6px 0 0' }}>
          Badges horizontais com ícone + texto. Altura ~9% da largura da peça. Posição: canto oposto ao Logo Marca.
        </p>
      </div>

      {/* Large preview */}
      <div style={{ backgroundColor: '#111', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '52px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Selo type={preview} D={260} />
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {seloItems.map(s => (
            <button key={s.id} onClick={() => setPreview(s.id)} style={{
              padding: '6px 14px',
              backgroundColor: preview === s.id ? '#fff' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${preview === s.id ? '#fff' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 3, cursor: 'pointer',
              fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 9, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: preview === s.id ? '#1A1A1A' : 'rgba(255,255,255,0.45)',
              transition: 'all 0.15s',
            }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de todos os selos */}
      <div>
        <div style={{ ...label, marginBottom: 16 }}>Todos os Selos</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {seloItems.map(s => (
            <div
              key={s.id}
              onClick={() => setPreview(s.id)}
              style={{
                backgroundColor: '#111', borderRadius: 8, padding: '24px 16px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                border: `1.5px solid ${preview === s.id ? 'rgba(255,255,255,0.35)' : 'transparent'}`,
                cursor: 'pointer', transition: 'border-color 0.15s',
              }}
            >
              <Selo type={s.id} D={160} />
              <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', letterSpacing: '0.03em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Escala + regra */}
      <div style={{ backgroundColor: '#F8F6F2', border: '1px solid #E8E4DC', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8E4DC' }}>
          <div style={{ ...label, color: '#888' }}>Escala por Formato</div>
        </div>
        <div style={{ display: 'flex' }}>
          {[
            { fmt: '1080 × 1080', ratio: '1:1' },
            { fmt: '1080 × 1350', ratio: '4:5' },
            { fmt: '1080 × 1920', ratio: '9:16' },
          ].map((r, i) => (
            <div key={r.fmt} style={{ flex: 1, padding: '18px 24px', borderRight: i < 2 ? '1px solid #E8E4DC' : 'none' }}>
              <div style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{r.fmt}</div>
              <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#999', marginTop: 3 }}>{r.ratio} · 20% da largura</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid #E8E4DC', backgroundColor: '#fff' }}>
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 13, color: '#777', lineHeight: 1.7 }}>
            O selo sempre fica no canto oposto ao Logo Marca — ambos na mesma linha horizontal no rodapé. Em 9:16, respeitam a safe zone inferior.
          </div>
        </div>
      </div>

    </div>
  )
}

// ─── BUTTON ──────────────────────────────────────────────────────────────────

function Btn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 11px',
      backgroundColor: active ? '#1A1A1A' : 'transparent',
      border: `1px solid ${active ? '#1A1A1A' : '#D0CCC5'}`,
      borderRadius: 2, cursor: 'pointer',
      fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 8.5, fontWeight: 700,
      letterSpacing: '0.13em', textTransform: 'uppercase',
      color: active ? '#fff' : '#888', transition: 'all 0.15s',
    }}>{label}</button>
  )
}

function Sep() { return <div style={{ width: 1, height: 16, backgroundColor: '#D0CCC5' }} /> }

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab,      setTab]      = useState<TabId>('formatos')
  const [mode,     setMode]     = useState<ViewMode>('skeleton')
  const [campaign, setCampaign] = useState(CAMPAIGNS[0])
  const [fmt,      setFmt]      = useState(FORMATS[0])
  const [selo,     setSelo]     = useState<SeloType>('none')
  const [overlay,  setOverlay]  = useState<OverlayMode>('none')
  const [expanded, setExpanded] = useState(false)

  const [logoPos,   setLogoPos]   = useState<LogoPos>('left')
  const [anforaPos, setAnforaPos] = useState<AnforaPos>('right')
  const [textPos,   setTextPos]   = useState<TextPos>('left')
  const [moldura,   setMoldura]   = useState(false)
  const layout: Layout = { logoPos, anforaPos, textPos, moldura }

  function toggleOverlay(o: OverlayMode) { setOverlay(prev => prev === o ? 'none' : o) }

  const EXP_SCALE = Math.min(
    (Math.min(typeof window !== 'undefined' ? window.innerWidth : 1200, 1108) * 0.78) / fmt.w,
    (typeof window !== 'undefined' ? window.innerHeight : 900) * 0.74 / fmt.h,
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#EDEAE4', overflowX: 'hidden' }}>

      {/* ── HEADER — brand + tabs apenas ── */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #DEDAD4', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 36px' }}>

          {/* Brand */}
          <div style={{ height: 52, display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid #F0EDE8' }}>
            <img src={OB_LOGO_URL} alt="oBoticário" style={{ height: 22, width: 'auto', display: 'block', objectFit: 'contain' }} />
            <div style={{ width: 1, height: 16, backgroundColor: '#DEDAD4' }} />
            <span style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 8, fontWeight: 600, letterSpacing: '0.22em', color: '#BBB', textTransform: 'uppercase' }}>
              Design System · Awareness · META
            </span>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', height: 40, borderBottom: '1px solid #F0EDE8' }}>
            {([['formatos', 'Formatos'], ['selos', 'Selos']] as [TabId, string][]).map(([id, lbl]) => (
              <button key={id} onClick={() => setTab(id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                height: 40, padding: '0 20px',
                fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 10, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: tab === id ? '#1A1A1A' : '#AAA',
                borderBottom: tab === id ? '2px solid #1A1A1A' : '2px solid transparent',
                marginBottom: -1,
                transition: 'all 0.15s',
              }}>
                {lbl}
              </button>
            ))}
          </div>

        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1140, margin: '0 auto', padding: '40px 36px 100px' }}>

        {/* ═══ SELOS TAB ═══ */}
        {tab === 'selos' && <SelosTab />}

        {/* ═══ FORMATOS TAB ═══ */}
        {tab === 'formatos' && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 25, fontWeight: 800, letterSpacing: '-0.01em', color: '#1A1A1A', margin: 0 }}>Peças de Awareness</h1>
              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 14, color: '#999', marginTop: 6, lineHeight: 1.7 }}>
                {mode === 'skeleton' ? 'Esqueleto para a criação.' : 'Simulação de campanha.'}&nbsp;
                {overlay === 'zones' && '· Zonas de elemento ativas.'}
                {overlay === 'areas' && '· Áreas de composição de foto ativas.'}
              </p>
            </div>

            {/* ── Painel de controles principal ── */}
            <div style={{
              backgroundColor: '#fff', border: '1px solid #DEDAD4', borderRadius: 6,
              marginBottom: 16, padding: '18px 20px',
              display: 'flex', alignItems: 'flex-start', gap: 32, flexWrap: 'wrap',
            }}>
              {/* Vista */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', color: '#AAA', textTransform: 'uppercase' }}>Vista</span>
                <div style={{ display: 'flex', backgroundColor: '#EDEAE4', borderRadius: 4, padding: 3, gap: 2 }}>
                  {(['skeleton', 'sim'] as const).map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                      padding: '7px 18px', border: 'none', borderRadius: 3, cursor: 'pointer',
                      backgroundColor: mode === m ? '#1A1A1A' : 'transparent',
                      fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: mode === m ? '#fff' : '#888',
                      boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
                      transition: 'all 0.15s', whiteSpace: 'nowrap',
                    }}>
                      {m === 'skeleton' ? 'Esqueleto' : 'Simulação'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ width: 1, height: 56, backgroundColor: '#EDEBE6', alignSelf: 'center' }} />

              {/* Campanha */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, opacity: mode === 'skeleton' ? 0.4 : 1, transition: 'opacity 0.2s' }}>
                <span style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', color: '#AAA', textTransform: 'uppercase' }}>Campanha</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {CAMPAIGNS.map(c => (
                    <button key={c.id} onClick={() => { setMode('sim'); setCampaign(c) }} style={{
                      padding: '7px 14px', borderRadius: 3, cursor: 'pointer',
                      backgroundColor: campaign.id === c.id && mode === 'sim' ? '#1A1A1A' : 'transparent',
                      border: `1px solid ${campaign.id === c.id && mode === 'sim' ? '#1A1A1A' : '#D0CCC5'}`,
                      fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: campaign.id === c.id && mode === 'sim' ? '#fff' : '#888',
                      transition: 'all 0.15s', whiteSpace: 'nowrap',
                    }}>
                      {c.id === 'ameixa' ? 'Ameixa Intensa' : c.id === 'glamour' ? 'Glamour Intense' : 'Floratta Blue Crystal'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ width: 1, height: 56, backgroundColor: '#EDEBE6', alignSelf: 'center' }} />

              {/* Overlay */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', color: '#AAA', textTransform: 'uppercase' }}>Overlay</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {([['zones', 'Zonas'], ['areas', 'Áreas de Foto']] as [OverlayMode, string][]).map(([o, lbl]) => (
                    <button key={o} onClick={() => toggleOverlay(o)} style={{
                      padding: '7px 14px', borderRadius: 3, cursor: 'pointer',
                      backgroundColor: overlay === o ? '#1A1A1A' : 'transparent',
                      border: `1px solid ${overlay === o ? '#1A1A1A' : '#D0CCC5'}`,
                      fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: overlay === o ? '#fff' : '#888',
                      transition: 'all 0.15s', whiteSpace: 'nowrap',
                    }}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Selos: dropdown em linha única ── */}
            <div style={{
              backgroundColor: '#fff', border: '1px solid #DEDAD4', borderRadius: 4,
              marginBottom: 24, padding: '0 16px', height: 44,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <span style={{
                fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 8, fontWeight: 700,
                letterSpacing: '0.2em', color: '#CCC', textTransform: 'uppercase', flexShrink: 0,
              }}>Selo</span>
              <div style={{ width: 1, height: 18, backgroundColor: '#EDEBE6', flexShrink: 0 }} />
              <select
                value={selo}
                onChange={e => setSelo(e.target.value as SeloType)}
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.08em', color: selo === 'none' ? '#BBB' : '#1A1A1A',
                  cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none',
                  textTransform: 'uppercase',
                }}
              >
                {SELOS_LIST.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              {/* chevron */}
              <svg width={12} height={12} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, pointerEvents: 'none' }}>
                <path d="M2 4l4 4 4-4" stroke="#BBBBBB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* ── Layout position controls ── */}
            <div style={{
              backgroundColor: '#fff', border: '1px solid #DEDAD4', borderRadius: 4,
              marginBottom: 24, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
            }}>
              {([
                { label: 'Logo',   opts: [['left','← Esq'], ['right','→ Dir']]                               as [LogoPos,string][],   val: logoPos,   set: setLogoPos },
                { label: 'Ânfora', opts: [['left','← Esq'], ['right','→ Dir']] as [AnforaPos,string][], val: anforaPos, set: setAnforaPos },
                { label: 'Texto',  opts: [['left','← Esq'],       ['right','→ Dir']]                          as [TextPos,string][],   val: textPos,   set: setTextPos },
              ] as const).map(({ label, opts, val, set }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', color: '#AAA', textTransform: 'uppercase', flexShrink: 0 }}>{label}</span>
                  <div style={{ display: 'flex', backgroundColor: '#EDEAE4', borderRadius: 3, padding: 2, gap: 1 }}>
                    {opts.map(([id, lbl]) => (
                      <button key={id} onClick={() => (set as (v: string) => void)(id)} style={{
                        padding: '4px 9px', border: 'none', borderRadius: 2, cursor: 'pointer',
                        backgroundColor: val === id ? '#1A1A1A' : 'transparent',
                        fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 8, fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: val === id ? '#fff' : '#888',
                        boxShadow: val === id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.15s', whiteSpace: 'nowrap',
                      }}>{lbl}</button>
                    ))}
                  </div>
                </div>
              ))}
              {/* Moldura toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
                <div style={{ width: 1, height: 18, backgroundColor: '#DEDAD4' }} />
                <span style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', color: '#AAA', textTransform: 'uppercase', flexShrink: 0 }}>Moldura</span>
                <button onClick={() => setMoldura(m => !m)} style={{
                  padding: '4px 9px', border: 'none', borderRadius: 2, cursor: 'pointer',
                  backgroundColor: moldura ? '#1A1A1A' : '#EDEAE4',
                  fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 8, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: moldura ? '#fff' : '#888',
                  transition: 'all 0.15s',
                }}>{moldura ? '✓ Com Moldura' : 'Sem Moldura'}</button>
              </div>
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 24 }}>
              {FORMATS.map(f => (
                <Thumb key={f.id} campaign={campaign} fmt={f} mode={mode} selo={selo} overlay={overlay} layout={layout}
                  active={fmt.id === f.id} onClick={() => { setFmt(f); setExpanded(true) }} />
              ))}
            </div>

            {/* ── Legenda — abaixo das peças ── */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
              padding: '10px 16px', backgroundColor: '#fff', border: '1px solid #DEDAD4',
              borderRadius: 4, marginBottom: 28,
            }}>
              <span style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', color: '#CCC', textTransform: 'uppercase', flexShrink: 0 }}>Legenda</span>
              {(Object.keys(Z) as ZK[]).map(k => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, opacity: overlay === 'areas' ? 0.38 : 1, transition: 'opacity 0.2s' }}>
                  <div style={{ width: 9, height: 9, borderRadius: 2, backgroundColor: Z[k].bg, border: `1.5px dashed ${Z[k].bd}`, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#555', whiteSpace: 'nowrap' }}>{Z[k].label}</span>
                </div>
              ))}
              <div style={{ width: 1, height: 14, backgroundColor: '#DEDAD4', flexShrink: 0 }} />
              {[
                { bg: 'rgba(190,40,40,0.28)',  bd: 'rgba(230,60,60,0.85)',  lbl: 'Área de Conteúdo', dashed: false },
                { bg: 'rgba(30,100,210,0.22)', bd: 'rgba(60,140,250,0.8)', lbl: 'Área da Foto',      dashed: false },
                { bg: 'rgba(255,205,0,0.2)',   bd: 'rgba(255,215,0,0.9)',  lbl: 'Safe Zone 9:16',    dashed: true  },
              ].map(item => (
                <div key={item.lbl} style={{ display: 'flex', alignItems: 'center', gap: 5, opacity: overlay === 'areas' ? 1 : 0.28, transition: 'opacity 0.2s' }}>
                  <div style={{ width: 9, height: 9, borderRadius: 2, backgroundColor: item.bg, border: `${item.dashed ? '1.5px dashed' : '2px solid'} ${item.bd}`, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#555', whiteSpace: 'nowrap' }}>{item.lbl}</span>
                </div>
              ))}
            </div>

            {/* Expanded */}
            {expanded && (
              <div style={{ backgroundColor: '#fff', border: '1px solid #DEDAD4', borderRadius: 6, padding: 28, marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#1A1A1A', textTransform: 'uppercase' }}>{fmt.desc} — {fmt.label} — {fmt.w} × {fmt.h}px</div>
                    {fmt.id === 'stories' && <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 12, color: '#AAA', marginTop: 2 }}>Safe zone: top {fmt.safeTop}px / bottom {fmt.safeBottom}px</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {FORMATS.map(f => <Btn key={f.id} label={f.label} active={fmt.id === f.id} onClick={() => setFmt(f)} />)}
                    <button onClick={() => setExpanded(false)} style={{ padding: '5px 10px', backgroundColor: 'transparent', border: '1px solid #D0CCC5', borderRadius: 2, cursor: 'pointer', fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 9, color: '#AAA' }}>✕</button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#F0EDE7', borderRadius: 3, padding: 28 }}>
                  <div style={{ width: Math.round(fmt.w * EXP_SCALE), height: Math.round(fmt.h * EXP_SCALE), position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                    <div style={{ width: fmt.w, height: fmt.h, transform: `scale(${EXP_SCALE})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
                      {mode === 'skeleton'
                        ? <SkeletonPiece fmt={fmt} selo={selo} overlay={overlay} layout={layout} />
                        : <SimPiece campaign={campaign} fmt={fmt} selo={selo} overlay={overlay} layout={layout} />}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Element specs */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #DEDAD4', borderRadius: 6, padding: 28 }}>
              <div style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#CCC', textTransform: 'uppercase', marginBottom: 20 }}>Especificações</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 0 }}>
                {([
                  { k: 'bg'       as ZK, d: 'Full-bleed. Produto + humanização. Sujeito na Área da Foto (direita). Área de Conteúdo (esquerda) deve ser neutra.' },
                  { k: 'campanha' as ZK, d: 'Logo específico de campanha — muda por lançamento. SVG ou PNG fundo transparente. Top-left, padding 72px.' },
                  { k: 'marca'    as ZK, d: 'Wordmark oBoticário sem slogan. Bottom-right. Fonte Domaine Sans (aguardando). Isolado da ânfora.' },
                  { k: 'anfora'   as ZK, d: 'Ícone símbolo. Right, ~40% da altura. Mínimo 200px de distância do logo marca.' },
                  { k: 'txt1'     as ZK, d: 'Headline da campanha. Alinhado à esquerda. Uppercase. Fonte Domaine Sans bold.' },
                  { k: 'txt2'     as ZK, d: 'Segmentação ou benefício. Left-aligned. Light italic. Separado do TXT1 por hairline.' },
                  { k: 'selo'     as ZK, d: 'Opcional. Circular ~20% da largura. Bottom-left — mesmo nível do Logo Marca no bottom-right.' },
                  { k: 'juridico' as ZK, d: 'Texto jurídico. Rodapé centralizado. Fonte pequena, discreta. Presente em todas as peças.' },
                ]).map((item, i) => (
                  <div key={item.k} style={{ display: 'flex', gap: 13, padding: '14px 0', borderBottom: i < 7 ? '1px solid #F0EDE8' : 'none' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, flexShrink: 0, marginTop: 3, backgroundColor: Z[item.k].bg, border: `1.5px dashed ${Z[item.k].bd}` }} />
                    <div>
                      <div style={{ fontFamily: 'Domaine Sans Text, Montserrat, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#1A1A1A', textTransform: 'uppercase' }}>{Z[item.k].label}</div>
                      <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 12, color: '#888', marginTop: 3, lineHeight: 1.65 }}>{item.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
