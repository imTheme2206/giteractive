import i18n from '../../i18n'
import { Button } from '../common/Button'

export const LanguageSwitcher = () => {
  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'th' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }
  return (
    <Button onClick={toggleLang} className="text-xs">
      {i18n.language.toUpperCase()}
    </Button>
  )
}
