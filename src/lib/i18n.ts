import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'en' | 'es'

interface I18nState {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
}

export const useI18n = create<I18nState>()(
  persist(
    (set) => ({
      lang: 'en',
      setLang: (lang) => set({ lang }),
      toggleLang: () => set((state) => ({ lang: state.lang === 'en' ? 'es' : 'en' })),
    }),
    {
      name: 'language-storage',
    }
  )
)
