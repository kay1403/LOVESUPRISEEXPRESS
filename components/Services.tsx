'use client'

import { motion } from 'framer-motion'

const services = [
  {
    title: 'Balloons & Helium',
    description: 'Balloon accessories and helium gas for all events',
    image: 'https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg'
  },
  {
    title: 'Party Decoration',
    description: 'Complete decoration for birthdays, weddings, and more',
    image: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg'
  },
  {
    title: 'Surprise Planner',
    description: 'We organize everything for the perfect surprise',
    image: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg'
  },
  {
    title: 'Teddy Bear',
    description: 'Giant personalized teddy bears',
    image: 'https://images.pexels.com/photos/603919/pexels-photo-603919.jpeg'
  },
  {
    title: 'Flower Bouquet',
    description: 'Fresh and elegant flower arrangements',
    image: 'https://images.pexels.com/photos/568500/pexels-photo-568500.jpeg'
  },
  {
    title: 'General Printing',
    description: 'Custom printing for all your party needs',
    image: 'https://images.pexels.com/photos/164340/pexels-photo-164340.jpeg'
  }
]

export default function Services() {
  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-4">
            Our Services
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Everything you need to create the perfect surprise moment
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark mb-2">{service.title}</h3>
                <p className="text-gray-500">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
