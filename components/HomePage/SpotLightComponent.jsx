import React from 'react'
import { Spotlight } from '../ui/spotlight'

const SpotLightComponent = () => {
  return (
    <div className="">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="blue" />
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
    </div>
  )
}

export default SpotLightComponent
