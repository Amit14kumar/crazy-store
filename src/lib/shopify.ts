const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

async function shopifyFetch(query, variables = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

export async function getProducts() {
  const data = await shopifyFetch(`
    query {
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            images(first: 10) {
              edges { node { url altText } }
            }
            variants(first: 1) {
              edges { node { id } }
            }
          }
        }
      }
    }
  `);
  return data.products.edges.map(e => e.node);
}

export async function getProduct(handle) {
  const data = await shopifyFetch(`
    query($handle: String!) {
      product(handle: $handle) {
        id title handle description
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 5) { edges { node { url altText } } }
        variants(first: 10) {
          edges { node { id title price { amount currencyCode } availableForSale } }
        }
      }
    }
  `, { handle });
  return data.product;
}

export async function createCart(variantId, quantity = 1) {
  const data = await shopifyFetch(`
    mutation($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { id checkoutUrl }
      }
    }
  `, { lines: [{ merchandiseId: variantId, quantity }] });
  return data.cartCreate.cart;
}

export async function addToCart(cartId, variantId, quantity = 1) {
  const data = await shopifyFetch(`
    mutation($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { id checkoutUrl totalQuantity
          lines(first: 20) {
            edges { node { id quantity merchandise { ... on ProductVariant { id title product { title images(first:1){ edges{ node{ url } } } } price { amount } } } } }
          }
        }
      }
    }
  `, { cartId, lines: [{ merchandiseId: variantId, quantity }] });
  return data.cartLinesAdd.cart;
}

export async function updateCartLine(cartId, lineId, quantity) {
  const data = await shopifyFetch(`
    mutation($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { id checkoutUrl totalQuantity
          lines(first: 20) {
            edges { node { id quantity cost { totalAmount { amount } } merchandise { ... on ProductVariant { id title product { title images(first:1){ edges{ node{ url } } } } price { amount } } } } }
          }
        }
      }
    }
  `, { cartId, lines: [{ id: lineId, quantity }] });
  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(cartId, lineId) {
  const data = await shopifyFetch(`
    mutation($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { id checkoutUrl totalQuantity
          lines(first: 20) {
            edges { node { id quantity merchandise { ... on ProductVariant { id title product { title images(first:1){ edges{ node{ url } } } } price { amount } } } } }
          }
        }
      }
    }
  `, { cartId, lineIds: [lineId] });
  return data.cartLinesRemove.cart;
}

export async function getCart(cartId) {
  const data = await shopifyFetch(`
    query($cartId: ID!) {
      cart(id: $cartId) {
        id checkoutUrl totalQuantity
        lines(first: 20) {
          edges { node { id quantity merchandise { ... on ProductVariant { id title product { title images(first:1){ edges{ node{ url } } } } price { amount } } } } }
        }
      }
    }
  `, { cartId });
  return data.cart;
}
