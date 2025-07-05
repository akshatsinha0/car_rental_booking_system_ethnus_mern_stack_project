import React from 'react'
import Silk from './Silk'
import steeringWheel from '../assets/steeringWheelImage.png'

const Loader = () => {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      <Silk
        speed={5}
        scale={1}
        color="#7B7481"
        noiseIntensity={1.5}
        rotation={0}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <img
          src={steeringWheel}
          alt="Loading..."
          className="h-20 w-20 animate-spin"
          style={{ animationDuration: '1.2s', animationTimingFunction: 'linear' }}
        />
      </div>
    </div>
  )
}

export default Loader
