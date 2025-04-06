'use client'
import React from 'react'
import { cva } from 'class-variance-authority'

const skeletonVariants = cva(
  'animate-pulse rounded-md bg-gray-200',
  {
    variants: {
      variant: {
        default: '',
        circle: 'rounded-full',
        text: 'h-4 rounded',
      }
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Skeleton = ({ className, variant, ...props }) => {
  return (
    <div
      className={skeletonVariants({ variant, className })}
      {...props}
    />
  )
}

export { Skeleton }