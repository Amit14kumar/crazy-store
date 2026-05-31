import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Rating from '@mui/material/Rating'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Skeleton from '@mui/material/Skeleton'
import CloseIcon from '@mui/icons-material/Close'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckIcon from '@mui/icons-material/Check'
import StarIcon from '@mui/icons-material/Star'
import { getProducts } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import DomeGallery from '../components/DomeGallery'

interface Product {
  id: string; title: string; handle: string
  images?: { edges: { node: { url: string; altText?: string } }[] }
  variants?: { edges: { node: { id: string } }[] }
  priceRange?: { minVariantPrice: { amount: string; currencyCode: string } }
}

const HERO_IMG = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=90&auto=format&fit=crop'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [addedId, setAddedId] = useState<string | null>(null)
  const { addItem, loading } = useCart()
  const navigate = useNavigate()

  useEffect(() => { getProducts().then(setProducts).catch(() => {}) }, [])

  // Build dome images from real product images, filtering out size charts & utility images
  const SIZE_CHART_PATTERN = /size\s*chart|measurement|size\s*guide|table|inches|waist|bust|hip|cm\b/i
  const domeImages = products.flatMap(p => {
    const imgs = (p.images?.edges ?? [])
      .filter(e => !SIZE_CHART_PATTERN.test(e.node.altText ?? ''))
      .slice(0, 3) // max 3 per product — product shots only
    if (imgs.length === 0) return [{ src: '', alt: p.title }]
    return imgs.map(e => ({ src: e.node.url, alt: e.node.altText || p.title }))
  })

  const handleAddToCart = async (variantId: string) => {
    await addItem(variantId)
    setAddedId(variantId)
    setTimeout(() => setAddedId(null), 2000)
  }

  const handleBuyNow = async (variantId: string, handle: string) => {
    await addItem(variantId)
    closePanel()
    navigate(`/products/${handle}`)
  }

  const openPanel = () => { setPanelOpen(true); document.body.style.overflow = 'hidden' }
  const closePanel = () => { setPanelOpen(false); document.body.style.overflow = '' }

  return (
    <Box sx={{ bgcolor: 'background.default' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <Box sx={{
        position: 'relative', minHeight: { xs: '85vh', md: '92vh' },
        display: 'flex', alignItems: 'flex-end',
        overflow: 'hidden', bgcolor: '#0a0a0a',
      }}>
        <Box
          component="img"
          src={HERO_IMG}
          alt="NUVRA"
          onLoad={() => setHeroLoaded(true)}
          sx={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'top',
            opacity: heroLoaded ? 0.48 : 0,
            transition: 'opacity 1s',
          }}
        />
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', pb: { xs: 8, md: 14 }, px: { xs: 3, lg: 4 } }}>
          <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.45em', color: '#E11D48', textTransform: 'uppercase', mb: 3 }}>
            New Collection · 2026
          </Typography>

          <Typography
            component="h1"
            sx={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: { xs: '4rem', sm: '6rem', md: '9rem' },
              fontWeight: 700, fontStyle: 'italic',
              color: '#fff', lineHeight: 0.88,
              letterSpacing: '-0.02em', mb: 4,
            }}
          >
            DEFINE<br />
            YOUR<br />
            <Box component="span" sx={{ color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.85)' }}>
              STYLE.
            </Box>
          </Typography>

          <Typography sx={{ color: '#aaa', fontSize: '0.875rem', maxWidth: 360, lineHeight: 1.7, mb: 5 }}>
            Premium fashion, beauty & lifestyle — delivered worldwide.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: 'secondary.main', color: '#fff', minHeight: 52,
                fontSize: '0.688rem', px: 4,
                '&:hover': { bgcolor: '#be123c' },
              }}
            >
              Shop Now
            </Button>
            <Button
              component={Link}
              to="/products"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'rgba(255,255,255,0.3)', color: '#fff', minHeight: 52,
                fontSize: '0.688rem', px: 4, borderWidth: 1,
                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              View All
            </Button>
          </Box>

          <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Rating value={5} readOnly size="small" sx={{ color: '#facc15', fontSize: '0.75rem' }}
              icon={<StarIcon fontSize="inherit" />} emptyIcon={<StarIcon fontSize="inherit" />}
            />
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.688rem', fontWeight: 500, letterSpacing: '0.04em' }}>
              4.9/5 · Trusted by 10,000+ customers
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ── THE NUVRA UNIVERSE ──────────────────────────── */}
      <Box sx={{ bgcolor: '#0a0a0a' }}>
        <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3, pt: 8, pb: 2, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.563rem', fontWeight: 700, color: '#E11D48', letterSpacing: '0.45em', textTransform: 'uppercase', mb: 2 }}>
            Explore
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, color: '#fff', mb: 1.5 }}>
            The NUVRA Universe
          </Typography>
          <Box sx={{ width: 40, height: 2, bgcolor: '#E11D48', mx: 'auto', mt: 2, mb: 2 }} />
          <Typography sx={{ color: '#555', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
            Drag to explore · Click any image to shop
          </Typography>
        </Box>

        {/* Keep DomeGallery as-is */}
        <DomeGallery
          images={domeImages}
          containerHeight="65vh"
          fov={340}
          faceSize={145}
          autoRotate
          autoRotateSpeed={0.12}
          onFaceClick={openPanel}
        />

        <Box sx={{ textAlign: 'center', pb: 8 }}>
          <Button
            onClick={openPanel}
            variant="contained"
            size="large"
            startIcon={<ShoppingBagOutlinedIcon />}
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: '#E11D48', color: '#fff', minHeight: 52, px: 4, fontSize: '0.688rem',
              '&:hover': { bgcolor: '#be123c' },
            }}
          >
            Browse All Products
          </Button>
        </Box>
      </Box>

      {/* ── FOOTER ────────────────────────────────────── */}
      <Box component="footer" sx={{ bgcolor: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#555' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, lg: 4 }, py: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
            <Typography sx={{
              fontFamily: '"Cormorant Garamond", serif', fontWeight: 700,
              fontStyle: 'italic', fontSize: '1.5rem',
              letterSpacing: '0.15em', color: '#fff', textTransform: 'uppercase',
            }}>
              NUVRA
            </Typography>
            <Typography sx={{ fontSize: '0.688rem', color: '#444' }}>
              © 2026 NUVRA. Premium fashion & lifestyle. Ships worldwide 🌍
            </Typography>
            <Box sx={{ display: 'flex', gap: 4 }}>
              {[{ label: 'Shop', to: '/products' }, { label: 'Privacy', to: '#' }, { label: 'Returns', to: '#' }].map(l => (
                <Box key={l.label} component={Link} to={l.to} sx={{
                  fontSize: '0.688rem', color: '#555', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.05em',
                  '&:hover': { color: '#fff' }, transition: 'color 0.2s',
                }}>
                  {l.label}
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── PRODUCT PANEL (slide-up) ──────────────────── */}
      {panelOpen && (
        <Box
          sx={{
            position: 'fixed', inset: 0, zIndex: 1300,
            display: 'flex', alignItems: 'flex-end',
            bgcolor: 'rgba(0,0,0,0.7)',
          }}
          onClick={closePanel}
        >
          <Box
            sx={{
              width: '100%', bgcolor: 'background.paper',
              maxHeight: '84vh', display: 'flex', flexDirection: 'column',
              animation: 'slideUp 0.3s ease',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Panel header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontStyle: 'italic', fontSize: '1.25rem', letterSpacing: '0.05em' }}>
                  Shop NUVRA
                </Typography>
                <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', mt: 0.25, letterSpacing: '0.08em' }}>
                  Add items to your cart
                </Typography>
              </Box>
              <IconButton
                onClick={closePanel}
                size="small"
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0, width: 40, height: 40, '&:hover': { bgcolor: '#f5f5f5' } }}
              >
                <CloseIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Box>

            {/* Product grid */}
            <Box sx={{ overflowY: 'auto', flex: 1, p: 2 }}>
              {products.length === 0 ? (
                <Grid container spacing={1.5}>
                  {[1, 2, 3, 4].map(i => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
                      <Box>
                        <Skeleton variant="rectangular" sx={{ aspectRatio: '3/4', width: '100%' }} />
                        <Box sx={{ p: 1.5 }}>
                          <Skeleton width="75%" height={12} sx={{ mb: 0.75 }} />
                          <Skeleton width="50%" height={12} sx={{ mb: 1.5 }} />
                          <Skeleton variant="rectangular" height={44} />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Grid container spacing={1.5}>
                  {products.map(p => {
                    const img = p.images?.edges?.[0]?.node
                    const variantId = p.variants?.edges?.[0]?.node?.id ?? ''
                    const price = parseFloat(p.priceRange?.minVariantPrice?.amount ?? '0')
                    const comparePrice = (price * 1.55).toFixed(2)
                    const discount = Math.round((1 - price / parseFloat(comparePrice)) * 100)
                    const isAdded = addedId === variantId
                    return (
                      <Grid size={{ xs: 6, sm: 4, md: 3 }} key={p.id}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid', borderColor: 'divider', overflow: 'hidden', '&:hover': { borderColor: '#bbb' }, transition: 'border-color 0.2s' }}>
                          {/* Image */}
                          <Box
                            component={Link}
                            to={`/products/${p.handle}`}
                            onClick={closePanel}
                            sx={{ position: 'relative', display: 'block', bgcolor: '#f7f7f7', aspectRatio: '3/4', overflow: 'hidden' }}
                          >
                            {img
                              ? <Box component="img" src={img.url} alt={img.altText ?? p.title} sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', '&:hover': { transform: 'scale(1.04)' } }} />
                              : <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingBagOutlinedIcon sx={{ fontSize: 32, color: '#ddd' }} /></Box>
                            }
                            <Box sx={{ position: 'absolute', top: 0, left: 0, bgcolor: 'secondary.main', color: '#fff', px: 1.25, py: 0.5, fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                              -{discount}%
                            </Box>
                          </Box>

                          {/* Info */}
                          <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
                            <Box component={Link} to={`/products/${p.handle}`} onClick={closePanel} sx={{ textDecoration: 'none' }}>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', '&:hover': { color: 'secondary.main' }, transition: 'color 0.2s' }}>
                                {p.title}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                              <Typography sx={{ fontSize: '0.875rem', fontWeight: 800 }}>${price.toFixed(2)}</Typography>
                              <Typography sx={{ fontSize: '0.688rem', color: 'text.secondary', textDecoration: 'line-through' }}>${comparePrice}</Typography>
                            </Box>

                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              size="small"
                              onClick={() => handleAddToCart(variantId)}
                              disabled={loading || !variantId}
                              startIcon={isAdded ? <CheckIcon sx={{ fontSize: '12px !important' }} /> : <ShoppingBagOutlinedIcon sx={{ fontSize: '12px !important' }} />}
                              sx={{
                                mt: 'auto', minHeight: 44, fontSize: '0.563rem',
                                bgcolor: isAdded ? '#16a34a' : '#0a0a0a',
                                '&:hover': { bgcolor: isAdded ? '#16a34a' : 'secondary.main' },
                                '&:disabled': { bgcolor: '#ccc', color: '#fff' },
                              }}
                            >
                              {isAdded ? 'Added ✓' : 'Add to Cart'}
                            </Button>

                            <Button
                              variant="outlined"
                              color="primary"
                              fullWidth
                              size="small"
                              onClick={() => handleBuyNow(variantId, p.handle)}
                              disabled={loading || !variantId}
                              endIcon={<ArrowForwardIcon sx={{ fontSize: '12px !important' }} />}
                              sx={{
                                minHeight: 44, fontSize: '0.563rem', borderWidth: 2,
                                '&:hover': { bgcolor: '#0a0a0a', color: '#fff', borderColor: '#0a0a0a' },
                              }}
                            >
                              Buy Now
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    )
                  })}
                </Grid>
              )}
            </Box>

            {/* Panel footer */}
            <Box sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', letterSpacing: '0.05em' }}>
                {products.length} products · Free shipping over $35
              </Typography>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                size="small"
                endIcon={<ArrowForwardIcon sx={{ fontSize: '12px !important' }} />}
                onClick={closePanel}
                sx={{ minHeight: 36, fontSize: '0.563rem', px: 2 }}
              >
                View Full Store
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
