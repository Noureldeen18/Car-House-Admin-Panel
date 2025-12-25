/**
 * Tax calculation utilities
 */
import { TAX_RATE } from './constants.js';

/**
 * Calculate tax amount from subtotal
 * @param {number} subtotal - Subtotal before tax
 * @returns {number} Tax amount
 */
export function calculateTax(subtotal) {
  return subtotal * TAX_RATE;
}

/**
 * Calculate subtotal from total (reverse calculation)
 * @param {number} total - Total including tax
 * @returns {number} Subtotal before tax
 */
export function calculateSubtotal(total) {
  return total / (1 + TAX_RATE);
}

/**
 * Calculate total with tax
 * @param {number} subtotal - Subtotal before tax
 * @returns {number} Total including tax
 */
export function calculateTotalWithTax(subtotal) {
  return subtotal * (1 + TAX_RATE);
}
