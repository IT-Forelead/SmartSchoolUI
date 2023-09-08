import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { SolarFullScreenBold } from '@/icons/FullIcon'
import Image from 'next/image'

export default function ImageFull(props: { cId: string }) {
  return (
    <Dialog>
      <DialogTrigger>
        <SolarFullScreenBold className='w-6 h-6 text-blue-600' />
      </DialogTrigger>
      <DialogContent className='max-w-3xl'>
        <div className='relative h-[85vh]'>
          <Image src={`http://25-school.uz/school/api/v1/asset/${props.cId}` ?? ''} alt="Hujjat" layout='fill' className="top-0 object-contain duration-500 rounded-lg" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
