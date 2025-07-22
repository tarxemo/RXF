import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingCart, Leaf, Egg, Wheat, Carrot, Sun, Droplets, Sprout, Phone } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import Footer from '../components/footer';
import AnimatedCounter from '../components/AnimatedCounter';

// 3D Model Component
function FarmModel() {
  const { scene } = useGLTF('/farm_scene.glb');
  
  useFrame(({ clock }) => {
    scene.rotation.y = clock.getElapsedTime() * 0.1;
  });

  return <primitive object={scene} />;
}

// Particle Background Component
const ParticleBackground = () => {
  const particles = useRef<THREE.Points>(null);
  
  useFrame(() => {
    if (particles.current) {
      particles.current.rotation.x += 0.0005;
      particles.current.rotation.y += 0.001;
    }
  });

  const count = 2000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random() * 0.5 + 0.5;
  }

  return (
    <points ref={particles}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3} args={[positions, 3]}        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3} args={[positions, 3]}        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        size={0.02}
        sizeAttenuation
        color="#4CAF50"
        transparent
        opacity={0.8}
        alphaTest={0.01}
      />
    </points>
  );
};

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [, setScrollProgress] = useState(0);
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
  });

  const heroImages = [
    '/farm1.jpg',
    '/dairy.jpg',
    '/poultry.jpg',
    '/crops.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering) {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovering, heroImages.length]);

  const products = [
    {
      icon: <Egg className="h-8 w-8 text-[#FF9800]" />,
      title: 'Dairy Products',
      description: 'Fresh milk, cheese, yogurt and other dairy products from our healthy cattle.',
      images: ['/milk1.jpg', '/milk2.jpg', '/cheese.jpg'],
      stats: [
        { value: '1000+', label: 'Cattle' },
        { value: '5000L', label: 'Daily Milk' },
        { value: '100%', label: 'Organic' }
      ]
    },
    {
      icon: <Egg className="h-8 w-8 text-[#FF9800]" />,
      title: 'Poultry',
      description: 'Organic eggs and poultry meat from free-range chickens.',
      images: ['/eggs1.jpg', '/chickens.jpg', '/poultry_farm.jpg'],
      stats: [
        { value: '10,000+', label: 'Chickens' },
        { value: '5,000+', label: 'Daily Eggs' },
        { value: 'Free', label: 'Range' }
      ]
    },
    {
      icon: <Wheat className="h-8 w-8 text-[#FF9800]" />,
      title: 'Crops',
      description: 'High-quality maize, tomatoes and other crops grown with sustainable methods.',
      images: ['/maize.jpg', '/tomatoes.jpg', '/harvest.jpg'],
      stats: [
        { value: '200+', label: 'Acres' },
        { value: '10+', label: 'Crop Types' },
        { value: '0%', label: 'Chemicals' }
      ]
    },
    {
      icon: <Carrot className="h-8 w-8 text-[#FF9800]" />,
      title: 'Vegetables',
      description: 'Fresh, organic vegetables harvested at peak ripeness for maximum nutrition.',
      images: ['/vegetables1.jpg', '/vegetables2.jpg', '/greenhouse.jpg'],
      stats: [
        { value: '50+', label: 'Varieties' },
        { value: 'Daily', label: 'Harvest' },
        { value: 'Local', label: 'Markets' }
      ]
    },
  ];

  const stats = [
    { value: '500+', label: 'Happy Customers' },
    { value: '1000+', label: 'Livestock' },
    { value: '200+', label: 'Acres Farmed' },
    { value: '24/7', label: 'Support' },
  ];

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div className="bg-gray-900 text-white overflow-hidden" ref={targetRef}>

      {/* Hero Section with Parallax and 3D */}
      <section id="home" className="relative h-screen overflow-hidden">
        {/* Animated Background Images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.img
              src={heroImages[currentImageIndex]}
              alt="Farm background"
              className="w-full h-full object-cover"
              style={{
                y: parallaxY,
                scale
              }}
            />
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent"></div>
          </motion.div>
        </AnimatePresence>
        
        {/* 3D Model Floating */}
        <div className="absolute right-10 bottom-10 w-64 h-64 md:w-96 md:h-96 z-10">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <FarmModel />
            <OrbitControls enableZoom={false} autoRotate />
          </Canvas>
        </div>

        {/* Particle Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Canvas>
            <ParticleBackground />
          </Canvas>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-3xl relative z-10"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="flex items-center space-x-2 text-[#4CAF50] mb-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Leaf className="h-5 w-5" />
              </motion.div>
              <motion.span 
                className="font-semibold"
                animate={{
                  textShadow: [
                    '0 0 5px rgba(76, 175, 80, 0)',
                    '0 0 10px rgba(76, 175, 80, 0.5)',
                    '0 0 5px rgba(76, 175, 80, 0)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                Sustainable Agriculture Since 2010
              </motion.span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            >
              <motion.span 
                className="inline-block"
                whileHover={{ color: '#FF9800' }}
              >
                Premium
              </motion.span>{' '}
              <motion.span 
                className="text-[#4CAF50] inline-block"
                animate={{
                  scale: [1, 1.05, 1],
                  textShadow: [
                    '0 0 10px rgba(76, 175, 80, 0.5)',
                    '0 0 20px rgba(76, 175, 80, 0.7)',
                    '0 0 10px rgba(76, 175, 80, 0.5)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                Agricultural
              </motion.span>{' '}
              <motion.span 
                className="inline-block"
                whileHover={{ color: '#FF9800' }}
              >
                Products
              </motion.span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 1 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl"
            >
              Rochex Agro brings you the finest farm products directly from our sustainable farms to your table. Experience freshness like never before.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 1 }}
              className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"
            >
              <motion.a
                href="/login"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 20px rgba(255, 152, 0, 0.7)'
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#FF9800] text-gray-900 px-4 py-2 rounded-lg font-bold flex items-center justify-center text-lg relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Login Now
                </span>
                <motion.span
                  className="absolute inset-0 bg-orange-300 rounded-md z-0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.4 }}
                />
              </motion.a>

              <motion.a
                href="/products"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 20px rgba(76, 175, 80, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-[#4CAF50] text-[#4CAF50] px-4 py-2 rounded-lg font-bold flex items-center justify-center text-lg relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  Virtual Farm Tour <ArrowRight className="h-5 w-5 ml-2" />
                </span>
                <motion.span
                  className="absolute inset-0 bg-[#4CAF50]/10 rounded-md z-0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.4 }}
                />
              </motion.a>
            </motion.div>

          </motion.div>
        </div>

        {/* Scrolling Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white flex flex-col items-center"
          >
            <span className="mb-2">Scroll Down</span>
            <div className="w-6 h-10 border-2 border-[#4CAF50] rounded-full flex justify-center">
              <motion.div
                className="w-1 h-2 bg-[#4CAF50] rounded-full mt-2"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Floating Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
        className="fixed right-8 bottom-8 z-50 space-y-4"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-[#FF9800] rounded-full flex items-center justify-center shadow-lg"
        >
          <ShoppingCart className="h-6 w-6 text-gray-900" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-gray-800 border border-[#4CAF50] rounded-full flex items-center justify-center shadow-lg"
        >
          <Phone className="h-6 w-6 text-[#4CAF50]" />
        </motion.button>
      </motion.div>

      {/* Products Section with Parallax */}
      <section id="products" className="relative py-32 bg-gray-900 overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(45deg, rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.7))`,
            y: useTransform(scrollYProgress, [0, 1], [0, -100])
          }}
        >
          <div className="absolute inset-0 opacity-20">
            <Canvas>
              <ParticleBackground />
            </Canvas>
          </div>
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6"
              whileInView={{
                color: ['#FFFFFF', '#4CAF50', '#FFFFFF'],
                textShadow: [
                  '0 0 10px rgba(76, 175, 80, 0)',
                  '0 0 20px rgba(76, 175, 80, 0.5)',
                  '0 0 10px rgba(76, 175, 80, 0)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              Our <span className="text-[#FF9800]">Premium</span> Products
            </motion.h2>
            <motion.p
              className="max-w-3xl mx-auto text-xl text-gray-300"
              whileInView={{
                x: [-20, 0],
                opacity: [0, 1]
              }}
              transition={{ duration: 0.8 }}
            >
              We offer a wide range of high-quality agricultural products cultivated with care and sustainable practices.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 10, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -15 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-[#4CAF50]/50 transition-all relative overflow-hidden group"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-[#FF9800] opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.img
                    src={product.images[0]}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 5 }}
                  />
                </div>
                
                <div className="relative z-10">
                  <div className="bg-gray-900 w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    {product.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{product.title}</h3>
                  <p className="text-gray-300 mb-6">{product.description}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {product.stats.map((stat, i) => (
                      <div key={i} className="bg-gray-900/50 rounded p-2 text-center">
                        <div className="text-[#FF9800] font-bold">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-[#4CAF50] text-gray-900 px-4 py-2 rounded-md font-bold flex items-center justify-center"
                  >
                    View Products <ArrowRight className="h-4 w-4 ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Gallery Section */}
      <section className="relative py-20 bg-gray-800 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/farm_pattern.png')] opacity-5"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Our <span className="text-[#FF9800]">Farm</span> Gallery
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { img: '/farm_view1.jpg', title: 'Dairy Farm', icon: <Egg /> },
              { img: '/poultry_farm1.jpg', title: 'Poultry Houses', icon: <Egg /> },
              { img: '/crop_field1.jpg', title: 'Crop Fields', icon: <Wheat /> },
              { img: '/greenhouse1.jpg', title: 'Greenhouses', icon: <Sprout /> },
              { img: '/irrigation1.jpg', title: 'Irrigation', icon: <Droplets /> },
              { img: '/farm_sunset.jpg', title: 'Farm Sunset', icon: <Sun /> }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group overflow-hidden rounded-xl shadow-2xl h-64"
                whileHover={{ y: -10 }}
              >
                <motion.img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="bg-[#4CAF50] text-gray-900 p-2 rounded-lg mr-3">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section className="py-20 bg-[#FF9800] text-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Canvas>
            <ParticleBackground />
          </Canvas>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <motion.p 
                  className="text-5xl md:text-6xl font-bold mb-2"
                  whileInView={{
                    scale: [1, 1.1, 1],
                    textShadow: [
                      '0 0 10px rgba(0, 0, 0, 0)',
                      '0 0 15px rgba(0, 0, 0, 0.2)',
                      '0 0 10px rgba(0, 0, 0, 0)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                >
                  <AnimatedCounter from={0} to={parseInt(stat.value.replace(/[^0-9]/g, ''))} />
                  {stat.value.includes('+') && '+'}
                  {stat.value.includes('/') && '/'}
                </motion.p>
                <p className="text-lg font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;