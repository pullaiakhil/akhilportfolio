import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, useGLTF } from "@react-three/drei";

function AvatarModel() {
  const { scene } = useGLTF("/avatar.glb");

  return (
    <primitive
      object={scene}
      scale={2.2}
      position={[0, -2.3, 0]}
    />
  );
}

export default function Avatar3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[2, 2, 5]}
        intensity={2}
      />

      <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={1}
      >
        <AvatarModel />
      </Float>

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}