import Image from 'next/image' // Use Next.js Image
import linearImage from '../../assests/linear.webp' // Import WebP image correctly
import SparklesComponent from './SparklesComponent'
import TypeWriterComponent from './TypeWriterComponenet'
import { ContainerScroll } from '../ui/container-scroll-animation'
import { TestimonialComponent } from './TestimonialComponent'
import { ContactFormComponent } from './ContactFormComponent'

const HomePage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <SparklesComponent />
      <TypeWriterComponent />
      <ContainerScroll
        id="about"
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Artificial Intelligence
              </span>
            </h1>
          </>
        }
      >
        <Image
          src={linearImage}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
      <TestimonialComponent id="testimonials" />
      <ContactFormComponent id="contact" />
    </div>
  )
}

export default HomePage
