import type { Mode } from '../types'

export const useCanvasCapabilities = (mode: Mode) => ({
  canBranch: mode !== 'module1',
  canCheckout: mode === 'sandbox' || mode === 'module8' || mode === 'module10',
  canDrag: mode === 'sandbox' || mode === 'module3' || mode === 'module4' || mode === 'module5' || mode === 'module6',
  canReset: mode === 'sandbox' || mode === 'module7' || mode === 'module11',
  canSquash: mode === 'module9',
})
