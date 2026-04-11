'use client'

import { motion } from 'framer-motion'

const giftBaskets = [
  {
    name: 'Birthday Gift Basket',
    description: 'Perfect for birthday celebrations',
    price: 'From 50,000 RWF',
    image: 'https://images.pexels.com/photos/6521975/pexels-photo-6521975.jpeg'
  },
  {
    name: 'Romantic Gift Basket',
    description: 'For your special someone',
    price: 'From 75,000 RWF',
    image: 'https://images.pexels.com/photos/6521976/pexels-photo-6521976.jpeg',
    popular: true
  },
  {
    name: 'New Baby Gift Basket',
    description: 'Welcome the little one',
    price: 'From 45,000 RWF',
    image: 'https://images.pexels.com/photos/6521977/pexels-photo-6521977.jpeg'
  },
  {
    name: 'Gourmet Gift Basket',
    description: 'For food lovers',
    price: 'From 65,000 RWF',
    image: 'https://images.pexels.com/photos/6521978/pexels-photo-6521978.jpeg'
  },
  {
    name: 'Wellness Gift Basket',
    description: 'Relaxation and self-care',
    price: 'From 55,000 RWF',
    image: 'https://images.pexels.com/photos/6521979/pexels-photo-6521979.jpeg'
  }
]

export default function GiftBaskets() {
  return (
    <section className="py-24 bg-primaryLight">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">
            Our Gift Baskets
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Carefully curated gifts for every occasion
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {giftBaskets.map((basket, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer relative"
            >
              {basket.popular && (
                <div className="absolute top-4 right-4 bg-accent text-dark px-3 py-1 rounded-full text-sm font-semibold z-10">
                  Popular
                </div>
              )}
              <div className="h-64 overflow-hidden">
                <img 
                  src={basket.image} 
                  alt={basket.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark mb-2">{basket.name}</h3>
                <p className="text-gray-500 mb-4">{basket.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">{basket.price}</span>
                  <button className="text-primary font-semibold hover:text-accent transition">
                    Order →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
