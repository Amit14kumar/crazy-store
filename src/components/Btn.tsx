/**
 * ─── NUVRA Global Button Library ────────────────────────────────────────────
 *
 * Usage:
 *   <Btn variant="primary" size="lg" arrow>Shop Now</Btn>
 *   <Btn variant="outline" size="md" to="/products">View All</Btn>
 *   <Btn variant="gradient" size="lg" arrow>Explore Pro</Btn>
 *   <Btn variant="ghost" size="sm">Cancel</Btn>
 *   <Btn variant="rose" pill size="md" arrow>Sale</Btn>
 *   <Btn variant="badge" badgeText="SPRING30" size="md">30% off with code</Btn>
 *   <Btn variant="icon-left" icon={<Star size={14}/>} size="md">Wishlist</Btn>
 *
 * Props:
 *   variant    — see VARIANTS below
 *   size       — 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 *   pill       — forces fully rounded (default true)
 *   arrow      — appends animated → arrow
 *   icon       — prepend any ReactNode icon
 *   badgeText  — appended pill badge (used by 'badge' variant)
 *   to         — React Router <Link>
 *   href       — plain <a>
 *   onClick    — button onClick
 *   disabled   — disabled state
 *   loading    — shows spinner, disables
 *   fullWidth  — w-full
 *   className  — extra classes
 */

import { Link } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

export type BtnVariant =
  | 'primary'        // solid black
  | 'secondary'      // solid white
  | 'rose'           // solid rose/red
  | 'gradient'       // purple→indigo gradient (inspired by React Bits Pro button)
  | 'gradient-rose'  // rose→pink gradient
  | 'outline'        // outlined black
  | 'outline-white'  // outlined white (on dark backgrounds)
  | 'outline-rose'   // outlined rose
  | 'ghost'          // no border, subtle hover
  | 'ghost-white'    // ghost on dark backgrounds
  | 'glass'          // frosted glass look
  | 'badge'          // text + appended code badge (outlined style)
  // legacy aliases
  | 'black'
  | 'white'
  | 'outline-black'

export type BtnSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface BtnProps {
  children: ReactNode
  variant?: BtnVariant
  size?: BtnSize
  pill?: boolean
  arrow?: boolean
  icon?: ReactNode
  badgeText?: string
  to?: string
  href?: string
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

// ─── Base ────────────────────────────────────────────────────────────────────
const BASE =
  'group inline-flex items-center justify-center gap-2 font-black tracking-[0.1em] uppercase transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed select-none'

// ─── Variants ────────────────────────────────────────────────────────────────
const VARIANTS: Record<BtnVariant, string> = {
  // Solid fills
  primary:         'bg-black text-white border-2 border-black hover:bg-neutral-800 hover:border-neutral-800',
  black:           'bg-black text-white border-2 border-black hover:bg-neutral-800 hover:border-neutral-800',
  secondary:       'bg-white text-black border-2 border-white hover:bg-gray-100',
  white:           'bg-white text-black border-2 border-white hover:bg-gray-100',
  rose:            'bg-rose-500 text-white border-2 border-rose-500 hover:bg-rose-600 hover:border-rose-600',

  // Gradients — like the React Bits Pro purple button
  gradient:
    'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-2 border-transparent hover:from-violet-500 hover:to-indigo-500 shadow-[0_4px_24px_rgba(109,40,217,0.35)] hover:shadow-[0_6px_28px_rgba(109,40,217,0.5)]',
  'gradient-rose':
    'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-2 border-transparent hover:from-rose-400 hover:to-pink-400 shadow-[0_4px_24px_rgba(244,63,94,0.3)] hover:shadow-[0_6px_28px_rgba(244,63,94,0.45)]',

  // Outlined
  outline:         'bg-transparent text-black border-2 border-black hover:bg-black hover:text-white',
  'outline-black': 'bg-transparent text-black border-2 border-black hover:bg-black hover:text-white',
  'outline-white': 'bg-transparent text-white border-2 border-white/40 hover:border-white hover:bg-white/10',
  'outline-rose':  'bg-transparent text-rose-500 border-2 border-rose-500 hover:bg-rose-500 hover:text-white',

  // Ghost
  ghost:           'bg-transparent text-black border-2 border-transparent hover:bg-gray-100',
  'ghost-white':   'bg-transparent text-white border-2 border-transparent hover:bg-white/10',

  // Glass (frosted)
  glass:
    'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/30',

  // Badge variant — outlined with an appended pill (like "30% off with code SPRING30")
  badge:
    'bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/5',
}

// ─── Sizes ───────────────────────────────────────────────────────────────────
const SIZES: Record<BtnSize, string> = {
  xs:  'text-[9px]  px-3.5 py-1.5',
  sm:  'text-[10px] px-5   py-2.5',
  md:  'text-[11px] px-7   py-3',
  lg:  'text-xs    px-9   py-3.5',
  xl:  'text-sm    px-12  py-4.5',
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Btn({
  children,
  variant = 'primary',
  size = 'md',
  pill = true,
  arrow = false,
  icon,
  badgeText,
  to,
  href,
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  type = 'button',
}: BtnProps) {
  const rounded = pill ? 'rounded-full' : 'rounded-xl'
  const width = fullWidth ? 'w-full' : ''
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${rounded} ${width} ${className}`

  const inner = (
    <>
      {loading ? (
        <Loader2 size={13} className="animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
      {badgeText && (
        <span className="ml-1 bg-white/15 border border-white/25 rounded-full px-2.5 py-0.5 text-[9px] font-black tracking-widest">
          {badgeText}
        </span>
      )}
      {arrow && !loading && (
        <ArrowRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform duration-200" />
      )}
    </>
  )

  const isDisabled = disabled || loading

  if (to && !isDisabled) return <Link to={to} className={cls}>{inner}</Link>
  if (href && !isDisabled) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  return (
    <button type={type} onClick={onClick} disabled={isDisabled} className={cls}>
      {inner}
    </button>
  )
}
