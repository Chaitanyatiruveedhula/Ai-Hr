'use client'
import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Textarea } from '../ui/textarea'

import emailjs from '@emailjs/browser'
export function ContactFormComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  })
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await emailjs.send(
        'service_fjn3zzf', // Replace with your EmailJS service ID
        'template_5vz4xba', // Replace with your EmailJS template ID
        {
          from_name: formData.fullName,
          from_email: formData.email,
          message: formData.message,
          to_email: 'saikumarpuppala249@gmail.com',
        },
        'jeW0330zx30bPXiiO' // Replace with your EmailJS public key
      )

      toast.success('Your message has been sent successfully.')

      setFormData({
        fullName: '',
        email: '',
        message: '',
      })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className=" w-full min-h-screen flex items-center justify-evenly">
      <div className="p-8 flex flex-col items-center relative z-10 pt-20 md:pt-0  text-neutral-50">
        <div className="items-start mt-8 w-full max-w-md space-y-6">
          <h1 className=" text-4xl md:text-6xl font-bold  bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Contact Us
          </h1>
          <p className=" mt-4 text-base md:text-lg font-light text-neutral-300  max-w-xl">
            We are always looking for ways to improve our products and services.
            Contact us and let us know how we can help you.
          </p>

          <div className="flex flex-col items-start">
            <p className="text-lg font-medium text-neutral-50">Email</p>
            <p className="text-base font-light text-neutral-300 ">
              saikumarpuppala249@gmail.com
            </p>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-lg font-medium text-neutral-50">Phone</p>
            <p className="text-base font-light text-neutral-300 ">
              +91 987654321
            </p>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-lg font-medium text-neutral-50">LinkedIn</p>
            <p className="text-base font-light text-neutral-300">
              <a
                href="https://www.linkedin.com/in/saikumar-puppala-009019234/"
                className="underline hover:text-neutral-50"
              >
                linkedin/saikumar
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md w-full  rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <form className="my-8" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Tyler"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-8">
            <Label htmlFor="twitterpassword">Message</Label>

            <Textarea
              id="message"
              placeholder="Your message..."
              value={formData.message}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>

          <button
            className={cn(
              'bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Message'} &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
      </div>
    </div>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  )
}

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn('flex flex-col space-y-2 w-full', className)}>
      {children}
    </div>
  )
}
