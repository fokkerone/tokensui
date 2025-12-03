'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Helper function to create aperture/hexagon logo particle positions from SVG
function createApertureLogoParticles(particleCount: number) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  // Setup canvas - large size for detail
  const size = 2000;
  canvas.width = size;
  canvas.height = size;
  const centerX = size / 2;
  const centerY = size / 2;

  // SVG path data - exact logo shape
  const svgString = `<svg width="776" height="791" viewBox="0 0 776 791" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(-1309, -375)">
      <g transform="matrix(-1,0,0,-1,2940.159635,3421.759912)">
        <g transform="matrix(-0.283657,0,0,-1.060185,1986.566459,3586.496467)">
          <path d="M3753.617,872.418L3968.203,772.975L3539.518,772.975L3753.617,872.418Z" fill="white"/>
        </g>
        <g transform="matrix(0.5,-0.866025,-0.866025,-0.5,272.516857,6573.584701)">
          <path d="M3798.028,1010.792L3580.428,1387.687L3496.267,1241.917L3629.707,1010.792L3798.028,1010.792Z" fill="white"/>
        </g>
      </g>
      <g transform="translate(928.787789, -1102.416541)">
        <g transform="matrix(0.141828,0.245654,-0.918148,0.530093,1208.109042,762.040648)">
          <path d="M3753.617,872.418L3968.203,772.975L3539.518,772.975L3753.617,872.418Z" fill="white"/>
        </g>
        <g transform="matrix(-1,0,0,1,4652.028137,752.907029)">
          <path d="M3802.816,1002.499L3580.428,1387.687L3496.267,1241.917L3634.495,1002.499L3802.816,1002.499Z" fill="white"/>
        </g>
      </g>
      <g transform="matrix(-0.5,0.866025,-0.866025,-0.5,3698.609035,1040.670676)">
        <g transform="matrix(0.141828,0.245654,-0.918148,0.530093,1208.109042,762.040648)">
          <path d="M3753.617,872.418L3968.203,772.975L3539.518,772.975L3753.617,872.418Z" fill="white"/>
        </g>
        <g transform="matrix(-1,0,0,1,4652.028137,752.907029)">
          <path d="M3802.816,1002.499L3580.428,1387.687L3496.267,1241.917L3634.495,1002.499L3802.816,1002.499Z" fill="white"/>
        </g>
      </g>
      <g transform="matrix(-1,0,0,-1,2466.761155,2642.583459)">
        <g transform="matrix(0.141828,0.245654,-0.918148,0.530093,1208.109042,762.040648)">
          <path d="M3753.617,872.418L3968.203,772.975L3539.518,772.975L3753.617,872.418Z" fill="white"/>
        </g>
        <g transform="matrix(-1,0,0,1,4652.028137,752.907029)">
          <path d="M3802.816,1002.499L3580.428,1387.687L3496.267,1241.917L3634.495,1002.499L3802.816,1002.499Z" fill="white"/>
        </g>
      </g>
      <g transform="matrix(-0.5,-0.866025,0.866025,-0.5,460.540474,2373.330294)">
        <g transform="matrix(0.141828,0.245654,-0.918148,0.530093,1208.109042,762.040648)">
          <path d="M3753.617,872.418L3968.203,772.975L3539.518,772.975L3753.617,872.418Z" fill="white"/>
        </g>
        <g transform="matrix(-1,0,0,1,4652.028137,752.907029)">
          <path d="M3802.816,1002.499L3580.428,1387.687L3496.267,1241.917L3634.495,1002.499L3802.816,1002.499Z" fill="white"/>
        </g>
      </g>
      <g transform="matrix(0.5,0.866025,-0.866025,0.5,2946.269668,-894.746835)">
        <g transform="matrix(0.141828,0.245654,-0.918148,0.530093,1255.802617,803.432953)">
          <path d="M3753.617,872.418L3968.203,772.975L3539.518,772.975L3753.617,872.418Z" fill="white"/>
        </g>
        <g transform="matrix(-1,0,0,1,4699.721712,794.299334)">
          <path d="M3801.896,1004.093L3580.428,1387.687L3496.267,1241.917L3633.574,1004.093L3801.896,1004.093Z" fill="white"/>
        </g>
      </g>
    </g>
  </svg>`;

  //Create image from SVG
  const img = new Image();
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  // Draw SVG to canvas (synchronous for initialization)

  // Draw a simple circle in the center
  ctx.fillStyle = 'white';
  const circleRadius = 500; // Large circle

  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0.0008, Math.PI * 2);
  ctx.fill();

  // Get pixel data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  //Collect positions where logo exists
  const logoPositions: [number, number][] = [];
  for (let y = 0; y < canvas.height; y += 3) {
    for (let x = 0; x < canvas.width; x += 3) {
      const index = (y * canvas.width + x) * 4;
      const alpha = pixels[index + 3];
      if (alpha > 128) {
        logoPositions.push([(x - centerX) * 0.1, (centerY - y) * 0.1]);
      }
    }
  }

  // Cleanup
  URL.revokeObjectURL(url);

  // Sample particles evenly across the logo
  const particles: Array<{ originalX: number; originalY: number; originalZ: number }> = [];
  const step = Math.max(1, Math.floor(logoPositions.length / particleCount));

  for (let i = 0; i < logoPositions.length && particles.length < particleCount; i += step) {
    const [x, y] = logoPositions[i];
    particles.push({
      originalX: x,
      originalY: y,
      originalZ: (Math.random() - 0.5) * 8,
    });
  }

  // Fill remaining particles randomly
  while (particles.length < particleCount) {
    const randomPos = logoPositions[Math.floor(Math.random() * logoPositions.length)];
    const [x, y] = randomPos;
    particles.push({
      originalX: x,
      originalY: y,
      originalZ: (Math.random() - 0.5) * 8,
    });
  }

  return particles;
}

