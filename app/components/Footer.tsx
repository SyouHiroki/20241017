import Image from "next/image"
import Link from "next/link"

type LinkType = {text: string, link: string}

export type FooterLinksGroupType = {
  products: LinkType[],
  weAlsoBuilt: LinkType[],
  company: LinkType[]
}

export default function Footer({text, navsGroup}: {text: string, navsGroup: FooterLinksGroupType}) {

  return (
    <div className="mb-10 mt-8 md:mt-12 lg:mt-16 xl:flex xl:justify-center">
      <div className="border-t p-2 flex flex-col xl:flex-row xl:gap-9 xl:w-[1280px]">
        <div className="mt-12 px-2 xl:max-w-[384px]">
          <Image src='/favicon.ico' width={28} height={28} draggable={false} className="w-7 h-7 mb-8" alt='favicon' />
          <p className="text-[#9ea3af] text-sm">{text}</p>
          <div className="flex gap-4 items-center mt-8">
            <Link href={'/'}><Image src='/assets/tiktok.svg' draggable={false} width={24} height={24} className="w-6 h-6" alt='tiktok' /></Link>
            <Link href={'/'}><Image src='/assets/ins.svg' draggable={false} width={28} height={28} className="w-7 h-7" alt='ins' /></Link>
            <Link href={'/'}><Image src='/assets/twtter.svg' draggable={false} width={24} height={24} className="w-6 h-6" alt='twtter' /></Link>
            <Link href={'/'}><Image src='/assets/youtube.svg' draggable={false} width={28} height={28} className="w-7 h-7" alt='youtube' /></Link>
          </div>
        </div>

        <div className="mt-16 px-2 flex flex-col gap-10 text-[#9ea3af] text-sm md:flex-row md:gap-3 xl:gap-28">
          <div className="flex flex-col flex-1 gap-6">
            <h3 className="font-semibold leading-6 text-gray-900">Products</h3>
            {navsGroup.products.map((v, i) => <Link key={i} className="text-nowrap hover:text-gray-900" href={v.link}>{v.text}</Link>)}
          </div>

          <div className="flex flex-col flex-1 gap-6">
            <h3 className="font-semibold leading-6 text-gray-900">We also built</h3>
            {navsGroup.weAlsoBuilt.map((v, i) => <Link key={i} className="text-nowrap hover:text-gray-900" href={v.link}>{v.text}</Link>)}
          </div>

          <div className="flex flex-col flex-1 gap-6">
            <h3 className="font-semibold leading-6 text-gray-900">Company</h3>
            {navsGroup.company.map((v, i) => <Link key={i} className="text-nowrap hover:text-gray-900" href={v.link}>{v.text}</Link>)}
          </div>
        </div>
      </div>
    </div>
  )
}