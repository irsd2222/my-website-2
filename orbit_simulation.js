// Inisialisasi scene, kamera, dan renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Objek pusat (benda stasioner)
const centralBodyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const centralBodyMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const centralBody = new THREE.Mesh(centralBodyGeometry, centralBodyMaterial);
scene.add(centralBody);

// Objek pengorbit
const orbitingBodyGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const orbitingBodyMaterial = new THREE.MeshBasicMaterial({ color: 0x0077ff });
const orbitingBody = new THREE.Mesh(orbitingBodyGeometry, orbitingBodyMaterial);
scene.add(orbitingBody);

// Lintasan pengorbit
const pathMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const pathGeometry = new THREE.BufferGeometry();
let positions = [];
pathGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
const pathLine = new THREE.Line(pathGeometry, pathMaterial);
scene.add(pathLine);

// Parameter kontrol
const params = {
    centralMass: 10.0, // Massa benda pusat
    orbitMass: 1.0,    // Massa pengorbit
    initialPosition: { x: 5, y: 0, z: 0 }, // Posisi awal
    initialVelocity: { x: 0, y: 1.5, z: 0 }, // Kecepatan awal
    startSimulation: false
};

// Fungsi percepatan gravitasi
function acceleration(r, m, M) {
    const G = 1; // Konstanta gravitasi (disederhanakan)
    const rMag = Math.sqrt(r.x ** 2 + r.y ** 2 + r.z ** 2);
    const factor = -G * M / (rMag ** 3);
    return { x: factor * r.x, y: factor * r.y, z: factor * r.z };
}

// Runge-Kutta untuk gerak benda
function rungeKutta4(acceleration, r, v, m, M, dt) {
    const k1v = acceleration(r, m, M);
    const k1r = v;

    const k2v = acceleration({
        x: r.x + k1r.x * dt / 2,
        y: r.y + k1r.y * dt / 2,
        z: r.z + k1r.z * dt / 2
    }, m, M);
    const k2r = { x: v.x + k1v.x * dt / 2, y: v.y + k1v.y * dt / 2, z: v.z + k1v.z * dt / 2 };

    const k3v = acceleration({
        x: r.x + k2r.x * dt / 2,
        y: r.y + k2r.y * dt / 2,
        z: r.z + k2r.z * dt / 2
    }, m, M);
    const k3r = { x: v.x + k2v.x * dt / 2, y: v.y + k2v.y * dt / 2, z: v.z + k2v.z * dt / 2 };

    const k4v = acceleration({
        x: r.x + k3r.x * dt,
        y: r.y + k3r.y * dt,
        z: r.z + k3r.z * dt
    }, m, M);
    const k4r = { x: v.x + k3v.x * dt, y: v.y + k3v.y * dt, z: v.z + k3v.z * dt };

    v.x += (k1v.x + 2 * k2v.x + 2 * k3v.x + k4v.x) * dt / 6;
    v.y += (k1v.y + 2 * k2v.y + 2 * k3v.y + k4v.y) * dt / 6;
    v.z += (k1v.z + 2 * k2v.z + 2 * k3v.z + k4v.z) * dt / 6;

    r.x += (k1r.x + 2 * k2r.x + 2 * k3r.x + k4r.x) * dt / 6;
    r.y += (k1r.y + 2 * k2r.y + 2 * k3r.y + k4r.y) * dt / 6;
    r.z += (k1r.z + 2 * k2r.z + 2 * k3r.z + k4r.z) * dt / 6;
}

// Simulasi
let position = { ...params.initialPosition };
let velocity = { ...params.initialVelocity };
const dt = 0.01;

function animate() {
    requestAnimationFrame(animate);

    if (params.startSimulation) {
        rungeKutta4(acceleration, position, velocity, params.orbitMass, params.centralMass, dt);
        orbitingBody.position.set(position.x, position.y, position.z);

        positions.push(position.x, position.y, position.z);
        pathGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        pathGeometry.setDrawRange(0, positions.length / 3);
    }

    renderer.render(scene, camera);
}
camera.position.z = 15;

// GUI untuk kontrol parameter
const gui = new dat.GUI({ autoPlace: false });
document.getElementById("controls").appendChild(gui.domElement);

gui.add(params, "centralMass", 1, 100).name("Central Mass");
gui.add(params, "orbitMass", 0.1, 10).name("Orbit Mass");
gui.add(params.initialPosition, "x", -10, 10).name("Initial X");
gui.add(params.initialPosition, "y", -10, 10).name("Initial Y");
gui.add(params.initialVelocity, "x", -5, 5).name("Velocity X");
gui.add(params.initialVelocity, "y", -5, 5).name("Velocity Y");
gui.add(params, "startSimulation").name("Start Simulation");

animate();
