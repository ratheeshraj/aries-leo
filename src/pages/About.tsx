import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, GlobeAltIcon, CheckCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';

const About: React.FC = () => {
  useScrollToTop();
  
  const values = [
    {
      icon: <HeartIcon className="w-8 h-8" />,
      title: "Women-First Design",
      description: "Every piece is designed specifically for women's bodies, ensuring flattering fits and comfortable wear all day long."
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: "Sustainable Fashion",
      description: "We're committed to sustainable practices, from eco-friendly materials to ethical manufacturing processes."
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Empowering Women",
      description: "We believe in empowering women through fashion that makes them feel confident, comfortable, and authentically themselves."
    },
    {
      icon: <CheckCircleIcon className="w-8 h-8" />,
      title: "Inclusive Sizing",
      description: "We create bottoms for every woman, offering inclusive sizing and styles that celebrate all body types."
    }
  ];

  const timeline = [
    {
      year: "2020",
      title: "The Beginning",
      description: "Founded with a vision to create empowering women's bottoms that combine comfort, style, and confidence."
    },
    {
      year: "2021",
      title: "First Collection",
      description: "Launched our debut collection featuring premium cotton women's bottoms designed specifically for the female form."
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Expanded internationally, bringing Aries Leo women's bottoms to customers around the world."
    },
    {
      year: "2023",
      title: "Inclusive Sizing",
      description: "Introduced expanded size ranges and sustainable manufacturing practices to serve all women."
    },
    {
      year: "2024",
      title: "Today",
      description: "Continuing to innovate and create bottoms that truly empower women, serving thousands of customers globally."
    }
  ];

  const team = [
    {
      name: "Alexandra Chen",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b789?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      bio: "Women's fashion designer turned entrepreneur with a passion for creating empowering, comfortable clothing for women."
    },
    {
      name: "Sarah Williams",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      bio: "Award-winning designer with 15+ years experience in women's fashion and sustainable textile innovation."
    },
    {
      name: "Maria Rodriguez",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      bio: "Specialist in women's fit and sizing, dedicated to creating bottoms that flatter and empower every body type."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-accent-light to-accent-medium overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative container-responsive">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-fluid-3xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
              Our Story
            </h1>
            <p className="text-fluid-base text-gray-700 leading-relaxed">
              At Aries Leo, we believe that the perfect pair of bottoms should empower every woman. 
              That's why we've dedicated ourselves to creating premium, comfortable, and stylish 
              women's bottoms that celebrate your unique style and confidence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="container-responsive">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-fluid-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                Bottoms That Empower Every Woman
              </h2>
              <p className="text-fluid-sm text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
                Founded in 2020, Aries Leo was born from a simple observation: most women's bottoms 
                compromise on either comfort, style, or functionality. We set out to create 
                bottoms that excel in all three areas, specifically designed for women.
              </p>
              <p className="text-fluid-sm text-gray-600 mb-4 sm:mb-6 md:mb-8 leading-relaxed">
                Our philosophy "Cotton • Comfort • Confidence" isn't just marketing—it's our 
                commitment. Every pair is crafted from premium cotton for ultimate comfort, 
                features thoughtfully designed details for functionality, and comes in styles 
                that let your confidence shine through.
              </p>
              
              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-accent-rose">50K+</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-accent-rose">25+</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-accent-rose">4.8★</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600">Average Rating</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative order-first lg:order-last"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Aries Leo design studio"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container-responsive">
          <motion.div
            className="text-center mb-8 sm:mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-fluid-2xl font-bold text-gray-900 mb-3 sm:mb-4">Our Values</h2>
            <p className="text-fluid-base text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do, from design to delivery
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 text-center shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-accent-rose mb-3 sm:mb-4 flex justify-center">
                  {React.cloneElement(value.icon, { className: "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" })}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="container-responsive">
          <motion.div
            className="text-center mb-8 sm:mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-fluid-2xl font-bold text-gray-900 mb-3 sm:mb-4">Our Journey</h2>
            <p className="text-fluid-base text-gray-600 max-w-2xl mx-auto">
              From a simple idea to a global brand, here's how we've grown
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line - hidden on mobile */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-accent-rose h-full"></div>

              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-start md:items-center mb-8 sm:mb-12 ${
                    index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-l-4 md:border-l-0 border-accent-rose">
                      <div className="text-accent-rose font-bold text-base sm:text-lg mb-2">
                        {item.year}
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Timeline dot - hidden on mobile */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent-rose rounded-full border-4 border-white"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container-responsive">
          <motion.div
            className="text-center mb-8 sm:mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-fluid-2xl font-bold text-gray-900 mb-3 sm:mb-4">Meet Our Team</h2>
            <p className="text-fluid-base text-gray-600 max-w-2xl mx-auto">
              The passionate people behind Aries Leo who make the magic happen
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 text-center shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto mb-3 sm:mb-4"
                />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-accent-rose font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                  {member.role}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-accent-rose">
        <div className="container-responsive text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-fluid-2xl font-bold text-white mb-3 sm:mb-4">
              Ready to Feel Empowered?
            </h2>
            <p className="text-fluid-base text-white mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of women worldwide who've discovered bottoms that truly empower and inspire confidence
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link to="/shop" className="w-full sm:w-auto">
                <Button size="lg" variant='secondary' className="group w-full sm:w-auto btn-responsive">
                  Shop Collection
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto btn-responsive">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
