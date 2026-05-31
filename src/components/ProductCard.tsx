import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Rating from '@mui/material/Rating'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckIcon from '@mui/icons-material/Check'
import { useCart } from '../context/CartContext'

interface Product {
  id: string
  title: string
  handle: string
  images?: { edges: { node: { url: string; altText?: string } }[] }
  variants?: { edges: { node: { id: string } }[] }
  priceRange?: { minVariantPrice: { amount: string; currencyCode: string } }
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, loading } = useCart()
  const navigate = useNavigate()
  const [wished, setWished] = useState(false)
  const [added, setAdded] = useState(false)

  const image = product.images?.edges?.[0]?.node
  const variantId = product.variants?.edges?.[0]?.node?.id
  const price = parseFloat(product.priceRange?.minVariantPrice?.amount ?? '0')
  const comparePrice = (price * 1.55).toFixed(2)
  const discount = Math.round((1 - price / parseFloat(comparePrice)) * 100)

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!variantId) return
    await addItem(variantId)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!variantId) return
    await addItem(variantId)
    navigate(`/products/${product.handle}`)
  }

  return (
    <Card
      elevation={0}
      sx={{
        display: 'flex', flexDirection: 'column',
        border: '1px solid', borderColor: 'divider',
        borderRadius: 0, overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:hover': { borderColor: '#bbb', boxShadow: '0 8px 40px rgba(0,0,0,0.09)' },
        position: 'relative',
        '&:hover .quick-add-overlay': { opacity: 1 },
        '&:hover .wishlist-btn': { opacity: 1 },
      }}
    >
      {/* ── Image ─────────────────────────────── */}
      <Box sx={{ position: 'relative', bgcolor: '#f7f7f7', aspectRatio: '3/4', overflow: 'hidden' }}>
        <Box
          component={Link}
          to={`/products/${product.handle}`}
          sx={{ display: 'block', width: '100%', height: '100%' }}
        >
          {image ? (
            <Box
              component="img"
              src={image.url}
              alt={image.altText ?? product.title}
              sx={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.5s ease',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            />
          ) : (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f0f0f0' }}>
              <ShoppingBagOutlinedIcon sx={{ fontSize: 40, color: '#ccc' }} />
            </Box>
          )}
        </Box>

        {/* Discount badge */}
        <Box sx={{
          position: 'absolute', top: 0, left: 0,
          bgcolor: 'secondary.main', color: '#fff',
          px: 1.25, py: 0.625,
          fontSize: '0.563rem', fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          pointerEvents: 'none',
        }}>
          -{discount}%
        </Box>

        {/* Wishlist */}
        <IconButton
          className="wishlist-btn"
          onClick={() => setWished(w => !w)}
          size="small"
          sx={{
            position: 'absolute', top: 10, right: 10,
            bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
            borderRadius: 0, width: 36, height: 36,
            opacity: 0, transition: 'opacity 0.2s',
            '&:hover': { borderColor: '#999', bgcolor: '#f9f9f9' },
          }}
        >
          {wished
            ? <FavoriteIcon sx={{ fontSize: 14, color: 'secondary.main' }} />
            : <FavoriteBorderIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          }
        </IconButton>

        {/* Quick-add overlay */}
        <Button
          className="quick-add-overlay"
          onClick={handleAdd}
          disabled={loading || !variantId}
          startIcon={added ? <CheckIcon sx={{ fontSize: '13px !important' }} /> : <ShoppingBagOutlinedIcon sx={{ fontSize: '13px !important' }} />}
          sx={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            bgcolor: added ? '#16a34a' : '#0a0a0a',
            color: '#fff', borderRadius: 0,
            fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', minHeight: 44,
            opacity: 0, transition: 'opacity 0.2s, background-color 0.15s',
            '&:hover': { bgcolor: added ? '#16a34a' : 'secondary.main' },
            '&:disabled': { bgcolor: '#555', color: '#fff' },
          }}
        >
          {added ? 'Added ✓' : 'Quick Add'}
        </Button>
      </Box>

      {/* ── Info ──────────────────────────────── */}
      <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', gap: 1.25, flex: 1 }}>
        {/* Stars */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Rating value={4.8} precision={0.1} readOnly size="small" sx={{ fontSize: '0.75rem', color: '#f59e0b' }} />
          <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', fontWeight: 500 }}>(128)</Typography>
        </Box>

        {/* Title */}
        <Box component={Link} to={`/products/${product.handle}`} sx={{ textDecoration: 'none' }}>
          <Typography sx={{
            fontSize: '0.813rem', fontWeight: 600, color: 'text.primary',
            lineHeight: 1.35, display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            '&:hover': { color: 'secondary.main' }, transition: 'color 0.2s',
          }}>
            {product.title}
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
            ${price.toFixed(2)}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', textDecoration: 'line-through' }}>
            ${comparePrice}
          </Typography>
          <Typography sx={{ fontSize: '0.563rem', fontWeight: 700, color: 'secondary.main', letterSpacing: '0.1em' }}>
            -{discount}%
          </Typography>
        </Box>

        {/* CTA buttons — square, big */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 'auto', pt: 0.5 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAdd}
            disabled={loading || !variantId}
            startIcon={added ? <CheckIcon sx={{ fontSize: '14px !important' }} /> : <ShoppingBagOutlinedIcon sx={{ fontSize: '14px !important' }} />}
            sx={{
              bgcolor: added ? '#16a34a' : '#0a0a0a',
              minHeight: { xs: 48, sm: 50 },
              fontSize: { xs: '0.625rem', sm: '0.688rem' },
              '&:hover': { bgcolor: added ? '#16a34a' : 'secondary.main' },
              '&:disabled': { bgcolor: '#555', color: '#fff' },
              transition: 'background-color 0.15s',
            }}
          >
            {added ? 'Added to Cart ✓' : 'Add to Cart'}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleBuyNow}
            disabled={loading || !variantId}
            endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
            sx={{
              minHeight: { xs: 48, sm: 50 },
              fontSize: { xs: '0.625rem', sm: '0.688rem' },
              borderWidth: 2,
              '&:hover': { bgcolor: '#0a0a0a', color: '#fff', borderColor: '#0a0a0a' },
            }}
          >
            Buy Now
          </Button>
        </Box>
      </Box>
    </Card>
  )
}
