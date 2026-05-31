import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Rating from '@mui/material/Rating'
import Skeleton from '@mui/material/Skeleton'
import Chip from '@mui/material/Chip'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import CheckIcon from '@mui/icons-material/Check'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

interface Variant { id: string; title: string; price: { amount: string }; availableForSale: boolean }
interface Product {
  id: string; title: string; handle: string; description: string
  images: { edges: { node: { url: string; altText?: string } }[] }
  variants: { edges: { node: Variant }[] }
  priceRange: { minVariantPrice: { amount: string } }
}

const PERKS = [
  { Icon: LocalShippingOutlinedIcon, label: 'Free Shipping', sub: 'On orders over $35' },
  { Icon: RefreshOutlinedIcon,       label: 'Easy Returns',   sub: '30-day return policy' },
  { Icon: LockOutlinedIcon,          label: 'Secure Payment', sub: '256-bit SSL encryption' },
]

function LoadingSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 4, md: 8 } }}>
        <Skeleton variant="rectangular" sx={{ aspectRatio: '3/4', width: '100%' }} />
        <Box sx={{ pt: { md: 3 } }}>
          {[40, 60, 80, 50, 100, 56, 56].map((w, i) => (
            <Skeleton key={i} height={i < 2 ? 16 : i === 2 ? 24 : 14} width={`${w}%`} sx={{ mb: i === 2 ? 2 : 1.25 }} />
          ))}
        </Box>
      </Box>
    </Container>
  )
}