// Magnetic Particle System Component with longer elements
function MagneticParticles({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const driftRef = useRef<Float32Array | null>(null);
  const startPositionsRef = useRef<Float32Array | null>(null);
  const animationProgressRef = useRef(0);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const { count, originalPositions, colors } = useMemo(() => {
    const particles = createApertureLogoParticles(9000);
    const originalPos = new Float32Array(particles.length * 3);
    const colorsArray: THREE.Color[] = [];

    particles.forEach((particle, i) => {
      originalPos[i * 3] = particle.originalX;
      originalPos[i * 3 + 1] = particle.originalY;
      originalPos[i * 3 + 2] = particle.originalZ;

      // PRISM SPECTRUM COLORS - Broken light effect
      // Calculate angle from center for radial rainbow
      const angle = Math.atan2(particle.originalY, particle.originalX);
      const normalizedAngle = (angle + Math.PI) / (Math.PI * 2); // 0 to 1
      const distFromCenter = Math.sqrt(
        particle.originalX * particle.originalX + particle.originalY * particle.originalY,
      );
      const zVariation = (particle.originalZ + 4) / 8;

      // Full spectrum: Red → Orange → Yellow → Green → Cyan → Blue → Violet → Red
      const hue = normalizedAngle * 360;
      const saturation = 0.9 + zVariation * 0.1; // High saturation for vibrant prism colors
      const lightness = 0.5 + Math.sin(distFromCenter * 0.95) * 0.2; // Vary lightness by distance

      // Convert HSL to RGB
      const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
      const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
      const m = lightness - c / 2;

      let r = 0,
        g = 0,
        b = 0;
      if (hue < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (hue < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (hue < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (hue < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (hue < 300) {
        r = x;
        g = 0;
        b = c;
      } else {
        r = c;
        g = 0;
        b = x;
      }

      r += m;
      g += m;
      b += m;

      // Boost brightness for more vibrant prism effect
      r = Math.min(1, r * 1.3);
      g = Math.min(1, g * 1.3);
      b = Math.min(1, b * 1.3);

      colorsArray.push(new THREE.Color(r, g, b));
    });

    return { count: particles.length, originalPositions: originalPos, colors: colorsArray };
  }, []);

  // Initialize velocities, drift, and start positions
  useEffect(() => {
    velocitiesRef.current = new Float32Array(originalPositions.length);
    driftRef.current = new Float32Array(originalPositions.length);
    startPositionsRef.current = new Float32Array(originalPositions.length);
    animationProgressRef.current = 0;

    // Initialize random drift for organic movement - maximum chaos
    for (let i = 0; i < driftRef.current.length; i++) {
      driftRef.current[i] = (Math.random() - 1.05) * 0.4;
    }

    // Initialize random start positions - particles fly in from random directions
    for (let i = 0; i < startPositionsRef.current.length; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 1100;
      startPositionsRef.current[i] = Math.cos(angle) * distance;
      startPositionsRef.current[i + 1] = Math.cos(angle) * distance;
      startPositionsRef.current[i + 2] = Math.sin(angle) * distance;
    }
  }, [originalPositions]);

  useFrame((state) => {
    if (!meshRef.current || !velocitiesRef.current || !driftRef.current || !startPositionsRef.current) return;

    const velocities = velocitiesRef.current;
    const drift = driftRef.current;
    const startPositions = startPositionsRef.current;
    const time = state.clock.elapsedTime;

    // Animation progress for initial fly-in (0 to 1 over 3 seconds)
    if (animationProgressRef.current < 1) {
      animationProgressRef.current = Math.min(1, time / 9);
    }
    const progress = animationProgressRef.current;
    // Easing function for smooth fly-in
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    // Mouse position in 3D space (scaled for massive animation)
    const mouseX = mousePosition.x * 55;
    const mouseY = mousePosition.y * 55;
    const mouseZ = 0;

    // Physics parameters - EXPLOSIVE MAGNETISM with random delayed return
    const attractionRadius = 140; // ENORMOUS repulsion area - particles fly VERY far
    const attractionStrength = 65.0; // MAXIMUM repulsion - explosive blast
    const baseSpringStrength = 0.15; // EXTREMELY weak base return
    const damping = 0.64; // Very low damping for extended flight time
    const driftSpeed = 0.0009; // Super fast drift
    const driftStrength = 55.0; // INSANE drift for maximum wildness

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const originalX = originalPositions[i3];
      const originalY = originalPositions[i3 + 1];
      const originalZ = originalPositions[i3 + 2];

      let currentX, currentY, currentZ;

      // During initial fly-in animation
      if (progress < 1) {
        const easedProgress = easeOutCubic(progress);
        const startX = startPositions[i3];
        const startY = startPositions[i3 + 1];
        const startZ = startPositions[i3 + 2];

        currentX = startX + (originalX - startX) * easedProgress;
        currentY = startY + (originalY - startY) * easedProgress;
        currentZ = startZ + (originalZ - startZ) * easedProgress;

        // Reset velocities during animation
        velocities[i3] = 0;
        velocities[i3 + 1] = 0;
        velocities[i3 + 2] = 0;
      } else {
        // Normal behavior after fly-in
        currentX = originalX + velocities[i3];
        currentY = originalY + velocities[i3 + 1];
        currentZ = originalZ + velocities[i3 + 2];
      }

      // Calculate mouse direction for rotation
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      const dz = mouseZ - currentZ;

      // Only apply physics after fly-in animation is complete
      if (progress >= 1) {
        // Organic drift movement - much stronger wandering
        const driftX = Math.sin(time * driftSpeed + i * 0.5) * drift[i3] * driftStrength;
        const driftY = Math.cos(time * driftSpeed + i * 0.5) * drift[i3 + 1] * driftStrength;
        const driftZ = Math.sin(time * driftSpeed * 0.5 + i * 0.2) * drift[i3 + 2] * (driftStrength * 0.8);

        // Mouse repulsion - particles fly away
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distanceToMouse < attractionRadius && distanceToMouse > 0.1) {
          const force = (attractionRadius - distanceToMouse) / attractionRadius;
          // Negative force = repulsion (particles fly away)
          velocities[i3] -= (dx / distanceToMouse) * force * attractionStrength;
          velocities[i3 + 1] -= (dy / distanceToMouse) * force * attractionStrength;
          velocities[i3 + 2] -= (dz / distanceToMouse) * force * attractionStrength;
        }

        // Spring back to original position with random delay per particle
        // Each particle has a different return speed for staggered effect
        const particleReturnDelay = (i % 100) / 100; // 0 to 0.99 based on particle index
        const randomSpringStrength = baseSpringStrength * (0.3 + particleReturnDelay * 1.7); // Varies 0.3x to 2x

        velocities[i3] += (originalX - currentX) * randomSpringStrength;
        velocities[i3 + 1] += (originalY - currentY) * randomSpringStrength;
        velocities[i3 + 2] += (originalZ - currentZ) * randomSpringStrength;

        // Add drift - extreme influence
        velocities[i3] += driftX * 0.18;
        velocities[i3 + 1] += driftY * 0.18;
        velocities[i3 + 2] += driftZ * 0.28;

        // Apply damping
        velocities[i3] *= damping;
        velocities[i3 + 1] *= damping;
        velocities[i3 + 2] *= damping;
      }

      // Final position
      const finalX = currentX;
      const finalY = currentY;
      const finalZ = currentZ;

      // Set position
      tempObject.position.set(finalX, finalY, finalZ);

      // No rotation - keep particles flat to see logo clearly
      tempObject.rotation.set(0, 0, 0);

      // Pulsing scale - wild breathing effect with individual particle timing - BIGGER PARTICLES
      const pulseSpeed = 4.0; // Faster pulsing
      const pulsePhase = i * 0.05; // More varied phases
      const pulseAmount = Math.sin(time * pulseSpeed + pulsePhase) * 0.5 + 1.0; // Oscillates between 0.5 and 1.5
      const baseScaleX = 0.08; // Much bigger
      const baseScaleY = 0.25; // Much longer
      const baseScaleZ = 0.18; // Much bigger

      tempObject.scale.set(
        baseScaleX * pulseAmount,
        baseScaleY * pulseAmount * 1.2, // Extra Y scaling for more dramatic effect
        baseScaleZ * pulseAmount,
      );

      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
      meshRef.current.setColorAt(i, colors[i]);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.5, 0.5, 1, 8]} />
      <meshStandardMaterial transparent opacity={0.7} />
    </instancedMesh>
  );
}

// Camera Animation Component with Mouse Tracking
function CameraRig({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    // Keep camera fixed at initial position - no movement
    state.camera.position.set(0, 0, 80);

    // Always look at the center - perfectly centered
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

// Main Scene Component
function Scene({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />
      <MagneticParticles mousePosition={mousePosition} />
      <CameraRig mousePosition={mousePosition} />
    </>
  );
}

// Main Export Component
export default function AntigravityScene() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-10">
      <Canvas
        camera={{ position: [0, 0, 80], fov: 70 }}
        gl={{ antialias: true, alpha: true }}
        className="bg-transparent"
      >
        <Scene mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}
