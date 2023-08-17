import { SvgSpinnersBouncingBall } from '@/icons/LoaderIcon'
import React from 'react'

export default function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-20">
      <SvgSpinnersBouncingBall className="w-7 h-7" />
      Ma`lumotlar yuklanmoqda...
    </div>
  )
}
