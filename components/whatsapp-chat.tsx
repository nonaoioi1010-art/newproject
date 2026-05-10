'use client'

import { useState } from 'react'
import { MessageCircle, X, Send, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'

const faqItems = [
  {
    question: 'ما هي طرق الدفع المتاحة؟',
    answer: 'نوفر الدفع عند الاستلام، التحويل البنكي، والدفع الإلكتروني.'
  },
  {
    question: 'كم تستغرق عملية التوصيل؟',
    answer: 'التوصيل خلال 1-3 أيام عمل داخل صنعاء، و3-7 أيام للمحافظات الأخرى.'
  },
  {
    question: 'هل يوجد حد أدنى للطلب؟',
    answer: 'نعم، الحد الأدنى للطلب 50,000 ر.ي للاستفادة من أسعار الجملة.'
  },
  {
    question: 'هل يمكنني إرجاع المنتجات؟',
    answer: 'نعم، يمكنك الإرجاع خلال 7 أيام من الاستلام بشرط أن يكون المنتج بحالته الأصلية.'
  },
  {
    question: 'كيف أتواصل مع خدمة العملاء؟',
    answer: 'يمكنك التواصل عبر الواتساب أو الاتصال على الرقم الموحد.'
  },
]

export function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null)
  const { siteSettings } = useStore()
  
  const whatsappNumber = siteSettings?.whatsappNumber || '967772652212'

  const openWhatsApp = (message?: string) => {
    const encodedMessage = encodeURIComponent(message || 'مرحباً، أحتاج مساعدة')
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
  }

  return (
    <>
      {/* WhatsApp Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        aria-label="فتح الدردشة"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-7 h-7"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">جملة العم</h3>
                  <p className="text-sm text-white/80">متصل الآن</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setSelectedFaq(null)
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#E5DDD5]">
              {/* Welcome Message */}
              <div className="bg-white rounded-lg p-3 shadow-sm mb-4 max-w-[85%]">
                <p className="text-sm text-foreground">
                  مرحباً بك في جملة العم! كيف يمكننا مساعدتك؟
                </p>
                <p className="text-xs text-muted-foreground mt-1 text-left">الآن</p>
              </div>

              {/* FAQ Section */}
              <div className="space-y-2">
                <p className="text-xs text-center text-muted-foreground mb-3">
                  اختر سؤالاً أو تواصل معنا مباشرة
                </p>
                
                {faqItems.map((faq, index) => (
                  <div key={index}>
                    <button
                      onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
                      className="w-full text-right bg-[#DCF8C6] rounded-lg p-3 shadow-sm hover:bg-[#D4F0BE] transition-colors"
                    >
                      <p className="text-sm font-medium text-foreground">{faq.question}</p>
                    </button>
                    
                    {selectedFaq === index && (
                      <div className="bg-white rounded-lg p-3 shadow-sm mt-2 max-w-[85%] animate-in slide-in-from-top-2">
                        <p className="text-sm text-foreground">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-card border-t border-border space-y-2">
              <Button
                onClick={() => openWhatsApp()}
                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2"
              >
                <Send className="h-4 w-4" />
                تواصل عبر الواتساب
              </Button>
              <Button
                onClick={() => window.open(`tel:+${whatsappNumber}`, '_self')}
                variant="outline"
                className="w-full gap-2"
              >
                <Phone className="h-4 w-4" />
                اتصل بنا مباشرة
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
