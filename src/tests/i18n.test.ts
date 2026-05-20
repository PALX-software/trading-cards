import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useI18n } from '@/lib/i18n'

// Reset Zustand store state before each test to avoid bleed-through
beforeEach(() => {
  useI18n.setState({ lang: 'en' })
})

describe('useI18n hook', () => {
  it('returns lang and toggleLang', () => {
    const { result } = renderHook(() => useI18n())
    expect(result.current.lang).toBeDefined()
    expect(typeof result.current.toggleLang).toBe('function')
    expect(typeof result.current.setLang).toBe('function')
  })

  it('default language is en (as defined in the store initializer)', () => {
    const { result } = renderHook(() => useI18n())
    expect(result.current.lang).toBe('en')
  })

  it('toggleLang switches from en to es', () => {
    const { result } = renderHook(() => useI18n())
    expect(result.current.lang).toBe('en')

    act(() => {
      result.current.toggleLang()
    })

    expect(result.current.lang).toBe('es')
  })

  it('toggleLang switches back from es to en', () => {
    useI18n.setState({ lang: 'es' })
    const { result } = renderHook(() => useI18n())
    expect(result.current.lang).toBe('es')

    act(() => {
      result.current.toggleLang()
    })

    expect(result.current.lang).toBe('en')
  })

  it('setLang sets language to es', () => {
    const { result } = renderHook(() => useI18n())
    act(() => {
      result.current.setLang('es')
    })
    expect(result.current.lang).toBe('es')
  })

  it('setLang sets language to en', () => {
    useI18n.setState({ lang: 'es' })
    const { result } = renderHook(() => useI18n())
    act(() => {
      result.current.setLang('en')
    })
    expect(result.current.lang).toBe('en')
  })

  it('multiple toggles cycle correctly', () => {
    const { result } = renderHook(() => useI18n())
    expect(result.current.lang).toBe('en')

    act(() => result.current.toggleLang())
    expect(result.current.lang).toBe('es')

    act(() => result.current.toggleLang())
    expect(result.current.lang).toBe('en')

    act(() => result.current.toggleLang())
    expect(result.current.lang).toBe('es')
  })
})
