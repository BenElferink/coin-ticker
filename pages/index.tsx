import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { formatTokenFromChainToHuman } from '@/functions/formatTokenAmount'
import ChangeGreenRed from '@/components/ChangeGreenRed'
import { ADA_SYMBOL, BANKERCOIN_POLICY_ID, BANKERCOIN_TOKEN_NAME } from '@/constants'
import NumberValue from '@/components/NumberValue'
import PromptModal from '@/components/PromptModal'

const PulseCanvas = dynamic(import('@/components/PulseCanvas'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [marketCap, setMarketCap] = useState(0)
  const [change24, setChange24] = useState(0)
  const [prices, setPrices] = useState<{ price: number; ask: number; bid: number }[]>([])

  useEffect(() => {
    const handleCoinData = () =>
      fetch(
        `https://api.muesliswap.com/price?base-policy-id=&base-tokenname=&quote-policy-id=${BANKERCOIN_POLICY_ID}&quote-tokenname=${BANKERCOIN_TOKEN_NAME}`
      )
        .then((res) => res.json())
        .then(
          (data: {
            marketCap: number
            price: number
            askPrice: number
            bidPrice: number

            priceChange: { '24h': string; '7d': string }
            volume: { base: string; quote: string }
            volumeChange: { base: number; quote: number }

            baseAddress: { name: string; policyId: string }
            baseDecimalPlaces: number

            quoteAddress: { name: string; policyId: string }
            quoteDecimalPlaces: number
          }) => {
            setMarketCap(formatTokenFromChainToHuman(data.marketCap, data.baseDecimalPlaces))
            setChange24(Number(data.priceChange['24h']))
            setPrices((prev) => {
              const payload = [...prev]

              if (payload.length >= 60) payload.shift()
              payload.push({
                price: formatTokenFromChainToHuman(data.price, data.baseDecimalPlaces),
                ask: formatTokenFromChainToHuman(data.askPrice, data.baseDecimalPlaces),
                bid: formatTokenFromChainToHuman(data.bidPrice, data.baseDecimalPlaces),
              })

              return payload
            })
          }
        )
        .catch((e) => console.error(e.message))

    const interval = setInterval(handleCoinData, 1000)
    return () => clearInterval(interval)
  }, [])

  const [volume, setVolume] = useState(0)

  useEffect(() => {
    if (prices.length >= 2) {
      const lastPrice = prices[prices.length - 2].price
      const currPrice = prices[prices.length - 1].price

      if (currPrice !== lastPrice) {
        const player = new Audio(currPrice > lastPrice ? '/media/coin-up.wav' : '/media/coin-down.wav')
        player.volume = volume
        player.play()
      }
    }
  }, [prices, volume])

  return (
    <main className={`min-h-screen p-10 flex flex-col items-center justify-start ${inter.className}`}>
      <PromptModal text='Enable Sound FX?' onClickYes={() => setVolume(1)} onClickNo={() => setVolume(0)} />

      <div className='mb-12 flex flex-col'>
        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:blur-2xl after:content-[''] before:bg-gradient-to-br before:from-transparent before:to-amber-400/20 after:from-amber-400 after:via-amber-800/50 before:lg:h-[360px]">
          <Image
            className='relative drop-shadow-[0_0_0.3rem_#fde04780]'
            src='/media/$BANK.png'
            alt='Next.js Logo'
            width={180}
            height={180}
            priority
          />
        </div>

        <section className='mt-6 flex flex-col items-center justify-center'>
          <NumberValue prefix={ADA_SYMBOL} value={marketCap} className='mb-1 text-2xl' />

          <div className='flex items-center'>
            <div className='mr-1 flex flex-col items-end'>
              <NumberValue prefix={ADA_SYMBOL} value={prices[prices.length - 1]?.price || 0} className='text-sm' />

              {change24 ? (
                <ChangeGreenRed
                  prefix={ADA_SYMBOL}
                  value={
                    -((prices[prices.length - 1]?.price || 0) - change24 * (prices[prices.length - 1]?.price || 0))
                  }
                  scale={0.6}
                />
              ) : null}
            </div>

            {change24 ? (
              <ChangeGreenRed value={Number(change24.toFixed(2))} suffix='%' invert withCaret scale={0.9} />
            ) : null}
          </div>
        </section>
      </div>

      <PulseCanvas dataPoints={prices} />
    </main>
  )
}
