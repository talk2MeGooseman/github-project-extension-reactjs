import type { ReactElement } from 'react'
import { StrictMode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const renderSpy = vi.fn()

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({ render: renderSpy })),
}))
vi.mock('../src/views/config', () => ({ Config: () => null }))
vi.mock('../src/views/viewer', () => ({ Viewer: () => null }))

const mountApp = async () => {
  vi.resetModules()
  renderSpy.mockClear()
  document.body.innerHTML = '<div id="root"></div>'
  await import('../src/index')

  // The entry renders <StrictMode><AuthWrapper>{view}</AuthWrapper></StrictMode>.
  const tree = renderSpy.mock.calls[0][0] as ReactElement<{ children: ReactElement<{ children: ReactElement }> }>
  expect(tree.type).toBe(StrictMode)
  return tree.props.children.props.children.type
}

describe('entry point mode switching', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('mounts the Config view when ?mode=config is present', async () => {
    const { Config } = await import('../src/views/config')
    window.history.replaceState(null, '', '/?mode=config')

    expect(await mountApp()).toBe(Config)
  })

  it('mounts the Viewer for any other mode', async () => {
    const { Viewer } = await import('../src/views/viewer')
    window.history.replaceState(null, '', '/?mode=something-else')

    expect(await mountApp()).toBe(Viewer)
  })

  it('mounts the Viewer when no mode is given', async () => {
    const { Viewer } = await import('../src/views/viewer')

    expect(await mountApp()).toBe(Viewer)
  })
})
