import { useNavigate } from 'react-router-dom'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Snackbar from '@mui/material/Snackbar'
import Slide from '@mui/material/Slide'
import CloseIcon from '@mui/icons-material/Close'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import { useCart } from '../context/CartContext'

const FREE_SHIP = 35

export default function CartDrawer() {
  const { cartOpen, setCartOpen, lines, removeItem, updateItem, totalItems, loading, toast } = useCart()
  const navigate = useNavigate()

  const subtotal = lines.reduce((acc: number, line: any) => {
    return acc + parseFloat(line.cost?.totalAmount?.amount ?? line.merchandise?.price?.amount ?? 0)
  }, 0)

  const remaining = Math.max(0, FREE_SHIP - subtotal)
  const progress = Math.min((subtotal / FREE_SHIP) * 100, 100)

  return (
    <>
      <Snackbar
        open={toast?.open ?? false}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        slots={{ transition: (props) => <Slide {...props} direction="left" /> }}
        sx={{ top: { xs: 70, sm: 80 } }}
      >
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 2,
          bgcolor: '#111', color: '#fff',
          px: 2.5, py: 1.75,
          minWidth: 280, maxWidth: 360,
          boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
        }}>
          {toast?.image && (
            <Box component="img" src={toast.image} sx={{ width: 44, height: 56, objectFit: 'cover', flexShrink: 0 }} />
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 13, color: '#4ade80' }} />
              <Typography sx={{ fontSize: '0.563rem', fontWeight: 700, color: '#4ade80', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Added to cart
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {toast?.title}
            </Typography>
          </Box>
          <Button
            size="small"
            onClick={() => setCartOpen(true)}
            sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.563rem', fontWeight: 700, letterSpacing: '0.1em', px: 1.5, py: 0.75, flexShrink: 0, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            View Cart
          </Button>
        </Box>
      </Snackbar>

      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: '100vw', sm: 420 },
              maxWidth: '100vw',
              borderRadius: 0,
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Your Cart
            </Typography>
            {totalItems > 0 && (
              <Box sx={{ bgcolor: 'secondary.main', color: '#fff', fontSize: '0.563rem', fontWeight: 700, minWidth: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 0.5 }}>
                {totalItems > 9 ? '9+' : totalItems}
              </Box>
            )}
          </Box>
          <IconButton onClick={() => setCartOpen(false)} size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0, width: 36, height: 36, '&:hover': { bgcolor: '#f5f5f5' } }}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {lines.length > 0 && (
          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#f9f9f9' }}>
            {subtotal >= FREE_SHIP ? (
              <Typography sx={{ fontSize: '0.688rem', fontWeight: 700, color: '#16a34a', textAlign: 'center', letterSpacing: '0.08em' }}>
                You have unlocked free shipping!
              </Typography>
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: '0.688rem', color: 'text.secondary' }}>
                    Add <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>${remaining.toFixed(2)}</Box> for free shipping
                  </Typography>
                  <Typography sx={{ fontSize: '0.688rem', fontWeight: 700 }}>${subtotal.toFixed(2)} / $35</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ bgcolor: '#e8e8e8', borderRadius: 0, height: 3, '& .MuiLinearProgress-bar': { bgcolor: 'secondary.main', borderRadius: 0 } }}
                />
              </>
            )}
          </Box>
        )}

        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {lines.length === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 3, px: 3, py: 8 }}>
              <Box sx={{ width: 80, height: 80, border: '2px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Inventory2OutlinedIcon sx={{ fontSize: 32, color: '#bbb' }} />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1rem' }}>Your cart is empty</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.813rem', lineHeight: 1.6 }}>
                  Discover our collection and add something you will love.
                </Typography>
              </Box>
              <Button variant="contained" color="primary" size="large" onClick={() => setCartOpen(false)} sx={{ px: 5 }}>
                Continue Shopping
              </Button>
            </Box>
          ) : (
            <Box sx={{ '& > *:not(:last-child)': { borderBottom: '1px solid', borderColor: '#f0f0f0' } }}>
              {lines.map((line: any) => {
                const img = line.merchandise?.product?.images?.edges?.[0]?.node
                const title = line.merchandise?.product?.title ?? 'Product'
                const variant = line.merchandise?.title
                const unitPrice = parseFloat(line.merchandise?.price?.amount ?? '0')
                const lineTotal = parseFloat(line.cost?.totalAmount?.amount ?? String(unitPrice * line.quantity))
                return (
                  <Box key={line.id} sx={{ display: 'flex', gap: 2, px: 3, py: 2.5, '&:hover': { bgcolor: '#fafafa' }, transition: 'background 0.15s' }}>
                    <Box sx={{ width: 76, height: 96, bgcolor: '#f3f3f3', flexShrink: 0, overflow: 'hidden' }}>
                      {img && <Box component="img" src={img.url} alt={title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.813rem', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {title}
                      </Typography>
                      {variant && variant !== 'Default Title' && (
                        <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          {variant}
                        </Typography>
                      )}
                      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', mt: 'auto' }}>
                        ${lineTotal.toFixed(2)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider' }}>
                          <IconButton
                            size="small"
                            disabled={loading || line.quantity <= 1}
                            onClick={() => updateItem(line.id, line.quantity - 1)}
                            sx={{ borderRadius: 0, width: 32, height: 32, '&:hover': { bgcolor: '#f5f5f5' } }}
                          >
                            <RemoveIcon sx={{ fontSize: 12 }} />
                          </IconButton>
                          <Typography sx={{ width: 36, textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, borderLeft: '1px solid', borderRight: '1px solid', borderColor: 'divider', height: 32, lineHeight: '32px' }}>
                            {line.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            disabled={loading}
                            onClick={() => updateItem(line.id, line.quantity + 1)}
                            sx={{ borderRadius: 0, width: 32, height: 32, '&:hover': { bgcolor: '#f5f5f5' } }}
                          >
                            <AddIcon sx={{ fontSize: 12 }} />
                          </IconButton>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => removeItem(line.id)}
                          disabled={loading}
                          sx={{ borderRadius: 0, width: 32, height: 32, color: '#aaa', '&:hover': { color: 'secondary.main', bgcolor: '#fff1f2' } }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>

        {lines.length > 0 && (
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Box sx={{ px: 3, pt: 2.5, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid', borderColor: '#f0f0f0' }}>
              <Box>
                <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, mb: 0.25 }}>
                  Subtotal
                </Typography>
                <Typography sx={{ fontSize: '0.688rem', color: 'text.secondary' }}>Taxes and shipping at checkout</Typography>
              </Box>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>${subtotal.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                onClick={() => { setCartOpen(false); navigate('/checkout') }}
                sx={{ py: 1.75, fontSize: '0.688rem', bgcolor: '#111', '&:hover': { bgcolor: '#333' } }}
              >
                Checkout Securely
              </Button>
              <Button
                variant="text"
                size="small"
                fullWidth
                onClick={() => setCartOpen(false)}
                sx={{ color: 'text.secondary', fontSize: '0.625rem', letterSpacing: '0.1em', minHeight: 36, '&:hover': { color: 'text.primary', bgcolor: 'transparent' } }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </>
  )
}
