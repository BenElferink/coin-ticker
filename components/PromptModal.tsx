import { useState } from 'react'

const PromptModal = (props: { text: string; onClickYes: () => void; onClickNo: () => void }) => {
  const { text, onClickYes, onClickNo } = props
  const [open, setOpen] = useState(true)

  if (!open) {
    return null
  }

  return (
    <div className='w-screen h-screen bg-black bg-opacity-50 backdrop-blur-lg flex items-center justify-center fixed top-0 left-0 z-50'>
      <div className='flex flex-col items-center max-w-screen max-w-[90vw] w-fit min-h-fit max-h-[90vh] p-4 rounded-3xl bg-gray-800 overflow-auto'>
        <h2 className='text-xl mb-4'>{text}</h2>

        <div className='flex'>
          <button
            className='w-20 mx-1 py-2 px-4 disabled:cursor-not-allowed disabled:bg-gray-900 disabled:bg-opacity-50 disabled:border-gray-800 disabled:text-gray-700 rounded-xl bg-green-900 hover:bg-green-700 bg-opacity-50 hover:bg-opacity-50 hover:text-gray-200 disabled:border border hover:border border-green-700 hover:border-green-700 hover:cursor-pointer'
            onClick={() => {
              onClickYes()
              setOpen(false)
            }}
          >
            Yes
          </button>
          <button
            className='w-20 mx-1 py-2 px-4 disabled:cursor-not-allowed disabled:bg-gray-900 disabled:bg-opacity-50 disabled:border-gray-800 disabled:text-gray-700 rounded-xl bg-red-900 hover:bg-red-700 bg-opacity-50 hover:bg-opacity-50 hover:text-gray-200 disabled:border border hover:border border-red-700 hover:border-red-700 hover:cursor-pointer'
            onClick={() => {
              onClickNo()
              setOpen(false)
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}

export default PromptModal
