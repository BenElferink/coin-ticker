'use client'
import { GREEN, RED } from '@/constants'
import { useEffect, useRef } from 'react'

export default function PulseCanvas(props: {
  dataPoints: { price: number; ask: number; bid: number }[]
  withAskBid?: boolean
}) {
  const { dataPoints = [], withAskBid = false } = props

  const canvasRef = useRef(null)
  const animationFrameId = useRef(0)
  const pulseCount = useRef(0)

  useEffect(() => {
    // set width and height according to screen size.
    // this is also applied when the screen size changes
    const canvas = canvasRef.current as unknown as HTMLCanvasElement
    canvas.width = window.innerWidth - 100
    canvas.height = window.innerHeight - 420

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.innerWidth, window.innerHeight])

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement
    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    // the animation draw function, creates the visuals on the canvas
    const draw = () => {
      pulseCount.current++
      let maxPrice = 0
      let minPrice = 0

      context.clearRect(0, 0, context.canvas.width, context.canvas.height)

      // find the highest price, and lowest price in the current queue
      dataPoints.forEach(({ price, ask, bid }) => {
        const newMax = withAskBid ? Math.max(ask, price) : price
        const newMin = withAskBid ? Math.min(bid, price) : price

        if (newMax > maxPrice || maxPrice === 0) {
          maxPrice = newMax
        } else if (newMin < minPrice || minPrice === 0) {
          minPrice = newMin
        }
      })

      // this fixes a bug where on-mount price may be stable, and the chart would not display a pulse
      if (maxPrice && minPrice && maxPrice === minPrice) {
        minPrice -= Number(`${String(minPrice)}1`)
      }

      // generic calculators to get the X and Y positions for each dataPoints point
      const getX = (index: number) => (canvas.width / dataPoints.length) * index
      const getY = (price: number) =>
        Math.abs((canvas.height / (maxPrice - minPrice)) * (price - minPrice) - canvas.height)

      const drawPulse = (yValue: number) => {
        const pulseRadius = 7 * Math.sin(pulseCount.current * 0.05) ** 2
        context.beginPath()
        context.arc(
          dataPoints.length >= canvas.width
            ? getX(canvas.width - pulseRadius)
            : dataPoints.length
            ? getX(dataPoints.length - 1)
            : getX(0),
          dataPoints.length ? getY(yValue) : getY(0),
          pulseRadius,
          0,
          2 * Math.PI
        )
        context.fill()
      }

      const drawLine = (key: 'price' | 'ask' | 'bid') => {
        context.beginPath()
        dataPoints.forEach((data, i) => {
          if (i === 0) {
            context.moveTo(getX(i), getY(data[key]))
          } else {
            context.lineTo(getX(i), getY(data[key]))
          }
        })
        context.stroke()
      }

      const { price, ask, bid } = dataPoints[dataPoints.length - 1]

      if (withAskBid) {
        // ask price (high)
        context.strokeStyle = RED
        context.fillStyle = RED
        drawPulse(ask)
        drawLine('ask')

        //  bid price (low)
        context.strokeStyle = GREEN
        context.fillStyle = GREEN
        drawPulse(bid)
        drawLine('bid')
      }

      // real price
      context.strokeStyle = '#ca8a04'
      context.fillStyle = '#ca8a04'
      drawPulse(price)
      drawLine('price')

      animationFrameId.current = window.requestAnimationFrame(draw)
    }

    if (dataPoints.length) draw()
    return () => {
      window.cancelAnimationFrame(animationFrameId.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataPoints])

  return <canvas ref={canvasRef} />
}
