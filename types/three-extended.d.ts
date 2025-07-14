import 'three';

declare module 'three' {
  export class Shape {
    constructor();
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    closePath(): void;
  }

  export class ShapeGeometry {
    constructor(shape: Shape);
    scale(x: number, y: number, z: number): void;
  }

  export class BufferGeometry {
    constructor();
    setAttribute(name: string, attribute: BufferAttribute): void;
    setFromPoints(points: Vector3[]): void;
  }

  export class BufferAttribute {
    constructor(array: ArrayLike<number>, itemSize: number);
  }

  export class Group extends Object3D {
    constructor();
    children: Object3D[];
  }

  export class Object3D {
    position: Vector3;
    rotation: Euler;
    scale: Vector3;
    visible: boolean;
  }

  export class Euler {
    x: number;
    y: number;
    z: number;
  }

  export class Line extends Object3D {
    constructor(geometry?: BufferGeometry, material?: Material);
    geometry: BufferGeometry;
    material: Material;
  }

  export class LineBasicMaterial extends Material {
    constructor(parameters?: {
      color?: ColorRepresentation;
      linewidth?: number;
      linecap?: string;
      linejoin?: string;
      opacity?: number;
      transparent?: boolean;
    });
  }

  export class MeshBasicMaterial extends Material {
    constructor(parameters?: {
      color?: ColorRepresentation;
      opacity?: number;
      transparent?: boolean;
    });
  }

  export type ColorRepresentation = Color | string | number;

  export interface Mesh extends Object3D {
    geometry: BufferGeometry;
    material: Material;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      planeGeometry: any;
      sphereGeometry: any;
      bufferGeometry: any;
      bufferAttribute: any;
      meshBasicMaterial: any;
      lineBasicMaterial: any;
      shaderMaterial: any;
      meshStandardMaterial: any;
    }
  }
}
