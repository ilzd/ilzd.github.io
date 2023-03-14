export function isoToCart (isoPointX, isoPointY) {
  const cartPoint = new Phaser.Math.Vector2()
  cartPoint.x = (2 * isoPointY + isoPointX) / 2
  cartPoint.y = (2 * isoPointY - isoPointX) / 2
  return cartPoint
}

export function cartToIso (cartPointX, cartPointY) {
  const isoPoint = new Phaser.Math.Vector2()
  isoPoint.x = cartPointX - cartPointY
  isoPoint.y = (cartPointX + cartPointY) / 2
  return isoPoint
}