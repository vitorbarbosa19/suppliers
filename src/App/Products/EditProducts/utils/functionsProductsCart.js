export const reduceItem = price => {
    const priceNumber = price ? parseFloat(price.replace(',', '.')) : 0
    return ([prevItems, prevPrice], cur) => (cur ? [prevItems + parseInt(cur), prevPrice + parseInt(cur) * priceNumber] : [prevItems, prevPrice])
  },
  reduceTotal = (prices, products) => ([prevItems, prevPrice], cur) => {
    const { requestedQuantities } = products[cur]
    const price = prices[cur]
    if (!cur || !requestedQuantities || !price) return [prevItems, prevPrice]
    const [curItems, curPrice] = Object.values(requestedQuantities).reduce(reduceItem(price), [0, 0])
    return [prevItems + curItems, prevPrice + curPrice]
  }

// function to parse some integer represented by a string on a key of a main object, or return zero
export const parseQty = quantities => key => (quantities && quantities[key] && parseInt(quantities[key])) || 0

// function to calculate [new totalAvailbleQuantities, new availableQuantities, new requestedQuantities]
export const calculateNewQuantities = (newRequestedQuantities, availableQuantities) => {
  // orq = OldRequestedQuantity
  //const getOrq = parseQty(oldRequestedQuantities)
  // nrq = NewRequestedQuantity
  const getNrq = parseQty(newRequestedQuantities)
  // oaq = OldAvailableQuantity
  const getOaq = parseQty(availableQuantities)
  return Object.keys(availableQuantities).reduce(
    ([tA, nA, nR], key) => {
      const oaq = getOaq(key)
      const nrq = getNrq(key)
      // naq = NewAvailableQuantity
      const naq = nrq
      if (naq < 0) return [tA + oaq, { ...nA, [key]: oaq }, { ...nR}]
      return [tA + naq, { ...nA, [key]: naq }, { ...nR, [key]: nrq }]
    },
    [0, {}, {}],
  )
}

// this function find the cart item that corresponds to the same brand and status
export const cartItemFinder = cartEntries => (brandName, status = 'open') => {
  return cartEntries.find(([, cartItem]) => cartItem.brandName === brandName && cartItem.status === status) || [,]
}

// this function reduce a object that contains various objects with a status key
export const statusReducer = (prev, [id, { status, ...request }]) => {
  return { ...prev, [status]: [...(prev[status] || []), { ...request, id }] }
}

// this function reduce a object to an array with all productIds
export const idReducer = (prev, { productIds }) => (productIds ? [...prev, ...productIds] : prev)

export const rqReducer = (prev, [key, value]) => (key !== '' && value !== '' ? { ...prev, [key]: value } : prev)

export const parseTotal = (productIds, products, prices) =>
  productIds && products ? productIds.reduce(reduceTotal(prices, products), [0, 0]) : [0, 0]
