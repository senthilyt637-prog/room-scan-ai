import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as THREE from 'three';

export const exportSceneAsGLB = (scene: THREE.Scene, filename: string = 'detected-objects.glb') => {
  const exporter = new GLTFExporter();
  
  exporter.parse(
    scene,
    (gltf) => {
      const blob = new Blob([gltf as ArrayBuffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    },
    (error) => {
      console.error('Error exporting GLB:', error);
    },
    { binary: true }
  );
};

export const exportObjectAsGLB = (object: THREE.Object3D, filename: string) => {
  const exporter = new GLTFExporter();
  
  exporter.parse(
    object,
    (gltf) => {
      const blob = new Blob([gltf as ArrayBuffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    },
    (error) => {
      console.error('Error exporting GLB:', error);
    },
    { binary: true }
  );
};
