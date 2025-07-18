import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion"

const faqs = [
  {
    question: "What is Board Hub?",
    answer: "Board Hub is a Trello-style project management tool that helps teams organize tasks using Kanban boards. It features drag-and-drop functionality, real-time collaboration, and customizable workflows."
  },
  {
    question: "How does the free plan work?",
    answer: "The free plan includes up to 5 boards, basic Kanban features, dark/light theme support, and Google OAuth login. It's perfect for individuals and small teams getting started with project management."
  },
  {
    question: "Can I collaborate with my team?",
    answer: "Yes! Board Hub is built for team collaboration. You can share boards, assign tasks, and track progress together. All changes are updated in real-time so everyone stays in sync."
  },
  {
    question: "Is my data secure?",
    answer: "We take security seriously. Board Hub uses industry-standard encryption, secure authentication via Google OAuth, and regular backups to keep your data safe and private."
  },
  {
    question: "Can I customize my boards?",
    answer: "Absolutely! You can create custom workflows, add multiple lists, and organize cards in a way that matches your team's process. Pro users get access to additional customization options."
  },
  {
    question: "Do you offer support?",
    answer: "Yes, we provide community support for free users and priority support for Pro users. Enterprise customers get dedicated support with SLA guarantees."
  }
]

export function FaqSection() {
  return (
    <section id="faq" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about Board Hub
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
} 