export default function ProductDetailPage() {
  const { handle } = useParams<{ handle: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [wished, setWished] = useState(false)
  const [added, setAdded] = useState(false)
  const { addItem, loading: cartLoading } = useCart()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    if (!handle) return
    getProduct(handle)
      .then((p: Product) => { setProduct(p); setSelectedVariant(p.variants.edges[0]?.node ?? null) })
      .finally(() => setLoading(false))
  }, [handle])

  const handleAddToCart = async () => {
    if (!selectedVariant) return
    for (let i = 0; i < qty; i++) await addItem(selectedVariant.id)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  if (loading) return <LoadingSkeleton />

  if (!product) return (
    <Box sx={{ textAlign: 'center', py: 16 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Product not found</Typography>
      <Box component={Link} to="/products" sx={{ color: 'secondary.main', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
        ← Back to all products
      </Box>
    </Box>
  )

  const images = product.images.edges
  const price = parseFloat(selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount)
  const comparePrice = (price * 1.55).toFixed(2)
  const discount = Math.round((1 - price / parseFloat(comparePrice)) * 100)
  const variants = product.variants.edges.map(e => e.node)

  // The sticky product actions panel (shared between desktop sidebar and mobile bottom bar)
  const ActionsPanel = (
    <>
      {/* Price */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 800, letterSpacing: '-0.02em' }}>
          ${price.toFixed(2)}
        </Typography>
        <Typography sx={{ fontSize: '1rem', color: 'text.secondary', textDecoration: 'line-through' }}>
          ${comparePrice}
        </Typography>
        <Box sx={{ bgcolor: 'secondary.main', color: '#fff', px: 1, py: 0.375, fontSize: '0.563rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          SAVE {discount}%
        </Box>
      </Box>

      {/* Variants */}
      {variants.length > 1 && (
        <Box sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', mb: 1.5 }}>
            Select: <Box component="span" sx={{ color: 'secondary.main' }}>{selectedVariant?.title}</Box>
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {variants.map(v => (
              <Chip
                key={v.id}
                label={v.title}
                onClick={() => v.availableForSale && setSelectedVariant(v)}
                variant={selectedVariant?.id === v.id ? 'filled' : 'outlined'}
                sx={{
                  borderRadius: 0, height: 40, fontWeight: 700, fontSize: '0.75rem',
                  bgcolor: selectedVariant?.id === v.id ? '#0a0a0a' : 'transparent',
                  color: selectedVariant?.id === v.id ? '#fff' : v.availableForSale ? 'text.primary' : 'text.disabled',
                  borderColor: selectedVariant?.id === v.id ? '#0a0a0a' : 'divider',
                  cursor: v.availableForSale ? 'pointer' : 'not-allowed',
                  textDecoration: !v.availableForSale ? 'line-through' : 'none',
                  '&:hover': v.availableForSale && selectedVariant?.id !== v.id
                    ? { borderColor: '#0a0a0a', bgcolor: 'transparent' } : {},
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Quantity */}
      <Box sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', mb: 1.5 }}>
          Quantity
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', border: '2px solid', borderColor: 'divider', width: 'fit-content' }}>
          <IconButton size="small" onClick={() => setQty(q => Math.max(1, q - 1))} sx={{ borderRadius: 0, width: 44, height: 44, borderRight: '1px solid', borderColor: 'divider' }}>
            <RemoveIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Typography sx={{ width: 56, textAlign: 'center', fontWeight: 700, fontSize: '0.938rem' }}>
            {qty}
          </Typography>
          <IconButton size="small" onClick={() => setQty(q => q + 1)} sx={{ borderRadius: 0, width: 44, height: 44, borderLeft: '1px solid', borderColor: 'divider' }}>
            <AddIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>

      {/* CTA Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={handleAddToCart}
          disabled={cartLoading || !selectedVariant}
          startIcon={added ? <CheckIcon /> : <ShoppingBagOutlinedIcon />}
          sx={{
            bgcolor: added ? '#16a34a' : '#0a0a0a',
            minHeight: 56, fontSize: '0.75rem',
            '&:hover': { bgcolor: added ? '#16a34a' : 'secondary.main' },
            '&:disabled': { bgcolor: '#ccc', color: '#fff' },
          }}
        >
          {added ? 'Added to Cart ✓' : 'Add to Cart'}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          fullWidth
          onClick={handleAddToCart}
          disabled={cartLoading || !selectedVariant}
          endIcon={<ArrowForwardIcon />}
          sx={{
            minHeight: 56, fontSize: '0.75rem', borderWidth: 2,
            '&:hover': { bgcolor: '#0a0a0a', color: '#fff', borderColor: '#0a0a0a' },
          }}
        >
          Buy Now
        </Button>
      </Box>
    </>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: isMobile ? 14 : 0 }}>

      {/* Breadcrumb */}
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
          <Box
            component={Link}
            to="/products"
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.5,
              py: 2, fontSize: '0.625rem', fontWeight: 700, color: 'text.secondary',
              textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.15em',
              '&:hover': { color: 'text.primary' }, transition: 'color 0.2s',
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 16 }} /> All Products
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, lg: 4 }, py: { xs: 3, md: 6 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 4, md: 8, lg: 12 }, alignItems: 'start' }}>

          {/* ── Image Gallery ───────────────── */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {/* Thumbnails */}
            {images.length > 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: 68, flexShrink: 0 }}>
                {images.map((img, i) => (
                  <Box
                    key={i}
                    component="button"
                    onClick={() => setActiveImage(i)}
                    sx={{
                      p: 0, border: '2px solid', cursor: 'pointer', borderRadius: 0,
                      borderColor: activeImage === i ? '#0a0a0a' : 'transparent',
                      opacity: activeImage === i ? 1 : 0.45,
                      overflow: 'hidden', aspectRatio: '1',
                      '&:hover': { opacity: 1 }, transition: 'all 0.15s',
                      background: 'none',
                    }}
                  >
                    <Box component="img" src={img.node.url} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </Box>
                ))}
              </Box>
            )}

            {/* Main Image */}
            <Box sx={{ flex: 1, position: 'relative', bgcolor: '#f7f7f7', aspectRatio: '3/4', overflow: 'hidden' }}>
              {images[activeImage] ? (
                <Box
                  component="img"
                  src={images[activeImage].node.url}
                  alt={images[activeImage].node.altText ?? product.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 60, color: '#ccc' }} />
                </Box>
              )}
              {/* Discount badge */}
              <Box sx={{
                position: 'absolute', top: 0, left: 0,
                bgcolor: 'secondary.main', color: '#fff',
                px: 1.5, py: 0.75,
                fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
              }}>
                -{discount}% OFF
              </Box>

              {/* Action icons on image */}
              <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <IconButton
                  onClick={() => setWished(w => !w)}
                  size="small"
                  sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 0, width: 40, height: 40, '&:hover': { bgcolor: '#f5f5f5' } }}
                >
                  {wished ? <FavoriteIcon sx={{ fontSize: 16, color: 'secondary.main' }} /> : <FavoriteBorderIcon sx={{ fontSize: 16 }} />}
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 0, width: 40, height: 40, '&:hover': { bgcolor: '#f5f5f5' } }}
                >
                  <ShareIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* ── Product Info ─────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={4.8} precision={0.1} readOnly size="small" sx={{ color: '#f59e0b' }} />
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>4.8 (128 reviews)</Typography>
            </Box>

            {/* Title */}
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                lineHeight: 1.1, mb: 3,
              }}
            >
              {product.title}
            </Typography>

            {/* Desktop: inline actions panel */}
            {!isMobile && ActionsPanel}

            {/* Perks */}
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {PERKS.map(({ Icon, label, sub }) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 40, height: 40, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>{label}</Typography>
                    <Typography sx={{ fontSize: '0.688rem', color: 'text.secondary' }}>{sub}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Description */}
            {product.description && (
              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', mb: 1.5 }}>
                  Description
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', lineHeight: 1.75 }}>
                  {product.description}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      {/* ── Mobile Fixed Bottom Bar ─────────────────────────── */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200,
            bgcolor: 'background.paper',
            borderTop: '1px solid', borderColor: 'divider',
            boxShadow: '0 -4px 30px rgba(0,0,0,0.12)',
            px: 2, py: 2,
            display: 'flex', gap: 1.5,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: '0.563rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Price</Typography>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
              ${price.toFixed(2)}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleAddToCart}
            disabled={cartLoading || !selectedVariant}
            startIcon={added ? <CheckIcon /> : <ShoppingBagOutlinedIcon />}
            sx={{
              flex: 1, bgcolor: added ? '#16a34a' : '#0a0a0a',
              minHeight: 52, fontSize: '0.688rem',
              '&:hover': { bgcolor: added ? '#16a34a' : 'secondary.main' },
              '&:disabled': { bgcolor: '#ccc', color: '#fff' },
            }}
          >
            {added ? 'Added ✓' : 'Add to Cart'}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleAddToCart}
            disabled={cartLoading || !selectedVariant}
            sx={{
              flex: 1, minHeight: 52, fontSize: '0.688rem', borderWidth: 2,
              '&:hover': { bgcolor: '#0a0a0a', color: '#fff', borderColor: '#0a0a0a' },
            }}
          >
            Buy Now
          </Button>
        </Box>
      )}
    </Box>
  )
}
