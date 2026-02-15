import * as THREE from 'three';
import { Line } from '@react-three/drei';

interface ArrowProps {
    start?: [number, number, number];
    end?: [number, number, number];
    direction?: [number, number, number];
    origin?: [number, number, number];
    color: string;
    lineWidth?: number; // For Line implementation
    thickness?: number; // For Cylinder implementation
    headLength?: number;
    headWidth?: number;
}

export function Arrow({
    start,
    end,
    direction,
    origin = [0, 0, 0],
    color,
    lineWidth = 3,
    thickness = 0, // Default to Line implementation
    headLength,
    headWidth,
}: ArrowProps) {
    const from = new THREE.Vector3(...(start || origin));
    const to = new THREE.Vector3();

    if (end) {
        to.set(...end);
    } else if (direction) {
        to.copy(from).add(new THREE.Vector3(...direction));
    } else {
        return null;
    }

    const dir = new THREE.Vector3().subVectors(to, from);
    const length = dir.length();

    if (length < 1e-4) return null;

    // Default head dimensions based on length/thickness if not provided
    const hLength = headLength ?? Math.min(0.6, length * 0.2);
    const hWidth = headWidth ?? (thickness ? thickness * 3 : 0.08);

    dir.normalize();

    const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir
    );

    // Calculate positions
    // Cone tip at 'to'. Base at 'to - dir*hLength'
    // Cone geometry is centered at local origin.
    // We want the tip at (0, hLength/2, 0) locally to be at 'to'.
    // So we position the mesh at 'to - dir*(hLength/2)'
    const conePos = to.clone().sub(dir.clone().multiplyScalar(hLength / 2));

    if (thickness > 0) {
        // Cylinder implementation
        const shaftLength = length - hLength;

        // Cylinder center
        const cylinderPos = from.clone().add(dir.clone().multiplyScalar(shaftLength / 2));

        return (
            <group>
                {shaftLength > 0.01 && (
                    <mesh position={cylinderPos.toArray()} quaternion={quaternion}>
                        <cylinderGeometry args={[thickness, thickness, shaftLength, 12]} />
                        <meshLambertMaterial color={color} />
                    </mesh>
                )}
                <mesh position={conePos.toArray()} quaternion={quaternion}>
                    <coneGeometry args={[hWidth, hLength, 16]} />
                    <meshLambertMaterial color={color} />
                </mesh>
            </group>
        );
    } else {
        // Line implementation
        return (
            <group>
                <Line
                    points={[from.toArray(), to.toArray()]}
                    color={color}
                    lineWidth={lineWidth}
                />
                <mesh position={conePos.toArray()} quaternion={quaternion}>
                    <coneGeometry args={[hWidth, hLength, 12]} />
                    <meshBasicMaterial color={color} />
                </mesh>
            </group>
        );
    }
}
