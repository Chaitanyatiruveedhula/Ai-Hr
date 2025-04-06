'use client'
import { currentUser } from '@clerk/nextjs'
import { useAuth } from '@clerk/nextjs'
import { Button } from '../ui/button'
import { TypewriterEffectSmooth } from '../ui/typewriter-effect'
import { useRouter } from 'next/navigation'

const TypeWriterComponent = () => {
  const router = useRouter()
  const { userId } = useAuth()
  console.log(userId)
  const words = [
    {
      text: ' Strengthen ',
    },

    {
      text: ' Interviews ',
    },

    {
      text: ' with ',
    },
    {
      text: ' Ai mock interview prep.',
      className: 'text-blue-500 dark:text-blue-500',
    },
  ]
  return (
    <div className="flex flex-col items-center justify-center  ">
      {' '}
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
        The path to mastering elite interviews begins here.
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <Button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm hover:text-gray-950">
          Take an Interview
        </Button>
        <Button
          className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm"
          onClick={() => {
            if (!userId) {
              router.push('/sign-in')
            } else {
              router.push('/dashboard')
            }
          }}
        >
          Get Started
        </Button>
      </div>
    </div>
  )
}
export default TypeWriterComponent
