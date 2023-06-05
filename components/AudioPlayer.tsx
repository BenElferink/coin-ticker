import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'

const AudioPlayer = (props: { lastPrice: number; currPrice: number }) => {
  const { lastPrice, currPrice } = props

  const [player, setPlayer] = useState<HTMLAudioElement>()
  const [playing, setPlaying] = useState(false)
  const [userClicked, setUserClicked] = useState(false)

  useEffect(() => {
    if (player && playing && userClicked && currPrice && lastPrice && currPrice !== lastPrice) {
      player.src = currPrice > lastPrice ? '/media/coin-up.wav' : '/media/coin-down.wav'
      player.play()
    }
  }, [player, playing, userClicked, currPrice, lastPrice])

  useEffect(() => {
    const handler = () => {
      if (!userClicked) {
        setUserClicked(true)
        setPlayer(new Audio())
      }
    }

    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [userClicked])

  return (
    <button
      onClick={() => setPlaying((prev) => !prev)}
      className={'relative mx-1 p-1 rounded-full border ' + (playing ? 'border-green-200' : 'border-red-200')}
    >
      {playing ? (
        <SpeakerWaveIcon className='w-4 h-4 text-green-400' />
      ) : (
        <SpeakerXMarkIcon className='w-4 h-4 text-red-400' />
      )}
      <div
        className={
          'absolute top-1 animate-ping w-4 h-4 rounded-full border ' +
          (playing ? 'border-green-200' : 'border-red-200')
        }
      />
    </button>
  )
}

export default AudioPlayer
