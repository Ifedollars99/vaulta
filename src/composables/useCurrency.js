import { computed } from 'vue'
import { formatNaira, maskAccountNumber, maskCardNumber } from '@/utils/formatCurrency'

/**
 * Currency + masking helpers shared by money surfaces.
 * Formatting itself lives in utils/ so it stays usable outside setup().
 */
export function useCurrency() {
  const naira = (amount, options) => computed(() => formatNaira(amount, options))
  return {
    formatNaira,
    maskAccountNumber,
    maskCardNumber,
    naira,
  }
}
