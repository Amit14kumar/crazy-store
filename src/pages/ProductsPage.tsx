import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import TuneIcon from '@mui/icons-material/Tune'
import { getProducts } from '../lib/shopify'
import ProductCard from '../components/ProductCard'

interface Product {
  id: string; title: string; handle: string
  images?: { edges: { node: { url: string; altText?: string } }[] }
  variants?: { edges: { node: { id: string } }[] }
  priceRange?: { minVariantPrice: { amount: string; currencyCode: string } }
}

const FILTERS = ['All', 'Dresses', 'Tops', 'Accessories', 'Sale']

function CardSkeleton() {
  return (
    <Box>
      <Skeleton variant="rectangular" sx={{ aspectRatio: '3/4', width: '100%' }} />
      <Box sx={{ p: 2 }}>
        <Skeleton width="60%" height={12} sx={{ mb: 0.75 }} />
        <Skeleton width="85%" height={14} sx={{ mb: 0.5 }} />
        <Skeleton width="50%" height={14} sx={{ mb: 1.5 }} />
        <Skeleton variant="rectangular" height={48} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={48} />
      </Box>
    </Box>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9' }}>

      {/* ── Hero Banner ─────────────────────────── */}
      <Box sx={{ bgcolor: '#0a0a0a', color: '#fff', py: { xs: 8, md: 12 }, px: 3, textAlign: 'center' }}>
        <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.4em', color: 'secondary.main', textTransform: 'uppercase', mb: 2 }}>
          New Arrivals — 2026
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem' },
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 700, fontStyle: 'italic',
            letterSpacing: '-0.02em', color: '#fff', mb: 2,
          }}
        >
          All Products
        </Typography>
        <Box sx={{ width: 48, height: 2, bgcolor: 'secondary.main', mx: 'auto', mb: 2.5 }} />
        <Typography sx={{ color: '#888', fontSize: '0.813rem', letterSpacing: '0.05em', maxWidth: 400, mx: 'auto' }}>
          {loading
            ? 'Loading collection…'
            : `${products.length} handpicked styles — free worldwide shipping over $35`}
        </Typography>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, lg: 4 } }}>

        {/* ── Filter + Sort Bar ───────────────────── */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 2,
          borderBottom: '1px solid', borderColor: 'divider', pb: 3, mb: 4,
        }}>
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <Chip
                key={f}
                label={f}
                onClick={() => setActiveFilter(f)}
                variant={activeFilter === f ? 'filled' : 'outlined'}
                sx={{
                  borderRadius: 0,
                  bgcolor: activeFilter === f ? '#0a0a0a' : 'transparent',
                  color: activeFilter === f ? '#fff' : 'text.secondary',
                  borderColor: activeFilter === f ? '#0a0a0a' : 'divider',
                  fontWeight: 700, letterSpacing: '0.12em', fontSize: '0.625rem',
                  height: 38, px: 1,
                  '&:hover': {
                    bgcolor: activeFilter === f ? '#1a1a1a' : '#f5f5f5',
                    borderColor: '#0a0a0a',
                  },
                  borderWidth: activeFilter === f ? 0 : 1,
                }}
              />
            ))}
          </Stack>
          <Button
            variant="outlined"
            startIcon={<TuneIcon sx={{ fontSize: 14 }} />}
            size="small"
            sx={{
              borderColor: 'divider', color: 'text.secondary',
              fontSize: '0.625rem', letterSpacing: '0.12em',
              minHeight: 38, px: 2, borderRadius: 0, borderWidth: 1,
              '&:hover': { borderColor: '#0a0a0a', color: 'text.primary', bgcolor: 'transparent' },
            }}
          >
            Sort
          </Button>
        </Box>

        {/* ── Loading Skeleton ─────────────────────── */}
        {loading && (
          <Grid container spacing={{ xs: 0.25, sm: 2, lg: 3 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid size={{ xs: 6, sm: 4, lg: 3 }} key={i}>
                <CardSkeleton />
              </Grid>
            ))}
          </Grid>
        )}

        {/* ── Error ───────────────────────────────── */}
        {error && (
          <Box sx={{
            bgcolor: 'background.paper', border: '2px solid #fee2e2',
            p: 6, textAlign: 'center',
          }}>
            <Typography variant="h4" sx={{ mb: 2 }}>⚠️</Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>Could not load products</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.813rem' }}>{error}</Typography>
          </Box>
        )}

        {/* ── Empty ───────────────────────────────── */}
        {!loading && !error && products.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography variant="h3" sx={{ mb: 2.5 }}>🛍️</Typography>
            <Typography variant="h5" sx={{ mb: 1 }}>No products yet</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              Add & publish products in your Shopify admin to see them here.
            </Typography>
          </Box>
        )}

        {/* ── Products Grid ───────────────────────── */}
        {!loading && !error && products.length > 0 && (
          <>
            <Grid container spacing={{ xs: 1.5, sm: 2.5, lg: 3 }}>
              {products.map(product => (
                <Grid size={{ xs: 6, sm: 4, lg: 3 }} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.688rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>
                Showing all {products.length} products
              </Typography>
            </Box>
          </>
        )}
      </Container>
    </Box>
  )
}
