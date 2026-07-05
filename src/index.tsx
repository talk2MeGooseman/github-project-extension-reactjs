import '@primer/primitives/dist/css/base/size/size.css'
import '@primer/primitives/dist/css/base/typography/typography.css'
import '@primer/primitives/dist/css/functional/size/border.css'
import '@primer/primitives/dist/css/functional/size/size.css'
import '@primer/primitives/dist/css/functional/typography/typography.css'
import '@primer/primitives/dist/css/functional/themes/light.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import AuthWrapper from './shared/auth-wrapper'
import { Config } from './views/config'
import { Viewer } from './views/viewer'

const params = new URLSearchParams(window.location.search)
const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <AuthWrapper>{params.get('mode') === 'config' ? <Config /> : <Viewer />}</AuthWrapper>
  </StrictMode>,
)
