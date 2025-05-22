import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ShoppingCart, ChevronDown, Sun, Moon, User, Search, Phone, Egg } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// 3D Logo Component
function LogoModel() {
  const { scene } = useGLTF('/rochex_logo.glb');
  const modelRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={0.8} />;
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLElement>(null);
  
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(17, 24, 39, 0)', 'rgba(17, 24, 39, 0.98)']
  );
  const borderBottom = useTransform(
    scrollY,
    [0, 100],
    ['1px solid rgba(255, 227, 26, 0)', '1px solid rgba(255, 227, 26, 0.2)']
  );
  const logoScale = useTransform(
    scrollY,
    [0, 100],
    [1, 0.9]
  );

  // Handle search toggle
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  // Navigation items with dropdowns
  const navItems = [
    { 
      name: 'Home', 
      href: '#home',
      icon: null
    },
    { 
      name: 'Products', 
      href: '#products',
      icon: <ChevronDown className="ml-1 h-4 w-4" />,
      subItems: [
        { name: 'Dairy Products', href: '#dairy' },
        { name: 'Poultry', href: '#poultry' },
        { name: 'Crops', href: '#crops' },
        { name: 'Vegetables', href: '#vegetables' }
      ]
    },
    { 
      name: 'Farm', 
      href: '#farm',
      icon: <ChevronDown className="ml-1 h-4 w-4" />,
      subItems: [
        { name: 'Virtual Tour', href: '#tour' },
        { name: 'Sustainability', href: '#sustainability' },
        { name: 'Our Animals', href: '#animals' }
      ]
    },
    { 
      name: 'Invest', 
      href: '#invest',
      icon: null
    },
    { 
      name: 'About', 
      href: '#about',
      icon: null
    },
    { 
      name: 'Contact', 
      href: '#contact',
      icon: null
    },
  ];

  // Handle dropdown toggle
  const toggleDropdown = (itemName: string) => {
    setDropdownOpen(dropdownOpen === itemName ? null : itemName);
  };

  // Close all dropdowns when scrolling
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 50) {
      setDropdownOpen(null);
    }
  });

  return (
    <motion.nav
      ref={navRef}
      style={{ 
        backgroundColor,
        borderBottom
      }}
      className="fixed w-full z-50 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        type: 'spring',
        stiffness: 100,
        damping: 15
      }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* 3D Logo */}
          <motion.div 
            style={{ scale: logoScale }}
            className="flex-shrink-0 flex items-center"
            whileHover={{ 
              scale: 1.05,
            }}
          >
            <div className="w-12 h-12 mr-2 hidden md:block">
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} color="#FFE31A" intensity={1} />
                <LogoModel />
                <OrbitControls 
                  enableZoom={false} 
                  enablePan={false} 
                  autoRotate 
                  autoRotateSpeed={2}
                />
              </Canvas>
            </div>
            <motion.div
              className="flex flex-col"
              animate={{
                textShadow: darkMode 
                  ? '0 0 10px rgba(255, 227, 26, 0.7)'
                  : '0 0 5px rgba(255, 227, 26, 0.3)'
              }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-[#FFE31A] font-bold text-2xl md:text-3xl">Rochex</span>
              <span className="text-white font-light text-sm md:text-lg -mt-1">Agro Investments</span>
            </motion.div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.subItems ? (
                  <>
                    <motion.button
                      onHoverStart={() => toggleDropdown(item.name)}
                      onClick={() => toggleDropdown(item.name)}
                      className={`px-4 py-3 rounded-lg flex items-center text-sm font-medium transition-all ${
                        dropdownOpen === item.name 
                          ? 'text-[#FFE31A] bg-gray-800' 
                          : 'text-white hover:text-[#FFE31A] hover:bg-gray-800/50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.name}
                      <motion.span
                        animate={{ rotate: dropdownOpen === item.name ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.icon}
                      </motion.span>
                    </motion.button>
                    
                    <AnimatePresence>
                      {dropdownOpen === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-1 w-56 rounded-lg shadow-xl bg-gray-800 border border-gray-700 z-50 overflow-hidden"
                          onHoverStart={() => toggleDropdown(item.name)}
                          onHoverEnd={() => setDropdownOpen(null)}
                        >
                          {item.subItems.map((subItem) => (
                            <motion.a
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-3 text-sm text-gray-300 hover:text-[#FFE31A] hover:bg-gray-700/50 transition-all"
                              whileHover={{ 
                                x: 5,
                                backgroundColor: 'rgba(255, 227, 26, 0.1)'
                              }}
                            >
                              {subItem.name}
                            </motion.a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <motion.a
                    href={item.href}
                    className="px-4 py-3 rounded-lg text-sm font-medium text-white hover:text-[#FFE31A] hover:bg-gray-800/50 transition-all"
                    whileHover={{ 
                      scale: 1.05,
                      color: '#FFE31A'
                    }}
                  >
                    {item.name}
                  </motion.a>
                )}
              </div>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Search bar */}
            <motion.div 
              className="relative"
              animate={{
                width: searchOpen ? '200px' : '40px'
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.input
                ref={searchRef}
                type="text"
                placeholder="Search..."
                className={`bg-gray-800 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFE31A] ${
                  searchOpen ? 'w-full pl-10 pr-4' : 'w-0 opacity-0'
                }`}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: searchOpen ? 1 : 0
                }}
              />
              <motion.button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FFE31A] ${
                  searchOpen ? 'pointer-events-none' : ''
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Search className="h-5 w-5" />
              </motion.button>
            </motion.div>

            {/* Dark mode toggle */}
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-800 text-gray-300 hover:text-[#FFE31A]"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.button>

            {/* Account button */}
            <motion.button
              className="p-2 rounded-full bg-gray-800 text-gray-300 hover:text-[#FFE31A] hidden md:block"
              whileHover={{ 
                scale: 1.1,
                backgroundColor: 'rgba(255, 227, 26, 0.1)'
              }}
              whileTap={{ scale: 0.9 }}
            >
              <User className="h-5 w-5" />
            </motion.button>

            {/* Cart button with counter */}
            <motion.button
              className="relative p-2 rounded-full bg-[#FFE31A] text-gray-900 hidden md:block"
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 0 15px rgba(255, 227, 26, 0.7)'
              }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingCart className="h-5 w-5" />
              <motion.span 
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 500,
                  damping: 15
                }}
              >
                3
              </motion.span>
            </motion.button>

            {/* Contact button */}
            <motion.a
              href="#contact"
              className="hidden md:flex items-center px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-[#FFE31A] hover:text-gray-900 transition-all"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 15px rgba(255, 227, 26, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="h-4 w-4 mr-2" />
              <span>Contact</span>
            </motion.a>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-full text-white hover:text-[#FFE31A] focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.subItems ? (
                    <>
                      <motion.button
                        onClick={() => toggleDropdown(item.name)}
                        className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-white hover:text-[#FFE31A] rounded-lg hover:bg-gray-800 transition-all"
                        whileHover={{ backgroundColor: 'rgba(255, 227, 26, 0.1)' }}
                      >
                        <span>{item.name}</span>
                        <motion.span
                          animate={{ rotate: dropdownOpen === item.name ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5" />
                        </motion.span>
                      </motion.button>
                      
                      <AnimatePresence>
                        {dropdownOpen === item.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 pl-4 border-l-2 border-[#FFE31A]/30"
                          >
                            {item.subItems.map((subItem) => (
                              <motion.a
                                key={subItem.name}
                                href={subItem.href}
                                className="block px-4 py-3 text-sm text-gray-300 hover:text-[#FFE31A] rounded-lg hover:bg-gray-800/50 transition-all"
                                onClick={() => setIsOpen(false)}
                                whileHover={{ x: 5 }}
                              >
                                {subItem.name}
                              </motion.a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <motion.a
                      href={item.href}
                      className="block px-4 py-3 text-base font-medium text-white hover:text-[#FFE31A] rounded-lg hover:bg-gray-800 transition-all"
                      onClick={() => setIsOpen(false)}
                      whileHover={{ x: 5 }}
                    >
                      {item.name}
                    </motion.a>
                  )}
                </div>
              ))}
              
              <div className="pt-2 border-t border-gray-800 mt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center px-4 py-3 bg-[#FFE31A] text-gray-900 rounded-lg font-bold"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Book Products
                </motion.button>
                
                <div className="flex space-x-3 mt-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-800 text-white rounded-lg"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Account
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-800 text-white rounded-lg"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {darkMode ? (
                      <Sun className="h-5 w-5 mr-2" />
                    ) : (
                      <Moon className="h-5 w-5 mr-2" />
                    )}
                    Theme
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating notification */}

      <AnimatePresence>
  {!isOpen && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: 1.5 }}
      className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-[#FFE31A] text-gray-900 px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center max-w-[95vw] sm:max-w-md min-w-[280px] sm:min-w-[350px] whitespace-normal"
    >
      <Egg className="h-4 w-4 mr-2 flex-shrink-0" />
      <span className="truncate sm:whitespace-normal">
      Special offer: 20% off all dairy products!
      </span>
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className="ml-2 flex-shrink-0"
      >
        <X className="h-4 w-4" />
      </motion.button>
    </motion.div>
  )}
</AnimatePresence>

    </motion.nav>
  );
};

export default Navigation;