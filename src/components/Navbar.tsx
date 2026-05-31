import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useCart } from '../context/CartContext'

const CATEGORIES = [
  { label: 'Dresses', emoji: '👗' },
  { label: 'Makeup & Beauty', emoji: '💄' },
  { label: 'Skincare', emoji: '🧴' },
  { label: 'Jewelry', emoji: '💍' },
  { label: 'Handbags', emoji: '👜' },
  { label: 'Tops', emoji: '👚' },
  { label: 'Home Decor', emoji: '🏡' },
  { label: 'Accessories', emoji: '🕶️' },
]

export default function Navbar() {
  const { setCartOpen, totalItems } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [shopExpanded, setShopExpanded] = useState(false)
  const [shopHover, setShopHover] = useState(false)
  const location = useLocation()
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 4 })

  useEffect(() => { setMobileOpen(false); setShopExpanded(false) }, [location])

  return (
    <>
      {/* Announcement Bar */}
      <Box sx={{ bgcolor: '#0a0a0a', color: '#fff', textAlign: 'center', py: 1, fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
        ✦ Free Worldwide Shipping on Orders Over $35 &nbsp;·&nbsp; 7–15 Day Delivery ✦
      </Box>

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper', color: 'text.primary',
          borderBottom: '1px solid', borderColor: 'divider',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
          transition: 'box-shadow 0.3s',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            maxWidth: 1280, width: '100%', mx: 'auto',
            px: { xs: 2, sm: 3, lg: 4 },
            minHeight: { xs: 60, md: 64 },
            justifyContent: 'space-between', gap: 2,
          }}
        >
          {/* Logo */}
          <Typography
            component={Link}
            to="/"
            sx={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 700, fontStyle: 'italic',
              fontSize: { xs: '1.5rem', md: '1.75rem' },
              letterSpacing: '0.12em', color: 'text.primary',
              textDecoration: 'none', textTransform: 'uppercase',
              '&:hover': { color: 'secondary.main' }, transition: 'color 0.2s',
            }}
          >
            NUVRA
          </Typography>

          {/* Desktop links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
            <Box
              sx={{ position: 'relative' }}
              onMouseEnter={() => setShopHover(true)}
              onMouseLeave={() => setShopHover(false)}
            >
              <Box
                component="button"
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.5,
                  border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: '0.688rem', fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: shopHover ? 'text.primary' : 'text.secondary',
                  transition: 'color 0.2s', py: 2.5,
                }}
              >
                Shop
                <ExpandMoreIcon sx={{ fontSize: 14, transform: shopHover ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </Box>

              {shopHover && (
                <Box sx={{
                  position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                  width: 280, bgcolor: 'background.paper',
                  border: '1px solid', borderColor: 'divider',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                  p: 1.5, zIndex: 1300,
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                }}>
                  {CATEGORIES.map(c => (
                    <Box key={c.label} component={Link} to="/products" sx={{
                      display: 'flex', alignItems: 'center', gap: 1,
                      px: 1.5, py: 1.25, fontSize: '0.688rem', fontWeight: 600,
                      color: 'text.secondary', textDecoration: 'none',
                      '&:hover': { bgcolor: '#f5f5f5', color: 'text.primary' },
                      transition: 'all 0.15s',
                    }}>
                      <span style={{ fontSize: 14 }}>{c.emoji}</span>{c.label}
                    </Box>
                  ))}
                  <Box component={Link} to="/products" sx={{
                    gridColumn: '1/-1', textAlign: 'center', mt: 1, pt: 1.25,
                    borderTop: '1px solid', borderColor: 'divider',
                    fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: 'secondary.main', textDecoration: 'none',
                    '&:hover': { color: '#be123c' },
                  }}>
                    View All Products →
                  </Box>
                </Box>
              )}
            </Box>

            {[{ label: 'New In', path: '/products', accent: false }, { label: 'Sale', path: '/products', accent: true }].map(l => (
              <Box key={l.label} component={Link} to={l.path} sx={{
                fontSize: '0.688rem', fontWeight: 700, letterSpacing: '0.18em',
                textTransform: 'uppercase', textDecoration: 'none',
                color: l.accent ? 'secondary.main' : 'text.secondary',
                '&:hover': { color: l.accent ? '#be123c' : 'text.primary' }, transition: 'color 0.2s',
              }}>
                {l.label}
              </Box>
            ))}
          </Box>

          {/* Right actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton onClick={() => setCartOpen(true)} size="medium" sx={{ color: 'text.primary', '&:hover': { bgcolor: '#f5f5f5' } }}>
              <Badge badgeContent={totalItems} max={9} sx={{
                '& .MuiBadge-badge': {
                  bgcolor: 'secondary.main', color: '#fff',
                  fontSize: '0.563rem', fontWeight: 700,
                  minWidth: 18, height: 18, borderRadius: 0,
                },
              }}>
                <ShoppingBagOutlinedIcon sx={{ fontSize: 22 }} />
              </Badge>
            </IconButton>

            <IconButton onClick={() => setMobileOpen(o => !o)} size="medium" sx={{ display: { md: 'none' }, color: 'text.primary', '&:hover': { bgcolor: '#f5f5f5' } }}>
              {mobileOpen ? <CloseIcon sx={{ fontSize: 20 }} /> : <MenuIcon sx={{ fontSize: 20 }} />}
            </IconButton>
          </Box>
        </Toolbar>

        {/* Category strip desktop */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{
            maxWidth: 1280, mx: 'auto', px: { sm: 3, lg: 4 },
            display: 'flex', alignItems: 'center', overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
          }}>
            {CATEGORIES.map(c => (
              <Box key={c.label} component={Link} to="/products" sx={{
                display: 'flex', alignItems: 'center', gap: 0.75,
                px: 2, py: 1.25,
                fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'text.secondary',
                textDecoration: 'none', whiteSpace: 'nowrap',
                borderBottom: '2px solid transparent',
                '&:hover': { color: 'text.primary', borderColor: 'text.primary' },
                transition: 'all 0.2s',
              }}>
                <span>{c.emoji}</span>{c.label}
              </Box>
            ))}
          </Box>
        </Box>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} slotProps={{ paper: { sx: { width: 300, borderRadius: 0 } } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontStyle: 'italic', fontSize: '1.25rem', letterSpacing: '0.1em' }}>
            NUVRA
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ borderRadius: 0 }}><CloseIcon fontSize="small" /></IconButton>
        </Box>

        <List disablePadding>
          <ListItemButton onClick={() => setShopExpanded(e => !e)} sx={{ py: 1.75, px: 3 }}>
            <ListItemText primary="Shop" slotProps={{ primary: { style: { fontSize: '0.688rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' } } }} />
            <ExpandMoreIcon sx={{ fontSize: 16, transform: shopExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </ListItemButton>
          <Collapse in={shopExpanded}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', bgcolor: '#f9f9f9' }}>
              {CATEGORIES.map(c => (
                <Box key={c.label} component={Link} to="/products" onClick={() => setMobileOpen(false)} sx={{
                  display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5,
                  fontSize: '0.688rem', fontWeight: 600, color: 'text.secondary',
                  textDecoration: 'none', '&:hover': { bgcolor: '#f0f0f0', color: 'text.primary' },
                }}>
                  <span style={{ fontSize: 14 }}>{c.emoji}</span>{c.label}
                </Box>
              ))}
            </Box>
          </Collapse>
          <Divider />
          {[{ label: 'New In', path: '/products', accent: false }, { label: 'Sale', path: '/products', accent: true }].map(l => (
            <ListItem key={l.label} disablePadding>
              <ListItemButton component={Link} to={l.path} sx={{ py: 1.75, px: 3 }}>
                <ListItemText primary={l.label} slotProps={{ primary: { style: { fontSize: '0.688rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: l.accent ? '#E11D48' : '#0a0a0a' } } }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  )
}
