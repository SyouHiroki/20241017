import dynamic from 'next/dynamic'
import Header, { HeaderLogoLinkType, HeaderNavsLinkType } from './components/Header'
import Footer, { FooterLinksGroupType } from './components/Footer'

const Pdf = dynamic(() => import('./components/Pdf'), {
  ssr: false
});

export default function Home() {
  const headerLogoLink: HeaderLogoLinkType = {text: 'PDF.SYOUHIROKI.ICU', link: '/'}

  const headerNavsLink: HeaderNavsLinkType = [
    {text: 'Pricing', link: '/'},
    {text: 'Chrome extension', link: '/'},
    {text: 'Use cases', link: '/'},
    {text: 'Get started →', link: '/'}
  ]

  const footerText = 'Chat with any PDF: ask questions, get summaries, find information, and more.'

  const footerNavsGroup: FooterLinksGroupType = {
    products: [
      {text: 'Use cases', link: '/'},
      {text: 'Chrome extension', link: '/'},
      {text: 'API docs', link: '/'},
      {text: 'Pricing', link: '/'},
      {text: 'Video tutorials', link: '/'},
      {text: 'Resources', link: '/'},
      {text: 'Blog', link: '/'},
      {text: 'FAQ', link: '/'}
    ],
    weAlsoBuilt: [
      {text: 'Resume AI Scanner', link: '/'},
      {text: 'Invoice AI Scanner', link: '/'},
      {text: 'AI Quiz Generator', link: '/'},
      {text: 'QuickyAI', link: '/'},
      {text: 'Docsium', link: '/'},
      {text: 'PDF GPTs', link: '/'},
      {text: 'PDF AI generator', link: '/'},
      {text: 'Other PDF tools', link: '/'}
    ],
    company: [
      {text: 'PDF.ai vs ChatPDF', link: '/'},
      {text: 'PDF.ai vs Acrobat Reader', link: '/'},
      {text: 'Legal', link: '/'},
      {text: 'Affiliate program 💵', link: '/'},
      {text: 'Investor', link: '/'}
    ]
  }

  const domain = 'pdf.syouhiroki.icu'
  
  return (
    <div>
      <Header logoLink={headerLogoLink} navsLink={headerNavsLink}/>
      <Pdf domain={domain}/>
      <Footer text={footerText} navsGroup={footerNavsGroup}/>
    </div>
  )
}
