import * as THREE from 'three';

interface SubspacePlaneProps {
    normal: [number, number, number];
    color: string;
    size?: number;
}

export function SubspacePlane({
    normal,
    color,
    size = 18,
}: SubspacePlaneProps) {
    const n = new THREE.Vector3(...normal).normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1), // Plane geometry is X Y, normal is Z
        n
    );

    // GridHelper is usually X Z plane (normal Y).
    const gridQuaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        n
    );

    return (
        <group>
            <mesh quaternion={quaternion}>
                <planeGeometry args={[size, size]} />
                <meshBasicMaterial
                    color={color}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.15}
                    depthWrite={false}
                />
            </mesh>
            <gridHelper
                args={[size, size, color, color]}
                quaternion={gridQuaternion}
                material-opacity={0.2}
                material-transparent={true}
                material-depthWrite={false}
            />
        </group>
    );
}

interface SubspaceLineProps {
    direction: [number, number, number];
    color: string;
    length?: number;
    thickness?: number;
}

export function SubspaceLine({
    direction,
    color,
    length = 30,
    thickness = 0.06
}: SubspaceLineProps) {
    const vDir = new THREE.Vector3(...direction).normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0), // Cylinder is Y axis
        vDir
    );

    return (
        <mesh quaternion={quaternion}>
            <cylinderGeometry args={[thickness, thickness, length, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
    );
}
