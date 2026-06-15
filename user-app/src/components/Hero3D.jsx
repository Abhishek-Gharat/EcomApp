import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PresentationControls, Stage, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D Character Model Component
 * Displays a 3D character with interactive features
 */
const CharacterModel = ({ mouseX, mouseY }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      // Smooth head rotation following mouse
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseX * 0.5,
        0.1
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouseY * 0.3,
        0.1
      );

      // Subtle body sway
      groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Character head (placeholder - replace with actual model) */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshPhysicalMaterial
          color="#e8d5c4"
          roughness={0.4}
          metalness={0}
        />
      </mesh>

      {/* Left Headphone Earcup - with glow */}
      <mesh position={[-0.5, 0.6, 0]} castShadow>
        <boxGeometry args={[0.2, 0.3, 0.2]} />
        <meshPhysicalMaterial
          color="#00d9ff"
          emissive="#00d9ff"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Right Headphone Earcup - with glow */}
      <mesh position={[0.5, 0.6, 0]} castShadow>
        <boxGeometry args={[0.2, 0.3, 0.2]} />
        <meshPhysicalMaterial
          color="#00d9ff"
          emissive="#00d9ff"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Headband connecting earcups */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[1.0, 0.1, 0.1]} />
        <meshPhysicalMaterial
          color="#1a2332"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Left headphone glow effect */}
      <pointLight
        position={[-0.5, 0.6, 0]}
        intensity={2}
        distance={2}
        color="#00d9ff"
      />

      {/* Right headphone glow effect */}
      <pointLight
        position={[0.5, 0.6, 0]}
        intensity={2}
        distance={2}
        color="#00d9ff"
      />

      {/* Neck/body placeholder */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 0.4, 8]} />
        <meshPhysicalMaterial
          color="#1a2332"
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Shoulder area */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.2, 0.2, 0.4]} />
        <meshPhysicalMaterial
          color="#0f1419"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
};

/**
 * 3D Hero Scene Component
 * Full hero experience with interactive features
 */
const Hero3DScene = ({ mouseX = 0, mouseY = 0 }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 50 }}
      gl={{
        antialias: true,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
      }}
      dpr={[1, 2]}
    >
      {/* Ambient lighting for overall illumination */}
      <ambientLight intensity={0.8} color="#ffffff" />

      {/* Main key light - slightly warm */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        color="#fffacd"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Fill light - cool blue (complements cyan headphones) */}
      <directionalLight
        position={[-3, 3, -3]}
        intensity={0.6}
        color="#87ceeb"
      />

      {/* Back light - rim lighting effect */}
      <pointLight position={[0, 1, -5]} intensity={1.5} color="#00d9ff" />

      {/* Character with interactive features */}
      <CharacterModel mouseX={mouseX} mouseY={mouseY} />

      {/* Ground plane shadow */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial color="#000000" opacity={0.3} />
      </mesh>

      {/* Fog for depth perception */}
      <fog attach="fog" args={['#0f1419', 5, 20]} />
    </Canvas>
  );
};

/**
 * Hero3D Component
 * Main wrapper with mouse tracking and fallback
 */
const Hero3D = () => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [webglSupported, setWebglSupported] = useState(true);
  const containerRef = useRef(null);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  // Mouse tracking for interactive camera/character movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Convert to range -1 to 1
      setMouseX((x - 0.5) * 2);
      setMouseY((0.5 - y) * 2);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Mobile touch support
  useEffect(() => {
    const handleTouchMove = (e) => {
      if (!containerRef.current || e.touches.length === 0) return;

      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) / rect.width;
      const y = (touch.clientY - rect.top) / rect.height;

      setMouseX((x - 0.5) * 2);
      setMouseY((0.5 - y) * 2);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchmove', handleTouchMove);
      return () => container.removeEventListener('touchmove', handleTouchMove);
    }
  }, []);

  // Fallback for browsers without WebGL support
  if (!webglSupported) {
    return (
      <div
        ref={containerRef}
        className="w-full h-screen bg-pulse-bg flex items-center justify-center"
      >
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎧</div>
          <h2 className="text-3xl font-black text-pulse-text mb-4">
            GET CHARGED
          </h2>
          <p className="text-pulse-text-secondary mb-8">
            Your browser doesn't support 3D graphics. Update to the latest
            browser version to experience the interactive hero.
          </p>
          <div className="space-y-4">
            <button className="w-full px-6 py-4 bg-pulse-accent hover:shadow-glow-intense text-pulse-bg font-bold rounded-lg transition">
              CHARGE UP
            </button>
            <button className="w-full px-6 py-4 bg-pulse-gold hover:bg-pulse-gold-dark text-pulse-bg font-bold rounded-lg transition">
              EXPLORE NOW
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-pulse-bg overflow-hidden"
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Hero3DScene mouseX={mouseX} mouseY={mouseY} />
      </div>

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Top Section - Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pulse-accent/20 to-pulse-gold/20 px-4 py-2 text-sm text-pulse-accent border border-pulse-accent/50">
          <span className="w-2 h-2 bg-pulse-gold rounded-full animate-pulse" />
          Premium Gear • Charged & Ready
        </div>

        {/* Main Content */}
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-pulse-text mb-6 tracking-tight leading-tight">
            GET CHARGED
          </h1>
          <p className="text-xl md:text-2xl text-pulse-text-secondary mb-10 leading-relaxed">
            Tech built for people who move. Fast.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative px-8 py-4 md:px-12 md:py-5 bg-pulse-accent text-pulse-bg font-bold text-lg rounded-xl transition-all duration-300 hover:shadow-glow-intense hover:scale-105">
              CHARGE UP
              <span className="absolute inset-0 rounded-xl bg-pulse-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
            <button className="group relative px-8 py-4 md:px-12 md:py-5 bg-pulse-gold hover:bg-pulse-gold-dark text-pulse-bg font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105">
              EXPLORE NOW
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 flex flex-col items-center gap-2">
            <p className="text-pulse-text-secondary text-sm">Scroll to explore</p>
            <div className="animate-bounce">
              <svg
                className="w-6 h-6 text-pulse-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Performance hint for desktop */}
      <div className="absolute bottom-4 right-4 text-xs text-pulse-text-secondary z-20 hidden md:block">
        💡 Move your mouse to interact with the scene
      </div>
    </div>
  );
};

export default Hero3D;
