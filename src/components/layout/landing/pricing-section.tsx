import Link from 'next/link'
import { Button } from '../../../components/ui/button'
import { Card } from '../../../components/ui/card'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for individuals and small teams',
    features: [
      'Up to 5 boards',
      'Basic Kanban features',
      'Dark/Light theme',
      'Google OAuth login',
      'Community support'
    ]
  },
  {
    name: 'Pro',
    price: '$10',
    description: 'Best for growing teams and organizations',
    features: [
      'Unlimited boards',
      'Advanced board customization',
      'Priority support',
      'Team collaboration',
      'Custom workflows',
      'Board templates'
    ],
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with specific needs',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'Advanced security',
      'Usage analytics',
      'SLA guarantee'
    ]
  }
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that's right for your team
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className="relative group">
              {plan.highlighted && (
                <>
                  <div className="absolute -inset-[2px] rounded-lg bg-gradient-to-r from-primary to-primary/60 blur-sm"></div>
                  <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-primary to-primary/60"></div>
                </>
              )}
              <Card className={`relative h-full p-8 flex flex-col ${plan.highlighted ? 'border-0 shadow-lg' : ''}`}>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-muted-foreground">/month</span>}
                  </div>
                  <p className="mt-3 text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/auth" className="mt-auto">
                  <Button 
                    className="w-full" 
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </Link>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 