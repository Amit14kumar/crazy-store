import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Collapse from '@mui/material/Collapse'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useCart } from '../context/CartContext'

const STEPS = ['Shipping', 'Payment', 'Review']

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', desc: '7–15 business days', price: 0, tag: 'FREE' },
  { id: 'express', label: 'Express Delivery', desc: '3–5 business days', price: 9.99 },
]

export default function CheckoutPage() {
  const { lines, checkoutUrl } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [shipping, setShipping] = useState('standard')
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'India',
  })

  const subtotal = lines.reduce((acc: number, line: any) =>
    acc + parseFloat(line.cost?.totalAmount?.amount ?? line.merchandise?.price?.amount ?? 0), 0)
  const shippingCost = shipping === 'express' ? 9.99 : subtotal >= 35 ? 0 : 4.99
  const discount = couponApplied ? subtotal * 0.1 : 0
  const total = subtotal + shippingCost - discount

  const handleField = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const shippingFilled = form.firstName && form.lastName && form.email && form.address && form.city && form.zip

  if (lines.length === 0) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>Your cart is empty</Typography>
        <Button component={Link} to="/products" variant="contained" color="primary">Continue Shopping</Button>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', pt: { xs: 8, md: 10 }, pb: 10 }}>
      <Container maxWidth="lg">

        {/* Breadcrumb */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
          <Box component={Link} to="/" sx={{ fontSize: '0.75rem', color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'text.primary' } }}>Home</Box>
          <Typography sx={{ fontSize: '0.75rem', color: '#ccc' }}>/</Typography>
          <Box component={Link} to="/products" sx={{ fontSize: '0.75rem', color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'text.primary' } }}>Shop</Box>
          <Typography sx={{ fontSize: '0.75rem', color: '#ccc' }}>/</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Checkout</Typography>
        </Box>

        {/* Brand */}
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontStyle: 'italic', fontSize: '1.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
          NUVRA
        </Typography>

        {/* Stepper */}
        <Stepper activeStep={step} sx={{ mb: 5, '& .MuiStepLabel-label': { fontSize: '0.688rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' } }}>
          {STEPS.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' }, gap: 4, alignItems: 'start' }}>

          {/* ── LEFT: Form ───────────────────────────── */}
          <Box>

            {/* STEP 0: Shipping */}
            <Collapse in={step === 0}>
              <Box sx={{ bgcolor: '#fff', border: '1px solid', borderColor: 'divider', p: { xs: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Shipping Information
                  </Typography>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <TextField name="firstName" label="First Name" value={form.firstName} onChange={handleField} size="small" required fullWidth />
                  <TextField name="lastName" label="Last Name" value={form.lastName} onChange={handleField} size="small" required fullWidth />
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <TextField name="email" label="Email" type="email" value={form.email} onChange={handleField} size="small" required fullWidth />
                  <TextField name="phone" label="Phone" type="tel" value={form.phone} onChange={handleField} size="small" fullWidth />
                </Box>
                <TextField name="address" label="Street Address" value={form.address} onChange={handleField} size="small" required fullWidth sx={{ mb: 2 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 2 }}>
                  <TextField name="city" label="City" value={form.city} onChange={handleField} size="small" required fullWidth />
                  <TextField name="state" label="State" value={form.state} onChange={handleField} size="small" fullWidth />
                  <TextField name="zip" label="PIN / ZIP" value={form.zip} onChange={handleField} size="small" required fullWidth />
                </Box>
                <TextField name="country" label="Country" value={form.country} onChange={handleField} size="small" fullWidth sx={{ mb: 3 }} />

                <Divider sx={{ mb: 3 }} />

                {/* Shipping method */}
                <Typography sx={{ fontSize: '0.688rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', mb: 2 }}>
                  Delivery Method
                </Typography>
                <RadioGroup value={shipping} onChange={e => setShipping(e.target.value)}>
                  {SHIPPING_OPTIONS.map(opt => (
                    <Box
                      key={opt.id}
                      onClick={() => setShipping(opt.id)}
                      sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        border: '1px solid', borderColor: shipping === opt.id ? '#111' : 'divider',
                        p: 2, mb: 1.5, cursor: 'pointer',
                        bgcolor: shipping === opt.id ? '#f9f9f9' : '#fff',
                        transition: 'all 0.15s',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Radio value={opt.id} size="small" sx={{ p: 0.5 }} />
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.813rem' }}>{opt.label}</Typography>
                          <Typography sx={{ fontSize: '0.688rem', color: 'text.secondary' }}>{opt.desc}</Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: opt.price === 0 ? '#16a34a' : 'text.primary' }}>
                        {opt.tag ?? `$${opt.price.toFixed(2)}`}
                      </Typography>
                    </Box>
                  ))}
                </RadioGroup>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  disabled={!shippingFilled}
                  onClick={() => setStep(1)}
                  sx={{ mt: 2, py: 1.75, fontSize: '0.688rem', bgcolor: '#111', '&:hover': { bgcolor: '#333' } }}
                >
                  Continue to Payment
                </Button>
              </Box>
            </Collapse>

            {/* STEP 1: Payment */}
            <Collapse in={step === 1}>
              <Box sx={{ bgcolor: '#fff', border: '1px solid', borderColor: 'divider', p: { xs: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <CreditCardOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Payment
                  </Typography>
                </Box>

                {/* Razorpay placeholder */}
                <Box sx={{ border: '2px dashed', borderColor: 'divider', p: 4, textAlign: 'center', mb: 3, bgcolor: '#fafafa' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {['UPI', 'Cards', 'Netbanking', 'Wallets', 'EMI'].map(m => (
                      <Box key={m} sx={{ border: '1px solid #e5e5e5', px: 1.5, py: 0.5, fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', color: '#555', bgcolor: '#fff' }}>
                        {m}
                      </Box>
                    ))}
                  </Box>
                  <Typography sx={{ fontSize: '0.813rem', fontWeight: 600, mb: 0.5, color: '#111' }}>
                    Razorpay Payment Gateway
                  </Typography>
                  <Typography sx={{ fontSize: '0.688rem', color: 'text.secondary', lineHeight: 1.6 }}>
                    Secure payment integration coming soon.<br />
                    Supports UPI, Cards, Net Banking, Wallets & EMI.
                  </Typography>
                </Box>

                {/* Security badges */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                  <LockOutlinedIcon sx={{ fontSize: 14, color: '#16a34a' }} />
                  <Typography sx={{ fontSize: '0.625rem', color: '#16a34a', fontWeight: 700, letterSpacing: '0.1em' }}>
                    256-BIT SSL ENCRYPTED · PCI DSS COMPLIANT
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => setStep(0)}
                    sx={{ py: 1.75, fontSize: '0.688rem', flex: 1 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => setStep(2)}
                    sx={{ py: 1.75, fontSize: '0.688rem', flex: 2, bgcolor: '#111', '&:hover': { bgcolor: '#333' } }}
                  >
                    Review Order
                  </Button>
                </Box>
              </Box>
            </Collapse>

            {/* STEP 2: Review */}
            <Collapse in={step === 2}>
              <Box sx={{ bgcolor: '#fff', border: '1px solid', borderColor: 'divider', p: { xs: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Review Your Order
                  </Typography>
                </Box>

                {/* Shipping summary */}
                <Box sx={{ bgcolor: '#f9f9f9', p: 2.5, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'text.secondary', mb: 1 }}>
                    Ship to
                  </Typography>
                  <Typography sx={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    {form.firstName} {form.lastName}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.25 }}>
                    {form.address}, {form.city} {form.zip}, {form.country}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{form.email}</Typography>
                </Box>

                {/* Items */}
                <Box sx={{ mb: 3 }}>
                  {lines.map((line: any) => {
                    const img = line.merchandise?.product?.images?.edges?.[0]?.node
                    const title = line.merchandise?.product?.title ?? 'Product'
                    const lineTotal = parseFloat(line.cost?.totalAmount?.amount ?? 0)
                    return (
                      <Box key={line.id} sx={{ display: 'flex', gap: 2, py: 2, borderBottom: '1px solid #f0f0f0' }}>
                        <Box sx={{ width: 60, height: 76, bgcolor: '#f3f3f3', flexShrink: 0, overflow: 'hidden' }}>
                          {img && <Box component="img" src={img.url} alt={title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </Box>
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.813rem', lineHeight: 1.3 }}>{title}</Typography>
                            <Typography sx={{ fontSize: '0.688rem', color: 'text.secondary', mt: 0.5 }}>Qty: {line.quantity}</Typography>
                          </Box>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>${lineTotal.toFixed(2)}</Typography>
                        </Box>
                      </Box>
                    )
                  })}
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => setStep(1)}
                    sx={{ py: 1.75, fontSize: '0.688rem', flex: 1 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    endIcon={<LockOutlinedIcon />}
                    onClick={() => { window.location.href = checkoutUrl }}
                    sx={{ py: 1.75, fontSize: '0.688rem', flex: 2, bgcolor: '#E11D48', '&:hover': { bgcolor: '#be123c' } }}
                  >
                    Place Order
                  </Button>
                </Box>

                <Typography sx={{ fontSize: '0.563rem', color: 'text.secondary', textAlign: 'center', mt: 2, letterSpacing: '0.05em' }}>
                  By placing your order you agree to our Terms & Privacy Policy
                </Typography>
              </Box>
            </Collapse>
          </Box>

          {/* ── RIGHT: Order Summary ─────────────────── */}
          <Box sx={{ position: { lg: 'sticky' }, top: { lg: 100 } }}>
            <Box sx={{ bgcolor: '#fff', border: '1px solid', borderColor: 'divider', p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', mb: 2.5 }}>
                Order Summary
              </Typography>

              {/* Items */}
              <Box sx={{ mb: 2.5 }}>
                {lines.map((line: any) => {
                  const img = line.merchandise?.product?.images?.edges?.[0]?.node
                  const title = line.merchandise?.product?.title ?? 'Product'
                  const lineTotal = parseFloat(line.cost?.totalAmount?.amount ?? 0)
                  return (
                    <Box key={line.id} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box sx={{ position: 'relative', flexShrink: 0 }}>
                        <Box sx={{ width: 56, height: 72, bgcolor: '#f3f3f3', overflow: 'hidden' }}>
                          {img && <Box component="img" src={img.url} alt={title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </Box>
                        <Box sx={{ position: 'absolute', top: -6, right: -6, bgcolor: '#111', color: '#fff', width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.563rem', fontWeight: 700 }}>
                          {line.quantity}
                        </Box>
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, mt: 0.5 }}>${lineTotal.toFixed(2)}</Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Box>

              {/* Coupon */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
                <TextField
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  size="small"
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0, fontSize: '0.75rem' } }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => { if (coupon.toUpperCase() === 'NUVRA10') setCouponApplied(true) }}
                  sx={{ borderRadius: 0, fontSize: '0.625rem', fontWeight: 700, px: 2, flexShrink: 0, whiteSpace: 'nowrap' }}
                >
                  Apply
                </Button>
              </Box>
              {couponApplied && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 2, color: '#16a34a' }}>
                  <CheckCircleIcon sx={{ fontSize: 13 }} />
                  <Typography sx={{ fontSize: '0.688rem', fontWeight: 700 }}>NUVRA10 applied — 10% off!</Typography>
                </Box>
              )}

              <Divider sx={{ mb: 2 }} />

              {/* Totals */}
              {[
                { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
                { label: 'Shipping', value: shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`, green: shippingCost === 0 },
                ...(discount > 0 ? [{ label: 'Discount (NUVRA10)', value: `-$${discount.toFixed(2)}`, green: true }] : []),
              ].map(row => (
                <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.25 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{row.label}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: (row as any).green ? '#16a34a' : 'text.primary' }}>{row.value}</Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Total</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '1.375rem', letterSpacing: '-0.02em' }}>${total.toFixed(2)}</Typography>
              </Box>

              <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid', borderColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <LockOutlinedIcon sx={{ fontSize: 12, color: '#16a34a' }} />
                <Typography sx={{ fontSize: '0.563rem', color: 'text.secondary', letterSpacing: '0.06em' }}>
                  Secure & encrypted checkout
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
