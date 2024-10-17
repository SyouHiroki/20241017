import dynamic from 'next/dynamic';
import Header, { HeaderLogoLinkType, HeaderNavsLinkType } from './components/Header';
import Footer from './components/Footer';

const Pdf = dynamic(() => import('./components/Pdf'), {
  ssr: false
});

export default function Home() {
  const headerLogoLink: HeaderLogoLinkType = {text: 'PDF.SYOUHIROKI.ICU', link: '/'}

  const headerNavsLink: HeaderNavsLinkType = [
    {text: 'Pricing', link: '/'},
    {text: 'Chrome extension', link: '/'},
    {text: 'Use cases', link: '/'},
    {text: 'Get started →', link: '/'},
  ]
  
  return (
    <div>
      <Header logoLink={headerLogoLink} navsLink={headerNavsLink}/>
      <Pdf />
      <Footer />
    </div>
  )
}
