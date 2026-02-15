import * as THREE from 'three';

// Extracted logic from SigmaAlgebra.tsx
function simulateAllocation(level, mode) {
    const meshes = [];
    const colors = [0x3b82f6, 0xef4444, 0x10b981, 0xf59e0b, 0x8b5cf6, 0xec4899];

    if (mode === 'atoms') {
        const count = Math.pow(2, level);
        for (let i = 0; i < count; i++) {
            const phiStart = (i / count) * Math.PI * 2;
            const phiLength = (1 / count) * Math.PI * 2;
            const geo = new THREE.SphereGeometry(2.05, 32, 32, phiStart, phiLength, 0, Math.PI);
            const mat = new THREE.MeshPhongMaterial({
                color: colors[i % colors.length],
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.6,
            });
            meshes.push(new THREE.Mesh(geo, mat));
        }
    } else if (mode === 'complement') {
        const aGeo = new THREE.SphereGeometry(2.1, 32, 32, 0, Math.PI, 0, Math.PI);
        const aMat = new THREE.MeshPhongMaterial({
            color: 0x3b82f6,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7,
        });
        meshes.push(new THREE.Mesh(aGeo, aMat));

        const acGeo = new THREE.SphereGeometry(2.1, 32, 32, Math.PI, Math.PI, 0, Math.PI);
        const acMat = new THREE.MeshPhongMaterial({
            color: 0xef4444,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.4,
        });
        meshes.push(new THREE.Mesh(acGeo, acMat));
    } else if (mode === 'union') {
        const count = 3;
        for (let i = 0; i < count; i++) {
            const phiStart = (i / 6) * Math.PI * 2;
            const phiLength = (1 / 8) * Math.PI * 2;
            const geo = new THREE.SphereGeometry(2.1, 32, 32, phiStart, phiLength, 0, Math.PI);
            const mat = new THREE.MeshPhongMaterial({
                color: 0x10b981,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8,
            });
            meshes.push(new THREE.Mesh(geo, mat));
        }
    } else if (mode === 'universe') {
        const geo = new THREE.SphereGeometry(2.1, 32, 32);
        const mat = new THREE.MeshPhongMaterial({
            color: 0x8b5cf6,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
        });
        meshes.push(new THREE.Mesh(geo, mat));
    }
    return meshes;
}

const ITERATIONS = 1000;
console.log(`Running allocation simulation for ${ITERATIONS} iterations...`);

let totalMeshes = 0;
let totalGeometries = 0;
let totalMaterials = 0;

for (let i = 0; i < ITERATIONS; i++) {
    // Alternate modes and levels to simulate user interaction
    const level = i % 5; // 0, 1, 2, 3, 4
    const modes = ['atoms', 'complement', 'union', 'universe'];
    const mode = modes[i % modes.length];

    const meshes = simulateAllocation(level, mode);

    totalMeshes += meshes.length;
    meshes.forEach(m => {
        if (m.geometry) totalGeometries++;
        if (m.material) totalMaterials++;
    });
}

console.log('--- Baseline Allocation Metrics ---');
console.log(`Total Iterations: ${ITERATIONS}`);
console.log(`Total Meshes Created: ${totalMeshes}`);
console.log(`Total Geometries Created: ${totalGeometries}`);
console.log(`Total Materials Created: ${totalMaterials}`);
console.log(`Avg Objects Created Per Render: ${(totalMeshes + totalGeometries + totalMaterials) / ITERATIONS}`);
