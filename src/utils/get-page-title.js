import defaultSettings from '@/settings'

const title = defaultSettings.title || '鹅小满'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
