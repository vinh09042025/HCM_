import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const artifactInteractables = [];
const roomTriggers = [];
const videoInteractables = [];

const artifactData = {
    'painting-1': {
        year: '1911',
        title: 'Bến Nhà Rồng (địa điểm lịch sử)',
        desc: 'Hình ảnh tư liệu về Bến Nhà Rồng, địa điểm gắn với ngày 5/6/1911 khi Nguyễn Tất Thành lên tàu bắt đầu hành trình tìm đường cứu nước.'
    },
    'painting-2': {
        year: '1920',
        title: 'Nguyễn Ái Quốc tại Đại hội Tours',
        desc: 'Tại Đại hội Đảng Xã hội Pháp ở Tours tháng 12/1920, Nguyễn Ái Quốc tham gia quyết định lịch sử và trở thành một trong những người sáng lập Đảng Cộng sản Pháp.'
    },
    'painting-3': {
        year: '02/09/1945',
        title: 'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập',
        desc: 'Ngày 2/9/1945 tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa.'
    },
    'painting-4': {
        year: '02/09/1945',
        title: 'Quảng trường Ba Đình ngày Quốc khánh',
        desc: 'Quảng trường Ba Đình ngày 2/9/1945, nơi hàng vạn đồng bào chứng kiến Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập.'
    },
    'painting-9': {
        year: '02/09/1945',
        title: 'Hồ Chí Minh và Võ Nguyên Giáp trong ngày độc lập',
        desc: 'Ảnh tư liệu Chủ tịch Hồ Chí Minh và Đại tướng Võ Nguyên Giáp tại Quảng trường Ba Đình ngày 2/9/1945, gợi nhắc thời khắc nền độc lập được công bố.'
    },
    'painting-10': {
        year: '02/09/1945',
        title: 'Lễ đài độc lập tại Sài Gòn',
        desc: 'Ảnh tư liệu lễ đài độc lập ngày 2/9/1945 tại Sài Gòn, phản ánh không khí mừng độc lập và sự lan tỏa của thời khắc lịch sử trên cả nước.'
    },
    'painting-5': {
        year: '03/1946',
        title: 'Chính phủ Liên hiệp Kháng chiến ra mắt',
        desc: 'Hình ảnh Chính phủ Liên hiệp Kháng chiến của nước Việt Nam Dân chủ Cộng hòa tháng 3/1946, gắn với quá trình xây dựng chính quyền và Quốc hội khóa I sau Tổng tuyển cử.'
    },
    'painting-6': {
        year: '05/07/1955',
        title: 'Hồ Chí Minh và Tống Khánh Linh tại Bắc Kinh',
        desc: 'Hình ảnh Chủ tịch Hồ Chí Minh gặp Tống Khánh Linh tại Bắc Kinh năm 1955, thể hiện quan hệ hữu nghị và tinh thần đoàn kết quốc tế.'
    },
    'room4-national-unity-1': {
        year: 'Thập niên 1950',
        title: 'Hồ Chí Minh giao lưu với thiếu nhi Việt Nam',
        desc: 'Hình ảnh Chủ tịch Hồ Chí Minh giao lưu với thiếu nhi Việt Nam, gợi nhắc sự gắn kết giữa các thế hệ trong cộng đồng dân tộc.'
    },
    'room4-national-unity-2': {
        year: 'Trước 1969',
        title: 'Chủ tịch Hồ Chí Minh và đồng chí Đỗ Mười',
        desc: 'Hình ảnh Chủ tịch Hồ Chí Minh và đồng chí Đỗ Mười, phản ánh sự phối hợp của đội ngũ lãnh đạo trong sự nghiệp xây dựng đất nước.'
    },
    'room4-international-solidarity-2': {
        year: '1955',
        title: 'Chủ tịch Hồ Chí Minh thăm Mông Cổ',
        desc: 'Chuyến thăm Mông Cổ năm 1955, minh họa quan hệ hữu nghị và tinh thần đoàn kết quốc tế.'
    },
    'room4-national-unity-people': {
        year: 'Thế kỷ XX',
        title: 'Sức mạnh của đại đoàn kết toàn dân tộc',
        desc: 'Cụm mô hình con người được sử dụng để biểu trưng cho sức mạnh của khối đại đoàn kết toàn dân tộc trong tư tưởng Hồ Chí Minh. Đây là mô hình minh họa, không đại diện cho một nhóm nhân vật lịch sử cụ thể.'
    },
    'room4-dove': {
        year: 'Thế kỷ XX',
        title: 'Hòa bình và hữu nghị giữa các dân tộc',
        desc: 'Hình tượng chim bồ câu được sử dụng như biểu tượng minh họa cho hòa bình, hữu nghị và tinh thần đoàn kết quốc tế trong tư tưởng Hồ Chí Minh.'
    },
    'room4-letter': {
        year: 'Thế kỷ XX',
        title: 'Thông điệp hữu nghị và đoàn kết quốc tế',
        desc: 'Mô hình lá thư được sử dụng để gợi nhắc hoạt động trao đổi, liên hệ và tình đoàn kết giữa Việt Nam với bạn bè quốc tế. Đây là hiện vật minh họa, không khẳng định là một bức thư lịch sử cụ thể của Chủ tịch Hồ Chí Minh.'
    },
    'room5-chair': {
        year: 'Thế kỷ XX',
        title: 'Chiếc ghế gỗ mộc mạc',
        desc: 'Mô hình hiện vật gợi nhắc nếp sống giản dị, gần gũi, thanh bạch trong đời sống thường ngày.'
    },
    'room5-tea-cup': {
        year: 'Thế kỷ XX',
        title: 'Tách trà',
        desc: 'Hình ảnh đời sống thanh đạm, bình dị và nền nếp, gắn với phong cách sống nhẹ nhàng, tiết chế.'
    },
    'room5-work-desk': {
        year: 'Thế kỷ XX',
        title: 'Góc bàn làm việc giản dị',
        desc: 'Chiếc bàn gỗ mộc, ngọn đèn bàn, chồng sách và cuốn sổ ghi chép gợi lại nếp làm việc cần mẫn, ngăn nắp và giản dị. Đây là mô hình minh họa, không phải hiện vật gốc.'
    },
    'room5-rubber-sandals': {
        year: 'Thế kỷ XX',
        title: 'Dép cao su - biểu tượng lối sống giản dị',
        desc: 'Hình ảnh minh họa kiểu dép cao su gắn với phong cách sống giản dị, tiết kiệm và gần gũi; không khẳng định đây là đôi dép thật của Chủ tịch Hồ Chí Minh.'
    },
    'room5-humanism-2': {
        year: '1950',
        title: 'Hồ Chí Minh giao lưu với thiếu nhi',
        desc: 'Hình ảnh tư liệu về sự gần gũi, yêu thương của Chủ tịch Hồ Chí Minh với thiếu nhi, gợi nhắc chiều sâu nhân văn trong văn hóa và con người.'
    },
    'painting-7': {
        year: '2009',
        title: 'Không gian làm việc tại Nhà sàn Hồ Chí Minh',
        desc: 'Ảnh chụp không gian làm việc tại Nhà sàn Hồ Chí Minh ở Hà Nội, giúp hình dung nếp sống giản dị và tinh thần lao động, học tập của Người. Đây là ảnh tư liệu về không gian bảo tồn, không phải hiện vật gốc đang trưng bày.'
    },
    'painting-8': {
        year: 'Thập niên 1950',
        title: 'Chân dung Chủ tịch Hồ Chí Minh',
        desc: 'Chân dung tư liệu Chủ tịch Hồ Chí Minh, phù hợp làm hình ảnh mở đầu cho không gian phim và tư liệu về cuộc đời, sự nghiệp của Người.'
    },
    'room1-steam-ship': {
        year: '1911',
        title: 'Hành trình ra đi tìm đường cứu nước',
        desc: 'Mô hình tàu hơi nước minh họa phương tiện đường biển gắn với bối cảnh Nguyễn Tất Thành rời Tổ quốc năm 1911, bắt đầu hành trình tìm con đường giải phóng dân tộc.'
    },
    'room1-antique-globe': {
        year: '1911–1941',
        title: 'Hành trình qua nhiều quốc gia',
        desc: 'Quả địa cầu tượng trưng cho hành trình hoạt động thực tiễn của Nguyễn Ái Quốc – Hồ Chí Minh qua nhiều quốc gia và quá trình tìm ra con đường cứu nước phù hợp cho dân tộc Việt Nam.'
    },
    'room2-vintage-microphone': {
        year: '1945',
        title: 'Tiếng nói của độc lập',
        desc: 'Mô hình microphone cổ được sử dụng như một hiện vật minh họa cho không gian lịch sử gắn với việc công bố nền độc lập của Việt Nam. Đây là mô hình minh họa, không khẳng định là chiếc microphone thực tế được sử dụng ngày 2/9/1945.'
    },
    'room2-vintage-radio': {
        year: '1945',
        title: 'Thông tin và tiếng nói cách mạng',
        desc: 'Mô hình radio cổ minh họa phương tiện truyền thông trong bối cảnh lịch sử giữa thế kỷ XX, gợi nhắc vai trò của thông tin và tiếng nói cách mạng trong thời kỳ giành và bảo vệ nền độc lập.'
    },
    'room2-vintage-telephone': {
        year: 'Thế kỷ XX',
        title: 'Điện thoại cổ',
        desc: 'Mô hình điện thoại cổ minh họa phương tiện liên lạc trong bối cảnh lịch sử thế kỷ XX. Hiện vật được sử dụng nhằm tái hiện không khí của thời kỳ, không khẳng định đây là thiết bị cụ thể từng được Chủ tịch Hồ Chí Minh sử dụng.'
    },
    'room2-old-newspaper': {
        year: '1945',
        title: 'Báo chí và thông tin trong ngày độc lập',
        desc: 'Mô hình tờ báo cũ được sử dụng để gợi lại vai trò của báo chí và thông tin trong bối cảnh lịch sử năm 1945. Đây là hiện vật minh họa, không khẳng định là một số báo cụ thể của ngày 2/9/1945.'
    },
    'room3-ballot-box': {
        year: '1946',
        title: 'Quyền làm chủ của nhân dân',
        desc: 'Mô hình hòm phiếu được sử dụng để minh họa quyền tham gia quản lý Nhà nước và thực hiện quyền làm chủ của nhân dân. Hiện vật mang tính minh họa, không khẳng định đây là hòm phiếu cụ thể của cuộc Tổng tuyển cử năm 1946.'
    },
    'room3-typewriter': {
        year: 'Thế kỷ XX',
        title: 'Công tác văn thư và xây dựng Nhà nước',
        desc: 'Mô hình máy đánh chữ cổ minh họa hoạt động văn thư, soạn thảo và xử lý văn bản trong bộ máy hành chính. Đây là hiện vật minh họa, không khẳng định là thiết bị cụ thể từng được Chủ tịch Hồ Chí Minh sử dụng.'
    },
    'room3-old-book': {
        year: '1945–1946',
        title: 'Pháp luật và nền Nhà nước mới',
        desc: 'Mô hình sách cổ được sử dụng để tượng trưng cho văn kiện, Hiến pháp và vai trò của pháp luật trong xây dựng Nhà nước mới. Đây là hiện vật minh họa, không phải một bản Hiến pháp lịch sử cụ thể.'
    },
    'painting-11': {
        year: '1946',
        title: 'Chuẩn bị Tổng tuyển cử Quốc hội khóa I',
        desc: 'Ảnh tư liệu cảnh chuẩn bị bầu cử Quốc hội khóa I tại ngõ Phất Lộc năm 1946, gợi lại quá trình tổ chức cuộc Tổng tuyển cử đầu tiên của nước Việt Nam Dân chủ Cộng hòa.'
    },
    'painting-12': {
        year: '02/03/1946',
        title: 'Phiên họp đầu tiên của Quốc hội khóa I',
        desc: 'Quang cảnh phiên họp đầu tiên của Quốc hội Việt Nam Dân chủ Cộng hòa khóa I ngày 2/3/1946, một dấu mốc trong quá trình xây dựng Nhà nước mới.'
    }
};

let discoveredArtifacts = new Set();
const totalArtifacts = Object.keys(artifactData).length;

// --- DOM ELEMENTS ---
const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');
const infoPanel = document.getElementById('info-panel');
const counterDisplay = document.getElementById('found-count');
const closePanelBtn = document.getElementById('close-panel');
const victoryPopup = document.getElementById('victory-popup');
const continueTourBtn = document.getElementById('continue-tour-btn');
const restartTourBtn = document.getElementById('restart-tour-btn');
const entrancePopup = document.getElementById('entrance-popup');
const enterMuseumBtn = document.getElementById('enter-museum-btn');
const leaveMuseumBtn = document.getElementById('leave-museum-btn');
const currentRoomName = document.getElementById('current-room-name');
const roomPopup = document.getElementById('room-popup');
const roomPopupTitle = document.getElementById('room-popup-title');
const roomPopupNumber = document.getElementById('room-popup-number');
const enterRoomBtn = document.getElementById('enter-room-btn');
const cancelRoomBtn = document.getElementById('cancel-room-btn');
const progressFill = document.getElementById('progress-fill');
const progressTrack = document.querySelector('.progress-track');
const discoveredBadge = document.getElementById('discovered-badge');
const victoryFoundCount = document.getElementById('victory-found-count');
const victoryTotalCount = document.getElementById('victory-total-count');
const crosshair = document.getElementById('crosshair');
const room6ContinueBtn = document.getElementById('room6-continue-btn');
const room6AudioFallback = document.getElementById('room6-audio-fallback');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
document.getElementById('total-count').textContent = totalArtifacts;
document.getElementById('counter-total').textContent = totalArtifacts;

function updateProgressUI() {
    const found = discoveredArtifacts.size;
    const percentage = totalArtifacts ? (found / totalArtifacts) * 100 : 0;
    counterDisplay.textContent = found;
    progressFill.style.width = `${percentage}%`;
    progressTrack.setAttribute('aria-valuemax', totalArtifacts);
    progressTrack.setAttribute('aria-valuenow', found);
    victoryFoundCount.textContent = found;
    victoryTotalCount.textContent = totalArtifacts;
}

updateProgressUI();

// --- THREE.JS SETUP ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5); // Light fog for realistic indoor look
scene.fog = new THREE.Fog(0xf5f5f5, 10, 40);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 35); // Start outside, facing the museum entrance

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));
// Bóng đổ của mặt trời được tính một lần (bóng tĩnh) nên gần như không tốn hiệu năng.
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// The YouTube iframe lives in a CSS3D scene so it follows the same camera,
// perspective and room coordinates as the WebGL TV frame.
const cssScene = new THREE.Scene();
const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
cssRenderer.domElement.style.left = '0';
cssRenderer.domElement.style.zIndex = '2';
cssRenderer.domElement.style.background = 'transparent';
cssRenderer.domElement.style.pointerEvents = 'none';
document.getElementById('canvas-container').appendChild(cssRenderer.domElement);

// --- CONTROLS ---
const controls = new PointerLockControls(camera, document.body);

function enterGameMode() {
    if (isTouchDevice) {
        blocker.style.display = 'none';
        return;
    }

    try {
        controls.lock();
    } catch (error) {
        console.error('Không thể kích hoạt Pointer Lock:', error);
        blocker.style.display = 'grid';
    }
}

blocker.addEventListener('click', function () {
    enterGameMode();
    startMedia();
    startGuideTour();
});

const startTourBtn = document.getElementById('start-tour-btn');
if (startTourBtn) {
    startTourBtn.addEventListener('click', () => {
        enterGameMode();
        startMedia();
        startGuideTour();
    });
}

const mediaToggleBtn = document.getElementById('media-toggle-btn');
const mediaPopover = document.getElementById('media-popover');
const helpBtn = document.getElementById('help-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');

mediaToggleBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    const willOpen = mediaPopover.hidden;
    mediaPopover.hidden = !willOpen;
    mediaToggleBtn.setAttribute('aria-expanded', String(willOpen));
});

mediaPopover.addEventListener('click', event => event.stopPropagation());

helpBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (!isTouchDevice && document.pointerLockElement) document.exitPointerLock();
    else blocker.style.display = 'grid';
});

fullscreenBtn.addEventListener('click', async (event) => {
    event.stopPropagation();
    try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
    } catch (error) {
        console.warn('Không thể chuyển chế độ toàn màn hình:', error);
    }
});

document.addEventListener('fullscreenchange', () => {
    fullscreenBtn.setAttribute('aria-label', document.fullscreenElement ? 'Thoát toàn màn hình' : 'Toàn màn hình');
});

controls.addEventListener('lock', function () {
    blocker.style.display = 'none';
    startTourBtn.querySelector('span:last-child').textContent = 'Đang tham quan';
});

controls.addEventListener('unlock', function () {
    moveForward = false;
    moveBackward = false;
    moveLeft = false;
    moveRight = false;
    velocity.set(0, 0, 0);

    // Only show blocker if we didn't open the info panel
    if (infoPanel.classList.contains('closed') && entrancePopup.classList.contains('hidden') && roomPopup.classList.contains('hidden') && victoryPopup.classList.contains('hidden')) {
        blocker.style.display = 'grid';
    }
    startTourBtn.querySelector('span:last-child').textContent = 'Tiếp tục';
});

document.addEventListener('pointerlockerror', () => {
    console.error('Pointer Lock thất bại');
    blocker.style.display = 'grid';
});

scene.add(controls.getObject());

// --- MOBILE TOUCH DETECTION ---
// Make it a function so it can detect changes if user toggles Chrome DevTools
function checkIsTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia("(pointer: coarse)").matches;
}
let isTouchDevice = checkIsTouchDevice();
if (isTouchDevice) {
    camera.rotation.order = 'YXZ'; // Important for touch look
}

// Re-check on resize (useful for emulator toggling)
window.addEventListener('resize', () => {
    isTouchDevice = checkIsTouchDevice();
    if (isTouchDevice) camera.rotation.order = 'YXZ';

    // Update camera and renderer on resize
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    viewCamera.aspect = camera.aspect;
    viewCamera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Movement variables
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// --- VIRTUAL JOYSTICK LOGIC ---
const joystickBase = document.getElementById('joystick-base');
const joystickStick = document.getElementById('joystick-stick');
const touchLookZone = document.getElementById('touch-look-zone');
const maxJoystickTravel = 30; // pixels

// Always attach touch listeners (they won't fire on non-touch devices anyway)
let joystickIdentifier = null;

joystickBase.addEventListener('touchstart', (e) => {
    e.preventDefault(); // prevent scrolling
    const touch = e.changedTouches[0];
    joystickIdentifier = touch.identifier;
    updateJoystick(touch);
});

joystickBase.addEventListener('touchmove', (e) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joystickIdentifier) {
            updateJoystick(e.changedTouches[i]);
            break;
        }
    }
});

function handleJoystickEnd(e) {
    for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joystickIdentifier) {
            joystickIdentifier = null;
            joystickStick.style.transform = `translate(0px, 0px)`;
            moveForward = false;
            moveBackward = false;
            moveLeft = false;
            moveRight = false;
            break;
        }
    }
}
joystickBase.addEventListener('touchend', handleJoystickEnd);
joystickBase.addEventListener('touchcancel', handleJoystickEnd);

function updateJoystick(touch) {
    const rect = joystickBase.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;

    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > maxJoystickTravel) {
        dx = (dx / distance) * maxJoystickTravel;
        dy = (dy / distance) * maxJoystickTravel;
    }

    joystickStick.style.transform = `translate(${dx}px, ${dy}px)`;

    // Map to movement flags
    moveForward = dy < -10;
    moveBackward = dy > 10;
    moveLeft = dx < -10;
    moveRight = dx > 10;
}

// --- TOUCH LOOK LOGIC ---
let touchStartX, touchStartY;
let lookSensitivity = 0.005;

touchLookZone.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].pageX;
    touchStartY = e.changedTouches[0].pageY;
});

touchLookZone.addEventListener('touchmove', (e) => {
    const touchX = e.changedTouches[0].pageX;
    const touchY = e.changedTouches[0].pageY;

    const deltaX = touchX - touchStartX;
    const deltaY = touchY - touchStartY;

    camera.rotation.y -= deltaX * lookSensitivity;
    camera.rotation.x -= deltaY * lookSensitivity;

    // Clamp pitch
    const PI_2 = Math.PI / 2;
    camera.rotation.x = Math.max(-PI_2, Math.min(PI_2, camera.rotation.x));

    touchStartX = touchX;
    touchStartY = touchY;
});

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let prevTime = performance.now();

const onKeyDown = function (event) {
    const typingTag = document.activeElement?.tagName;
    const isTyping = typingTag === 'INPUT' || typingTag === 'TEXTAREA' || typingTag === 'SELECT' ||
        document.activeElement?.isContentEditable;

    if (event.code === 'KeyN' && !event.repeat) {
        if (isTyping) return;
        toggleDayNight();
        return;
    }

    if (event.code === 'KeyV' && !event.repeat) {
        if (isTyping) return;
        toggleViewMode();
        return;
    }

    if (event.code === 'KeyM' && !event.repeat) {
        if (isTyping) return;
        setNarrationEnabled(!narrationState.enabled);
        return;
    }

    if (event.code === 'KeyG' && !event.repeat) {
        if (isTyping) return;
        guideTeleportNear(camera.position);
        guideContextualTip();
        return;
    }

    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': moveForward = true; break;
        case 'ArrowLeft':
        case 'KeyA': moveLeft = true; break;
        case 'ArrowDown':
        case 'KeyS': moveBackward = true; break;
        case 'ArrowRight':
        case 'KeyD': moveRight = true; break;
    }
};

const onKeyUp = function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': moveForward = false; break;
        case 'ArrowLeft':
        case 'KeyA': moveLeft = false; break;
        case 'ArrowDown':
        case 'KeyS': moveBackward = false; break;
        case 'ArrowRight':
        case 'KeyD': moveRight = false; break;
    }
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// --- SCENE BUILDING ---

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Global soft light
scene.add(ambientLight);

// Main spotlight shining on the statue
const spotLight = new THREE.SpotLight(0xffeebb, 2);
spotLight.position.set(0, 10, 2);
spotLight.target.position.set(0, 0, -5);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.5;
spotLight.castShadow = false;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
scene.add(spotLight);
scene.add(spotLight.target);

// Fill lights for the room
const pointLight1 = new THREE.PointLight(0xffffff, 0.5, 20);
pointLight1.position.set(-8, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 20);
pointLight2.position.set(8, 5, 5);
scene.add(pointLight2);

// Room Dimensions
const roomWidth = 32;
const roomDepth = 42;
const wallHeight = 8;

// 1. Floor (Darker Museum Floor)
const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x34383d, roughness: 0.42, metalness: 0.08 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// 2. Red Carpet
const carpetGeo = new THREE.PlaneGeometry(4, roomDepth - 4);
const carpetMat = new THREE.MeshStandardMaterial({ color: 0x8f171b, roughness: 0.88 });
const carpet = new THREE.Mesh(carpetGeo, carpetMat);
carpet.rotation.x = -Math.PI / 2;
carpet.position.y = 0.01; // Slightly above floor to prevent z-fighting
carpet.receiveShadow = true;
scene.add(carpet);

// 3. Walls (Warm Cornsilk color)
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf3eee3, roughness: 0.92, side: THREE.DoubleSide });

// Back Wall
const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, wallHeight), wallMaterial);
backWall.position.set(0, wallHeight / 2, -roomDepth / 2);
backWall.receiveShadow = true;
scene.add(backWall);

// Front wall is split around a real entrance.
const entranceWidth = 4.2;
const entranceHeight = 4.4;
// The entrance is an opening in the front wall, not a collidable door. Keep
// enough margin for the player while allowing the bounds to cross the facade.
const entrancePassageHalfWidth = entranceWidth / 2 - 0.5;
const entranceZ = roomDepth / 2;
const frontSideWidth = (roomWidth - entranceWidth) / 2;
[-1, 1].forEach(side => {
    const wallPart = new THREE.Mesh(new THREE.PlaneGeometry(frontSideWidth, wallHeight), wallMaterial);
    wallPart.name = `exterior-front-wall-${side < 0 ? 'left' : 'right'}`;
    wallPart.position.set(side * (entranceWidth / 2 + frontSideWidth / 2), wallHeight / 2, roomDepth / 2);
    wallPart.rotation.y = Math.PI;
    wallPart.receiveShadow = true;
    scene.add(wallPart);
});
const frontTopWall = new THREE.Mesh(new THREE.PlaneGeometry(entranceWidth, wallHeight - entranceHeight), wallMaterial);
frontTopWall.name = 'exterior-front-wall-above-entrance';
frontTopWall.position.set(0, entranceHeight + (wallHeight - entranceHeight) / 2, roomDepth / 2);
frontTopWall.rotation.y = Math.PI;
frontTopWall.receiveShadow = true;
scene.add(frontTopWall);

// Left Wall
const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, wallHeight), wallMaterial);
leftWall.position.set(-roomWidth / 2, wallHeight / 2, 0);
leftWall.rotation.y = Math.PI / 2;
leftWall.receiveShadow = true;
scene.add(leftWall);

// Right Wall
const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, wallHeight), wallMaterial);
rightWall.position.set(roomWidth / 2, wallHeight / 2, 0);
rightWall.rotation.y = -Math.PI / 2;
rightWall.receiveShadow = true;
scene.add(rightWall);

// 4. Ceiling
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomDepth), wallMaterial);
ceiling.position.set(0, wallHeight, 0);
ceiling.rotation.x = Math.PI / 2;
scene.add(ceiling);

// --- EXTERIOR & MUSEUM FACADE ---
// Nền, lối đi và toàn bộ cảnh quan ngoài trời được dựng lại ở mục
// "CẢNH QUAN NGOÀI TRỜI (thiết kế lại)" phía dưới.

const facadeStone = new THREE.MeshStandardMaterial({ color: 0xe8dfcb, roughness: 0.82 });
const facadeDark = new THREE.MeshStandardMaterial({ color: 0x281816, roughness: 0.65 });
const facadeGold = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.65 });

// Entrance frame, stairs and a clean modern canopy.
// Match the visual recess to the full doorway opening. The previous inset left
// narrow warm-white strips at both sides and below the entrance, which read as
// a floating vertical bar from the courtyard approach.
const doorRecess = new THREE.Mesh(new THREE.PlaneGeometry(entranceWidth, entranceHeight), facadeDark);
doorRecess.name = 'exterior-main-entrance-recess';
doorRecess.position.set(0, entranceHeight / 2, roomDepth / 2 + 0.04);
scene.add(doorRecess);

for (let step = 0; step < 3; step++) {
    const stair = new THREE.Mesh(new THREE.BoxGeometry(6.4 - step * 0.55, 0.16, 0.75), facadeStone);
    stair.position.set(0, 0.08 + step * 0.16, roomDepth / 2 + 2.15 - step * 0.55);
    stair.receiveShadow = true;
    scene.add(stair);
}

const canopy = new THREE.Mesh(new THREE.BoxGeometry(11.3, 0.5, 2.4), facadeStone);
canopy.position.set(0, 6.65, roomDepth / 2 + 1.1);
canopy.castShadow = true;
scene.add(canopy);

function createMuseumSign() {
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 220;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#7d1717';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 12;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
    ctx.fillStyle = '#ffe7a0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 82px Arial';
    ctx.fillText('BẢO TÀNG HỒ CHÍ MINH', canvas.width / 2, canvas.height / 2 + 4);
    const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(9.5, 1.5),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })
    );
    sign.name = 'museum-facade-sign';
    sign.position.set(0, 7.35, roomDepth / 2 + 2.34);
    scene.add(sign);
}
createMuseumSign();

/* =====================================================================
   NHÂN VẬT 3D & GÓC NHÌN THỨ BA
   `camera` vẫn là "đầu" của người chơi: toàn bộ logic di chuyển, va chạm
   và nhận diện khu vực tiếp tục dùng camera.position. `viewCamera` mới là
   camera thật sự được render, nhờ vậy việc đổi góc nhìn không đụng tới
   bất kỳ quy tắc nào của phần tham quan.
   ===================================================================== */

// Giới hạn khuôn viên ngoài trời (được cảnh quan mới dùng lại).
const exteriorBounds = {
    minX: -26,
    maxX: 26,
    minZ: entranceZ,
    maxZ: entranceZ + 34
};

const characterTextureCache = new Map();

function makeHeadTexture(key, skinHex, options = {}) {
    if (characterTextureCache.has(key)) return characterTextureCache.get(key);
    const { ink = '#2b1c16', mouth = '#a2453f', blush = 'rgba(214,124,112,0.5)', lashes = false } = options;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = `#${skinHex.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Mặt nằm ở u = 0.25 của hình cầu (hướng +Z của nhân vật).
    const cx = 128;
    const cy = 104;

    ctx.fillStyle = blush;
    [-30, 30].forEach(dx => {
        ctx.beginPath();
        ctx.ellipse(cx + dx, cy + 22, 11, 7, 0, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = ink;
    [-20, 20].forEach(dx => {
        ctx.beginPath();
        ctx.ellipse(cx + dx, cy, 6.5, lashes ? 8 : 7, 0, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.fillStyle = '#ffffff';
    [-20, 20].forEach(dx => {
        ctx.beginPath();
        ctx.ellipse(cx + dx - 2, cy - 2.5, 2.1, 2.4, 0, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.strokeStyle = ink;
    ctx.lineCap = 'round';
    ctx.lineWidth = 4;
    [-20, 20].forEach(dx => {
        ctx.beginPath();
        ctx.moveTo(cx + dx - 10, cy - 15);
        ctx.quadraticCurveTo(cx + dx, cy - 19, cx + dx + 10, cy - 14);
        ctx.stroke();
    });

    if (lashes) {
        ctx.lineWidth = 2.4;
        [[-20, -1], [20, 1]].forEach(([dx, dir]) => {
            ctx.beginPath();
            ctx.moveTo(cx + dx + dir * 7, cy - 4);
            ctx.lineTo(cx + dx + dir * 12, cy - 8);
            ctx.stroke();
        });
    }

    ctx.strokeStyle = mouth;
    ctx.lineWidth = 3.4;
    ctx.beginPath();
    ctx.moveTo(cx - 11, cy + 31);
    ctx.quadraticCurveTo(cx, cy + 40, cx + 11, cy + 31);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    characterTextureCache.set(key, texture);
    return texture;
}

let contactShadowTexture = null;
function getContactShadowTexture() {
    if (contactShadowTexture) return contactShadowTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
    gradient.addColorStop(0, 'rgba(0,0,0,0.44)');
    gradient.addColorStop(0.55, 'rgba(0,0,0,0.18)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    contactShadowTexture = new THREE.CanvasTexture(canvas);
    return contactShadowTexture;
}

/**
 * Dựng một nhân vật low-poly cao khoảng 1,72 m, đứng trên mặt sàn y = 0.
 * Trả về group có group.userData.update(delta, walkAmount) để chạy hoạt cảnh.
 */
function createCharacter(options = {}) {
    const {
        name = 'character',
        skin = 0xf1c9a5,
        hair = 0x241812,
        top = 0xeef1f5,
        bottom = 0x2f394a,
        shoes = 0x241f1c,
        accent = 0x8f1820,
        goldTrim = 0xd7b45b,
        style = 'visitor',
        lashes = false
    } = options;

    const skinMaterial = new THREE.MeshStandardMaterial({ color: skin, roughness: 0.88 });
    const headMaterial = new THREE.MeshStandardMaterial({
        map: makeHeadTexture(`${name}-head`, skin, { lashes }),
        roughness: 0.88
    });
    const hairMaterial = new THREE.MeshStandardMaterial({ color: hair, roughness: 0.66 });
    const topMaterial = new THREE.MeshStandardMaterial({ color: top, roughness: 0.85 });
    const bottomMaterial = new THREE.MeshStandardMaterial({ color: bottom, roughness: 0.88 });
    const shoeMaterial = new THREE.MeshStandardMaterial({ color: shoes, roughness: 0.55 });
    const accentMaterial = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.72 });
    const trimMaterial = new THREE.MeshStandardMaterial({ color: goldTrim, roughness: 0.36, metalness: 0.42 });

    const group = new THREE.Group();
    group.name = name;
    const body = new THREE.Group();
    group.add(body);

    const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.05, 1.05),
        new THREE.MeshBasicMaterial({ map: getContactShadowTexture(), transparent: true, depthWrite: false, opacity: 0.9 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.012;
    shadow.renderOrder = -1;
    group.add(shadow);

    // Chân: mỗi chân là một pivot ở hông để đung đưa khi bước đi.
    const legs = [];
    [-1, 1].forEach(side => {
        const pivot = new THREE.Group();
        pivot.position.set(side * 0.105, 0.84, 0);
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.066, 0.8, 10), bottomMaterial);
        leg.position.y = -0.4;
        pivot.add(leg);
        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.085, 0.25), shoeMaterial);
        shoe.position.set(0, -0.8, 0.035);
        pivot.add(shoe);
        body.add(pivot);
        legs.push(pivot);
    });

    const hip = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.165, 0.2, 12), bottomMaterial);
    hip.position.y = 0.92;
    body.add(hip);

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.178, 0.52, 14), topMaterial);
    torso.position.y = 1.2;
    body.add(torso);

    const shoulders = new THREE.Mesh(new THREE.SphereGeometry(0.207, 14, 10), topMaterial);
    shoulders.scale.set(1, 0.6, 0.82);
    shoulders.position.y = 1.44;
    body.add(shoulders);

    // Tay: pivot ở vai.
    const arms = [];
    [-1, 1].forEach(side => {
        const pivot = new THREE.Group();
        pivot.position.set(side * 0.215, 1.42, 0);
        pivot.rotation.z = side * 0.07;
        const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.046, 0.44, 10), topMaterial);
        sleeve.position.y = -0.22;
        pivot.add(sleeve);
        const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.042, 0.22, 10), skinMaterial);
        forearm.position.y = -0.54;
        pivot.add(forearm);
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 8), skinMaterial);
        hand.position.y = -0.66;
        pivot.add(hand);
        body.add(pivot);
        arms.push(pivot);
    });

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.058, 0.1, 10), skinMaterial);
    neck.position.y = 1.52;
    body.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.y = 1.64;
    body.add(headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.145, 20, 16), headMaterial);
    head.scale.set(0.94, 1.06, 0.95);
    headGroup.add(head);

    const hairCap = new THREE.Mesh(
        new THREE.SphereGeometry(0.152, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.44),
        hairMaterial
    );
    hairCap.scale.set(0.96, 1.08, 0.98);
    hairCap.rotation.x = 0.16;
    headGroup.add(hairCap);

    const backHair = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 18, 14, Math.PI * 1.08, Math.PI * 0.84, Math.PI * 0.08, Math.PI * 0.66),
        hairMaterial
    );
    backHair.scale.set(0.98, 1.06, 1.0);
    headGroup.add(backHair);

    let guideFlag = null;

    if (style === 'guide') {
        // Áo dài: hai tà dài trước sau, cổ đứng và dải viền kim tuyến.
        const tunic = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.235, 0.62, 16, 1, true), topMaterial);
        tunic.position.y = 1.16;
        body.add(tunic);

        [0.098, -0.098].forEach((z, index) => {
            const flap = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.66, 0.022), topMaterial);
            flap.position.set(0, 0.68, z);
            flap.rotation.x = index === 0 ? -0.03 : 0.03;
            body.add(flap);
        });

        const sash = new THREE.Mesh(new THREE.CylinderGeometry(0.198, 0.198, 0.075, 16), accentMaterial);
        sash.position.y = 1.0;
        body.add(sash);

        const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.082, 0.09, 12, 1, true), accentMaterial);
        collar.position.y = 1.5;
        body.add(collar);

        const placket = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.44, 0.012), trimMaterial);
        placket.position.set(0.052, 1.25, 0.185);
        body.add(placket);

        // Thẻ tên hướng dẫn viên.
        const badge = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.08, 0.012), trimMaterial);
        badge.position.set(-0.115, 1.31, 0.178);
        body.add(badge);

        // Búi tóc dài sau gáy.
        const bun = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 12), hairMaterial);
        bun.position.set(0, -0.03, -0.14);
        headGroup.add(bun);
        const ponytail = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.05, 0.46, 10), hairMaterial);
        ponytail.position.set(0, 1.34, -0.14);
        ponytail.rotation.x = -0.12;
        body.add(ponytail);

        // Cây cờ hướng dẫn cầm ở tay trái.
        guideFlag = new THREE.Group();
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.72, 8), trimMaterial);
        pole.position.y = 0.18;
        guideFlag.add(pole);
        const cloth = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.19), new THREE.MeshStandardMaterial({
            color: accent, roughness: 0.78, side: THREE.DoubleSide
        }));
        cloth.position.set(0.152, 0.46, 0);
        guideFlag.add(cloth);
        const star = new THREE.Mesh(new THREE.CircleGeometry(0.045, 5), new THREE.MeshBasicMaterial({ color: 0xffde00, side: THREE.DoubleSide }));
        star.position.set(0.152, 0.46, 0.006);
        star.rotation.z = Math.PI;
        guideFlag.add(star);
        guideFlag.position.set(0.055, -0.6, 0.06);
        guideFlag.rotation.x = -0.22;
        arms[1].add(guideFlag);
        arms[1].rotation.x = -0.35;
        arms[1].rotation.z = 0.16;
    } else {
        // Khách tham quan: thẻ đeo cổ của bảo tàng.
        const lanyard = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.008, 6, 16, Math.PI), accentMaterial);
        lanyard.position.set(0, 1.46, 0.03);
        lanyard.rotation.x = Math.PI / 2;
        body.add(lanyard);
        const card = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.01), trimMaterial);
        card.position.set(0, 1.31, 0.183);
        body.add(card);
    }

    group.traverse(object => {
        if (object.isMesh) {
            object.castShadow = false;
            object.receiveShadow = false;
        }
    });

    const state = { phase: Math.random() * Math.PI * 2, walk: 0 };
    group.userData.update = (delta, walkAmount = 0) => {
        state.walk += (walkAmount - state.walk) * Math.min(1, delta * 9);
        state.phase += delta * (5.2 + state.walk * 3.4);
        const swing = Math.sin(state.phase) * 0.62 * state.walk;
        const idle = Math.sin(state.phase * 0.34) * 0.035;

        legs[0].rotation.x = swing;
        legs[1].rotation.x = -swing;
        arms[0].rotation.x = -swing * 0.72 + idle;
        if (style !== 'guide') arms[1].rotation.x = swing * 0.72 - idle;
        else arms[1].rotation.x = -0.35 + idle * 0.6;

        body.position.y = Math.abs(Math.sin(state.phase)) * 0.035 * state.walk;
        body.rotation.z = Math.sin(state.phase) * 0.02 * state.walk;
        if (guideFlag) guideFlag.rotation.z = Math.sin(state.phase * 0.6) * 0.08;
    };
    group.userData.headGroup = headGroup;
    return group;
}

// --- CAMERA RENDER ---
const viewCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
viewCamera.position.copy(camera.position);
scene.add(viewCamera);

let isThirdPerson = true;
const thirdPersonOffset = new THREE.Vector3(0.78, 0.55, 3.55); // phải · cao · lùi sau
const cameraCandidate = new THREE.Vector3();
const cameraDesired = new THREE.Vector3();
const cameraOffsetWorld = new THREE.Vector3();
const playerEuler = new THREE.Euler(0, 0, 0, 'YXZ');
let viewCameraInitialised = false;

const playerAvatar = createCharacter({
    name: 'player-avatar',
    skin: 0xf0c6a0,
    hair: 0x22160f,
    top: 0xe7ebf2,
    bottom: 0x333b4d,
    shoes: 0x221c19,
    accent: 0x8f1820
});
playerAvatar.visible = isThirdPerson;
scene.add(playerAvatar);

function getPlayerYaw() {
    playerEuler.setFromQuaternion(camera.quaternion, 'YXZ');
    return playerEuler.y;
}

/**
 * Camera thứ ba chỉ được phép nằm trong vùng người chơi đi lại được, nhờ đó
 * nó không bao giờ xuyên qua tường hay lọt ra ngoài toà nhà.
 */
function isOpenCameraSpot(position) {
    if (position.y < 0.35) return false;
    if (position.z > entranceZ) {
        return position.x >= exteriorBounds.minX - 1.5 && position.x <= exteriorBounds.maxX + 1.5 &&
            position.z <= exteriorBounds.maxZ + 2.5;
    }
    if (Math.abs(position.x) > roomWidth / 2 - 0.25) return false;
    if (position.z < -roomDepth / 2 + 0.25) return false;
    if (isAtMainEntrance(position) && position.z >= entranceZ - 2.2 && position.z <= entranceZ + 2.2) return true;
    if (pointInBounds(position, museumLayout.lobby, 0.15)) return true;
    if (pointInBounds(position, museumLayout.transition, 0.1)) return true;
    if (pointInBounds(position, museumLayout.corridor, 0.15)) return true;
    return museumRooms.some(room => pointInBounds(position, room.bounds, 0.2));
}

function updateViewCamera(delta, snap = false) {
    if (!isThirdPerson) {
        viewCamera.position.copy(camera.position);
        viewCamera.quaternion.copy(camera.quaternion);
        return;
    }

    cameraOffsetWorld.copy(thirdPersonOffset).applyQuaternion(camera.quaternion);
    cameraDesired.copy(camera.position).add(cameraOffsetWorld);

    if (!isOpenCameraSpot(cameraDesired)) {
        let resolved = false;
        for (let ratio = 0.85; ratio >= 0.2; ratio -= 0.13) {
            cameraCandidate.copy(camera.position).addScaledVector(cameraOffsetWorld, ratio);
            if (isOpenCameraSpot(cameraCandidate)) {
                cameraDesired.copy(cameraCandidate);
                resolved = true;
                break;
            }
        }
        if (!resolved) cameraDesired.copy(camera.position).addScaledVector(cameraOffsetWorld, 0.14);
    }

    if (snap || !viewCameraInitialised || viewCamera.position.distanceTo(cameraDesired) > 6) {
        viewCamera.position.copy(cameraDesired);
        viewCameraInitialised = true;
    } else {
        viewCamera.position.lerp(cameraDesired, Math.min(1, delta * 13));
    }
    viewCamera.quaternion.copy(camera.quaternion);
}

function updatePlayerAvatar(delta) {
    playerAvatar.visible = isThirdPerson;
    if (!isThirdPerson) return;
    playerAvatar.position.set(camera.position.x, 0, camera.position.z);
    const targetYaw = getPlayerYaw();
    // Quay mượt theo hướng nhìn, tránh giật khi xoay chuột nhanh.
    const diff = Math.atan2(Math.sin(targetYaw - playerAvatar.rotation.y), Math.cos(targetYaw - playerAvatar.rotation.y));
    playerAvatar.rotation.y += diff * Math.min(1, delta * 12);
    const planarSpeed = Math.hypot(velocity.x, velocity.z);
    playerAvatar.userData.update(delta, THREE.MathUtils.clamp(planarSpeed / 6, 0, 1));
}

const viewToggleBtn = document.getElementById('view-toggle-btn');
const interactionHintLabel = document.getElementById('interaction-hint');

function syncViewToggleButton() {
    if (!viewToggleBtn) return;
    viewToggleBtn.setAttribute('aria-pressed', String(isThirdPerson));
    viewToggleBtn.querySelector('span:last-child').textContent = isThirdPerson ? 'Góc nhìn 3' : 'Góc nhìn 1';
    viewToggleBtn.querySelector('.button-symbol').textContent = isThirdPerson ? '◍' : '◉';
    viewToggleBtn.title = isThirdPerson
        ? 'Đang ở góc nhìn thứ ba · Phím V để đổi'
        : 'Đang ở góc nhìn thứ nhất · Phím V để đổi';
}

function toggleViewMode() {
    isThirdPerson = !isThirdPerson;
    playerAvatar.visible = isThirdPerson;
    viewCameraInitialised = false;
    syncViewToggleButton();
    updateViewCamera(0.016, true);
}

syncViewToggleButton();

if (viewToggleBtn) {
    viewToggleBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleViewMode();
    });
}

/* =====================================================================
   THUYẾT MINH TIẾNG VIỆT
   Mọi lời thuyết minh đã được thu sẵn thành file MP3 bằng giọng nữ tiếng
   Việt (thư mục audio/thuyet-minh), nên máy nào cũng nghe cùng một giọng
   Việt tự nhiên, không phụ thuộc giọng đọc cài trong trình duyệt.
   Tên file là mã băm FNV-1a của câu thoại: đổi câu chữ thì cần chạy lại
   tools/tao-thuyet-minh.py để thu lại. Câu nào chưa có file sẽ dùng giọng
   tiếng Việt của trình duyệt (nếu có), không bao giờ dùng giọng nước ngoài.
   ===================================================================== */

const NARRATION_AUDIO_DIR = './audio/thuyet-minh/';
const RECORDED_VOICE = 'recorded';
const speechEngine = window.speechSynthesis || null;
const voiceToggleBtn = document.getElementById('voice-toggle-btn');
const voiceSelect = document.getElementById('voice-select');
const voiceStatus = document.getElementById('voice-status');
const voiceVolumeSlider = document.getElementById('voice-volume-slider');
const voiceRateSlider = document.getElementById('voice-rate-slider');
const captionBox = document.getElementById('guide-caption');
const captionName = document.getElementById('guide-caption-name');
const captionText = document.getElementById('guide-caption-text');
const captionStopBtn = document.getElementById('guide-caption-stop');
const panelSpeakBtn = document.getElementById('panel-speak-btn');
const panelSpeakLabel = document.getElementById('panel-speak-label');

const GUIDE_NAME = 'Hướng dẫn viên Hương';

const narrationState = {
    enabled: true,
    speaking: false,
    voiceMode: RECORDED_VOICE,
    voice: null,
    volume: 1,
    rate: 0.95,
    queue: [],
    lastText: '',
    lastKey: null,
    captionTimer: null,
    keepAliveTimer: null,
    spokenAreas: new Set(),
    token: 0
};

// --- Kho lời thu sẵn ---
const recordedClips = { available: null };
const narrationAudio = new Audio();
narrationAudio.preload = 'auto';

function normalizeNarrationText(text) {
    return String(text).replace(/\s+/g, ' ').trim();
}

/** FNV-1a 32 bit trên các byte UTF-8, trùng với công cụ thu âm. */
function narrationClipId(text) {
    const bytes = new TextEncoder().encode(normalizeNarrationText(text));
    let hash = 0x811c9dc5;
    for (let i = 0; i < bytes.length; i++) {
        hash ^= bytes[i];
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, '0');
}

fetch(`${NARRATION_AUDIO_DIR}manifest.json`)
    .then(response => (response.ok ? response.json() : null))
    .then(data => {
        recordedClips.available = new Set(data?.clips || []);
        refreshVoiceList();
    })
    .catch(() => {
        recordedClips.available = new Set();
        refreshVoiceList();
    });

function hasRecordedClip(text) {
    // Danh mục chưa tải xong thì cứ thử phát; lỗi sẽ tự chuyển sang phương án dự phòng.
    if (!recordedClips.available) return true;
    return recordedClips.available.has(narrationClipId(text));
}

let musicDucked = false;
function applyMusicVolume() {
    try {
        const base = bgmSlider ? parseFloat(bgmSlider.value) : 0.2;
        if (typeof bgmAudio !== 'undefined' && bgmAudio) {
            bgmAudio.setVolume(musicDucked ? base * 0.26 : base);
        }
    } catch (error) {
        /* Nhạc nền chưa sẵn sàng: bỏ qua. */
    }
}

function duckMusic(shouldDuck) {
    if (musicDucked === shouldDuck) return;
    musicDucked = shouldDuck;
    applyMusicVolume();
}

function setCaption(text, speaker = GUIDE_NAME) {
    if (!captionBox) return;
    captionName.textContent = speaker;
    captionText.textContent = text;
    captionBox.classList.remove('hidden');
    captionBox.classList.add('speaking');
    if (narrationState.captionTimer) clearTimeout(narrationState.captionTimer);
}

function fadeCaption(delay = 4200) {
    if (!captionBox) return;
    captionBox.classList.remove('speaking');
    if (narrationState.captionTimer) clearTimeout(narrationState.captionTimer);
    narrationState.captionTimer = setTimeout(() => captionBox.classList.add('hidden'), delay);
}

function markSpeaking(isSpeaking) {
    narrationState.speaking = isSpeaking;
    duckMusic(isSpeaking);
    if (voiceToggleBtn) voiceToggleBtn.classList.toggle('is-speaking', isSpeaking && narrationState.enabled);
    if (captionBox) captionBox.classList.toggle('speaking', isSpeaking);
    if (panelSpeakLabel) panelSpeakLabel.textContent = isSpeaking ? 'Dừng thuyết minh' : 'Nghe thuyết minh';
    if (typeof onNarrationStateChange === 'function') onNarrationStateChange(isSpeaking);
}

function finishNarration(token) {
    if (token !== narrationState.token) return;
    markSpeaking(false);
    fadeCaption();
}

/** Chrome cắt ngang các câu dài, nên giọng dự phòng được tách thành từng đoạn ngắn. */
function splitIntoChunks(text, limit = 170) {
    const sentences = text.replace(/\s+/g, ' ').trim().split(/(?<=[.!?…:;])\s+/);
    const chunks = [];
    let current = '';
    sentences.forEach(sentence => {
        if ((current + ' ' + sentence).trim().length <= limit) {
            current = (current + ' ' + sentence).trim();
        } else {
            if (current) chunks.push(current);
            if (sentence.length <= limit) {
                current = sentence;
            } else {
                const words = sentence.split(' ');
                let piece = '';
                words.forEach(word => {
                    if ((piece + ' ' + word).trim().length <= limit) piece = (piece + ' ' + word).trim();
                    else { if (piece) chunks.push(piece); piece = word; }
                });
                current = piece;
            }
        }
    });
    if (current) chunks.push(current);
    return chunks;
}

function haltAllVoices() {
    narrationState.queue = [];
    try { narrationAudio.pause(); } catch (error) { /* bỏ qua */ }
    if (speechEngine) {
        try { speechEngine.cancel(); } catch (error) { /* bỏ qua */ }
    }
    if (narrationState.keepAliveTimer) {
        clearInterval(narrationState.keepAliveTimer);
        narrationState.keepAliveTimer = null;
    }
}

function stopNarration() {
    narrationState.token++;
    haltAllVoices();
    markSpeaking(false);
    fadeCaption(900);
}

function speakChunkQueue(token) {
    if (token !== narrationState.token) return;
    if (!speechEngine || !narrationState.enabled) return;
    const chunk = narrationState.queue.shift();
    if (chunk === undefined) {
        if (narrationState.keepAliveTimer) {
            clearInterval(narrationState.keepAliveTimer);
            narrationState.keepAliveTimer = null;
        }
        finishNarration(token);
        return;
    }
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.lang = 'vi-VN';
    if (narrationState.voice) utterance.voice = narrationState.voice;
    utterance.rate = narrationState.rate;
    utterance.pitch = 1.04;
    utterance.volume = narrationState.volume;
    utterance.onend = () => speakChunkQueue(token);
    utterance.onerror = () => speakChunkQueue(token);
    speechEngine.speak(utterance);
}

function getVietnameseBrowserVoices() {
    if (!speechEngine) return [];
    return speechEngine.getVoices().filter(voice => (voice.lang || '').toLowerCase().replace('_', '-').startsWith('vi') || /vietnam|tiếng việt/i.test(voice.name));
}

function speakWithBrowserVoice(text, token) {
    const voices = getVietnameseBrowserVoices();
    if (!narrationState.voice || !voices.includes(narrationState.voice)) narrationState.voice = voices[0] || null;
    // Không có giọng Việt thì chỉ hiện phụ đề, tránh giọng nước ngoài đọc tiếng Việt.
    if (!narrationState.voice) {
        markSpeaking(false);
        fadeCaption(Math.min(14000, 3500 + text.length * 45));
        return;
    }
    narrationState.queue = splitIntoChunks(text);
    markSpeaking(true);
    if (!narrationState.keepAliveTimer) {
        // Một số bản Chrome tự ngắt sau ~15 giây: pause/resume giữ dòng đọc liên tục.
        narrationState.keepAliveTimer = setInterval(() => {
            if (speechEngine.speaking && !speechEngine.paused) {
                speechEngine.pause();
                speechEngine.resume();
            }
        }, 9000);
    }
    speakChunkQueue(token);
}

function playRecordedClip(text, token) {
    narrationAudio.onended = () => finishNarration(token);
    narrationAudio.onerror = () => {
        if (token !== narrationState.token) return;
        speakWithBrowserVoice(text, token);
    };
    narrationAudio.src = `${NARRATION_AUDIO_DIR}${narrationClipId(text)}.mp3`;
    narrationAudio.volume = narrationState.volume;
    narrationAudio.playbackRate = THREE.MathUtils.clamp(narrationState.rate / 0.95, 0.6, 1.5);
    markSpeaking(true);
    const playing = narrationAudio.play();
    if (playing && typeof playing.catch === 'function') {
        playing.catch(error => {
            if (token !== narrationState.token) return;
            // Trình duyệt chặn tự phát: giữ phụ đề, khách bấm "Nghe thuyết minh" để nghe lại.
            if (error && error.name === 'NotAllowedError') {
                markSpeaking(false);
                fadeCaption(9000);
            } else {
                speakWithBrowserVoice(text, token);
            }
        });
    }
}

/**
 * @param {string} text  Nội dung thuyết minh
 * @param {object} opts  { key, speaker, force }
 */
function narrate(text, opts = {}) {
    const { key = null, speaker = GUIDE_NAME, force = false } = opts;
    if (!text) return;
    if (!force && key && key === narrationState.lastKey && narrationState.speaking) return;

    narrationState.lastKey = key;
    narrationState.lastText = text;
    setCaption(text, speaker);

    const token = ++narrationState.token;
    haltAllVoices();

    if (!narrationState.enabled) {
        markSpeaking(false);
        fadeCaption(6500);
        return;
    }

    if (narrationState.voiceMode === RECORDED_VOICE && hasRecordedClip(text)) {
        playRecordedClip(text, token);
    } else {
        speakWithBrowserVoice(text, token);
    }
}

function replayNarration() {
    if (narrationState.speaking) {
        stopNarration();
        return;
    }
    if (narrationState.lastText) narrate(narrationState.lastText, { force: true });
}

// --- Chọn giọng đọc: giọng thu sẵn luôn đứng đầu, sau đó chỉ các giọng tiếng Việt của máy ---
function refreshVoiceList() {
    const browserVoices = getVietnameseBrowserVoices();
    const recordedReady = !recordedClips.available || recordedClips.available.size > 0;

    if (voiceSelect) {
        const previous = narrationState.voiceMode === RECORDED_VOICE ? RECORDED_VOICE : (narrationState.voice?.voiceURI || '');
        voiceSelect.innerHTML = '';
        const recordedOption = document.createElement('option');
        recordedOption.value = RECORDED_VOICE;
        recordedOption.textContent = 'Giọng Hương · tiếng Việt thu sẵn';
        voiceSelect.appendChild(recordedOption);
        browserVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.voiceURI;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
        voiceSelect.value = previous || RECORDED_VOICE;
        if (!voiceSelect.value) voiceSelect.value = RECORDED_VOICE;
    }

    if (voiceStatus) {
        if (narrationState.voiceMode === RECORDED_VOICE) {
            voiceStatus.textContent = recordedReady
                ? 'Lời thuyết minh do giọng nữ tiếng Việt đọc sẵn, nghe giống nhau trên mọi thiết bị.'
                : 'Chưa tải được file thuyết minh; đang dùng giọng tiếng Việt của máy nếu có.';
        } else {
            voiceStatus.textContent = `Đang dùng giọng tiếng Việt của máy: ${narrationState.voice?.name || ''}.`;
        }
    }
}

if (speechEngine) {
    speechEngine.onvoiceschanged = refreshVoiceList;
    setTimeout(refreshVoiceList, 800);
}
refreshVoiceList();

if (voiceSelect) {
    voiceSelect.addEventListener('change', (event) => {
        if (event.target.value === RECORDED_VOICE) {
            narrationState.voiceMode = RECORDED_VOICE;
        } else {
            narrationState.voiceMode = 'browser';
            narrationState.voice = getVietnameseBrowserVoices().find(voice => voice.voiceURI === event.target.value) || null;
        }
        refreshVoiceList();
        narrate(VOICE_SAMPLE_TEXT, { force: true });
    });
}

if (voiceVolumeSlider) {
    voiceVolumeSlider.addEventListener('input', (event) => {
        narrationState.volume = parseFloat(event.target.value);
        narrationAudio.volume = narrationState.volume;
    });
}

if (voiceRateSlider) {
    voiceRateSlider.addEventListener('input', (event) => {
        narrationState.rate = parseFloat(event.target.value);
        narrationAudio.playbackRate = THREE.MathUtils.clamp(narrationState.rate / 0.95, 0.6, 1.5);
    });
}

function setNarrationEnabled(enabled) {
    narrationState.enabled = enabled;
    if (voiceToggleBtn) {
        voiceToggleBtn.classList.toggle('is-on', enabled);
        voiceToggleBtn.classList.toggle('is-off', !enabled);
        voiceToggleBtn.setAttribute('aria-pressed', String(enabled));
    }
    if (!enabled) stopNarration();
}

if (voiceToggleBtn) {
    voiceToggleBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        setNarrationEnabled(!narrationState.enabled);
        if (narrationState.enabled && narrationState.lastText) narrate(narrationState.lastText, { force: true });
    });
}

if (captionStopBtn) {
    captionStopBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        stopNarration();
        captionBox.classList.add('hidden');
    });
}

if (panelSpeakBtn) {
    panelSpeakBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        replayNarration();
    });
}

/* --- LỜI THUYẾT MINH CHO TỪNG KHÔNG GIAN --- */
const VOICE_SAMPLE_TEXT = 'Xin chào, đây là giọng thuyết minh của Bảo tàng Hồ Chí Minh.';
const TOUR_COMPLETE_TEXT = 'Chúc mừng bạn đã hoàn tất chuyến tham quan Bảo tàng Hồ Chí Minh. Cảm ơn bạn đã dành thời gian lắng nghe những câu chuyện lịch sử. Hẹn gặp lại bạn trong hành trình sau.';
const ALL_DONE_TEXT = 'Bạn đã hoàn thành toàn bộ hành trình tham quan. Cảm ơn bạn đã lắng nghe những câu chuyện lịch sử của bảo tàng.';

const areaNarration = {
    welcome: 'Xin chào và chào mừng quý khách đến với Bảo tàng Hồ Chí Minh. Tôi là Hương, hướng dẫn viên sẽ đồng hành cùng bạn trong chuyến tham quan hôm nay. Chúng ta đang đứng ở khuôn viên phía trước bảo tàng. Mời bạn đi dọc lối chính, giữa hai hồ sen và hàng cây hoa, để tới hàng cột trắng của tiền sảnh.',
    courtyard: 'Đây là khuôn viên bảo tàng. Lối đi chính lát đá chạy giữa hai hồ sen, hai bên là hàng cây xanh, cây hoa mai, hoa ban và những khóm tre. Trước tiền sảnh, cờ Tổ quốc và cờ Đảng tung bay trang trọng. Bên trái là đài tưởng niệm với phù điêu chân dung Chủ tịch Hồ Chí Minh, bên phải là bia đá khắc lời của Người.',
    lobby: 'Chúng ta đang ở sảnh chính. Từ đây, hành lang trung tâm dẫn tới sáu không gian trưng bày theo trình tự thời gian, bắt đầu từ hành trình tìm đường cứu nước cho tới di sản tư tưởng của Chủ tịch Hồ Chí Minh.',
    corridor: 'Đây là hành lang triển lãm. Các phòng trưng bày nằm ở hai bên. Bạn hãy nhìn biển số phòng phía trên cửa, rồi bấm chuột vào cánh cửa để bước vào.'
};

const roomNarration = {
    room1: 'Phòng số một: Hành trình tìm đường cứu nước và sự hình thành tư tưởng. Không gian này kể lại chặng đường bắt đầu từ Bến Nhà Rồng ngày năm tháng sáu năm 1911, khi người thanh niên Nguyễn Tất Thành rời Tổ quốc ra đi. Mô hình con tàu hơi nước gợi nhắc chuyến đi ấy, còn quả địa cầu tượng trưng cho hành trình qua nhiều quốc gia, cho tới Đại hội Tua năm 1920.',
    room2: 'Phòng số hai: Độc lập dân tộc và chủ nghĩa xã hội. Không gian tái hiện mùa thu năm 1945, khi Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình, khai sinh nước Việt Nam Dân chủ Cộng hòa. Bục phát biểu, micro và chiếc ra-đi-ô cổ gợi lại thời khắc tiếng nói độc lập vang tới mọi miền đất nước.',
    room3: 'Phòng số ba: Đảng Cộng sản và Nhà nước của nhân dân. Phòng trưng bày những hình ảnh về cuộc Tổng tuyển cử đầu tiên năm 1946 và phiên họp đầu tiên của Quốc hội khóa một. Hòm phiếu, máy đánh chữ và cuốn sách luật tượng trưng cho quyền làm chủ của nhân dân và quá trình xây dựng một nhà nước còn non trẻ.',
    room4: 'Phòng số bốn: Đại đoàn kết dân tộc và đoàn kết quốc tế. Tư tưởng xuyên suốt của Chủ tịch Hồ Chí Minh là đoàn kết, đoàn kết, đại đoàn kết. Cụm tượng người dân, hình chim bồ câu và lá thư trong phòng là biểu tượng cho sức mạnh của khối đại đoàn kết toàn dân và tình hữu nghị giữa Việt Nam với bạn bè năm châu.',
    room5: 'Phòng số năm: Văn hóa, đạo đức và con người. Đây là không gian gần gũi nhất của chuyến tham quan, với góc bàn làm việc giản dị, chiếc ghế gỗ mộc mạc, tách trà và đôi dép cao su. Những hiện vật bình dị ấy nói lên nếp sống thanh bạch, cần kiệm liêm chính và tình yêu thương con người của Chủ tịch Hồ Chí Minh.',
    room6: 'Phòng số sáu: Không gian tư liệu và phim. Mời bạn ngồi xuống và hướng lên màn ảnh lớn phía trước để xem thước phim tư liệu về cuộc đời và di sản tư tưởng của Chủ tịch Hồ Chí Minh. Bạn hãy bấm vào màn hình để bắt đầu, và nhớ bật âm thanh của phim.'
};

function narrateArea(areaKey, { once = true } = {}) {
    const text = areaNarration[areaKey];
    if (!text) return;
    if (once && narrationState.spokenAreas.has(areaKey)) return;
    narrationState.spokenAreas.add(areaKey);
    narrate(text, { key: `area-${areaKey}` });
}

function narrateRoom(room) {
    if (!room) return;
    const text = roomNarration[room.id];
    if (!text) return;
    narrate(text, { key: `room-${room.id}` });
}

function artifactNarrationText(artifactId) {
    const data = artifactData[artifactId];
    if (!data) return '';
    return `${data.title}. Niên đại: ${data.year}. ${data.desc}`;
}

function narrateArtifact(artifactId) {
    const text = artifactNarrationText(artifactId);
    if (!text) return;
    narrate(text, { key: `artifact-${artifactId}` });
}

// Các câu gợi ý của hướng dẫn viên (được thu sẵn cho từng phòng và từng hiện vật).
function remainingArtifactTipText(artifactId) {
    return `Trong phòng này vẫn còn hiện vật bạn chưa xem. Hãy tới gần hiện vật ${artifactData[artifactId].title}, rồi bấm chuột để nghe giới thiệu.`;
}

function roomCompleteTipText(room) {
    return `Bạn đã xem hết hiện vật của phòng số ${Number(room.number)}. Mời bạn quay ra hành lang để sang phòng tiếp theo.`;
}

function nextRoomTipText(room) {
    return `Mời bạn tới phòng số ${Number(room.number)}: ${room.shortName}, nằm ở phía ${room.side < 0 ? 'bên trái' : 'bên phải'} hành lang.`;
}

/** Danh sách mọi câu thuyết minh; công cụ tools/tao-thuyet-minh.py dùng để thu âm. */
function getAllNarrationTexts() {
    const texts = [
        VOICE_SAMPLE_TEXT, TOUR_COMPLETE_TEXT, ALL_DONE_TEXT,
        ...Object.values(areaNarration),
        ...Object.values(roomNarration),
        ...Object.keys(artifactData).map(artifactNarrationText)
    ];
    museumRooms.forEach(room => {
        texts.push(roomCompleteTipText(room), nextRoomTipText(room));
        room.artifacts.forEach(id => { if (artifactData[id]) texts.push(remainingArtifactTipText(id)); });
    });
    return [...new Set(texts.map(normalizeNarrationText))];
}
// Cho công cụ thu âm lấy danh sách câu từ Console trình duyệt.
window.museumNarrationTexts = getAllNarrationTexts;

const exteriorLight = new THREE.DirectionalLight(0xfff3d6, 1.3);
exteriorLight.position.set(8, 14, 25);
exteriorLight.castShadow = true;
scene.add(exteriorLight);

const nightLightsGroup = new THREE.Group();
nightLightsGroup.name = 'night-lights';
nightLightsGroup.visible = false;
scene.add(nightLightsGroup);

// Day/night theme changes reuse the existing light rig. The values captured
// here are restored on every toggle, so lights are never duplicated.
let isNightMode = false;
const daySceneBackground = 0xcfd9df;
const nightSceneBackground = 0x101722;
const dayFogColor = 0xd3dde2;
const nightFogColor = 0x0f1626;
const lightingPresets = {
    day: {
        ambientScale: 1,
        exteriorScale: 1,
        pointScale: 1,
        spotScale: 1,
        nightLightsVisible: false
    },
    night: {
        ambientScale: 0.62,
        exteriorScale: 0.42,
        pointScale: 0.88,
        spotScale: 0.9,
        nightLightsVisible: true
    }
};

const activeFireworks = [];
const fireworkPalettes = [
    [0xffd166, 0xffffff],
    [0xff4d4d, 0xffffcc],
    [0xff9f43, 0xffffff],
    [0x70c1ff, 0xffffff]
];
const maxActiveFireworks = 5;
let fireworkSpawnTimer = 0;
const fireworkPatternNames = ['sphere', 'ring', 'chrysanthemum', 'willow', 'double'];

const fireworkSpawnZones = [
    { minX: -roomWidth * 0.44, maxX: -roomWidth * 0.28, minZ: entranceZ - 1.5, maxZ: entranceZ + 4 },
    { minX: -roomWidth * 0.14, maxX: roomWidth * 0.14, minZ: entranceZ - 3, maxZ: entranceZ - 1 },
    { minX: roomWidth * 0.28, maxX: roomWidth * 0.44, minZ: entranceZ - 1.5, maxZ: entranceZ + 4 }
];

function disposeFireworkPoints(points) {
    if (!points) return;
    points.parent?.remove(points);
    points.geometry.dispose();
    points.material.dispose();
}

function createExplosionLayer(firework, count, color, size, speedMin, speedMax, lifeMin, lifeMax, pattern, gravity) {
    const positions = new Float32Array(count * 3);
    const velocities = new Array(count);
    const ages = new Float32Array(count);
    const lives = new Float32Array(count);

    for (let index = 0; index < count; index++) {
        // Uniform random 3D direction, with a restrained pattern-specific
        // bias so every burst still has a strong volumetric silhouette.
        const direction = new THREE.Vector3(
            THREE.MathUtils.randFloatSpread(2),
            THREE.MathUtils.randFloatSpread(2),
            THREE.MathUtils.randFloatSpread(2)
        ).normalize();
        if (pattern === 'ring') direction.y *= 0.18;
        else if (pattern === 'chrysanthemum') direction.y *= 0.9;
        else if (pattern === 'willow') direction.y = Math.abs(direction.y) * 0.55 + 0.18;
        direction.normalize();
        velocities[index] = direction.multiplyScalar(THREE.MathUtils.randFloat(speedMin, speedMax));
        lives[index] = THREE.MathUtils.randFloat(lifeMin, lifeMax);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
        color,
        map: fireworkParticleTexture,
        size,
        sizeAttenuation: true,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geometry, material);
    points.position.copy(firework.position);
    scene.add(points);
    return { points, positions, velocities, ages, lives, count, gravity };
}

function createFireworkExplosion(firework) {
    const [primaryColor, sparkColor] = firework.palette;
    const pattern = firework.pattern;
    firework.layers = [
        createExplosionLayer(firework, THREE.MathUtils.randInt(85, 115), 0xffffff, 0.18, 9.5, 13.5, 1.5, 2.3, pattern, 1.0),
        createExplosionLayer(firework, THREE.MathUtils.randInt(180, 250), primaryColor, 0.14, 7.5, 11.5, 2.0, 3.1, pattern, pattern === 'willow' ? 0.9 : 1.15),
        createExplosionLayer(firework, THREE.MathUtils.randInt(80, 125), sparkColor, 0.065, 9.5, 14.0, 2.4, 3.8, pattern, pattern === 'willow' ? 0.75 : 1.25)
    ];
    firework.secondaryTimer = pattern === 'double' ? THREE.MathUtils.randFloat(0.15, 0.3) : -1;
    firework.glowAge = 0;
    firework.phase = 'explosion';
    disposeFireworkPoints(firework.rocket);
    disposeFireworkPoints(firework.trail);
    firework.rocket = null;
    firework.trail = null;
}

function createExplosionGlow(firework) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
    const material = new THREE.PointsMaterial({
        map: fireworkParticleTexture,
        color: 0xffffff,
        size: 0.85,
        sizeAttenuation: true,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Points(geometry, material);
    glow.position.copy(firework.position);
    scene.add(glow);
    firework.glow = glow;
}

// Sprite-sheet fireworks replace the legacy point-burst renderer below. The
// sheet dimensions were verified from images/Firework.png: 1536x1280, with
// 256px square frames arranged as 6 columns by 5 rows.
let fireworkSheetReady = false;
let fireworkSheetColumns = 0;
let fireworkSheetRows = 0;
let fireworkSheetFrameCount = 0;
let spriteFireworkSpawnTimer = 0;
const pendingSpriteFireworks = [];
const fireworkTextureLoader = new THREE.TextureLoader();
const fireworkBaseTexture = fireworkTextureLoader.load(
    './images/Firework.png',
    texture => {
        const frameSize = 256;
        const width = texture.image.width;
        const height = texture.image.height;
        if (width % frameSize !== 0 || height % frameSize !== 0) {
            console.warn(`Firework.png dimensions ${width}x${height} are not a 256px frame grid`);
            return;
        }
        fireworkSheetColumns = width / frameSize;
        fireworkSheetRows = height / frameSize;
        fireworkSheetFrameCount = fireworkSheetColumns * fireworkSheetRows;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1 / fireworkSheetColumns, 1 / fireworkSheetRows);
        texture.needsUpdate = true;
        fireworkSheetReady = true;
    },
    undefined,
    error => console.error('Không thể tải images/Firework.png:', error)
);

function setFireworkSpriteFrame(texture, frame) {
    const frameX = frame % fireworkSheetColumns;
    const frameY = Math.floor(frame / fireworkSheetColumns);
    texture.offset.x = frameX / fireworkSheetColumns;
    texture.offset.y = 1 - (frameY + 1) / fireworkSheetRows;
}

function disposeSpriteFirework(firework) {
    if (!firework?.sprite) return;
    firework.sprite.parent?.remove(firework.sprite);
    const material = firework.sprite.material;
    const texture = material.map;
    material.dispose();
    texture?.dispose();
}

function spawnFireworkSprite() {
    if (!isNightMode || !fireworkSheetReady || activeFireworks.length >= maxActiveFireworks) return;
    const zone = fireworkSpawnZones[THREE.MathUtils.randInt(0, fireworkSpawnZones.length - 1)];
    const texture = fireworkBaseTexture.clone();
    texture.needsUpdate = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1 / fireworkSheetColumns, 1 / fireworkSheetRows);
    setFireworkSpriteFrame(texture, 0);

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        rotation: THREE.MathUtils.randFloat(0, Math.PI * 2)
    });
    const sprite = new THREE.Sprite(material);
    const sizeVariant = THREE.MathUtils.randFloat(0.85, 1.25);
    const baseSize = THREE.MathUtils.randFloat(5.4, 7.2) * sizeVariant;
    const frameRate = THREE.MathUtils.randFloat(21, 25);
    sprite.scale.set(baseSize, baseSize, 1);
    sprite.position.set(
        THREE.MathUtils.randFloat(zone.minX, zone.maxX),
        THREE.MathUtils.randFloat(11.5, 16.5),
        THREE.MathUtils.randFloat(zone.minZ, zone.maxZ)
    );
    sprite.renderOrder = 3;
    scene.add(sprite);

    activeFireworks.push({
        sprite,
        age: 0,
        frame: 0,
        frameRate,
        baseSize,
        lifetime: fireworkSheetFrameCount / frameRate,
        position: sprite.position
    });
}

function scheduleSpriteFireworkSalvo() {
    spawnFireworkSprite();
    if (Math.random() >= 0.28) return;
    pendingSpriteFireworks.push({ delay: THREE.MathUtils.randFloat(0.2, 0.5) });
    if (Math.random() < 0.45) pendingSpriteFireworks.push({ delay: THREE.MathUtils.randFloat(0.2, 0.5) });
}

function clearSpriteFireworks() {
    activeFireworks.forEach(disposeSpriteFirework);
    activeFireworks.length = 0;
    pendingSpriteFireworks.length = 0;
}

function updateFireworkSprites(delta) {
    if (!isNightMode) {
        if (activeFireworks.length || pendingSpriteFireworks.length) clearSpriteFireworks();
        return;
    }

    spriteFireworkSpawnTimer -= delta;
    if (spriteFireworkSpawnTimer <= 0) {
        scheduleSpriteFireworkSalvo();
        spriteFireworkSpawnTimer = THREE.MathUtils.randFloat(0.8, 1.8);
    }

    for (let index = pendingSpriteFireworks.length - 1; index >= 0; index--) {
        const pending = pendingSpriteFireworks[index];
        pending.delay -= delta;
        if (pending.delay <= 0) {
            spawnFireworkSprite();
            pendingSpriteFireworks.splice(index, 1);
        }
    }

    for (let index = activeFireworks.length - 1; index >= 0; index--) {
        const firework = activeFireworks[index];
        firework.age += delta;
        const progress = firework.age / firework.lifetime;
        firework.frame = Math.min(
            fireworkSheetFrameCount - 1,
            Math.floor(firework.age * firework.frameRate)
        );
        setFireworkSpriteFrame(firework.sprite.material.map, firework.frame);

        const scaleProgress = Math.min(1, progress / 0.62);
        const easedScale = scaleProgress * scaleProgress * (3 - 2 * scaleProgress);
        const scale = firework.baseSize * (0.2 + easedScale * 0.9);
        firework.sprite.scale.set(scale, scale, 1);
        firework.sprite.material.opacity = progress > 0.72
            ? Math.max(0, 1 - (progress - 0.72) / 0.28)
            : 1;

        if (firework.age >= firework.lifetime) {
            disposeSpriteFirework(firework);
            activeFireworks.splice(index, 1);
        }
    }
}

function spawnFirework() {
    if (!isNightMode || activeFireworks.length >= maxActiveFireworks) return;

    const zone = fireworkSpawnZones[THREE.MathUtils.randInt(0, fireworkSpawnZones.length - 1)];
    const start = new THREE.Vector3(
        THREE.MathUtils.randFloat(zone.minX, zone.maxX),
        0.35,
        THREE.MathUtils.randFloat(zone.minZ, zone.maxZ)
    );
    const targetY = THREE.MathUtils.randFloat(11.5, 16.5);
    const palette = fireworkPalettes[THREE.MathUtils.randInt(0, fireworkPalettes.length - 1)];
    const pattern = fireworkPatternNames[THREE.MathUtils.randInt(0, fireworkPatternNames.length - 1)];
    const trailCount = 16;
    const trailPositions = new Float32Array(trailCount * 3);
    for (let index = 0; index < trailCount; index++) {
        trailPositions[index * 3] = start.x;
        trailPositions[index * 3 + 1] = start.y;
        trailPositions[index * 3 + 2] = start.z;
    }
    const rocketGeometry = new THREE.BufferGeometry();
    rocketGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
    const rocketMaterial = new THREE.PointsMaterial({
        map: fireworkParticleTexture,
        color: 0xffffff,
        size: 0.22,
        sizeAttenuation: true,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    const rocket = new THREE.Points(rocketGeometry, rocketMaterial);
    rocket.position.copy(start);
    scene.add(rocket);

    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trailPositions, 3));
    const trailMaterial = new THREE.PointsMaterial({
        map: fireworkParticleTexture,
        color: palette[0],
        size: 0.09,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    const trail = new THREE.Points(trailGeometry, trailMaterial);
    scene.add(trail);

    const firework = {
        phase: 'rocket',
        rocket,
        trail,
        trailPositions,
        trailCount,
        points: null,
        position: start,
        velocity: new THREE.Vector3(0, THREE.MathUtils.randFloat(11.5, 14.5), 0),
        targetY,
        age: 0,
        palette,
        pattern,
        layers: [],
        glow: null,
        glowAge: 0,
        secondaryTimer: -1
    };
    activeFireworks.push(firework);
}

function clearFireworks() {
    activeFireworks.forEach(firework => {
        disposeFireworkPoints(firework.rocket);
        disposeFireworkPoints(firework.trail);
        firework.layers?.forEach(layer => disposeFireworkPoints(layer.points));
        disposeFireworkPoints(firework.glow);
    });
    activeFireworks.length = 0;
}

function updateFireworks(delta) {
    if (!isNightMode) {
        if (activeFireworks.length) clearFireworks();
        return;
    }

    fireworkSpawnTimer -= delta;
    if (fireworkSpawnTimer <= 0) {
        if (activeFireworks.length < maxActiveFireworks) spawnFirework();
        fireworkSpawnTimer = THREE.MathUtils.randFloat(1.2, 2.5);
    }

    for (let index = activeFireworks.length - 1; index >= 0; index--) {
        const firework = activeFireworks[index];
        if (firework.phase === 'rocket') {
            firework.age += delta;
            firework.position.addScaledVector(firework.velocity, delta);
            firework.rocket.position.copy(firework.position);
            for (let trailIndex = firework.trailCount - 1; trailIndex > 0; trailIndex--) {
                const targetOffset = trailIndex * 3;
                const sourceOffset = (trailIndex - 1) * 3;
                firework.trailPositions[targetOffset] = firework.trailPositions[sourceOffset];
                firework.trailPositions[targetOffset + 1] = firework.trailPositions[sourceOffset + 1];
                firework.trailPositions[targetOffset + 2] = firework.trailPositions[sourceOffset + 2];
            }
            firework.trailPositions[0] = firework.position.x;
            firework.trailPositions[1] = firework.position.y;
            firework.trailPositions[2] = firework.position.z;
            firework.trail.geometry.attributes.position.needsUpdate = true;
            firework.trail.material.opacity = Math.max(0.08, 0.5 - firework.age * 0.08);
            firework.velocity.y -= 1.0 * delta;
            if (firework.position.y >= firework.targetY) {
                createFireworkExplosion(firework);
                createExplosionGlow(firework);
            }
            continue;
        }

        if (firework.secondaryTimer >= 0) {
            firework.secondaryTimer -= delta;
            if (firework.secondaryTimer <= 0) {
                const secondaryColor = firework.palette[1];
                firework.layers.push(
                    createExplosionLayer(firework, 90, secondaryColor, 0.105, 6.5, 10.0, 1.7, 2.7, 'sphere', 1.15)
                );
                firework.secondaryTimer = -1;
            }
        }

        const updateLayer = layer => {
            let alive = false;
            for (let particle = 0; particle < layer.count; particle++) {
                const age = layer.ages[particle] + delta;
                layer.ages[particle] = age;
                if (age >= layer.lives[particle]) continue;
                alive = true;
                const velocity = layer.velocities[particle];
                velocity.y -= layer.gravity * delta;
                velocity.multiplyScalar(Math.pow(0.985, delta * 60));
                const offset = particle * 3;
                layer.positions[offset] += velocity.x * delta;
                layer.positions[offset + 1] += velocity.y * delta;
                layer.positions[offset + 2] += velocity.z * delta;
            }
            layer.points.geometry.attributes.position.needsUpdate = true;
            const progress = layer.ages.reduce((maxAge, age, particle) => Math.max(maxAge, age / layer.lives[particle]), 0);
            layer.points.material.opacity = Math.max(0, 1 - progress);
            return alive;
        };
        let anyLayerAlive = false;
        firework.layers.forEach(layer => {
            if (updateLayer(layer)) anyLayerAlive = true;
        });
        firework.glowAge += delta;
        if (firework.glow) {
            firework.glow.material.opacity = Math.max(0, 1 - firework.glowAge / 0.2);
            firework.glow.material.size = 0.85 + firework.glowAge * 1.3;
        }
        if (!anyLayerAlive) {
            firework.layers.forEach(layer => disposeFireworkPoints(layer.points));
            disposeFireworkPoints(firework.glow);
            activeFireworks.splice(index, 1);
        }
    }
}

function applyLightingMode() {
    const night = isNightMode;
    const preset = night ? lightingPresets.night : lightingPresets.day;
    if (night && !nightLightsGroup.visible) spriteFireworkSpawnTimer = THREE.MathUtils.randFloat(0.4, 0.9);
    if (!night) {
        spriteFireworkSpawnTimer = 0;
        clearSpriteFireworks();
    }
    scene.background.setHex(night ? nightSceneBackground : daySceneBackground);
    scene.fog.color.setHex(night ? nightFogColor : dayFogColor);
    nightLightsGroup.visible = preset.nightLightsVisible;
    updateSkyForTheme(night);

    scene.traverse(object => {
        if (!object.isLight) return;
        if (object.userData.dayIntensity === undefined) {
            object.userData.dayIntensity = object.intensity;
            object.userData.dayColor = object.color.getHex();
        }

        let intensityScale = 1;
        if (object === ambientLight) intensityScale = preset.ambientScale;
        else if (object === exteriorLight) intensityScale = preset.exteriorScale;
        else if (object.isPointLight) intensityScale = preset.pointScale;
        else if (object.isSpotLight) intensityScale = preset.spotScale;

        object.intensity = object.userData.dayIntensity * intensityScale;
        if (object === ambientLight) {
            object.color.setHex(night ? 0xb5c7df : object.userData.dayColor);
        } else if (object === exteriorLight) {
            object.color.setHex(night ? 0xb8c9e8 : object.userData.dayColor);
        }
    });

    if (typeof applyVisualNightMode === 'function') applyVisualNightMode(night);
    themeToggleBtn.setAttribute('aria-pressed', String(night));
    themeToggleBtn.title = night ? 'Chuyển sang chế độ ngày' : 'Chuyển sang chế độ đêm';
    themeToggleBtn.innerHTML = `<span class="button-symbol" aria-hidden="true">${night ? '☾' : '☀'}</span><span>${night ? 'Đêm' : 'Ngày'}</span>`;
}

function toggleDayNight() {
    isNightMode = !isNightMode;
    applyLightingMode();
}

themeToggleBtn.addEventListener('click', toggleDayNight);

// --- SIX MUSEUM ROOMS ---
const museumLayout = {
    lobby: { minX: -7.2, maxX: 7.2, minZ: 10.5, maxZ: roomDepth / 2 },
    corridor: { minX: -3.4, maxX: 3.4, minZ: -roomDepth / 2, maxZ: 11.8 },
    transition: { minX: -7.2, maxX: 7.2, minZ: 9.5, maxZ: 13.5 }
};
const corridorHalfWidth = Math.abs(museumLayout.corridor.maxX);
const partitionMaterial = new THREE.MeshStandardMaterial({ color: 0xf1eadb, roughness: 0.95 });

function addPartition(width, height, depth, x, z) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), partitionMaterial);
    wall.position.set(x, height / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);
}

// Room partitions are generated from museumRooms after its bounds are calculated.

const museumRooms = [
    { id: 'room1', number: '01', name: 'Hành trình tìm đường cứu nước và hình thành tư tưởng', shortName: 'Hành trình cứu nước', side: -1, centerX: -9.6, centerZ: 6.8, width: 12.4, depth: 8.4, accent: 0x875b3b, artifacts: ['painting-1', 'painting-2', 'room1-steam-ship', 'room1-antique-globe'], bench: { x: -8.4, z: 9.0, rotation: Math.PI / 2 } },
    { id: 'room2', number: '02', name: 'Độc lập dân tộc và chủ nghĩa xã hội', shortName: 'Độc lập dân tộc', side: 1, centerX: 9.6, centerZ: 1.4, width: 12.4, depth: 10.0, accent: 0x315f78, artifacts: ['painting-3', 'painting-4', 'painting-9', 'painting-10', 'room2-vintage-microphone', 'room2-vintage-radio', 'room2-vintage-telephone', 'room2-old-newspaper'], bench: { x: 8.2, z: 3.8, rotation: Math.PI / 2 } },
    { id: 'room3', number: '03', name: 'Đảng Cộng sản và Nhà nước của nhân dân', shortName: 'Đảng và Nhà nước', side: -1, centerX: -9.6, centerZ: -3.8, width: 12.4, depth: 11.0, accent: 0x5b6f3c, artifacts: ['painting-5', 'painting-11', 'painting-12', 'room3-ballot-box', 'room3-typewriter', 'room3-old-book'], bench: { x: -8.1, z: -1.0, rotation: Math.PI / 2 } },
    { id: 'room4', number: '04', name: 'Đại đoàn kết dân tộc và đoàn kết quốc tế', shortName: 'Đại đoàn kết', side: 1, centerX: 9.6, centerZ: -8.0, width: 12.4, depth: 8.0, accent: 0x7a3034, artifacts: ['painting-6'], bench: { x: 8.0, z: -6.0, rotation: Math.PI / 2 } },
    { id: 'room5', number: '05', name: 'Văn hóa, đạo đức và con người', shortName: 'Văn hóa và con người', side: -1, centerX: -9.6, centerZ: -16.0, width: 12.4, depth: 10.0, accent: 0xa06d18, artifacts: ['painting-7'], bench: { x: -8.0, z: -13.2, rotation: Math.PI / 2 } },
    { id: 'room6', number: '06', name: 'Không gian tư liệu và phim · Hồ Chí Minh – Cuộc đời và di sản tư tưởng', shortName: 'Không gian tư liệu và phim', side: 1, centerX: 9.6, centerZ: -16.5, width: 12.4, depth: 9.0, accent: 0x4a302b, artifacts: ['painting-8'], screeningRoom: true }
];

// Room 04 stays intentionally open: no bench in the sightline to the statement wall.
museumRooms.find(room => room.id === 'room4').bench = null;
museumRooms.find(room => room.id === 'room4').artifacts = [
    'room4-national-unity-1', 'room4-national-unity-2', 'room4-national-unity-people',
    'room4-international-solidarity-2', 'painting-6', 'room4-dove', 'room4-letter'
];
// Room 05 is intentionally kept open around its living-culture vignette.
museumRooms.find(room => room.id === 'room5').bench = null;
museumRooms.find(room => room.id === 'room5').artifacts = [
    'painting-7', 'room5-humanism-2', 'room5-chair', 'room5-tea-cup', 'room5-work-desk', 'room5-rubber-sandals'
];

museumRooms.forEach(room => {
    room.bounds = {
        minX: room.centerX - room.width / 2,
        maxX: room.centerX + room.width / 2,
        minZ: room.centerZ - room.depth / 2,
        maxZ: room.centerZ + room.depth / 2
    };
    room.doorPosition = new THREE.Vector3(room.side * corridorHalfWidth, 1.9, room.centerZ);
    room.entryPosition = new THREE.Vector3(room.side * (corridorHalfWidth + 2.4), 1.6, room.centerZ);
    room.exitPosition = new THREE.Vector3(room.side * (corridorHalfWidth - 1.05), 1.6, room.centerZ);
});

museumRooms.forEach(room => {
    const doorWidth = 3.2;
    const wallX = room.side * corridorHalfWidth;
    const segmentDepth = (room.depth - doorWidth) / 2;
    [-1, 1].forEach(direction => {
        addPartition(0.18, wallHeight, segmentDepth, wallX, room.centerZ + direction * (doorWidth / 2 + segmentDepth / 2));
    });
    addPartition(room.width, wallHeight, 0.18, room.centerX, room.bounds.minZ);
    addPartition(room.width, wallHeight, 0.18, room.centerX, room.bounds.maxZ);
});
const roomDoors = [];

// Warm room floors, feature walls and soft ceiling panels.
museumRooms.forEach(room => {
    const roomCenterX = room.centerX;
    const roomFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(room.width - 0.2, room.depth - 0.2),
        new THREE.MeshStandardMaterial({ color: room.screeningRoom ? 0x292b31 : 0xc9c2b5, roughness: 0.72 })
    );
    roomFloor.name = `room-floor-${room.id}`;
    roomFloor.rotation.x = -Math.PI / 2;
    roomFloor.position.set(roomCenterX, 0.025, room.centerZ);
    scene.add(roomFloor);

    const featureWall = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 4.8, room.depth - 0.8),
        new THREE.MeshStandardMaterial({ color: room.id === 'room4' ? 0x34251f : (room.id === 'room5' ? 0x4b3025 : (room.id === 'room2' || room.id === 'room3' ? 0x6f171b : room.accent)), roughness: 0.84 })
    );
    featureWall.name = `room-feature-wall-${room.id}`;
    featureWall.position.set(room.side < 0 ? room.bounds.minX + 0.08 : room.bounds.maxX - 0.08, 3.15, room.centerZ);
    scene.add(featureWall);

    const lightPanel = new THREE.Mesh(
        new THREE.BoxGeometry(4.8, 0.06, 2.4),
        new THREE.MeshBasicMaterial({ color: 0xfff3d2 })
    );
    lightPanel.position.set(roomCenterX, wallHeight - 0.07, room.centerZ);
    scene.add(lightPanel);

    const roomLight = new THREE.PointLight(room.screeningRoom ? 0x8ba2c9 : 0xffe6bd, room.screeningRoom ? 0.38 : 0.9, 11);
    roomLight.position.set(roomCenterX, 6.7, room.centerZ);
    scene.add(roomLight);
});

// Refined central corridor: pale runner, brass edging and ceiling lights.
const corridorRunner = new THREE.Mesh(
    new THREE.PlaneGeometry(corridorHalfWidth * 2 - 0.5, roomDepth - 1),
    new THREE.MeshStandardMaterial({ color: 0x731a1d, roughness: 0.82 })
);
corridorRunner.rotation.x = -Math.PI / 2;
corridorRunner.position.y = 0.035;
scene.add(corridorRunner);

[-corridorHalfWidth + 0.13, corridorHalfWidth - 0.13].forEach(x => {
    const edge = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.025, roomDepth - 1),
        new THREE.MeshBasicMaterial({ color: 0xc8a84e })
    );
    edge.position.set(x, 0.055, 0);
    scene.add(edge);
});

[-18, -12, -6, 0, 6, 12, 17].forEach(z => {
    const panel = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.05, 1.05),
        new THREE.MeshBasicMaterial({ color: 0xfff4d8 })
    );
    panel.position.set(0, wallHeight - 0.06, z);
    scene.add(panel);
});

// Main lobby creates a deliberate pause between the entrance and gallery corridor.
const lobbyFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(museumLayout.lobby.maxX - museumLayout.lobby.minX, museumLayout.lobby.maxZ - museumLayout.lobby.minZ),
    new THREE.MeshStandardMaterial({ color: 0xbeb5a6, roughness: 0.68 })
);
lobbyFloor.rotation.x = -Math.PI / 2;
lobbyFloor.position.set(0, 0.045, (museumLayout.lobby.minZ + museumLayout.lobby.maxZ) / 2);
scene.add(lobbyFloor);

const lobbyLight = new THREE.PointLight(0xffe3b0, 1.15, 15);
lobbyLight.position.set(0, 6.6, 15.8);
scene.add(lobbyLight);

function createLobbyDirectory() {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 620;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#201b19'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#c7a448'; ctx.lineWidth = 12; ctx.strokeRect(8, 8, 884, 604);
    ctx.fillStyle = '#f6e7bd'; ctx.textAlign = 'center';
    ctx.font = 'bold 48px Arial'; ctx.fillText('HÀNH TRÌNH TƯ TƯỞNG', 450, 78);
    ctx.font = 'bold 58px Arial'; ctx.fillText('HỒ CHÍ MINH', 450, 145);
    const leftX = 78;
    const rightX = 492;
    const rowY = [255, 370, 485];
    const itemFontSize = 27;
    const lineHeight = 34;
    const columnWidth = 330;
    ctx.font = `bold ${itemFontSize}px Arial`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    function drawRoomItem(room, x, y, color) {
        const prefix = `${room.number}  `;
        const label = room.shortName.toUpperCase();
        const words = label.split(' ');
        const lines = [];
        let line = '';
        words.forEach(word => {
            const candidate = `${line}${word} `;
            if (ctx.measureText(`${prefix}${candidate}`).width > columnWidth && line) {
                lines.push(line.trimEnd());
                line = `${word} `;
            } else {
                line = candidate;
            }
        });
        lines.push(line.trimEnd());
        ctx.fillStyle = color;
        const continuationX = x + ctx.measureText(prefix).width;
        lines.forEach((text, lineIndex) => {
            ctx.fillText(lineIndex === 0 ? `${prefix}${text}` : text, lineIndex === 0 ? x : continuationX, y + lineIndex * lineHeight);
        });
    }

    museumRooms.forEach((room, index) => {
        const x = index % 2 === 0 ? leftX : rightX;
        const y = rowY[Math.floor(index / 2)];
        drawRoomItem(room, x, y, index === 5 ? '#9fb5dc' : '#f4d98f');
    });
    const directory = new THREE.Mesh(
        new THREE.PlaneGeometry(6.4, 4.4),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })
    );
    directory.position.set(museumLayout.lobby.minX + 0.08, 3.3, 15.8);
    directory.rotation.y = Math.PI / 2;
    scene.add(directory);
}
createLobbyDirectory();

// Minimal welcome/hero area on the otherwise empty right side of the lobby.
// It is decorative only: no artifact registration, triggers, or new lights.
function createLobbyHeroArea() {
    const heroX = museumLayout.lobby.maxX - 0.1;
    const heroZ = 15.8;
    const panelWidth = 7.8;
    const panelHeight = 5.2;
    const heroMaterial = new THREE.MeshStandardMaterial({ color: 0x33251f, roughness: 0.86 });
    const heroBacking = new THREE.Mesh(new THREE.BoxGeometry(0.06, panelHeight, panelWidth), heroMaterial);
    heroBacking.name = 'lobby-hero-wall-backing';
    heroBacking.position.set(heroX, 3.35, heroZ);
    scene.add(heroBacking);

    const createHeroCanvas = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#2a201c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#c7a448';
        ctx.lineWidth = 5;
        ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);
        ctx.fillStyle = '#d8b765';
        ctx.textAlign = 'center';
        ctx.font = '700 30px Arial, sans-serif';
        ctx.fillText('WELCOME · BẢO TÀNG HỒ CHÍ MINH', canvas.width / 2, 96);
        ctx.fillStyle = '#fff4d8';
        ctx.font = '600 72px Georgia, serif';
        ctx.fillText('HỒ CHÍ MINH', canvas.width / 2, 245);
        ctx.fillStyle = '#e7d39a';
        ctx.font = '600 30px Arial, sans-serif';
        ctx.fillText('TƯ TƯỞNG · ĐẠO ĐỨC · PHONG CÁCH', canvas.width / 2, 320);
        ctx.strokeStyle = 'rgba(199,164,72,.65)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(180, 365);
        ctx.lineTo(820, 365);
        ctx.stroke();
        ctx.fillStyle = '#fff4d8';
        ctx.font = 'italic 34px Georgia, serif';
        ctx.fillText('“Không có gì quý hơn độc lập, tự do”', canvas.width / 2, 470);
        ctx.fillStyle = '#d8b765';
        ctx.font = '700 24px Arial, sans-serif';
        ctx.fillText('MỘT DI SẢN VẪN SOI ĐƯỜNG', canvas.width / 2, 650);
        return canvas;
    };

    const heroText = new THREE.Mesh(
        new THREE.PlaneGeometry(3.65, 3.7),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(createHeroCanvas()) })
    );
    heroText.name = 'lobby-hero-text-panel';
    heroText.position.set(heroX - 0.045, 3.45, heroZ - 1.75);
    heroText.rotation.y = -Math.PI / 2;
    scene.add(heroText);

    // Keep the portrait in a dedicated vertical slot on the right. The image
    // is contained inside this frame after its real aspect ratio is known.
    const portraitWidth = 2.85;
    const portraitHeight = 3.45;
    const portraitFrameMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2a18, roughness: 0.68, metalness: 0.08 });
    const portraitFrameX = heroX - 0.055;
    const portraitFrameZ = heroZ + 1.95;
    const frameDepth = 0.035;
    const frameRail = (name, width, height, z, y) => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(frameDepth, height, width), portraitFrameMaterial);
        rail.name = name;
        rail.position.set(portraitFrameX, y, z);
        scene.add(rail);
    };
    // Four open rails replace the old solid box: no opaque panel can sit over
    // the portrait while the dark wood outline remains visible.
    frameRail('lobby-hero-portrait-frame-left', 0.10, portraitHeight + 0.18, portraitFrameZ - (portraitWidth + 0.18) / 2, 3.5);
    frameRail('lobby-hero-portrait-frame-right', 0.10, portraitHeight + 0.18, portraitFrameZ + (portraitWidth + 0.18) / 2, 3.5);
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(frameDepth, 0.10, portraitWidth + 0.18), portraitFrameMaterial);
    frameTop.name = 'lobby-hero-portrait-frame-top';
    frameTop.position.set(portraitFrameX, 3.5 + (portraitHeight + 0.18) / 2, portraitFrameZ);
    scene.add(frameTop);
    const frameBottom = frameTop.clone();
    frameBottom.name = 'lobby-hero-portrait-frame-bottom';
    frameBottom.position.y = 3.5 - (portraitHeight + 0.18) / 2;
    scene.add(frameBottom);

    const portraitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const portrait = new THREE.Mesh(
        new THREE.PlaneGeometry(portraitWidth, portraitHeight),
        portraitMaterial
    );
    portrait.name = 'lobby-hero-portrait';
    portrait.position.set(heroX - 0.09, 3.5, heroZ + 1.95);
    portrait.rotation.y = -Math.PI / 2;
    scene.add(portrait);

    const portraitTexture = new THREE.TextureLoader().load('./images/exhibits/room6-ho-chi-minh-portrait-1950s.jpg', texture => {
        const imageRatio = texture.image.width / texture.image.height;
        const frameRatio = portraitWidth / portraitHeight;
        // Contain: never crop the head or shoulders to fill the frame.
        if (imageRatio > frameRatio) portrait.scale.y = frameRatio / imageRatio;
        else portrait.scale.x = imageRatio / frameRatio;
    });
    portraitTexture.colorSpace = THREE.SRGBColorSpace;
    portraitMaterial.map = portraitTexture;
    portraitMaterial.needsUpdate = true;

    const pedestal = new THREE.Mesh(
        new THREE.BoxGeometry(0.82, 0.22, 3.5),
        new THREE.MeshStandardMaterial({ color: 0x5a3928, roughness: 0.78 })
    );
    pedestal.name = 'lobby-hero-low-pedestal';
    pedestal.position.set(heroX - 0.62, 0.11, heroZ);
    scene.add(pedestal);

    const lotusCanvas = document.createElement('canvas');
    lotusCanvas.width = 700;
    lotusCanvas.height = 180;
    const lotusCtx = lotusCanvas.getContext('2d');
    lotusCtx.strokeStyle = '#d8b765';
    lotusCtx.lineWidth = 5;
    lotusCtx.lineCap = 'round';
    lotusCtx.beginPath();
    lotusCtx.moveTo(150, 126); lotusCtx.quadraticCurveTo(350, 164, 550, 126);
    lotusCtx.moveTo(350, 142); lotusCtx.quadraticCurveTo(270, 75, 235, 120);
    lotusCtx.moveTo(350, 142); lotusCtx.quadraticCurveTo(430, 75, 465, 120);
    lotusCtx.moveTo(350, 142); lotusCtx.quadraticCurveTo(350, 55, 350, 28);
    lotusCtx.stroke();
    const lotus = new THREE.Mesh(
        new THREE.PlaneGeometry(2.7, 0.7),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(lotusCanvas), transparent: true })
    );
    lotus.name = 'lobby-hero-lotus-motif';
    lotus.rotation.x = -Math.PI / 2;
    lotus.position.set(heroX - 0.65, 0.235, heroZ);
    scene.add(lotus);
}
createLobbyHeroArea();

function createWayfindingSign(leftLabel, rightLabel, z) {
    const canvas = document.createElement('canvas');
    canvas.width = 900; canvas.height = 150;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(28,24,22,0.96)'; ctx.fillRect(0, 0, 900, 150);
    ctx.strokeStyle = '#c7a448'; ctx.lineWidth = 8; ctx.strokeRect(5, 5, 890, 140);
    ctx.fillStyle = '#f6e7bd'; ctx.font = 'bold 38px Arial'; ctx.textBaseline = 'middle';
    ctx.textAlign = 'left'; ctx.fillText(`← ${leftLabel}`, 55, 76);
    ctx.textAlign = 'right'; ctx.fillText(`${rightLabel} →`, 845, 76);
    const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(4.8, 0.8),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), side: THREE.DoubleSide })
    );
    sign.position.set(0, 5.3, z);
    scene.add(sign);
}
createWayfindingSign('PHÒNG 01', 'PHÒNG 02', 5.0);
createWayfindingSign('PHÒNG 03', 'PHÒNG 04', -5.2);
createWayfindingSign('PHÒNG 05', 'PHIM 06', -13.5);

function createJourneyEndFeature() {
    const canvas = document.createElement('canvas');
    canvas.width = 1000; canvas.height = 360;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#6f171b'; ctx.fillRect(0, 0, 1000, 360);
    ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 12; ctx.strokeRect(8, 8, 984, 344);
    ctx.fillStyle = '#f8e6ad'; ctx.textAlign = 'center';
    ctx.font = 'bold 38px Arial'; ctx.fillText('KHÔNG GIAN TỔNG KẾT', 500, 120);
    ctx.font = 'bold 62px Arial'; ctx.fillText('KẾT THÚC HÀNH TRÌNH', 500, 220);
    const feature = new THREE.Mesh(
        new THREE.PlaneGeometry(7.2, 2.6),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })
    );
    feature.position.set(0, 3.6, -roomDepth / 2 + 0.08);
    scene.add(feature);
    const endLight = new THREE.SpotLight(0xffd88b, 1.2, 12, Math.PI / 5, 0.6);
    endLight.position.set(0, 7, -16);
    endLight.target = feature;
    scene.add(endLight);
}
createJourneyEndFeature();

function createRoomSign(room) {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 190;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#7d1717';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 10;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);
    ctx.fillStyle = '#ffe9a8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 30px Arial';
    ctx.fillText(`PHÒNG ${room.number}`, canvas.width / 2, 42);
    ctx.font = 'bold 34px Arial';
    const words = room.name.toUpperCase().split(' ');
    const lines = [];
    let line = '';
    words.forEach(word => {
        if (ctx.measureText(`${line} ${word}`).width > 820 && line) { lines.push(line); line = word; }
        else line = `${line} ${word}`.trim();
    });
    lines.push(line);
    lines.slice(0, 3).forEach((text, index) => ctx.fillText(text, canvas.width / 2, 88 + index * 38));
    const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(4.3, 0.92),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })
    );
    sign.position.set(room.side * (corridorHalfWidth - 0.1), 4.75, room.centerZ);
    sign.rotation.y = room.side < 0 ? Math.PI / 2 : -Math.PI / 2;
    scene.add(sign);

    const door = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 3.8, 3.2),
        new THREE.MeshStandardMaterial({ color: 0x34231f, roughness: 0.62, metalness: 0.1 })
    );
    door.position.copy(room.doorPosition);
    door.userData.type = 'room-trigger';
    door.userData.roomId = room.id;
    door.userData.roomData = room;
    door.userData.closedY = 1.9;
    door.userData.openAmount = 0;
    door.userData.targetOpen = 0;
    scene.add(door);
    roomDoors.push(door);
    roomTriggers.push(door);

    const trimMaterial = new THREE.MeshStandardMaterial({ color: 0xb89543, roughness: 0.35, metalness: 0.45 });
    [-1.72, 1.72].forEach(zOffset => {
        const trim = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.15, 0.12), trimMaterial);
        trim.position.set(room.side * (corridorHalfWidth - 0.02), 2.05, room.centerZ + zOffset);
        scene.add(trim);
    });
    const topTrim = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 3.55), trimMaterial);
    topTrim.position.set(room.side * (corridorHalfWidth - 0.02), 4.08, room.centerZ);
    scene.add(topTrim);

    const handle = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), trimMaterial);
    handle.position.set(room.side * (corridorHalfWidth - room.side * 0.14), 1.9, room.centerZ + 1.05);
    scene.add(handle);
}
museumRooms.forEach(createRoomSign);

// Long upholstered benches in every gallery, placed away from the doors.
const galleryBenchMaterial = new THREE.MeshStandardMaterial({ color: 0x5b2528, roughness: 0.8 });
const galleryBenchLegMaterial = new THREE.MeshStandardMaterial({ color: 0xb89543, roughness: 0.38, metalness: 0.5 });
museumRooms.forEach(room => {
    if (!room.bench || room.id === 'room1' || room.id === 'room2' || room.id === 'room3') return;
    const bench = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.28, 1.05), galleryBenchMaterial);
    seat.position.y = 0.72;
    bench.add(seat);
    [-1.45, 1.45].forEach(x => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.8), galleryBenchLegMaterial);
        leg.position.set(x, 0.34, 0);
        bench.add(leg);
    });
    bench.position.set(room.bench.x, 0, room.bench.z);
    bench.rotation.y = room.bench.rotation;
    scene.add(bench);
});

// Lightweight thematic 3D exhibits for the five galleries.
const exhibitWood = new THREE.MeshStandardMaterial({ color: 0x70452c, roughness: 0.82 });
const exhibitMetal = new THREE.MeshStandardMaterial({ color: 0x72787d, roughness: 0.42, metalness: 0.58 });
const exhibitPaper = new THREE.MeshStandardMaterial({ color: 0xe8dcc0, roughness: 0.95 });
const exhibitRed = new THREE.MeshStandardMaterial({ color: 0xb51f28, roughness: 0.78 });
const exhibitGold = new THREE.MeshStandardMaterial({ color: 0xe2c04f, roughness: 0.38, metalness: 0.35 });

function exhibitPart(group, geometry, material, x, y, z, rx = 0, ry = 0, rz = 0) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    group.add(mesh);
    return mesh;
}

function createThemeLabel(text, x, z, color = '#f6e7bd') {
    // Room 1 uses a dedicated centered title on its end wall.
    if (x < -15) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1000; canvas.height = 180;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(22,25,29,0.94)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#c7a448'; ctx.lineWidth = 8; ctx.strokeRect(5, 5, 990, 170);
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `bold ${text.length > 28 ? 38 : 52}px Arial`; ctx.fillText(text.toUpperCase(), 500, 92);
    const label = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 1.0), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) }));
    label.position.set(x, 5.7, z);
    label.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2;
    scene.add(label);
}

// Room 1 feature wall: keep the main sightline open by mounting the statement
// on the wall opposite the entrance. The room centre remains reserved for the ship display.
function createRoom1FeaturePanel() {
    const room = museumRooms[0];
    const panelX = room.bounds.minX + 0.16;
    const panelZ = room.centerZ;
    const panelY = 3.15;
    const panelWidth = 6.9;
    const panelHeight = 3.7;

    const backing = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, panelHeight, panelWidth),
        new THREE.MeshStandardMaterial({ color: 0x5a2522, roughness: 0.78, metalness: 0.08 })
    );
    backing.name = 'room1-feature-panel-backing';
    backing.position.set(panelX - 0.025, panelY, panelZ);
    scene.add(backing);

    const panel = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 3.36, 6.58),
        new THREE.MeshStandardMaterial({ color: 0xe7dcc2, roughness: 0.82 })
    );
    panel.name = 'room1-feature-panel-surface';
    panel.position.set(panelX + 0.045, panelY, panelZ);
    scene.add(panel);

    const trimMaterial = new THREE.MeshStandardMaterial({ color: 0xc7a448, roughness: 0.38, metalness: 0.35 });
    [
        new THREE.BoxGeometry(0.12, 0.08, 7.05),
        new THREE.BoxGeometry(0.12, 0.08, 7.05),
        new THREE.BoxGeometry(0.12, 3.8, 0.08),
        new THREE.BoxGeometry(0.12, 3.8, 0.08),
        new THREE.BoxGeometry(0.13, 0.045, 6.7),
        new THREE.BoxGeometry(0.13, 3.48, 0.045),
        new THREE.BoxGeometry(0.13, 3.48, 0.045)
    ].forEach((geometry, index) => {
        const trim = new THREE.Mesh(geometry, trimMaterial);
        const isHorizontal = index === 0 || index === 1 || index === 4;
        trim.position.set(
            panelX + 0.105,
            isHorizontal ? (index === 0 ? 5.05 : (index === 1 ? 1.25 : 4.72)) : panelY,
            isHorizontal ? panelZ : panelZ + (index === 2 || index === 5 ? -3.37 : 3.37)
        );
        scene.add(trim);
    });

    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#e7dcc2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#6f171b';
    ctx.font = 'bold 64px Arial, sans-serif';
    ctx.fillText('HÀNH TRÌNH CỨU NƯỚC', canvas.width / 2, 112);
    ctx.fillStyle = '#9b702b';
    ctx.font = 'bold 34px Arial, sans-serif';
    ctx.fillText('1911 – 1941', canvas.width / 2, 180);

    ctx.strokeStyle = 'rgba(155,112,43,.62)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(220, 235);
    ctx.lineTo(1180, 235);
    ctx.stroke();

    ctx.fillStyle = '#6f171b';
    ctx.font = '30px Arial, sans-serif';
    ctx.fillText('Rời Bến Nhà Rồng năm 1911, Nguyễn Tất Thành bắt đầu hành trình', canvas.width / 2, 326);
    ctx.fillText('tìm đường cứu nước, từng bước tiếp cận chủ nghĩa Mác – Lênin', canvas.width / 2, 386);
    ctx.fillText('và xác định con đường giải phóng dân tộc cho Việt Nam.', canvas.width / 2, 446);

    ctx.fillStyle = '#795b3a';
    ctx.font = '25px Arial, sans-serif';
    ctx.fillText('Nguyễn Tất Thành trước lúc ra đi tìm đường cứu nước · 1911', canvas.width / 2, 535);

    ctx.strokeStyle = 'rgba(155,112,43,.48)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(145, 610);
    ctx.lineTo(1255, 610);
    ctx.stroke();

    ctx.fillStyle = '#6f171b';
    ctx.font = 'bold 23px Arial, sans-serif';
    const milestones = [
        { year: '1911', lines: ['Rời Bến', 'Nhà Rồng'] },
        { year: '1919', lines: ['Gửi Yêu sách của', 'nhân dân An Nam'] },
        { year: '1920', lines: ['Tìm thấy con đường', 'cách mạng vô sản'] },
        { year: '1941', lines: ['Trở về', 'Tổ quốc'] }
    ];
    const milestoneX = [185, 515, 875, 1200];
    milestones.forEach((milestone, index) => {
        ctx.fillText(milestone.year, milestoneX[index], 665);
        ctx.font = '20px Arial, sans-serif';
        milestone.lines.forEach((line, lineIndex) => ctx.fillText(line, milestoneX[index], 710 + lineIndex * 30));
        ctx.font = 'bold 23px Arial, sans-serif';
    });

    const textSurface = new THREE.Mesh(
        new THREE.PlaneGeometry(6.4, 3.12),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })
    );
    textSurface.name = 'room1-feature-panel-content';
    textSurface.position.set(panelX + 0.115, panelY, panelZ);
    textSurface.rotation.y = Math.PI / 2;
    scene.add(textSurface);
}
createRoom1FeaturePanel();

// Room 1's physical exhibits use the supplied GLB assets. Their source
// materials/textures are intentionally left untouched; only transform and
// interaction metadata are added here.
const room1GLTFLoader = new GLTFLoader();
const room1ExhibitMaterials = {
    wood: new THREE.MeshStandardMaterial({ color: 0x3d2921, roughness: 0.62, metalness: 0.08 }),
    stone: new THREE.MeshStandardMaterial({ color: 0x77736b, roughness: 0.74, metalness: 0.08 })
};

function addRoom1GLBExhibit({ path, id, targetSize, fitAxis = 'max', position, rotationY, pedestalHeight, pedestalPadding, pedestalMaterial }) {
    room1GLTFLoader.load(path, (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.rotation.set(0, rotationY, 0);
        model.updateMatrixWorld(true);

        const sourceBox = new THREE.Box3().setFromObject(model);
        const sourceSize = sourceBox.getSize(new THREE.Vector3());
        const sourceDimension = fitAxis === 'y'
            ? sourceSize.y
            : Math.max(sourceSize.x, sourceSize.y, sourceSize.z);
        const uniformScale = targetSize / sourceDimension;
        model.scale.setScalar(uniformScale);
        model.updateMatrixWorld(true);

        let modelBox = new THREE.Box3().setFromObject(model);
        const modelSize = modelBox.getSize(new THREE.Vector3());
        const pedestalWidth = modelSize.x + pedestalPadding * 2;
        const pedestalDepth = modelSize.z + pedestalPadding * 2;
        const pedestal = new THREE.Mesh(
            new THREE.BoxGeometry(pedestalWidth, pedestalHeight, pedestalDepth),
            pedestalMaterial
        );
        pedestal.position.set(position.x, pedestalHeight / 2, position.z);
        pedestal.castShadow = true;
        pedestal.receiveShadow = true;
        scene.add(pedestal);

        const modelCenter = modelBox.getCenter(new THREE.Vector3());
        model.position.x += position.x - modelCenter.x;
        model.position.z += position.z - modelCenter.z;
        model.updateMatrixWorld(true);
        modelBox = new THREE.Box3().setFromObject(model);
        model.position.y += pedestalHeight - modelBox.min.y;
        model.updateMatrixWorld(true);

        model.userData.type = 'artifact';
        model.userData.id = id;
        model.traverse((child) => {
            if (!child.isMesh) return;
            child.castShadow = true;
            child.receiveShadow = true;
            child.userData.type = 'artifact';
            child.userData.id = id;
            artifactInteractables.push(child);
        });
        scene.add(model);
    }, undefined, (error) => {
        console.error(`Room 1 GLB failed to load: ${path}`, error);
    });
}

// The ship is the main focal point, kept low and slightly off the entry axis
// so visitors can see through the room before turning toward the exhibit.
addRoom1GLBExhibit({
    path: './images/room1/steam-ship.glb',
    id: 'room1-steam-ship',
    targetSize: 2.55,
    position: new THREE.Vector3(-10.15, 0, 8.25),
    rotationY: Math.PI / 2 + Math.PI / 8,
    pedestalHeight: 0.32,
    pedestalPadding: 0.16,
    pedestalMaterial: room1ExhibitMaterials.wood
});

addRoom1GLBExhibit({
    path: './images/room1/antique-globe.glb',
    id: 'room1-antique-globe',
    targetSize: 0.92,
    fitAxis: 'y',
    position: new THREE.Vector3(-7.25, 0, 5.15),
    rotationY: Math.PI / 12,
    pedestalHeight: 0.58,
    pedestalPadding: 0.16,
    pedestalMaterial: room1ExhibitMaterials.stone
});

// Room 2: the supplied microphone and radio replace the old flag/microphone/
// radio/podium placeholder group. The title remains on the end wall.
const room2GLTFLoader = new GLTFLoader();
const room2PedestalMaterials = {
    wood: new THREE.MeshStandardMaterial({ color: 0x3b2924, roughness: 0.64, metalness: 0.08 }),
    stone: new THREE.MeshStandardMaterial({ color: 0x77756f, roughness: 0.75, metalness: 0.06 })
};

const room2Models = {};

function loadRoom2Model({ path, id, targetSize, fitAxis, position, rotationY = 0, rotationX = 0, rotationZ = 0, pedestalHeight = 0, pedestalPadding = 0, pedestalMaterial = null, registerArtifact = false, onPlaced = null }) {
    room2GLTFLoader.load(path, (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.rotation.set(rotationX, rotationY, rotationZ);
        model.updateMatrixWorld(true);

        const sourceBox = new THREE.Box3().setFromObject(model);
        const sourceSize = sourceBox.getSize(new THREE.Vector3());
        const sourceDimension = fitAxis === 'y'
            ? sourceSize.y
            : fitAxis === 'z'
                ? sourceSize.z
                : fitAxis === 'max'
                    ? Math.max(sourceSize.x, sourceSize.y, sourceSize.z)
                    : sourceSize.x;
        const uniformScale = targetSize / sourceDimension;
        model.scale.setScalar(uniformScale);
        model.updateMatrixWorld(true);

        let modelBox = new THREE.Box3().setFromObject(model);
        const modelSize = modelBox.getSize(new THREE.Vector3());
        const pedestalWidth = modelSize.x + pedestalPadding * 2;
        const pedestalDepth = modelSize.z + pedestalPadding * 2;
        if (pedestalHeight > 0 && pedestalMaterial) {
            const pedestal = new THREE.Mesh(
                new THREE.BoxGeometry(pedestalWidth, pedestalHeight, pedestalDepth),
                pedestalMaterial
            );
            pedestal.position.set(position.x, pedestalHeight / 2, position.z);
            pedestal.castShadow = true;
            pedestal.receiveShadow = true;
            pedestal.userData.room = 'room2';
            scene.add(pedestal);
        }

        const modelCenter = modelBox.getCenter(new THREE.Vector3());
        model.position.x += position.x - modelCenter.x;
        model.position.z += position.z - modelCenter.z;
        model.updateMatrixWorld(true);
        modelBox = new THREE.Box3().setFromObject(model);
        model.position.y += (pedestalHeight > 0 ? pedestalHeight : 0) - modelBox.min.y;
        model.updateMatrixWorld(true);

        if (registerArtifact) {
            model.userData.type = 'artifact';
            model.userData.id = id;
        }
        model.traverse((child) => {
            if (!child.isMesh) return;
            if (registerArtifact) {
                child.userData.type = 'artifact';
                child.userData.id = id;
                artifactInteractables.push(child);
            }
            child.castShadow = true;
            child.receiveShadow = true;
        });
        scene.add(model);
        const finalBox = new THREE.Box3().setFromObject(model);
        const placement = { model, box: finalBox, size: finalBox.getSize(new THREE.Vector3()), scale: model.scale.x };
        if (id) room2Models[id] = placement;
        if (onPlaced) onPlaced(placement);
    }, undefined, (error) => {
        console.error(`Room 2 GLB failed to load: ${path}`, error);
    });
}

loadRoom2Model({
    path: './images/room2/vintage-microphone.glb',
    id: 'room2-vintage-microphone',
    targetSize: 0.62,
    fitAxis: 'y',
    position: new THREE.Vector3(10.0, 0, 1.2),
    rotationY: -Math.PI / 2,
    registerArtifact: true,
    onPlaced: tryMountRoom2Microphone
});

loadRoom2Model({
    path: './images/room2/vintage-radio.glb',
    id: 'room2-vintage-radio',
    targetSize: 0.82,
    fitAxis: 'x',
    position: new THREE.Vector3(7.35, 0, -1.75),
    rotationY: Math.PI / 12,
    pedestalHeight: 0.58,
    pedestalPadding: 0.15,
    pedestalMaterial: room2PedestalMaterials.stone,
    registerArtifact: true
});

loadRoom2Model({
    path: './images/room2/vintage_telephone.glb',
    id: 'room2-vintage-telephone',
    targetSize: 0.82,
    fitAxis: 'x',
    position: new THREE.Vector3(7.35, 0, 4.35),
    rotationY: -Math.PI / 10,
    pedestalHeight: 0.58,
    pedestalPadding: 0.15,
    pedestalMaterial: room2PedestalMaterials.wood,
    registerArtifact: true
});

loadRoom2Model({
    path: './images/room2/old_newspaper.glb',
    id: 'room2-old-newspaper',
    targetSize: 1.15,
    fitAxis: 'x',
    position: new THREE.Vector3(12.45, 0, 1.4),
    rotationY: Math.PI / 2,
    rotationX: -Math.PI / 18,
    pedestalHeight: 0.78,
    pedestalPadding: 0.16,
    pedestalMaterial: room2PedestalMaterials.stone,
    registerArtifact: true
});

loadRoom2Model({
    path: './images/room2/lectern.glb',
    id: 'room2-lectern',
    targetSize: 1.18,
    fitAxis: 'y',
    position: new THREE.Vector3(10.0, 0, 1.2),
    rotationY: 0,
    registerArtifact: false,
    onPlaced: tryMountRoom2Microphone
});

function tryMountRoom2Microphone() {
    const microphone = room2Models['room2-vintage-microphone'];
    const lectern = room2Models['room2-lectern'];
    if (!microphone || !lectern || microphone.model.userData.mountedOnLectern) return;

    const microphoneCenter = microphone.box.getCenter(new THREE.Vector3());
    const lecternCenter = lectern.box.getCenter(new THREE.Vector3());
    microphone.model.position.x += lecternCenter.x - microphoneCenter.x;
    microphone.model.position.z += lecternCenter.z - microphoneCenter.z;
    microphone.model.updateMatrixWorld(true);

    const microphoneBox = new THREE.Box3().setFromObject(microphone.model);
    microphone.model.position.y += lectern.box.max.y - microphoneBox.min.y + 0.025;
    microphone.model.updateMatrixWorld(true);
    microphone.box = new THREE.Box3().setFromObject(microphone.model);
    microphone.size = microphone.box.getSize(new THREE.Vector3());
    microphone.model.userData.mountedOnLectern = true;
}

createThemeLabel('Độc lập · Tự do · Hạnh phúc', museumRooms[1].bounds.maxX - 0.1, museumRooms[1].centerZ);

// Room 2 feature wall: retain the physical wall but turn its blue accent into
// a restrained ivory-and-burgundy independence display panel.
const room2Panel = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 3.65, 7.5),
    new THREE.MeshStandardMaterial({ color: 0xe7dcc2, roughness: 0.82 })
);
room2Panel.position.set(museumRooms[1].bounds.maxX - 0.15, 3.25, museumRooms[1].centerZ);
scene.add(room2Panel);

const room2PanelTrimMaterial = new THREE.MeshStandardMaterial({ color: 0xc7a448, roughness: 0.38, metalness: 0.35 });
[
    new THREE.BoxGeometry(0.1, 0.08, 7.65),
    new THREE.BoxGeometry(0.1, 0.08, 7.65),
    new THREE.BoxGeometry(0.1, 3.75, 0.08),
    new THREE.BoxGeometry(0.1, 3.75, 0.08)
].forEach((geometry, index) => {
    const trim = new THREE.Mesh(geometry, room2PanelTrimMaterial);
    const isHorizontal = index < 2;
    trim.position.set(
        museumRooms[1].bounds.maxX - 0.21,
        isHorizontal ? (index === 0 ? 5.1 : 1.4) : 3.25,
        isHorizontal ? museumRooms[1].centerZ : museumRooms[1].centerZ + (index === 2 ? -3.8 : 3.8)
    );
    scene.add(trim);
});

const room2QuoteCanvas = document.createElement('canvas');
room2QuoteCanvas.width = 1000;
room2QuoteCanvas.height = 520;
const room2QuoteContext = room2QuoteCanvas.getContext('2d');
room2QuoteContext.fillStyle = '#e7dcc2';
room2QuoteContext.fillRect(0, 0, room2QuoteCanvas.width, room2QuoteCanvas.height);
room2QuoteContext.fillStyle = '#6f171b';
room2QuoteContext.textAlign = 'center';
room2QuoteContext.textBaseline = 'middle';
room2QuoteContext.font = 'bold 38px Georgia';
room2QuoteContext.fillText('“Nước Việt Nam có quyền hưởng', 500, 190);
room2QuoteContext.fillText('tự do và độc lập…”', 500, 255);
room2QuoteContext.font = '24px Arial';
room2QuoteContext.fillText('Tuyên ngôn Độc lập · 2/9/1945', 500, 355);
const room2Quote = new THREE.Mesh(
    new THREE.PlaneGeometry(5.2, 2.7),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(room2QuoteCanvas) })
);
room2Quote.position.set(museumRooms[1].bounds.maxX - 0.23, 3.15, museumRooms[1].centerZ);
room2Quote.rotation.y = -Math.PI / 2;
scene.add(room2Quote);

// Room 3: administrative-history gallery using the supplied ballot box,
// typewriter and old book models instead of the former placeholder group.
const room3GLTFLoader = new GLTFLoader();
const room3Models = {};
const room3DisplayMaterials = {
    wood: new THREE.MeshStandardMaterial({ color: 0x3b2924, roughness: 0.68, metalness: 0.08 }),
    stone: new THREE.MeshStandardMaterial({ color: 0x77736b, roughness: 0.76, metalness: 0.06 })
};

function loadRoom3Model({ path, id, targetSize, fitAxis, position, rotationY = 0, rotationX = 0, rotationZ = 0, pedestalHeight = 0, pedestalPadding = 0.16, pedestalMaterial = null, registerArtifact = false, onPlaced = null }) {
    room3GLTFLoader.load(path, (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.rotation.set(rotationX, rotationY, rotationZ);
        model.updateMatrixWorld(true);

        const sourceBox = new THREE.Box3().setFromObject(model);
        const sourceSize = sourceBox.getSize(new THREE.Vector3());
        const sourceDimension = fitAxis === 'y'
            ? sourceSize.y
            : fitAxis === 'z'
                ? sourceSize.z
                : fitAxis === 'max'
                    ? Math.max(sourceSize.x, sourceSize.y, sourceSize.z)
                    : sourceSize.x;
        model.scale.setScalar(targetSize / sourceDimension);
        model.updateMatrixWorld(true);

        let modelBox = new THREE.Box3().setFromObject(model);
        const modelSize = modelBox.getSize(new THREE.Vector3());
        if (pedestalHeight > 0 && pedestalMaterial) {
            const pedestal = new THREE.Mesh(
                new THREE.BoxGeometry(modelSize.x + pedestalPadding * 2, pedestalHeight, modelSize.z + pedestalPadding * 2),
                pedestalMaterial
            );
            pedestal.position.set(position.x, pedestalHeight / 2, position.z);
            pedestal.castShadow = true;
            pedestal.receiveShadow = true;
            pedestal.userData.room = 'room3';
            scene.add(pedestal);
        }

        const modelCenter = modelBox.getCenter(new THREE.Vector3());
        model.position.x += position.x - modelCenter.x;
        model.position.z += position.z - modelCenter.z;
        model.updateMatrixWorld(true);
        modelBox = new THREE.Box3().setFromObject(model);
        model.position.y += (pedestalHeight > 0 ? pedestalHeight : 0) - modelBox.min.y;
        model.updateMatrixWorld(true);

        if (registerArtifact) {
            model.userData.type = 'artifact';
            model.userData.id = id;
        }
        model.traverse((child) => {
            if (!child.isMesh) return;
            if (registerArtifact) {
                child.userData.type = 'artifact';
                child.userData.id = id;
                artifactInteractables.push(child);
            }
            child.castShadow = true;
            child.receiveShadow = true;
        });
        scene.add(model);
        const finalBox = new THREE.Box3().setFromObject(model);
        const placement = { model, box: finalBox, size: finalBox.getSize(new THREE.Vector3()), scale: model.scale.x };
        if (id) room3Models[id] = placement;
        if (onPlaced) onPlaced(placement);
    }, undefined, (error) => {
        console.error(`Room 3 GLB failed to load: ${path}`, error);
    });
}

loadRoom3Model({
    path: './images/room3/snapshot_ballot_box.glb',
    id: 'room3-ballot-box',
    targetSize: 0.92,
    fitAxis: 'y',
    position: new THREE.Vector3(-10.25, 0, -3.0),
    rotationY: Math.PI / 2,
    pedestalHeight: 0.52,
    pedestalMaterial: room3DisplayMaterials.wood,
    registerArtifact: true
});

const room3TypewriterDesk = new THREE.Group();
const room3DeskTop = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.16, 1.2), room3DisplayMaterials.wood);
room3DeskTop.position.y = 0.84;
room3TypewriterDesk.add(room3DeskTop);
[-0.82, 0.82].forEach(x => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.84, 0.85), room3DisplayMaterials.wood);
    leg.position.set(x, 0.42, 0);
    room3TypewriterDesk.add(leg);
});
room3TypewriterDesk.position.set(-8.15, 0, -6.45);
room3TypewriterDesk.userData.room = 'room3';
room3TypewriterDesk.traverse(child => { child.castShadow = true; child.receiveShadow = true; });
scene.add(room3TypewriterDesk);

loadRoom3Model({
    path: './images/room3/typewriter.glb',
    id: 'room3-typewriter',
    targetSize: 0.78,
    fitAxis: 'x',
    position: new THREE.Vector3(-8.15, 0, -6.45),
    rotationY: Math.PI / 12,
    registerArtifact: true,
    onPlaced: ({ model, box }) => {
        const deskTopBox = new THREE.Box3().setFromObject(room3DeskTop);
        const typewriterBox = new THREE.Box3().setFromObject(model);
        const typewriterCenter = typewriterBox.getCenter(new THREE.Vector3());
        const deskCenter = deskTopBox.getCenter(new THREE.Vector3());
        model.position.x += deskCenter.x - typewriterCenter.x;
        model.position.z += deskCenter.z - typewriterCenter.z;
        model.updateMatrixWorld(true);
        const alignedBox = new THREE.Box3().setFromObject(model);
        model.position.y += deskTopBox.max.y - alignedBox.min.y + 0.025;
        model.updateMatrixWorld(true);
        room3Models['room3-typewriter'].box = new THREE.Box3().setFromObject(model);
        room3Models['room3-typewriter'].size = room3Models['room3-typewriter'].box.getSize(new THREE.Vector3());
    }
});

loadRoom3Model({
    path: './images/room3/old_book.glb',
    id: 'room3-old-book',
    targetSize: 0.68,
    fitAxis: 'x',
    position: new THREE.Vector3(-8.15, 0, -1.15),
    rotationY: -Math.PI / 12,
    rotationX: -Math.PI / 18,
    pedestalHeight: 0.84,
    pedestalMaterial: room3DisplayMaterials.stone,
    registerArtifact: true
});

function createRoom3ThemePanel() {
    const panel = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 3.65, 7.5),
        new THREE.MeshStandardMaterial({ color: 0xe7dcc2, roughness: 0.82 })
    );
    // Room 03 interior is toward +X; keep every decorative layer in front of
    // the feature wall instead of burying the text behind it.
    panel.position.set(museumRooms[2].bounds.minX + 0.18, 3.25, museumRooms[2].centerZ);
    scene.add(panel);

    const trimMaterial = new THREE.MeshStandardMaterial({ color: 0xc7a448, roughness: 0.38, metalness: 0.35 });
    [
        [0.08, 7.65, 5.1], [0.08, 7.65, 1.4],
        [3.75, 0.08, 3.25], [3.75, 0.08, 3.25]
    ].forEach(([height, depth, y], index) => {
        const geometry = index < 2
            ? new THREE.BoxGeometry(0.1, height, depth)
            : new THREE.BoxGeometry(0.1, height, 0.08);
        const trim = new THREE.Mesh(geometry, trimMaterial);
        trim.position.set(
            museumRooms[2].bounds.minX + 0.25,
            y,
            index < 2 ? museumRooms[2].centerZ : museumRooms[2].centerZ + (index === 2 ? -3.8 : 3.8)
        );
        scene.add(trim);
    });

    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 520;
    const context = canvas.getContext('2d');
    context.fillStyle = '#e7dcc2';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#6f171b';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = 'bold 38px Georgia';
    context.fillText('CỦA NHÂN DÂN · DO NHÂN DÂN', 500, 190);
    context.fillText('VÌ NHÂN DÂN', 500, 255);
    context.font = '24px Arial';
    context.fillText('Dân là chủ và dân làm chủ', 500, 355);
    context.font = 'bold 20px Arial';
    context.fillText('WALL OF IDEAS · 1945–1946', 500, 430);
    const textMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(5.2, 2.7),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })
    );
    textMesh.position.set(museumRooms[2].bounds.minX + 0.30, 3.15, museumRooms[2].centerZ);
    textMesh.rotation.y = Math.PI / 2;
    scene.add(textMesh);
}

createRoom3ThemePanel();

// Room 4: two halves with national unity and international solidarity.
createThemeLabel('Đại đoàn kết dân tộc', museumRooms[3].bounds.maxX - 0.1, museumRooms[3].centerZ - 1.9);
createThemeLabel('Đoàn kết quốc tế', museumRooms[3].bounds.maxX - 0.1, museumRooms[3].centerZ + 1.9);
// The old Room 04 divider and blue SphereGeometry globe were placeholders.

// Room 04 statement wall: thin panel, dark wood, fine brass and restrained text.
const room4 = museumRooms[3];
const room4PanelMaterial = new THREE.MeshStandardMaterial({ color: 0xe8dfcc, roughness: 0.86 });
const room4TrimMaterial = new THREE.MeshStandardMaterial({ color: 0xb89543, roughness: 0.4, metalness: 0.42 });
const room4StatementPanel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 4.35, 7.15), room4PanelMaterial);
room4StatementPanel.position.set(room4.bounds.maxX - 0.16, 3.15, room4.centerZ);
scene.add(room4StatementPanel);
[
    new THREE.BoxGeometry(0.07, 0.07, 7.28), new THREE.BoxGeometry(0.07, 0.07, 7.28),
    new THREE.BoxGeometry(0.07, 4.42, 0.07), new THREE.BoxGeometry(0.07, 4.42, 0.07)
].forEach((geometry, index) => {
    const trim = new THREE.Mesh(geometry, room4TrimMaterial);
    trim.position.set(room4.bounds.maxX - 0.22, index < 2 ? (index === 0 ? 5.34 : 0.96) : 3.15, index < 2 ? room4.centerZ : room4.centerZ + (index === 2 ? -3.64 : 3.64));
    scene.add(trim);
});

function createRoom4Canvas(textLines, background, ink, accent, fontSize = 42) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200; canvas.height = 520;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = background; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = accent; ctx.lineWidth = 8; ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);
    ctx.fillStyle = ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    textLines.forEach((line, index) => {
        ctx.font = `${index === 0 ? 'bold ' : ''}${index === 0 ? fontSize : Math.round(fontSize * 0.58)}px Arial`;
        ctx.fillText(line, canvas.width / 2, index === 0 ? 205 : 330);
    });
    return new THREE.CanvasTexture(canvas);
}

const room4Statement = new THREE.Mesh(
    new THREE.PlaneGeometry(6.35, 2.75),
    new THREE.MeshBasicMaterial({ map: createRoom4Canvas(['ĐOÀN KẾT · ĐOÀN KẾT · ĐẠI ĐOÀN KẾT', 'THÀNH CÔNG · THÀNH CÔNG · ĐẠI THÀNH CÔNG'], '#e8dfcc', '#6f171b', '#b89543', 48) })
);
room4Statement.position.set(room4.bounds.maxX - 0.24, 3.15, room4.centerZ);
room4Statement.rotation.y = -Math.PI / 2;
scene.add(room4Statement);

const room4CornerLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(2.1, 0.86),
    new THREE.MeshBasicMaterial({ map: createRoom4Canvas(['ĐẠI ĐOÀN KẾT TOÀN DÂN TỘC', 'VÀ ĐOÀN KẾT QUỐC TẾ'], '#34251f', '#f1e6ce', '#b89543', 29) })
);
room4CornerLabel.position.set(room4.bounds.maxX - 0.25, 1.02, room4.bounds.minZ + 0.82);
room4CornerLabel.rotation.y = -Math.PI / 2;
room4CornerLabel.scale.set(0.78, 0.78, 0.78);
scene.add(room4CornerLabel);

function createRoom4SectionLabel(text, z, color) {
    const label = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.48), new THREE.MeshBasicMaterial({
        map: createRoom4Canvas([text], '#34251f', '#f1e6ce', color, 34)
    }));
    label.position.set(room4.centerX, 5.25, z);
    label.rotation.y = z < room4.centerZ ? 0 : Math.PI;
    scene.add(label);
}
createRoom4SectionLabel('ĐẠI ĐOÀN KẾT TOÀN DÂN TỘC', room4.bounds.minZ + 0.06, '#9e5545');
createRoom4SectionLabel('ĐOÀN KẾT QUỐC TẾ', room4.bounds.maxZ - 0.06, '#9aa9ad');

// Room 04 objects: one people group for national unity, plus a dove and letter
// for the international section. Source materials are deliberately preserved.
const room4GLTFLoader = new GLTFLoader();
const room4DisplayMaterials = {
    wood: new THREE.MeshStandardMaterial({ color: 0x3b2924, roughness: 0.72, metalness: 0.08 }),
    stone: new THREE.MeshStandardMaterial({ color: 0x77736b, roughness: 0.78, metalness: 0.06 })
};
const room4Models = {};

function isFiniteVector3(vector) {
    return vector && Number.isFinite(vector.x) && Number.isFinite(vector.y) && Number.isFinite(vector.z);
}

function loadRoom4Artifact({ path, id, position, targetSize, fitAxis = 'max', rotationY = 0, rotationX = 0, rotationZ = 0, pedestalHeight = 0, pedestalPadding = 0.18, pedestalMaterial = null, prepare = null }) {
    room4GLTFLoader.load(path, (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.rotation.set(rotationX, rotationY, rotationZ);
        model.updateMatrixWorld(true);

        if (prepare) prepare(model);
        model.updateMatrixWorld(true);
        const sourceBox = new THREE.Box3().setFromObject(model);
        const sourceSize = sourceBox.getSize(new THREE.Vector3());
        if (!isFiniteVector3(sourceSize) || sourceSize.x <= 0 || sourceSize.y <= 0 || sourceSize.z <= 0) {
            console.error(`Room 04 invalid source bounds for ${id}`, sourceSize);
            return;
        }
        const sourceDimension = fitAxis === 'y' ? sourceSize.y : Math.max(sourceSize.x, sourceSize.y, sourceSize.z);
        if (!Number.isFinite(sourceDimension) || sourceDimension <= 0 || !Number.isFinite(targetSize) || targetSize <= 0) {
            console.error(`Room 04 invalid scale input for ${id}`, { sourceDimension, targetSize });
            return;
        }
        model.scale.setScalar(targetSize / sourceDimension);
        model.updateMatrixWorld(true);

        let modelBox = new THREE.Box3().setFromObject(model);
        const modelSize = modelBox.getSize(new THREE.Vector3());
        if (!isFiniteVector3(modelSize)) {
            console.error(`Room 04 invalid scaled bounds for ${id}`, modelSize);
            return;
        }
        if (pedestalHeight > 0 && pedestalMaterial) {
            const pedestal = new THREE.Mesh(
                new THREE.BoxGeometry(modelSize.x + pedestalPadding * 2, pedestalHeight, modelSize.z + pedestalPadding * 2),
                pedestalMaterial
            );
            pedestal.position.set(position.x, pedestalHeight / 2, position.z);
            pedestal.userData.room = 'room4';
            pedestal.userData.decorative = true;
            pedestal.castShadow = true;
            pedestal.receiveShadow = true;
            scene.add(pedestal);
        }

        const modelCenter = modelBox.getCenter(new THREE.Vector3());
        model.position.x += position.x - modelCenter.x;
        model.position.z += position.z - modelCenter.z;
        model.updateMatrixWorld(true);
        modelBox = new THREE.Box3().setFromObject(model);
        model.position.y += (pedestalHeight > 0 ? pedestalHeight : 0) - modelBox.min.y;
        model.updateMatrixWorld(true);

        const finalBox = new THREE.Box3().setFromObject(model);
        const finalSize = finalBox.getSize(new THREE.Vector3());
        if (!isFiniteVector3(finalSize)) {
            console.error(`Room 04 invalid final bounds for ${id}`, finalSize);
            return;
        }
        model.userData.type = 'artifact';
        model.userData.id = id;
        model.userData.room = 'room4';
        model.traverse((child) => {
            if (!child.isMesh) return;
            child.userData.type = 'artifact';
            child.userData.id = id;
            child.userData.room = 'room4';
            child.castShadow = true;
            child.receiveShadow = true;
            artifactInteractables.push(child);
        });
        scene.add(model);
        room4Models[id] = { model, box: finalBox, size: finalSize, scale: model.scale.x };
    }, undefined, (error) => {
        console.error(`Room 04 GLB failed to load: ${path}`, error);
    });
}

loadRoom4Artifact({
    path: './images/room4/free_pack_-_lowpoly_people.glb',
    id: 'room4-national-unity-people',
    targetSize: 1.45,
    fitAxis: 'y',
    position: new THREE.Vector3(8.15, 0, -8.85),
    rotationY: -Math.PI / 2,
    pedestalHeight: 0.28,
    pedestalPadding: 0.2,
    pedestalMaterial: room4DisplayMaterials.wood,
    prepare: (model) => {
        const peopleRoot = model.getObjectByName('SM_People_Lowpoly');
        if (!peopleRoot || !peopleRoot.children.length) {
            console.warn('Room 04 people hierarchy not found; keeping loaded group intact.');
            return;
        }
        peopleRoot.children.slice(5).forEach((person) => peopleRoot.remove(person));
    }
});

loadRoom4Artifact({
    path: './images/room4/dove_from_poly_by_google.glb',
    id: 'room4-dove',
    targetSize: 0.72,
    position: new THREE.Vector3(12.25, 0, -6.45),
    rotationY: Math.PI / 2,
    pedestalHeight: 0.3,
    pedestalPadding: 0.12,
    pedestalMaterial: room4DisplayMaterials.stone
});

loadRoom4Artifact({
    path: './images/room4/letter%20.glb',
    id: 'room4-letter',
    targetSize: 0.5,
    position: new THREE.Vector3(10.25, 0, -6.55),
    rotationX: -Math.PI / 12,
    rotationY: Math.PI / 14,
    pedestalHeight: 0.22,
    pedestalPadding: 0.12,
    pedestalMaterial: room4DisplayMaterials.wood
});

// Room 05: warm, restrained gallery for everyday culture and human values.
const room5 = museumRooms[4];
const room5PanelMaterial = new THREE.MeshStandardMaterial({ color: 0xe8dfcc, roughness: 0.88 });
const room5TrimMaterial = new THREE.MeshStandardMaterial({ color: 0xb89543, roughness: 0.42, metalness: 0.38 });
const room5StatementPanel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 4.35, 9.15), room5PanelMaterial);
room5StatementPanel.position.set(room5.bounds.minX + 0.16, 3.15, room5.centerZ);
scene.add(room5StatementPanel);
[
    new THREE.BoxGeometry(0.07, 0.07, 9.28), new THREE.BoxGeometry(0.07, 0.07, 9.28),
    new THREE.BoxGeometry(0.07, 4.42, 0.07), new THREE.BoxGeometry(0.07, 4.42, 0.07)
].forEach((geometry, index) => {
    const trim = new THREE.Mesh(geometry, room5TrimMaterial);
    trim.position.set(room5.bounds.minX + 0.22, index < 2 ? (index === 0 ? 5.34 : 0.96) : 3.15, index < 2 ? room5.centerZ : room5.centerZ + (index === 2 ? -4.64 : 4.64));
    scene.add(trim);
});

function createRoom5Canvas(lines, background, ink, accent, titleSize = 46) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200; canvas.height = 520;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = background; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = accent; ctx.lineWidth = 8; ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);
    ctx.fillStyle = ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    lines.forEach((line, index) => {
        ctx.font = `${index === 0 ? 'bold ' : ''}${index === 0 ? titleSize : Math.round(titleSize * 0.56)}px Arial`;
        ctx.fillText(line, canvas.width / 2, index === 0 ? 175 : 305 + index * 70);
    });
    return new THREE.CanvasTexture(canvas);
}

const room5Statement = new THREE.Mesh(
    new THREE.PlaneGeometry(8.0, 3.45),
    new THREE.MeshBasicMaterial({ map: createRoom5Canvas(['VĂN HÓA VÀ CON NGƯỜI', 'Văn hóa soi đường cho quốc dân đi', 'Giản dị · Thanh cao · Vì con người'], '#e8dfcc', '#6f171b', '#b89543', 54) })
);
room5Statement.position.set(room5.bounds.minX + 0.24, 3.15, room5.centerZ);
room5Statement.rotation.y = Math.PI / 2;
scene.add(room5Statement);

function createRoom5ZoneLabel(text, z, accent) {
    const label = new THREE.Mesh(new THREE.PlaneGeometry(3.7, 0.48), new THREE.MeshBasicMaterial({
        map: createRoom5Canvas([text], '#3b2924', '#f1e6ce', accent, 32)
    }));
    label.position.set(room5.centerX, 5.25, z);
    label.rotation.y = z < room5.centerZ ? 0 : Math.PI;
    scene.add(label);
}
createRoom5ZoneLabel('GÓC ĐỜI SỐNG GIẢN DỊ', room5.bounds.minZ + 0.06, '#b8874a');
createRoom5ZoneLabel('GẦN GŨI VỚI CON NGƯỜI', room5.bounds.maxZ - 0.06, '#a6ad88');

// Replace the legacy mojibake labels in Room 05 with Unicode-safe canvas text.
room5Statement.visible = false;
scene.children.filter((object) => object.position.y === 5.25 && object.position.x === room5.centerX).forEach((object) => { object.visible = false; });
const room5ReadableStatement = new THREE.Mesh(
    new THREE.PlaneGeometry(8.0, 3.45),
    new THREE.MeshBasicMaterial({ map: createRoom5Canvas(['V\u0102N H\u00D3A V\u00C0 CON NG\u01AF\u1EDCI', 'V\u0103n h\u00F3a soi \u0111\u01B0\u1EDDng cho qu\u1ED1c d\u00E2n \u0111i', 'Gi\u1EA3n d\u1ECB \u00B7 Thanh cao \u00B7 V\u00EC con ng\u01B0\u1EDDi'], '#e8dfcc', '#6f171b', '#b89543', 54) })
);
room5ReadableStatement.position.copy(room5Statement.position);
room5ReadableStatement.rotation.copy(room5Statement.rotation);
scene.add(room5ReadableStatement);
createRoom5ZoneLabel('G\u00D3C \u0110\u1EDCI S\u1ED0NG GI\u1EA2N D\u1E8A', room5.bounds.minZ + 0.06, '#b8874a');
createRoom5ZoneLabel('G\u1EA6N G\u0168I V\u1EDAI CON NG\u01AF\u1EDCI', room5.bounds.maxZ - 0.06, '#a6ad88');

// Room 05 GLB loader: bounds-driven scaling, source materials untouched.
const room5GLTFLoader = new GLTFLoader();
const room5DisplayMaterials = {
    wood: new THREE.MeshStandardMaterial({ color: 0x3b2924, roughness: 0.72, metalness: 0.08 }),
    stone: new THREE.MeshStandardMaterial({ color: 0x77736b, roughness: 0.78, metalness: 0.06 })
};
const room5Models = {};

function room5FiniteSize(size) {
    return size && Number.isFinite(size.x) && Number.isFinite(size.y) && Number.isFinite(size.z) && size.x > 0 && size.y > 0 && size.z > 0;
}

function loadRoom5Artifact({ path, id, position, targetSize, fitAxis = 'max', rotationY = 0, rotationX = 0, rotationZ = 0, pedestalHeight = 0, pedestalPadding = 0.16, pedestalMaterial = null }) {
    room5GLTFLoader.load(path, (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.rotation.set(rotationX, rotationY, rotationZ);
        model.updateMatrixWorld(true);
        const sourceBox = new THREE.Box3().setFromObject(model);
        const sourceSize = sourceBox.getSize(new THREE.Vector3());
        if (!room5FiniteSize(sourceSize)) { console.error(`Room 05 invalid source bounds for ${id}`, sourceSize); return; }
        const sourceDimension = fitAxis === 'y' ? sourceSize.y : Math.max(sourceSize.x, sourceSize.y, sourceSize.z);
        if (!Number.isFinite(sourceDimension) || sourceDimension <= 0 || !Number.isFinite(targetSize) || targetSize <= 0) { console.error(`Room 05 invalid scale for ${id}`); return; }
        model.scale.setScalar(targetSize / sourceDimension);
        model.updateMatrixWorld(true);
        let modelBox = new THREE.Box3().setFromObject(model);
        const modelSize = modelBox.getSize(new THREE.Vector3());
        if (!room5FiniteSize(modelSize)) { console.error(`Room 05 invalid scaled bounds for ${id}`, modelSize); return; }
        if (pedestalHeight > 0 && pedestalMaterial) {
            const pedestal = new THREE.Mesh(new THREE.BoxGeometry(modelSize.x + pedestalPadding * 2, pedestalHeight, modelSize.z + pedestalPadding * 2), pedestalMaterial);
            pedestal.position.set(position.x, pedestalHeight / 2, position.z);
            pedestal.userData.room = 'room5'; pedestal.userData.decorative = true;
            pedestal.castShadow = true; pedestal.receiveShadow = true; scene.add(pedestal);
        }
        const modelCenter = modelBox.getCenter(new THREE.Vector3());
        model.position.x += position.x - modelCenter.x;
        model.position.z += position.z - modelCenter.z;
        model.updateMatrixWorld(true);
        modelBox = new THREE.Box3().setFromObject(model);
        model.position.y += (pedestalHeight > 0 ? pedestalHeight : 0) - modelBox.min.y;
        model.updateMatrixWorld(true);
        const finalBox = new THREE.Box3().setFromObject(model);
        const finalSize = finalBox.getSize(new THREE.Vector3());
        if (!room5FiniteSize(finalSize)) { console.error(`Room 05 invalid final bounds for ${id}`, finalSize); return; }
        model.userData.type = 'artifact'; model.userData.id = id; model.userData.room = 'room5';
        model.traverse((child) => {
            if (!child.isMesh) return;
            child.userData.type = 'artifact'; child.userData.id = id; child.userData.room = 'room5';
            child.castShadow = true; child.receiveShadow = true; artifactInteractables.push(child);
        });
        scene.add(model); room5Models[id] = { model, box: finalBox, size: finalSize, scale: model.scale.x };
    }, undefined, (error) => console.error(`Room 05 GLB failed to load: ${path}`, error));
}

loadRoom5Artifact({ path: './images/room5/old_wooden_chair_low-poly.glb', id: 'room5-chair', targetSize: 1.65, fitAxis: 'y', position: new THREE.Vector3(-8.15, 0, -17.55), rotationY: -Math.PI / 10, pedestalHeight: 0.22, pedestalPadding: 0.22, pedestalMaterial: room5DisplayMaterials.wood });
loadRoom5Artifact({ path: './images/room5/tea_cup_low_poly.glb', id: 'room5-tea-cup', targetSize: 0.34, fitAxis: 'max', position: new THREE.Vector3(-7.05, 0, -17.15), rotationY: Math.PI / 8, pedestalHeight: 0.18, pedestalPadding: 0.12, pedestalMaterial: room5DisplayMaterials.stone });
// Góc bàn làm việc giản dị (thay cho bộ mô hình "Hà Nội specialities" cũ có con dao).
// Dựng hoàn toàn bằng hình khối Three.js, không cần tải thêm mô hình.
function createRoom5WorkDesk() {
    const desk = new THREE.Group();
    desk.name = 'room5-work-desk';
    const wood = new THREE.MeshStandardMaterial({ color: 0x6b4428, roughness: 0.62, metalness: 0.02 });
    const darkWood = new THREE.MeshStandardMaterial({ color: 0x3f2717, roughness: 0.7 });
    const brass = new THREE.MeshStandardMaterial({ color: 0xc9a54a, roughness: 0.32, metalness: 0.85 });
    const lampShade = new THREE.MeshStandardMaterial({ color: 0x2f6b4a, roughness: 0.35, metalness: 0.15, side: THREE.DoubleSide });
    const lampBulb = new THREE.MeshBasicMaterial({ color: 0xfff1c4 });
    const paper = new THREE.MeshStandardMaterial({ color: 0xf1e8d2, roughness: 0.95 });
    const bookColors = [0x7a1f22, 0x284a63, 0x5d6b3a, 0x8a6a2e];

    const add = (geometry, material, x, y, z, ry = 0) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.rotation.y = ry;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        desk.add(mesh);
        return mesh;
    };

    // Bệ gỗ thấp, cùng ngôn ngữ với các bệ trưng bày khác trong phòng.
    add(new THREE.BoxGeometry(2.05, 0.2, 1.25), room5DisplayMaterials.wood.clone(), 0, 0.1, 0);
    // Mặt bàn, chân bàn và ngăn kéo.
    add(new THREE.BoxGeometry(1.6, 0.07, 0.82), wood, 0, 0.98, 0);
    [[-0.72, -0.34], [0.72, -0.34], [-0.72, 0.34], [0.72, 0.34]].forEach(([x, z]) => {
        add(new THREE.BoxGeometry(0.07, 0.76, 0.07), darkWood, x, 0.58, z);
    });
    add(new THREE.BoxGeometry(1.44, 0.14, 0.05), darkWood, 0, 0.87, 0.36);
    add(new THREE.BoxGeometry(1.44, 0.05, 0.05), darkWood, 0, 0.3, -0.34);
    add(new THREE.BoxGeometry(0.5, 0.11, 0.02), wood, 0.36, 0.87, 0.39);
    add(new THREE.SphereGeometry(0.018, 10, 8), brass, 0.36, 0.87, 0.405);

    // Đèn bàn chao xanh.
    add(new THREE.CylinderGeometry(0.1, 0.12, 0.03, 20), brass, -0.52, 1.03, -0.18);
    add(new THREE.CylinderGeometry(0.014, 0.014, 0.4, 10), brass, -0.52, 1.24, -0.18);
    const shade = add(new THREE.CylinderGeometry(0.07, 0.17, 0.13, 24, 1, true), lampShade, -0.52, 1.45, -0.18);
    shade.rotation.z = 0.08;
    add(new THREE.SphereGeometry(0.045, 12, 10), lampBulb, -0.52, 1.41, -0.18);

    // Chồng sách và cuốn sổ đang mở.
    bookColors.forEach((color, index) => {
        add(new THREE.BoxGeometry(0.34 - index * 0.02, 0.05, 0.24), new THREE.MeshStandardMaterial({ color, roughness: 0.82 }), 0.5, 1.04 + index * 0.05, -0.2, index * 0.12 - 0.15);
    });
    [-1, 1].forEach(side => {
        const page = add(new THREE.BoxGeometry(0.22, 0.012, 0.3), paper, 0.02 + side * 0.115, 1.022, 0.12, 0);
        page.rotation.z = side * -0.05;
    });
    add(new THREE.CylinderGeometry(0.006, 0.006, 0.17, 8), darkWood, 0.2, 1.03, 0.16, 0.6).rotation.z = Math.PI / 2;

    // Ánh đèn bàn ấm (chỉ là vầng sáng giả, không thêm nguồn sáng thật).
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 128;
    const glowCtx = glowCanvas.getContext('2d');
    const glowGradient = glowCtx.createRadialGradient(64, 64, 4, 64, 64, 64);
    glowGradient.addColorStop(0, 'rgba(255,214,140,0.55)');
    glowGradient.addColorStop(1, 'rgba(255,214,140,0)');
    glowCtx.fillStyle = glowGradient;
    glowCtx.fillRect(0, 0, 128, 128);
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    glowTexture.colorSpace = THREE.SRGBColorSpace;
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ map: glowTexture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.rotation.x = -Math.PI / 2;
    glow.position.set(-0.4, 1.02, -0.05);
    desk.add(glow);

    desk.position.set(-10.05, 0, -17.35);
    desk.rotation.y = Math.PI / 10;
    desk.userData.type = 'artifact';
    desk.userData.id = 'room5-work-desk';
    desk.userData.room = 'room5';
    desk.traverse(child => {
        if (!child.isMesh || child === glow) return;
        child.userData.type = 'artifact';
        child.userData.id = 'room5-work-desk';
        child.userData.room = 'room5';
        artifactInteractables.push(child);
    });
    scene.add(desk);
}
createRoom5WorkDesk();

// 2D sandal image as a framed, interactive interpretive display.
const room5SandalFrame = new THREE.Mesh(new THREE.BoxGeometry(2.55, 3.2, 0.1), room5DisplayMaterials.wood);
room5SandalFrame.position.set(room5.centerX + 2.35, 3.45, room5.bounds.maxZ - 0.14);
scene.add(room5SandalFrame);
const room5Sandal = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 3.0), new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./images/room5/dep-tong.png') }));
room5Sandal.position.set(room5.centerX + 2.35, 3.45, room5.bounds.maxZ - 0.2);
room5Sandal.rotation.y = Math.PI;
room5Sandal.userData.type = 'artifact'; room5Sandal.userData.id = 'room5-rubber-sandals'; room5Sandal.userData.room = 'room5';
scene.add(room5Sandal); artifactInteractables.push(room5Sandal);
createPlacard('Dép cao su - biểu tượng lối sống giản dị', 'Thế kỷ XX', 'Hình ảnh minh họa kiểu dép cao su gắn với phong cách sống giản dị, tiết kiệm và gần gũi.', new THREE.Vector3(room5.centerX + 2.35, 1.35, room5.bounds.maxZ - 0.2), Math.PI, 1.35, 0.62);

// Room 6 follows below; no Room 05 light or painting spotlight is added here.

// Đài tưởng niệm Chủ tịch Hồ Chí Minh ngoài khuôn viên: bia đá granite với
// phù điêu chân dung đồng (xử lý từ ảnh tư liệu) thay cho khối tượng giản lược cũ.
const statue = new THREE.Group();
statue.name = 'exterior-memorial';
const bronzeMaterial = new THREE.MeshStandardMaterial({ color: 0x8a6a3e, roughness: 0.42, metalness: 0.7 });
const statueStone = new THREE.MeshStandardMaterial({ color: 0x4a4644, roughness: 0.55, metalness: 0.05 });
const memorialGranite = new THREE.MeshStandardMaterial({ color: 0x252322, roughness: 0.22, metalness: 0.12 });
const memorialLightStone = new THREE.MeshStandardMaterial({ color: 0xd9d2c3, roughness: 0.7 });

function addMemorialPart(geometry, material, x, y, z) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    statue.add(mesh);
    return mesh;
}

addMemorialPart(new THREE.BoxGeometry(4.3, 0.28, 2.6), memorialLightStone, 0, 0.14, 0);
addMemorialPart(new THREE.BoxGeometry(3.7, 0.28, 2.1), statueStone, 0, 0.42, 0);
addMemorialPart(new THREE.BoxGeometry(2.8, 4.0, 0.6), memorialGranite, 0, 2.56, -0.2);
addMemorialPart(new THREE.BoxGeometry(3.1, 0.24, 0.82), statueStone, 0, 4.68, -0.2);
addMemorialPart(new THREE.BoxGeometry(2.4, 0.16, 0.6), memorialLightStone, 0, 4.88, -0.2);
[-1.52, 1.52].forEach(x => addMemorialPart(new THREE.BoxGeometry(0.14, 3.7, 0.66), bronzeMaterial, x, 2.5, -0.2));

function createMemorialCanvasTexture(width, height, draw) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    draw(canvas.getContext('2d'), canvas);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
}

// Phù điêu: ảnh chân dung được chuyển sang tông đồng, cắt oval, viền vàng.
const reliefMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.48, metalness: 0.55, transparent: true, alphaTest: 0.4 });
const relief = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 2.35), reliefMaterial);
relief.position.set(0, 3.0, 0.105);
statue.add(relief);
const reliefImage = new Image();
reliefImage.onload = () => {
    const width = 760;
    const height = 940;
    const texture = createMemorialCanvasTexture(width, height, (ctx) => {
        const cx = width / 2;
        const cy = height / 2;
        const rx = width / 2 - 20;
        const ry = height / 2 - 20;
        // Ảnh nằm gọn trong khung oval, ưu tiên phần khuôn mặt.
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx - 26, ry - 26, 0, 0, Math.PI * 2);
        ctx.clip();
        const scale = Math.max((rx * 2) / reliefImage.width, (ry * 2) / reliefImage.height);
        const drawW = reliefImage.width * scale;
        const drawH = reliefImage.height * scale;
        ctx.drawImage(reliefImage, cx - drawW / 2, cy - drawH / 2 + 18, drawW, drawH);
        const pixels = ctx.getImageData(0, 0, width, height);
        const data = pixels.data;
        for (let i = 0; i < data.length; i += 4) {
            const g = (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11) / 255;
            const t = Math.pow(g, 0.9);
            data[i] = 58 + t * 190;
            data[i + 1] = 38 + t * 142;
            data[i + 2] = 20 + t * 78;
        }
        ctx.putImageData(pixels, 0, 0);
        const vignette = ctx.createRadialGradient(cx, cy, rx * 0.55, cx, cy, ry);
        vignette.addColorStop(0, 'rgba(40,24,10,0)');
        vignette.addColorStop(1, 'rgba(40,24,10,0.55)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
        // Viền vàng hai lớp.
        ctx.lineWidth = 22;
        ctx.strokeStyle = '#b8903f';
        ctx.beginPath(); ctx.ellipse(cx, cy, rx - 14, ry - 14, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#f3d98a';
        ctx.beginPath(); ctx.ellipse(cx, cy, rx - 5, ry - 5, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx, cy, rx - 26, ry - 26, 0, 0, Math.PI * 2); ctx.stroke();
    });
    reliefMaterial.map = texture;
    reliefMaterial.needsUpdate = true;
};
reliefImage.src = './images/exhibits/room6-ho-chi-minh-portrait-1950s.jpg';

// Dòng chữ khắc vàng trên bia.
const inscription = new THREE.Mesh(
    new THREE.PlaneGeometry(2.45, 0.78),
    new THREE.MeshStandardMaterial({
        map: createMemorialCanvasTexture(1024, 326, (ctx, canvas) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#e8c874';
            ctx.font = '700 84px Georgia, "Times New Roman", serif';
            ctx.fillText('CHỦ TỊCH HỒ CHÍ MINH', canvas.width / 2, 118);
            ctx.font = '400 58px Georgia, "Times New Roman", serif';
            ctx.fillText('1890 – 1969', canvas.width / 2, 232);
        }),
        transparent: true,
        metalness: 0.6,
        roughness: 0.35
    })
);
inscription.position.set(0, 1.25, 0.105);
statue.add(inscription);

// Hai lẵng hoa tươi dâng hai bên bia.
const memorialFlowerMaterials = [
    new THREE.MeshStandardMaterial({ color: 0xf3c540, roughness: 0.7 }),
    new THREE.MeshStandardMaterial({ color: 0xc8202b, roughness: 0.7 })
];
const memorialFlowerGeometry = new THREE.SphereGeometry(0.075, 10, 8);
[-1.35, 1.35].forEach(x => {
    addMemorialPart(new THREE.CylinderGeometry(0.28, 0.2, 0.5, 16), bronzeMaterial, x, 0.81, 0.62);
    const bouquet = new THREE.Group();
    for (let i = 0; i < 16; i++) {
        const angle = i * 2.39996;
        const radius = 0.08 + 0.2 * Math.sqrt(i / 16);
        const bloom = new THREE.Mesh(memorialFlowerGeometry, memorialFlowerMaterials[i % 3 === 0 ? 0 : 1]);
        bloom.position.set(Math.cos(angle) * radius, 0.1 + (1 - radius) * 0.18, Math.sin(angle) * radius);
        bouquet.add(bloom);
    }
    bouquet.position.set(x, 1.0, 0.62);
    statue.add(bouquet);
});

statue.position.set(-8.5, 0, roomDepth / 2 + 9.5);
statue.rotation.y = 0.25;
scene.add(statue);

const statueLight = new THREE.SpotLight(0xffdfaa, 1.5, 16, Math.PI / 5, 0.55);
statueLight.position.set(-5, 8, roomDepth / 2 + 14);
statueLight.target = relief;
scene.add(statueLight);

// --- EXTERIOR LANDSCAPE: trees and ceremonial flags ---
// Lightweight procedural fallback: the courtyard remains local/offline and
// avoids adding heavy GLB dependencies while preserving a restrained museum
// character.
// Cây xanh cũ đã được thay bằng hệ cảnh quan mới ở cuối phần này.

function createFlagTexture(kind) {
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 320; // Tỷ lệ cờ chuẩn 2:3
    const ctx = canvas.getContext('2d');

    // Nền đỏ cờ
    ctx.fillStyle = '#da251d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Màu vàng biểu tượng
    ctx.fillStyle = '#ffde00';

    if (kind === 'national') {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const outer = canvas.height * 0.25;
        const inner = outer * 0.382;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const radius = i % 2 === 0 ? outer : inner;
            const angle = -Math.PI / 2 + (i * Math.PI) / 5;
            const px = cx + Math.cos(angle) * radius;
            const py = cy + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
    } else {
        // Cờ Đảng: Búa - Liềm chuẩn quy cách
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Tỷ lệ Búa - Liềm so với lá cờ
        const scale = 0.95;
        ctx.scale(scale, scale);

        // --- 1. VẼ LƯỠI LIỀM & CÁN LIỀM ---
        ctx.beginPath();
        // Vòng cung ngoài lưỡi liềm
        ctx.arc(0, 0, 60, -Math.PI * 0.55, Math.PI * 0.72, false);
        // Cán liềm (phần đuôi chéo phía dưới bên trái - dài gấp đôi hiện tại)
        ctx.lineTo(-130, 135);
        ctx.lineTo(-115, 145);
        ctx.lineTo(-75, 105);
        // Vòng cung trong lưỡi liềm (tạo độ dày và mũi nhọn)
        ctx.arc(0, 0, 42, Math.PI * 0.62, -Math.PI * 0.48, true);
        ctx.closePath();
        ctx.fill();

        // --- 2. VẼ BÚA (ĐẶT ĐÈ LÊN LIỀM, NGHIÊNG 45 ĐỘ) ---
        ctx.save();
        // Dịch chuyển toàn bộ búa (0: dịch ngang, 10: dịch xuống dưới 10px. Hãy chỉnh số 10 này)
        ctx.translate(0, 20);
        ctx.rotate(-Math.PI / 4); // Xoay búa góc 45 độ chuẩn

        ctx.beginPath();
        // Đầu búa (lùi xuống 8px)
        ctx.rect(-22, -54, 44, 26);
        // Cán búa dài (lùi xuống 8px)
        ctx.rect(-7, -28, 14, 105);
        ctx.fill();
        ctx.restore();

        ctx.restore();
    }
    return new THREE.CanvasTexture(canvas);
}

function createExteriorFlag(name, x, kind, direction = 1) {
    const group = new THREE.Group();
    group.name = name;
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x857a6a, roughness: 0.45, metalness: 0.55 });
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x6a6258, roughness: 0.82 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.68, 0.24, 12), baseMaterial);
    base.position.y = 0.12;
    group.add(base);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.08, 7.1, 10), poleMaterial);
    pole.position.y = 3.68;
    group.add(pole);
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), poleMaterial);
    finial.position.y = 7.3;
    group.add(finial);
    let flagTexture;
    if (kind === 'party') {
        flagTexture = new THREE.TextureLoader().load('./images/Co_Dang.png');
        flagTexture.colorSpace = THREE.SRGBColorSpace;
    } else if (kind === 'national') {
        flagTexture = new THREE.TextureLoader().load('./images/Co_VN.png');
        flagTexture.colorSpace = THREE.SRGBColorSpace;
    } else {
        flagTexture = createFlagTexture(kind);
    }
    const flagMaterial = new THREE.MeshBasicMaterial({
        map: flagTexture,
        // The public approach is +Z and PlaneGeometry's front face is +Z.
        // FrontSide prevents the browser from showing a mirrored backside.
        side: kind === 'party' ? THREE.FrontSide : THREE.DoubleSide
    });
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1.32), flagMaterial);
    flag.name = `${name}-cloth`;
    flag.position.set(direction * 0.95, 6.55, 0);
    // Both flags face the public approach (+Z). The old party-flag branch
    // rotated its plane by PI, so the DoubleSide backside mirrored the
    // hammer-and-sickle from the front courtyard view. Direction still only
    // controls which side of the pole the flag extends toward.
    flag.rotation.y = 0;
    flag.scale.set(1, 1, 1);
    flag.userData.flagKind = kind;
    flag.userData.texture = flagTexture;
    group.add(flag);
    group.position.set(x, 0, roomDepth / 2 + 5.7);
    group.traverse(object => { object.castShadow = true; object.receiveShadow = true; });
    scene.add(group);
    return group;
}

createExteriorFlag('exterior-national-flag', 5.3, 'national', 1);
createExteriorFlag('exterior-party-flag', -5.3, 'party', -1);

/* =====================================================================
   CẢNH QUAN NGOÀI TRỜI (thiết kế lại)
   Quảng trường lát đá trước tiền sảnh, trục đường chính giữa hai hàng
   cây, hai hồ sen đối xứng, bồn hoa, hàng rào cây xanh, ghế đá, cột đèn,
   tường bao và cổng chính có biển tên bảo tàng.
   Mọi chi tiết lặp lại (cây, hoa, song sắt, cột đèn...) đều gom bằng
   InstancedMesh để giữ số lệnh vẽ thấp, chạy mượt cả trên điện thoại.
   ===================================================================== */

const courtyard = new THREE.Group();
courtyard.name = 'courtyard';
scene.add(courtyard);

// Các khối vật cản ngoài trời: người chơi và hướng dẫn viên đều không đi xuyên qua.
const exteriorBlockers = [];
function addBlocker(minX, maxX, minZ, maxZ) {
    exteriorBlockers.push({ minX, maxX, minZ, maxZ });
}
function isBlockedOutdoors(position, padding = 0.32) {
    for (let i = 0; i < exteriorBlockers.length; i++) {
        const box = exteriorBlockers[i];
        if (position.x > box.minX - padding && position.x < box.maxX + padding &&
            position.z > box.minZ - padding && position.z < box.maxZ + padding) {
            return true;
        }
    }
    return false;
}

const instanceMatrix = new THREE.Matrix4();
const instancePosition = new THREE.Vector3();
const instanceQuaternion = new THREE.Quaternion();
const instanceEuler = new THREE.Euler();
const instanceScale = new THREE.Vector3(1, 1, 1);
const instanceTint = new THREE.Color();

/** Gom các chi tiết giống nhau vào một lệnh vẽ duy nhất. */
function buildInstanced(geometry, material, items, name) {
    if (!items.length) return null;
    const mesh = new THREE.InstancedMesh(geometry, material, items.length);
    mesh.name = name;
    let useColor = false;
    items.forEach((item, index) => {
        instancePosition.set(item.x || 0, item.y || 0, item.z || 0);
        instanceEuler.set(item.rx || 0, item.ry || 0, item.rz || 0, 'YXZ');
        instanceQuaternion.setFromEuler(instanceEuler);
        const scale = item.scale || 1;
        instanceScale.set(
            (item.sx !== undefined ? item.sx : 1) * scale,
            (item.sy !== undefined ? item.sy : 1) * scale,
            (item.sz !== undefined ? item.sz : 1) * scale
        );
        instanceMatrix.compose(instancePosition, instanceQuaternion, instanceScale);
        mesh.setMatrixAt(index, instanceMatrix);
        if (item.color !== undefined) {
            useColor = true;
            instanceTint.setHex(item.color);
            mesh.setColorAt(index, instanceTint);
        }
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (useColor && mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.frustumCulled = false;
    courtyard.add(mesh);
    return mesh;
}

function makeCanvasTexture(width, height, draw, repeatX = 1, repeatY = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    draw(canvas.getContext('2d'), canvas);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.anisotropy = 4;
    return texture;
}

const grassTexture = makeCanvasTexture(256, 256, (ctx, canvas) => {
    ctx.fillStyle = '#6f8a51';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 2400; i++) {
        ctx.fillStyle = ['#7d9a5c', '#637d49', '#879e5f', '#5a7342'][i % 4];
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1 + Math.random() * 2.4, 1 + Math.random() * 3.4);
    }
}, 26, 24);

const plazaTexture = makeCanvasTexture(256, 256, (ctx, canvas) => {
    ctx.fillStyle = '#cfc7b6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const tile = 64;
    for (let y = 0; y < canvas.height; y += tile) {
        for (let x = 0; x < canvas.width; x += tile) {
            const tone = 200 + Math.floor(Math.random() * 22);
            ctx.fillStyle = `rgb(${tone}, ${tone - 8}, ${tone - 22})`;
            ctx.fillRect(x + 1.5, y + 1.5, tile - 3, tile - 3);
        }
    }
    ctx.strokeStyle = 'rgba(120,110,96,0.55)';
    ctx.lineWidth = 2;
    for (let y = 0; y <= canvas.height; y += tile) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    for (let x = 0; x <= canvas.width; x += tile) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
}, 12, 10);

const pathTexture = makeCanvasTexture(256, 256, (ctx, canvas) => {
    ctx.fillStyle = '#d8cdb6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const brickH = 32;
    const brickW = 64;
    for (let row = 0, y = 0; y < canvas.height; y += brickH, row++) {
        const offset = row % 2 ? brickW / 2 : 0;
        for (let x = -brickW; x < canvas.width + brickW; x += brickW) {
            const tone = 206 + Math.floor(Math.random() * 20);
            ctx.fillStyle = `rgb(${tone}, ${tone - 12}, ${tone - 30})`;
            ctx.fillRect(x + offset + 1.5, y + 1.5, brickW - 3, brickH - 3);
        }
    }
}, 4, 14);

const waterTexture = makeCanvasTexture(256, 256, (ctx, canvas) => {
    ctx.fillStyle = '#2c5a63';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(190, 232, 236, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 26; i++) {
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= canvas.width; x += 16) {
            ctx.lineTo(x, y + Math.sin((x / canvas.width) * Math.PI * 4 + i) * 4);
        }
        ctx.stroke();
    }
}, 2, 2);

const courtyardMaterials = {
    grass: new THREE.MeshStandardMaterial({ map: grassTexture, roughness: 1 }),
    plaza: new THREE.MeshStandardMaterial({ map: plazaTexture, roughness: 0.92 }),
    path: new THREE.MeshStandardMaterial({ map: pathTexture, roughness: 0.9 }),
    stone: new THREE.MeshStandardMaterial({ color: 0xd6ceba, roughness: 0.86 }),
    darkStone: new THREE.MeshStandardMaterial({ color: 0x6d6558, roughness: 0.8 }),
    water: new THREE.MeshStandardMaterial({
        map: waterTexture, color: 0x9fd5db, roughness: 0.16, metalness: 0.32,
        transparent: true, opacity: 0.92
    }),
    hedge: new THREE.MeshStandardMaterial({ color: 0x4c6b3a, roughness: 0.96 }),
    trunk: new THREE.MeshStandardMaterial({ color: 0x5b3a26, roughness: 0.94 }),
    foliage: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.94 }),
    palmLeaf: new THREE.MeshStandardMaterial({ color: 0x55793f, roughness: 0.92, side: THREE.DoubleSide }),
    lotusPetal: new THREE.MeshStandardMaterial({ color: 0xf3b9cd, roughness: 0.72, side: THREE.DoubleSide }),
    lotusHeart: new THREE.MeshStandardMaterial({ color: 0xe9c95c, roughness: 0.6 }),
    leafGreen: new THREE.MeshStandardMaterial({ color: 0x4d7c46, roughness: 0.9, side: THREE.DoubleSide }),
    bloom: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }),
    soil: new THREE.MeshStandardMaterial({ color: 0x4a3a2b, roughness: 1 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x6d6a63, roughness: 0.42, metalness: 0.62 }),
    lampGlass: new THREE.MeshStandardMaterial({ color: 0xfff2cf, emissive: 0xffd79a, emissiveIntensity: 0.4, roughness: 0.3 }),
    perimeter: new THREE.MeshStandardMaterial({ color: 0xd9d0bc, roughness: 0.9 }),
    railing: new THREE.MeshStandardMaterial({ color: 0x3d3a35, roughness: 0.5, metalness: 0.55 })
};

const foliageTones = [0x3f6136, 0x4f7540, 0x6a8f4c, 0x58803f];
const banBlossomTones = [0xe9a3c2, 0x5f8a45, 0xf3c9db, 0x6d9a4c];
const phoenixBlossomTones = [0xd9412b, 0x5d8a3f, 0xe8622f, 0x4f7a38];
const unitBox = new THREE.BoxGeometry(1, 1, 1);

function addCourtyardMesh(geometry, material, x, y, z, rotationY = 0) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.y = rotationY;
    courtyard.add(mesh);
    return mesh;
}

// --- 1. Nền: bãi cỏ lớn, quảng trường lát đá và trục đường chính ---
const lawn = new THREE.Mesh(new THREE.PlaneGeometry(130, 118), courtyardMaterials.grass);
lawn.rotation.x = -Math.PI / 2;
lawn.position.set(0, -0.05, entranceZ + 16);
courtyard.add(lawn);

const plaza = new THREE.Mesh(new THREE.PlaneGeometry(31, 14.2), courtyardMaterials.plaza);
plaza.rotation.x = -Math.PI / 2;
plaza.position.set(0, 0, entranceZ + 6.6);
courtyard.add(plaza);

const mainPath = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 21.5), courtyardMaterials.path);
mainPath.rotation.x = -Math.PI / 2;
mainPath.position.set(0, 0.005, entranceZ + 23.2);
courtyard.add(mainPath);

// Hai lối dạo men theo rìa vườn, nối quảng trường với khu hồ sen.
[-1, 1].forEach(side => {
    const sidePath = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 18), courtyardMaterials.path);
    sidePath.rotation.x = -Math.PI / 2;
    sidePath.position.set(side * 18, 0.005, entranceZ + 21.5);
    courtyard.add(sidePath);
});

// Viền đá quanh quảng trường.
buildInstanced(unitBox, courtyardMaterials.stone, [
    { x: -15.5, y: 0.08, z: entranceZ + 6.6, sx: 0.36, sy: 0.16, sz: 14.2 },
    { x: 15.5, y: 0.08, z: entranceZ + 6.6, sx: 0.36, sy: 0.16, sz: 14.2 },
    { x: 0, y: 0.08, z: entranceZ + 13.75, sx: 31.4, sy: 0.16, sz: 0.36 }
], 'courtyard-kerbs');

// --- 2. Hai hồ sen đối xứng ---
const padItems = [];
const petalItems = [];
const heartItems = [];
const pondRimItems = [];

function createLotusPond(centerX, centerZ, width, depth) {
    addCourtyardMesh(new THREE.BoxGeometry(width, 0.5, depth), courtyardMaterials.darkStone, centerX, -0.3, centerZ);

    const water = new THREE.Mesh(new THREE.PlaneGeometry(width - 0.7, depth - 0.7), courtyardMaterials.water.clone());
    water.rotation.x = -Math.PI / 2;
    water.position.set(centerX, 0.16, centerZ);
    water.name = 'pond-water';
    courtyard.add(water);

    pondRimItems.push(
        { x: centerX + width / 2 - 0.17, y: 0.16, z: centerZ, sx: 0.34, sy: 0.44, sz: depth },
        { x: centerX - width / 2 + 0.17, y: 0.16, z: centerZ, sx: 0.34, sy: 0.44, sz: depth },
        { x: centerX, y: 0.16, z: centerZ + depth / 2 - 0.17, sx: width, sy: 0.44, sz: 0.34 },
        { x: centerX, y: 0.16, z: centerZ - depth / 2 + 0.17, sx: width, sy: 0.44, sz: 0.34 }
    );

    for (let i = 0; i < 18; i++) {
        padItems.push({
            x: centerX + (Math.random() - 0.5) * (width - 1.9),
            y: 0.18,
            z: centerZ + (Math.random() - 0.5) * (depth - 1.9),
            rx: -Math.PI / 2,
            scale: 0.75 + Math.random() * 0.75
        });
    }

    for (let i = 0; i < 7; i++) {
        const fx = centerX + (Math.random() - 0.5) * (width - 2.6);
        const fz = centerZ + (Math.random() - 0.5) * (depth - 2.6);
        const flowerScale = 0.85 + Math.random() * 0.4;
        heartItems.push({ x: fx, y: 0.2 + 0.14 * flowerScale, z: fz, scale: flowerScale });
        for (let p = 0; p < 7; p++) {
            const angle = (p / 7) * Math.PI * 2;
            petalItems.push({
                x: fx + Math.cos(angle) * 0.11 * flowerScale,
                y: 0.2 + 0.14 * flowerScale,
                z: fz + Math.sin(angle) * 0.11 * flowerScale,
                rx: Math.cos(angle) * 0.62,
                ry: -angle,
                rz: Math.sin(angle) * 0.62,
                scale: flowerScale
            });
        }
    }

    addBlocker(centerX - width / 2, centerX + width / 2, centerZ - depth / 2, centerZ + depth / 2);
}

createLotusPond(-11.5, entranceZ + 19, 9, 12);
createLotusPond(11.5, entranceZ + 19, 9, 12);

buildInstanced(unitBox, courtyardMaterials.stone, pondRimItems, 'pond-rims');
buildInstanced(new THREE.CircleGeometry(0.32, 12), courtyardMaterials.leafGreen, padItems, 'lotus-pads');
buildInstanced(new THREE.ConeGeometry(0.085, 0.3, 6, 1, true), courtyardMaterials.lotusPetal, petalItems, 'lotus-petals');
buildInstanced(new THREE.SphereGeometry(0.1, 10, 8), courtyardMaterials.lotusHeart, heartItems, 'lotus-hearts');

const pondWaterMeshes = courtyard.children.filter(child => child.name === 'pond-water');

// Chân hai cột cờ trước tiền sảnh cũng là vật cản.
[-5.3, 5.3].forEach(x => addBlocker(x - 0.75, x + 0.75, entranceZ + 4.95, entranceZ + 6.45));

// --- 3. Cây xanh ---
const trunkItems = [];
const canopyItems = [];
const palmTrunkItems = [];
const palmLeafItems = [];
const palmCrownItems = [];

function addShadeTree(x, z, scale = 1, blocking = true, tones = foliageTones) {
    const spin = Math.random() * Math.PI;
    trunkItems.push({ x, y: 1.45 * scale, z, ry: spin, scale });
    [
        [0, 3.55, 0, 1.45],
        [0.75, 3.05, 0.35, 1.0],
        [-0.72, 3.15, -0.3, 0.95],
        [0.15, 4.35, -0.35, 0.88]
    ].forEach(([dx, dy, dz, radius], index) => {
        canopyItems.push({
            x: x + dx * scale,
            y: dy * scale,
            z: z + dz * scale,
            ry: spin,
            sx: radius * scale,
            sy: radius * 0.86 * scale,
            sz: radius * scale,
            color: tones[(index + Math.floor(Math.abs(x))) % tones.length]
        });
    });
    if (blocking) addBlocker(x - 0.45 * scale, x + 0.45 * scale, z - 0.45 * scale, z + 0.45 * scale);
}

function addPalmTree(x, z, scale = 1) {
    palmTrunkItems.push({ x, y: 2.3 * scale, z, scale });
    palmCrownItems.push({ x, y: 4.6 * scale, z, scale });
    for (let i = 0; i < 9; i++) {
        const angle = (i / 9) * Math.PI * 2;
        palmLeafItems.push({
            x: x + Math.cos(angle) * 0.95 * scale,
            y: 4.55 * scale,
            z: z + Math.sin(angle) * 0.95 * scale,
            rx: -Math.PI / 2.5,
            ry: -angle,
            scale
        });
    }
    addBlocker(x - 0.4 * scale, x + 0.4 * scale, z - 0.4 * scale, z + 0.4 * scale);
}

[-1, 1].forEach(side => {
    [entranceZ + 8.5, entranceZ + 15.5, entranceZ + 22, entranceZ + 30].forEach((z, index) => {
        // Xen kẽ cây xanh với cây hoa ban (trắng hồng) và phượng (đỏ cam).
        const tones = index % 2 === 1 ? (side < 0 ? banBlossomTones : phoenixBlossomTones) : foliageTones;
        addShadeTree(side * 20.5, z, 0.96 + (index % 2) * 0.16, true, tones);
    });
    addShadeTree(side * 7.6, entranceZ + 31.6, 0.9);
    addPalmTree(side * 7.2, entranceZ + 16.2, 0.95);
    addPalmTree(side * 7.2, entranceZ + 24.5, 0.95);
});

// Hàng cây nền phía sau tường bao để che đường chân trời (không cần vật cản).
[-1, 1].forEach(side => {
    for (let i = 0; i < 6; i++) {
        addShadeTree(side * (29 + Math.random() * 6), entranceZ + 2 + i * 7.5, 1.25, false);
    }
});
for (let i = 0; i < 7; i++) {
    addShadeTree(-24 + i * 8, entranceZ + 39 + Math.random() * 4, 1.3, false);
}

buildInstanced(new THREE.CylinderGeometry(0.17, 0.28, 2.9, 7), courtyardMaterials.trunk, trunkItems, 'tree-trunks');
buildInstanced(new THREE.IcosahedronGeometry(1, 1), courtyardMaterials.foliage, canopyItems, 'tree-canopies');
buildInstanced(new THREE.CylinderGeometry(0.13, 0.22, 4.6, 7), courtyardMaterials.trunk, palmTrunkItems, 'palm-trunks');
buildInstanced(new THREE.PlaneGeometry(0.52, 2.5), courtyardMaterials.palmLeaf, palmLeafItems, 'palm-leaves');
buildInstanced(new THREE.SphereGeometry(0.3, 8, 6), courtyardMaterials.leafGreen, palmCrownItems, 'palm-crowns');

// --- 4. Hàng rào cây xanh viền lối đi ---
const hedgeItems = [];
[-1, 1].forEach(side => {
    [[entranceZ + 15.4, 8.6], [entranceZ + 25.6, 8.4]].forEach(([z, length]) => {
        hedgeItems.push({ x: side * 4.9, y: 0.36, z, sx: 0.85, sy: 0.72, sz: length });
        addBlocker(side * 4.9 - 0.42, side * 4.9 + 0.42, z - length / 2, z + length / 2);
    });
});
buildInstanced(unitBox, courtyardMaterials.hedge, hedgeItems, 'hedges');

// --- 5. Bồn hoa tròn ---
const bedKerbItems = [];
const bedSoilItems = [];
const bloomItems = [];
const bloomLeafItems = [];

function addFlowerBed(x, z, radius = 1.5) {
    bedKerbItems.push({ x, y: 0.17, z, sx: radius, sy: 1, sz: radius });
    bedSoilItems.push({ x, y: 0.19, z, sx: radius - 0.14, sy: 1, sz: radius - 0.14 });
    const count = Math.round(radius * 12);
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.sqrt(Math.random()) * (radius - 0.35);
        const bx = x + Math.cos(angle) * dist;
        const bz = z + Math.sin(angle) * dist;
        bloomItems.push({ x: bx, y: 0.42, z: bz, color: i % 3 === 0 ? 0xe8bb3c : 0xc32b31 });
        bloomLeafItems.push({ x: bx, y: 0.33, z: bz, sx: 1, sy: 0.45, sz: 1 });
    }
    addBlocker(x - radius, x + radius, z - radius, z + radius);
}

addFlowerBed(0, entranceZ + 31, 2.3);
[-1, 1].forEach(side => {
    addFlowerBed(side * 13.2, entranceZ + 6.4, 1.5);
    addFlowerBed(side * 13.2, entranceZ + 11.4, 1.5);
    addFlowerBed(side * 11.5, entranceZ + 29.6, 1.35);
});

// Vòng hoa quanh bệ tượng Chủ tịch Hồ Chí Minh.
for (let i = 0; i < 14; i++) {
    const angle = (i / 14) * Math.PI * 2;
    const ringX = -8.5 + Math.cos(angle) * 3.05;
    const ringZ = entranceZ + 9.5 + Math.sin(angle) * 3.05;
    bloomItems.push({ x: ringX, y: 0.36, z: ringZ, scale: 1.5, color: i % 2 ? 0xc32b31 : 0xe8bb3c });
    bloomLeafItems.push({ x: ringX, y: 0.24, z: ringZ, sx: 1.7, sy: 0.8, sz: 1.7 });
}

buildInstanced(new THREE.CylinderGeometry(1, 1, 0.34, 18), courtyardMaterials.stone, bedKerbItems, 'bed-kerbs');
buildInstanced(new THREE.CylinderGeometry(1, 1, 0.36, 18), courtyardMaterials.soil, bedSoilItems, 'bed-soil');
buildInstanced(new THREE.SphereGeometry(0.1, 8, 6), courtyardMaterials.bloom, bloomItems, 'blooms');
buildInstanced(new THREE.SphereGeometry(0.14, 8, 6), courtyardMaterials.leafGreen, bloomLeafItems, 'bloom-leaves');

// --- 6. Ghế đá và cột đèn ---
const benchSeatItems = [];
const benchBackItems = [];
const benchLegItems = [];

function addStoneBench(x, z, rotationY) {
    const cos = Math.cos(rotationY);
    const sin = Math.sin(rotationY);
    benchSeatItems.push({ x, y: 0.48, z, ry: rotationY, sx: 2.2, sy: 0.16, sz: 0.62 });
    benchBackItems.push({ x: x - sin * 0.24, y: 0.78, z: z - cos * 0.24, ry: rotationY, sx: 2.2, sy: 0.52, sz: 0.12 });
    [-0.85, 0.85].forEach(offset => {
        benchLegItems.push({
            x: x + cos * offset,
            y: 0.22,
            z: z - sin * offset,
            ry: rotationY,
            sx: 0.2, sy: 0.44, sz: 0.56
        });
    });
    const halfW = Math.abs(cos) * 1.1 + 0.35;
    const halfD = Math.abs(sin) * 1.1 + 0.35;
    addBlocker(x - halfW, x + halfW, z - halfD, z + halfD);
}

[-1, 1].forEach(side => {
    addStoneBench(side * 7.2, entranceZ + 13.2, side > 0 ? -Math.PI / 2 : Math.PI / 2);
    addStoneBench(side * 7.2, entranceZ + 27.2, side > 0 ? -Math.PI / 2 : Math.PI / 2);
});

buildInstanced(unitBox, courtyardMaterials.stone, benchSeatItems, 'bench-seats');
buildInstanced(unitBox, courtyardMaterials.stone, benchBackItems, 'bench-backs');
buildInstanced(unitBox, courtyardMaterials.darkStone, benchLegItems, 'bench-legs');

const lampBaseItems = [];
const lampPoleItems = [];
const lampHeadItems = [];
const lampCapItems = [];

function addLampPost(x, z, withLight) {
    lampBaseItems.push({ x, y: 0.15, z });
    lampPoleItems.push({ x, y: 1.9, z });
    lampHeadItems.push({ x, y: 3.78, z });
    lampCapItems.push({ x, y: 4.02, z });
    addBlocker(x - 0.3, x + 0.3, z - 0.3, z + 0.3);
    // Chỉ một phần cột mang nguồn sáng thật, giữ ngân sách ánh sáng của cảnh.
    if (withLight) {
        const light = new THREE.PointLight(0xffd3a0, 0.9, 18, 2);
        light.position.set(x, 3.8, z);
        light.name = `courtyard-lamp-${x}-${z}`;
        nightLightsGroup.add(light);
    }
}

[-1, 1].forEach(side => {
    // Cột đèn đầu tiên được bỏ vì hàng cột hiên và cột cờ đã chiếm chỗ.
    [entranceZ + 11.6, entranceZ + 18.6, entranceZ + 25.6, entranceZ + 32.2].forEach((z, index) => {
        addLampPost(side * 5.6, z, index === 0 || index === 2);
    });
});

buildInstanced(new THREE.CylinderGeometry(0.22, 0.28, 0.3, 8), courtyardMaterials.darkStone, lampBaseItems, 'lamp-bases');
buildInstanced(new THREE.CylinderGeometry(0.07, 0.09, 3.5, 7), courtyardMaterials.metal, lampPoleItems, 'lamp-poles');
buildInstanced(new THREE.SphereGeometry(0.26, 10, 8), courtyardMaterials.lampGlass, lampHeadItems, 'lamp-heads');
buildInstanced(new THREE.ConeGeometry(0.3, 0.24, 8), courtyardMaterials.metal, lampCapItems, 'lamp-caps');

// --- 7. Bia đá khắc lời của Chủ tịch Hồ Chí Minh (đối xứng với tượng) ---
function createQuoteStele() {
    const stele = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.42, 1.5), courtyardMaterials.darkStone);
    base.position.y = 0.21;
    stele.add(base);
    const slab = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 0.42), courtyardMaterials.stone);
    slab.position.y = 1.42;
    stele.add(slab);

    const texture = makeCanvasTexture(1024, 700, (ctx, canvas) => {
        ctx.fillStyle = '#7d1717';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 10;
        ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);
        ctx.fillStyle = '#ffe7a0';
        ctx.textAlign = 'center';
        ctx.font = 'bold 74px Georgia, serif';
        ctx.fillText('"Không có gì quý hơn', canvas.width / 2, 240);
        ctx.fillText('độc lập, tự do"', canvas.width / 2, 340);
        ctx.font = 'italic 48px Georgia, serif';
        ctx.fillText('— Hồ Chí Minh —', canvas.width / 2, 480);
        ctx.font = '34px Arial';
        ctx.fillStyle = 'rgba(255,231,160,0.72)';
        ctx.fillText('Lời kêu gọi ngày 17 tháng 7 năm 1966', canvas.width / 2, 570);
    }, 1, 1);

    const plate = new THREE.Mesh(new THREE.PlaneGeometry(2.85, 1.85), new THREE.MeshBasicMaterial({ map: texture }));
    plate.position.set(0, 1.42, 0.22);
    stele.add(plate);

    stele.position.set(8.5, 0, entranceZ + 9.5);
    stele.rotation.y = -0.25;
    courtyard.add(stele);
    addBlocker(6.6, 10.4, entranceZ + 8.6, entranceZ + 10.4);
}
createQuoteStele();

// Bệ đá quanh tượng Chủ tịch Hồ Chí Minh.
const statueApron = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.6, 0.18, 24), courtyardMaterials.plaza);
statueApron.position.set(-8.5, 0.09, entranceZ + 9.5);
courtyard.add(statueApron);
addBlocker(-10.2, -6.8, entranceZ + 8.2, entranceZ + 10.8);

// --- 8. Tường bao và cổng chính ---
const railingBarItems = [];

function createPerimeterRun(x, z, length, rotationY) {
    addCourtyardMesh(new THREE.BoxGeometry(length, 0.85, 0.45), courtyardMaterials.perimeter, x, 0.42, z, rotationY);
    addCourtyardMesh(new THREE.BoxGeometry(length, 0.09, 0.1), courtyardMaterials.railing, x, 1.42, z, rotationY);

    const barCount = Math.floor(length / 0.9);
    for (let i = 0; i <= barCount; i++) {
        const offset = -length / 2 + (i * length) / barCount;
        railingBarItems.push({
            x: x + Math.cos(rotationY) * offset,
            y: 0.92,
            z: z - Math.sin(rotationY) * offset,
            ry: rotationY
        });
    }
}

[-1, 1].forEach(side => {
    createPerimeterRun(side * 25.6, entranceZ + 17, 34, Math.PI / 2);
    addBlocker(side * 25.6 - 0.5, side * 25.6 + 0.5, entranceZ, entranceZ + 34);
    createPerimeterRun(side * 15.6, entranceZ + 34, 20, 0);
    addBlocker(side * 15.6 - 10, side * 15.6 + 10, entranceZ + 33.5, entranceZ + 34.5);
});

function createMainGate() {
    const gate = new THREE.Group();
    gate.position.set(0, 0, entranceZ + 34);
    courtyard.add(gate);

    const pillarSpec = [
        [new THREE.BoxGeometry(1.5, 5.2, 1.5), courtyardMaterials.perimeter, 2.6],
        [new THREE.BoxGeometry(1.9, 0.3, 1.9), courtyardMaterials.stone, 5.35],
        [new THREE.ConeGeometry(0.42, 0.8, 6), courtyardMaterials.stone, 5.9]
    ];
    pillarSpec.forEach(([geometry, material, y]) => {
        const mesh = new THREE.InstancedMesh(geometry, material, 2);
        [-1, 1].forEach((side, index) => {
            instancePosition.set(side * 5.6, y, 0);
            instanceQuaternion.identity();
            instanceScale.set(1, 1, 1);
            instanceMatrix.compose(instancePosition, instanceQuaternion, instanceScale);
            mesh.setMatrixAt(index, instanceMatrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
        mesh.frustumCulled = false;
        gate.add(mesh);
    });
    [-1, 1].forEach(side => {
        addBlocker(side * 5.6 - 0.85, side * 5.6 + 0.85, entranceZ + 33.2, entranceZ + 34.8);
    });

    const lintel = new THREE.Mesh(new THREE.BoxGeometry(12.6, 1.05, 0.85), courtyardMaterials.perimeter);
    lintel.position.set(0, 5.6, 0);
    gate.add(lintel);

    const signTexture = makeCanvasTexture(1400, 200, (ctx, canvas) => {
        ctx.fillStyle = '#7d1717';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 10;
        ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
        ctx.fillStyle = '#ffe7a0';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 92px Arial';
        ctx.fillText('BẢO TÀNG HỒ CHÍ MINH', canvas.width / 2, canvas.height / 2 + 4);
    }, 1, 1);

    const signMaterial = new THREE.MeshBasicMaterial({ map: signTexture, side: THREE.DoubleSide });
    [0.45, -0.45].forEach(dz => {
        const sign = new THREE.Mesh(new THREE.PlaneGeometry(11.4, 1.6), signMaterial);
        sign.position.set(0, 5.62, dz);
        sign.rotation.y = dz > 0 ? 0 : Math.PI;
        gate.add(sign);
    });

    // Ngôi sao vàng trên đỉnh cổng.
    const star = new THREE.Mesh(new THREE.CircleGeometry(0.62, 5), new THREE.MeshBasicMaterial({ color: 0xffde00, side: THREE.DoubleSide }));
    star.position.set(0, 6.75, 0);
    gate.add(star);
    const starPost = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.1, 0.14), courtyardMaterials.metal);
    starPost.position.set(0, 6.2, 0);
    gate.add(starPost);
}
createMainGate();

buildInstanced(new THREE.BoxGeometry(0.07, 1.05, 0.07), courtyardMaterials.railing, railingBarItems, 'railing-bars');

// --- 9. Bảng chỉ dẫn ở đầu lối đi ---
function createWelcomeBoard() {
    const board = new THREE.Group();
    const posts = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 2.1, 0.16), courtyardMaterials.metal, 2);
    [-1.35, 1.35].forEach((dx, index) => {
        instancePosition.set(dx, 1.05, 0);
        instanceQuaternion.identity();
        instanceScale.set(1, 1, 1);
        instanceMatrix.compose(instancePosition, instanceQuaternion, instanceScale);
        posts.setMatrixAt(index, instanceMatrix);
    });
    posts.instanceMatrix.needsUpdate = true;
    posts.frustumCulled = false;
    board.add(posts);

    const panel = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.7, 0.12), courtyardMaterials.darkStone);
    panel.position.y = 1.85;
    board.add(panel);

    const texture = makeCanvasTexture(760, 420, (ctx, canvas) => {
        ctx.fillStyle = '#1d1a17';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#c7a448';
        ctx.lineWidth = 8;
        ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);
        ctx.fillStyle = '#f2dc9c';
        ctx.textAlign = 'center';
        ctx.font = 'bold 46px Arial';
        ctx.fillText('CHÀO MỪNG QUÝ KHÁCH', canvas.width / 2, 92);
        ctx.font = '30px Arial';
        ctx.fillStyle = '#efe6d2';
        ctx.fillText('Khuôn viên · Quảng trường · Tiền sảnh', canvas.width / 2, 160);
        ctx.fillText('6 phòng trưng bày theo dòng lịch sử', canvas.width / 2, 210);
        ctx.font = '26px Arial';
        ctx.fillStyle = 'rgba(242,220,156,0.78)';
        ctx.fillText('Hướng dẫn viên đồng hành và thuyết minh', canvas.width / 2, 285);
        ctx.fillText('Phím V: đổi góc nhìn · Phím M: bật/tắt lời', canvas.width / 2, 330);
    }, 1, 1);

    const plate = new THREE.Mesh(new THREE.PlaneGeometry(2.85, 1.5), new THREE.MeshBasicMaterial({ map: texture }));
    plate.position.set(0, 1.85, 0.07);
    board.add(plate);

    board.position.set(-8.4, 0, entranceZ + 30.5);
    board.rotation.y = 0.55;
    courtyard.add(board);
    addBlocker(-9.8, -7, entranceZ + 30, entranceZ + 31);
}
createWelcomeBoard();

// --- 10. Vòm trời ngày và đêm (shader: mây trôi, nắng, sao và trăng) ---
const SUN_DIRECTION = new THREE.Vector3(-0.52, 0.66, 0.54).normalize();
const MOON_DIRECTION = new THREE.Vector3(0.35, 0.5, -0.79).normalize();
const skyUniforms = {
    uNight: { value: 0 },
    uTime: { value: 0 },
    uSunDir: { value: SUN_DIRECTION.clone() },
    uMoonDir: { value: MOON_DIRECTION.clone() }
};
const skyDome = new THREE.Mesh(
    new THREE.SphereGeometry(320, 48, 24),
    new THREE.ShaderMaterial({
        uniforms: skyUniforms,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        vertexShader: /* glsl */`
            varying vec3 vDir;
            void main() {
                vDir = normalize(position);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: /* glsl */`
            uniform float uNight;
            uniform float uTime;
            uniform vec3 uSunDir;
            uniform vec3 uMoonDir;
            varying vec3 vDir;
            float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
            float hash3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
            float noise(vec2 p) {
                vec2 i = floor(p); vec2 f = fract(p);
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
            }
            float fbm(vec2 p) {
                float v = 0.0; float a = 0.5;
                for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
                return v;
            }
            void main() {
                vec3 dir = normalize(vDir);
                float h = dir.y;
                float up = clamp(h, 0.0, 1.0);

                // Ban ngày: xanh trong ở thiên đỉnh, sáng dần xuống chân trời.
                vec3 dayZenith = vec3(0.13, 0.33, 0.72);
                vec3 dayMid = vec3(0.36, 0.58, 0.86);
                vec3 dayHorizon = vec3(0.80, 0.86, 0.90);
                vec3 day = mix(dayHorizon, dayMid, smoothstep(0.0, 0.28, up));
                day = mix(day, dayZenith, smoothstep(0.25, 0.95, up));
                float sunDot = max(dot(dir, uSunDir), 0.0);
                day += vec3(1.0, 0.86, 0.62) * (pow(sunDot, 900.0) * 14.0 + pow(sunDot, 10.0) * 0.28);

                // Đêm: xanh thẫm, dải sáng gần chân trời, sao lấp lánh và trăng.
                vec3 nightZenith = vec3(0.008, 0.016, 0.05);
                vec3 nightHorizon = vec3(0.07, 0.11, 0.22);
                vec3 night = mix(nightHorizon, nightZenith, smoothstep(0.0, 0.55, up));
                vec3 cell = floor(dir * 380.0);
                float star = step(0.9975, hash3(cell));
                float twinkle = 0.6 + 0.4 * sin(uTime * 2.3 + hash3(cell + 3.1) * 40.0);
                night += vec3(0.9, 0.93, 1.0) * star * twinkle * smoothstep(0.02, 0.2, up) * (0.5 + hash3(cell + 7.0));
                float moonDot = dot(dir, uMoonDir);
                night += vec3(1.0, 0.97, 0.88) * smoothstep(0.99955, 0.99975, moonDot) * 2.2;
                night += vec3(0.35, 0.42, 0.6) * pow(max(moonDot, 0.0), 220.0) * 0.35;

                // Mây: chiếu hướng nhìn lên mặt phẳng trời rồi dùng fbm.
                vec2 cloudUv = dir.xz / (h + 0.18) * 1.35 + vec2(uTime * 0.006, uTime * 0.002);
                float c = fbm(cloudUv * 1.4);
                float coverage = smoothstep(0.52, 0.82, c) * smoothstep(0.02, 0.22, h);
                vec3 dayCloud = mix(vec3(0.78, 0.8, 0.84), vec3(1.0, 0.99, 0.96), smoothstep(0.55, 0.9, c) + sunDot * 0.2);
                vec3 nightCloud = vec3(0.09, 0.11, 0.18);
                day = mix(day, dayCloud, coverage * 0.9);
                night = mix(night, nightCloud, coverage * 0.38);

                vec3 color = mix(day, night, uNight);
                // Nhiễu nhỏ để tránh các dải màu (banding) trên nền trời đêm.
                color += (hash(gl_FragCoord.xy) - 0.5) / 160.0;
                // Phía dưới chân trời hòa vào màu sương mù.
                vec3 below = mix(vec3(0.72, 0.78, 0.80), vec3(0.05, 0.07, 0.13), uNight);
                color = mix(below, color, smoothstep(-0.06, 0.02, h));
                gl_FragColor = vec4(color, 1.0);
                #include <tonemapping_fragment>
                #include <colorspace_fragment>
            }
        `
    })
);
skyDome.name = 'sky-dome';
skyDome.renderOrder = -10;
skyDome.frustumCulled = false;
scene.add(skyDome);

function updateSkyForTheme(night) {
    skyUniforms.uNight.value = night ? 1 : 0;
}

// --- 11. Hiệu ứng động nhẹ: mặt nước gợn sóng ---
function updateCourtyard(delta) {
    skyUniforms.uTime.value += delta;
    const drift = delta * 0.05;
    pondWaterMeshes.forEach((water, index) => {
        const map = water.material.map;
        if (!map) return;
        map.offset.x = (map.offset.x + drift * (index ? 1 : -1)) % 1;
        map.offset.y = (map.offset.y + drift * 0.6) % 1;
    });
}

// Sương mù xa hơn khi ở ngoài trời để nhìn thấy toàn cảnh khuôn viên.
let fogIsOutdoor = null;
function updateFogRange(isOutside) {
    if (fogIsOutdoor === isOutside) return;
    fogIsOutdoor = isOutside;
    scene.fog.near = isOutside ? 38 : 24;
    scene.fog.far = isOutside ? 230 : 80;
}
updateFogRange(true);

// Small, fixed night-light rig for the courtyard. It is created once and
// only its group visibility changes with the day/night theme.
function createNightLighting() {
    const warmLight = 0xffd3a0;
    const fixtureMaterial = new THREE.MeshStandardMaterial({
        color: 0x241c18,
        emissive: 0xffd08a,
        emissiveIntensity: 0.45,
        roughness: 0.72,
        metalness: 0.28
    });
    const bulbMaterial = new THREE.MeshBasicMaterial({ color: 0xffe0a6 });

    const addPointLight = (name, position, intensity, distance) => {
        const light = new THREE.PointLight(warmLight, intensity, distance, 2);
        light.name = name;
        light.position.copy(position);
        light.castShadow = false;
        nightLightsGroup.add(light);
    };

    // Two warm sources wash the entrance and the two flags without shadows.
    addPointLight('night-facade-left', new THREE.Vector3(-3.2, 3.25, 20.4), 0.95, 11);
    addPointLight('night-facade-right', new THREE.Vector3(3.2, 3.25, 20.4), 0.95, 11);
    // One restrained fill gives the exterior statue readable form.
    addPointLight('night-statue-fill', new THREE.Vector3(-5.0, 4.8, 27.0), 0.8, 12);

    // Hệ cột đèn của cảnh quan mới đảm nhiệm phần chiếu sáng lối đi ban đêm.
}

createNightLighting();

// --- EXHIBITION: Paintings on the Walls ---
const textureLoader = new THREE.TextureLoader();

// Helper function to create a text placard
function createPlacard(title, year, desc, position, rotationY, width = 1.6, height = 1.6) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');

    // Background
    context.fillStyle = '#fdfbf7';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    context.strokeStyle = '#d4af37'; // Gold
    context.lineWidth = 12;
    context.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

    // Text: Title
    context.fillStyle = '#333333';
    context.textAlign = 'center';
    context.font = 'bold 30px Arial';
    context.fillText(title, canvas.width / 2, 70);

    // Text: Year
    context.fillStyle = '#aa1111';
    context.font = 'bold 22px Arial';
    context.fillText(year, canvas.width / 2, 110);

    // Divider
    context.beginPath();
    context.moveTo(canvas.width / 2 - 50, 130);
    context.lineTo(canvas.width / 2 + 50, 130);
    context.stroke();

    // Text: Description (Wrapped)
    context.fillStyle = '#555555';
    context.textAlign = 'left';
    context.font = '22px Arial';

    const words = desc.split(' ');
    let line = '';
    let y = 180;
    const maxWidth = 450;
    const x = 30;
    const lineHeight = 32;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y); // Draw the last line

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;

    const placardGeo = new THREE.PlaneGeometry(width, height);
    const placardMat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8 });
    const placard = new THREE.Mesh(placardGeo, placardMat);

    placard.position.copy(position);
    placard.rotation.y = rotationY;
    scene.add(placard);
}

// Đèn rọi tranh bằng đồng và vầng sáng hắt lên tường (giả lập, không thêm nguồn sáng thật).
function addPictureLight(position, rotationY, frameWidth, frameHeight) {
    if (!addPictureLight.shared) {
        const glowCanvas = document.createElement('canvas');
        glowCanvas.width = 256;
        glowCanvas.height = 256;
        const ctx = glowCanvas.getContext('2d');
        const gradient = ctx.createRadialGradient(128, 18, 6, 128, 70, 210);
        gradient.addColorStop(0, 'rgba(255,236,196,0.62)');
        gradient.addColorStop(0.45, 'rgba(255,226,176,0.22)');
        gradient.addColorStop(1, 'rgba(255,220,170,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        const glowTexture = new THREE.CanvasTexture(glowCanvas);
        glowTexture.colorSpace = THREE.SRGBColorSpace;
        addPictureLight.shared = {
            brass: new THREE.MeshStandardMaterial({ color: 0xb8913f, roughness: 0.3, metalness: 0.9 }),
            lens: new THREE.MeshBasicMaterial({ color: 0xfff1cf, toneMapped: false }),
            glow: new THREE.MeshBasicMaterial({ map: glowTexture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
        };
    }
    const { brass, lens, glow } = addPictureLight.shared;
    const normal = new THREE.Vector3(Math.sin(rotationY), 0, Math.cos(rotationY));
    const group = new THREE.Group();
    group.name = 'picture-light';
    group.position.copy(position);
    group.rotation.y = rotationY;

    const barLength = Math.min(frameWidth * 0.62, 2.6);
    const top = frameHeight / 2 + 0.2;
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, barLength, 14), brass);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, top + 0.28, 0.34);
    group.add(bar);
    const lensStrip = new THREE.Mesh(new THREE.BoxGeometry(barLength * 0.94, 0.012, 0.05), lens);
    lensStrip.position.set(0, top + 0.235, 0.34);
    group.add(lensStrip);
    [-1, 1].forEach(side => {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.4, 8), brass);
        arm.rotation.x = Math.PI / 2 - 0.5;
        arm.position.set(side * barLength * 0.3, top + 0.2, 0.17);
        group.add(arm);
        const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 12), brass);
        mount.rotation.x = Math.PI / 2;
        mount.position.set(side * barLength * 0.3, top + 0.1, 0.0);
        group.add(mount);
    });
    const wash = new THREE.Mesh(new THREE.PlaneGeometry(frameWidth + 1.6, frameHeight + 1.2), glow);
    wash.position.set(0, 0.25, 0.022);
    wash.renderOrder = 2;
    group.add(wash);
    scene.add(group);
    return normal;
}

// Helper function to create and place a framed painting
function createPainting(id, imagePath, position, rotationY, {
    placardSide = 'right',
    placardDistance = 3.0,
    placardPlacement = 'side',
    placardWidth = 1.6,
    placardHeight = 1.6,
    addSpotlight = true
} = {}) {
    const frameWidth = 4;
    const frameHeight = 3;

    // Frame mesh
    const frameGeo = new THREE.BoxGeometry(frameWidth + 0.4, frameHeight + 0.4, 0.1);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x4a2511, roughness: 0.7 }); // Dark wood
    const frame = new THREE.Mesh(frameGeo, frameMat);
    if (id === 'painting-8') frame.name = 'room6-portrait-frame';
    frame.position.copy(position);
    frame.rotation.y = rotationY;
    scene.add(frame);

    // Painting canvas
    const paintingMap = textureLoader.load(imagePath, texture => {
        // Fit every source image inside the fixed frame without stretching or cropping.
        const imageRatio = texture.image.width / texture.image.height;
        const frameRatio = frameWidth / frameHeight;
        if (imageRatio > frameRatio) painting.scale.y = frameRatio / imageRatio;
        else painting.scale.x = imageRatio / frameRatio;
    });
    const paintingGeo = new THREE.PlaneGeometry(frameWidth, frameHeight);
    const paintingMat = new THREE.MeshStandardMaterial({ map: paintingMap, roughness: 0.5 });
    const painting = new THREE.Mesh(paintingGeo, paintingMat);
    if (id === 'painting-8') painting.name = 'room6-portrait';

    // Position slightly in front of frame based on rotation
    const canvasOffset = 0.06;
    painting.position.copy(position);
    painting.position.x += Math.sin(rotationY) * canvasOffset;
    painting.position.z += Math.cos(rotationY) * canvasOffset;
    painting.rotation.y = rotationY;

    painting.userData = { type: 'artifact', id };
    scene.add(painting);
    artifactInteractables.push(painting);
    addPictureLight(position, rotationY, frameWidth + 0.4, frameHeight + 0.4);

    // The room lights already cover the gallery. Limit per-painting
    // spotlights so adding exhibits cannot exceed the WebGL light budget.
    if (addSpotlight) {
        const paintingLight = new THREE.SpotLight(0xffffff, 1.2);
        paintingLight.position.copy(position);
        paintingLight.position.y += 2.5;
        paintingLight.position.x += Math.sin(rotationY) * 3;
        paintingLight.position.z += Math.cos(rotationY) * 3;
        paintingLight.target = painting;
        paintingLight.angle = Math.PI / 6;
        paintingLight.penumbra = 0.5;
        scene.add(paintingLight);
    }

    const placardPos = position.clone();
    if (placardPlacement === 'below') {
        placardPos.y -= 2.12;
    } else {
        const placardOffset = (placardSide === 'left' ? -1 : 1) * placardDistance;
        placardPos.x += Math.cos(rotationY) * placardOffset;
        placardPos.z -= Math.sin(rotationY) * placardOffset;
        placardPos.y -= 0.7;
    }
    // Pull it slightly off the wall like the canvas
    placardPos.x += Math.sin(rotationY) * 0.06;
    placardPos.z += Math.cos(rotationY) * 0.06;

    createPlacard(artifactData[id].title, artifactData[id].year, artifactData[id].desc, placardPos, rotationY, placardWidth, placardHeight);
}

function getRoomPosition(room, localX, localY, localZ) {
    return new THREE.Vector3(room.centerX + localX, localY, room.centerZ + localZ);
}

function placePaintingInRoom({
    room,
    id,
    wall,
    offset = 0,
    height = 3,
    placardSide = 'right',
    placardDistance = 2.65,
    placardPlacement = 'side',
    placardWidth = 1.6,
    placardHeight = 1.6,
    addSpotlight = true
}) {
    const inset = 0.08;
    let position;
    let rotationY;

    if (wall === 'outer') {
        position = new THREE.Vector3(room.side < 0 ? room.bounds.minX + inset : room.bounds.maxX - inset, height, room.centerZ + offset);
        rotationY = room.side < 0 ? Math.PI / 2 : -Math.PI / 2;
    } else if (wall === 'back') {
        position = new THREE.Vector3(room.centerX + offset, height, room.bounds.minZ + inset);
        rotationY = 0;
    } else {
        position = new THREE.Vector3(room.centerX + offset, height, room.bounds.maxZ - inset);
        rotationY = Math.PI;
    }

    const imagePaths = {
        'painting-1': './images/exhibits/room1-ben-nha-rong-1911.jpg',
        'painting-2': './images/exhibits/room1-nguyen-ai-quoc-1920.jpg',
        'painting-3': './images/exhibits/room2-tuyen-ngon-doc-lap-1945.jpg',
        'painting-4': './images/exhibits/room2-ba-dinh-1945.jpg',
        'painting-9': './images/room2/independence-3.jpg',
        'painting-10': './images/room2/independence-4.jpg',
        'painting-5': './images/exhibits/room3-chinh-phu-1946.jpg',
        'painting-11': './images/room3/room3-election-1946.jpg',
        'painting-12': './images/room3/room3-national-assembly.jpg',
        'painting-6': './images/room4/room4-international-solidarity-01.jpg',
        'room4-national-unity-1': './images/room4/room4-national-unity-01.jpg',
        'room4-national-unity-2': './images/room4/room4-national-unity-2.jpg',
        'room4-international-solidarity-2': './images/room4/room4-international-solidarity-2.jpg',
        'painting-7': './images/room5/room5-culture-working-01.jpg',
        'room5-humanism-2': './images/room5/room5-humanism-2.jpg',
        'painting-8': './images/exhibits/room6-ho-chi-minh-portrait-1950s.jpg'
    };
    createPainting(id, imagePaths[id], position, rotationY, {
        placardSide,
        placardDistance,
        placardPlacement,
        placardWidth,
        placardHeight,
        addSpotlight
    });
}

// --- Museum Benches (To fill empty center space) ---
const benchSeatGeo = new THREE.BoxGeometry(3, 0.15, 1);
const benchSeatMat = new THREE.MeshStandardMaterial({ color: 0x3d1e0d, roughness: 0.9 }); // Leather/Dark Wood
const benchLegGeo = new THREE.BoxGeometry(0.2, 0.5, 0.8);
const benchLegMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 }); // Black metal

const benchPositions = []; // Keep the new central corridor clear between six rooms
benchPositions.forEach(zPos => {
    // Seat
    const seat = new THREE.Mesh(benchSeatGeo, benchSeatMat);
    seat.position.set(0, 0.575, zPos);
    seat.castShadow = true;
    seat.receiveShadow = true;
    scene.add(seat);

    // Left Leg
    const leg1 = new THREE.Mesh(benchLegGeo, benchLegMat);
    leg1.position.set(-1.2, 0.25, zPos);
    leg1.castShadow = true;
    scene.add(leg1);

    // Right Leg
    const leg2 = new THREE.Mesh(benchLegGeo, benchLegMat);
    leg2.position.set(1.2, 0.25, zPos);
    leg2.castShadow = true;
    scene.add(leg2);
});

// Artifacts now belong to galleries and use room-local placement.
// Room 1 keeps one historical painting on each side wall while the opposite
// wall remains a single, centered feature wall.
placePaintingInRoom({ room: museumRooms[0], id: 'painting-1', wall: 'back', offset: 0, height: 3.15, placardPlacement: 'below', placardWidth: 1.75, placardHeight: 0.82 });
placePaintingInRoom({ room: museumRooms[0], id: 'painting-2', wall: 'front', offset: 0, height: 3.15, placardPlacement: 'below', placardWidth: 1.75, placardHeight: 0.82 });
// Room 2 side walls: from the entrance (looking +X), -Z is left and +Z is right.
placePaintingInRoom({ room: museumRooms[1], id: 'painting-3', wall: 'back', offset: 1.55, placardPlacement: 'below', placardWidth: 1.75, placardHeight: 0.82 });
placePaintingInRoom({ room: museumRooms[1], id: 'painting-4', wall: 'front', offset: 1.55, placardPlacement: 'below', placardWidth: 1.75, placardHeight: 0.82 });
placePaintingInRoom({ room: museumRooms[1], id: 'painting-9', wall: 'back', offset: -2.15, placardPlacement: 'below', placardWidth: 1.75, placardHeight: 0.82 });
placePaintingInRoom({ room: museumRooms[1], id: 'painting-10', wall: 'front', offset: -2.15, placardPlacement: 'below', placardWidth: 1.75, placardHeight: 0.82 });
placePaintingInRoom({ room: museumRooms[2], id: 'painting-5', wall: 'back', offset: 0, placardPlacement: 'below', placardWidth: 1.75, placardHeight: 0.82 });
placePaintingInRoom({ room: museumRooms[2], id: 'painting-11', wall: 'front', offset: -2.4, placardPlacement: 'below', placardWidth: 1.75, placardHeight: 0.82, addSpotlight: false });
placePaintingInRoom({ room: museumRooms[2], id: 'painting-12', wall: 'front', offset: 2.4, placardPlacement: 'below', placardWidth: 1.75, placardHeight: 0.82, addSpotlight: false });
// Room 04: two works on each side wall, arranged along the visitor's depth axis.
// All four share the gallery light; per-painting spotlights stay disabled.
placePaintingInRoom({ room: museumRooms[3], id: 'room4-national-unity-1', wall: 'back', offset: -2.35, height: 3.0, placardPlacement: 'below', placardWidth: 1.75, placardHeight: 0.82, addSpotlight: false });
placePaintingInRoom({ room: museumRooms[3], id: 'room4-national-unity-2', wall: 'back', offset: 2.35, height: 3.0, placardPlacement: 'below', placardWidth: 1.75, placardHeight: 0.82, addSpotlight: false });
placePaintingInRoom({ room: museumRooms[3], id: 'room4-international-solidarity-2', wall: 'front', offset: -2.35, height: 3.0, placardPlacement: 'below', placardWidth: 1.75, placardHeight: 0.82, addSpotlight: false });
placePaintingInRoom({ room: museumRooms[3], id: 'painting-6', wall: 'front', offset: 2.35, height: 3.0, placardPlacement: 'below', placardWidth: 1.75, placardHeight: 0.82, addSpotlight: false });
placePaintingInRoom({ room: museumRooms[4], id: 'room5-humanism-2', wall: 'back', offset: -2.35, height: 3.0, placardPlacement: 'below', placardWidth: 1.55, placardHeight: 0.76, addSpotlight: false });
placePaintingInRoom({ room: museumRooms[4], id: 'painting-7', wall: 'back', offset: 2.35, height: 3.0, placardPlacement: 'below', placardWidth: 1.55, placardHeight: 0.76, addSpotlight: false });
placePaintingInRoom({ room: museumRooms[5], id: 'painting-8', wall: 'back', offset: 2.25, height: 3.0, placardPlacement: 'below', placardWidth: 1.55, placardHeight: 0.76, addSpotlight: false });

// --- ROOM 06 DOCUMENTARY SCREEN & AUDIO SYSTEM ---
const bgmElement = document.getElementById('bgm-source');

let mediaStarted = false;
function startMedia() {
    if (!mediaStarted) {
        // Need to resume AudioContext in modern browsers
        if (listener.context.state === 'suspended') {
            listener.context.resume();
        }
        bgmElement.play().catch(e => console.warn('Autoplay prevented', e));
        mediaStarted = true;
    }
}

// Audio Listener attached to camera
const listener = new THREE.AudioListener();
camera.add(listener);
// Global Volume Control: listener is kept at 1.0 (master)
listener.setMasterVolume(1.0);

const bgmSlider = document.getElementById('bgm-slider');

bgmSlider.addEventListener('input', () => {
    // Đi qua bộ trộn chung để nhạc nền tự nhỏ lại khi hướng dẫn viên đang nói.
    applyMusicVolume();
});

// 1. Room 06 wide projection screen: the YouTube API is loaded only on room entry.
const screenWidth = 8.8;
const screenHeight = 4.95;
const documentaryRoom = museumRooms.find(room => room.screeningRoom);
function createRoom6PosterTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#2e1c18');
    gradient.addColorStop(0.55, '#171313');
    gradient.addColorStop(1, '#4a2b27');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(215,180,91,.1)';
    context.fillRect(48, 48, canvas.width - 96, canvas.height - 96);
    context.strokeStyle = '#d7b45b';
    context.lineWidth = 3;
    context.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);
    context.textAlign = 'center';
    context.fillStyle = '#f2dc9c';
    context.font = '700 32px Arial, sans-serif';
    context.fillText('PHIM TƯ LIỆU', canvas.width / 2, 148);
    context.font = '600 76px Georgia, serif';
    context.fillText('HỒ CHÍ MINH', canvas.width / 2, 286);
    context.font = '600 38px Georgia, serif';
    context.fillStyle = '#fff8e8';
    context.fillText('CUỘC ĐỜI VÀ DI SẢN TƯ TƯỞNG', canvas.width / 2, 350);
    context.fillStyle = '#bd2932';
    context.beginPath();
    context.arc(canvas.width / 2, 500, 58, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#fff8e8';
    context.font = '42px Arial, sans-serif';
    context.fillText('▶', canvas.width / 2 + 4, 515);
    context.font = '700 26px Arial, sans-serif';
    context.fillStyle = '#f2dc9c';
    context.fillText('XEM PHIM', canvas.width / 2, 620);
    return new THREE.CanvasTexture(canvas);
}

const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(screenWidth, screenHeight), new THREE.MeshBasicMaterial({ map: createRoom6PosterTexture() }));
screenMesh.name = 'room6-documentary-screen';
screenMesh.position.set(documentaryRoom.bounds.maxX - 0.22, 4.05, documentaryRoom.centerZ);
screenMesh.rotation.y = -Math.PI / 2;
screenMesh.userData = { type: 'video', id: 'room6-documentary-screen', roomId: 'room6' };
scene.add(screenMesh);
videoInteractables.push(screenMesh);

const screenFrame = new THREE.Mesh(
    new THREE.BoxGeometry(screenWidth + 0.34, screenHeight + 0.34, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x171312, roughness: 0.42, metalness: 0.12 })
);
screenFrame.name = 'room6-screen-frame';
screenFrame.position.set(documentaryRoom.bounds.maxX - 0.1, 4.05, documentaryRoom.centerZ);
screenFrame.rotation.y = -Math.PI / 2;
scene.add(screenFrame);

// Ceiling-mounted projector aimed at the wide screen.
const projector = new THREE.Group();
const projectorBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.48, 0.82),
    new THREE.MeshStandardMaterial({ color: 0x24211f, roughness: 0.5, metalness: 0.18 })
);
projectorBody.position.set(0, 0, 0);
projector.add(projectorBody);
const projectorLens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.2, 0.18, 20),
    new THREE.MeshStandardMaterial({ color: 0x0b0b0b, roughness: 0.18, metalness: 0.4 })
);
projectorLens.rotation.z = Math.PI / 2;
projectorLens.position.x = 0.7;
projector.add(projectorLens);
projector.position.set(documentaryRoom.centerX + 0.8, 6.25, documentaryRoom.centerZ);
projector.name = 'room6-ceiling-projector';
scene.add(projector);

function addRoom6WallPanel(texture, width, height, position, rotationY) {
    // These panels live on the two side walls (constant Z). Keep the wall
    // backing thin on Z; using width as the Z dimension would create a large
    // freestanding slab in the visitor path.
    const backing = new THREE.Mesh(new THREE.BoxGeometry(width + 0.18, height + 0.18, 0.06), new THREE.MeshStandardMaterial({ color: 0x261a17, roughness: 0.88 }));
    backing.name = 'room6-wall-panel-backing';
    backing.position.copy(position);
    backing.rotation.y = rotationY;
    scene.add(backing);
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture }));
    panel.name = 'room6-wall-panel-surface';
    panel.position.copy(position);
    panel.position.z += rotationY === 0 ? 0.04 : -0.04;
    panel.rotation.y = rotationY;
    scene.add(panel);
}

function createRoom6ContentTexture(title, lines) {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 700;
    const context = canvas.getContext('2d');
    context.fillStyle = '#201614';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#d7b45b';
    context.lineWidth = 4;
    context.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);
    context.fillStyle = '#d7b45b';
    context.font = '700 28px Arial, sans-serif';
    context.fillText(title, 72, 92);
    context.strokeStyle = 'rgba(215,180,91,.55)';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(72, 122);
    context.lineTo(828, 122);
    context.stroke();
    let y = 190;
    lines.forEach((line, index) => {
        const parts = line.split('|');
        context.fillStyle = index % 2 === 0 ? '#f2dc9c' : '#fff8e8';
        context.font = index % 2 === 0 ? '700 34px Georgia, serif' : '400 25px Arial, sans-serif';
        parts.forEach(part => {
            context.fillText(part, 72, y);
            y += index % 2 === 0 ? 44 : 34;
        });
        if (index % 2 !== 0) y += 48;
    });
    return new THREE.CanvasTexture(canvas);
}

addRoom6WallPanel(createRoom6ContentTexture('DÒNG THỜI GIAN', [
    '1890', 'Ra đời tại Nghệ An',
    '1911', 'Ra đi tìm đường cứu nước',
    '1945', 'Đọc Tuyên ngôn Độc lập',
    '1969', 'Để lại di sản tư tưởng,|đạo đức và phong cách'
]), 3.8, 3.35, new THREE.Vector3(6.1, 3.05, documentaryRoom.bounds.minZ + 0.1), 0);

addRoom6WallPanel(createRoom6ContentTexture('DI SẢN', [
    'HỒ CHÍ MINH',
    'CUỘC ĐỜI · TƯ TƯỞNG · DI SẢN',
    'Độc lập dân tộc',
    'Đại đoàn kết',
    'Đạo đức · Văn hóa · Con người'
]), 4.1, 3.05, new THREE.Vector3(9.3, 3.05, documentaryRoom.bounds.maxZ - 0.1), Math.PI);

// Two compact seating rows keep the entry axis and side aisles open.
[8.05, 11.0].forEach((x, rowIndex) => {
    const row = new THREE.Group();
    row.name = `room6-bench-row-${rowIndex + 1}`;
    const seat = new THREE.Mesh(
        new THREE.BoxGeometry(0.92, 0.28, 4.6),
        new THREE.MeshStandardMaterial({ color: rowIndex ? 0x3e2025 : 0x4d272d, roughness: 0.86 })
    );
    seat.position.y = 0.72;
    row.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.9, 4.6), seat.material);
    back.position.set(-0.36, 1.12, 0);
    row.add(back);
    row.position.set(x, 0, documentaryRoom.centerZ);
    row.traverse(object => { object.castShadow = true; object.receiveShadow = true; });
    scene.add(row);
});

const aisleLight = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 0.12),
    new THREE.MeshBasicMaterial({ color: 0x9d7436 })
);
aisleLight.rotation.x = -Math.PI / 2;
aisleLight.position.set(5.9, 0.055, documentaryRoom.centerZ);
scene.add(aisleLight);

// Room 06 layout audit: keep the diagnostic focused on newly added display
// geometry so future changes cannot silently grow into the visitor path.
function logRoom6GeometryAudit() {
    const names = [
        'room6-documentary-screen', 'room6-screen-frame',
        'room6-wall-panel-backing', 'room6-wall-panel-surface',
        'room6-portrait-frame', 'room6-portrait',
        'room6-bench-row-1', 'room6-bench-row-2'
    ];
    const rows = [];
    names.forEach(name => {
        scene.traverse(object => {
            if (object.name !== name) return;
            const box = new THREE.Box3().setFromObject(object);
            rows.push({ name, position: object.position.toArray(), rotation: object.rotation.toArray(), scale: object.scale.toArray(), min: box.min.toArray(), max: box.max.toArray() });
        });
    });
    console.table(rows);
}
logRoom6GeometryAudit();

// 2. Speaker Setup for BGM
const speakerGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
const speakerMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
const speakerMesh = new THREE.Mesh(speakerGeo, speakerMat);
speakerMesh.position.set(0, wallHeight - 0.25, 0); // Mounted on ceiling center
scene.add(speakerMesh);

// Positional Audio for BGM
const bgmAudio = new THREE.PositionalAudio(listener);
bgmAudio.setMediaElementSource(bgmElement);
bgmAudio.setRefDistance(12); // Wider range for BGM
bgmAudio.setMaxDistance(40);
bgmAudio.setVolume(0.2); // Default BGM volume (half of video)
speakerMesh.add(bgmAudio);

const YOUTUBE_VIDEO_ID = 'dWAXQHot4ig';
let youtubeApiPromise = null;
let youtubePlayer = null;
let youtubePlayerReady = null;
let youtubeIframe = null;
let youtubeScreen = null;
let room6PlaybackActive = false;
let css3dInteractionEnabled = false;
let room6AudioMuted = true;
let room6AudioFallbackVisible = false;
let room6MusicWasPlaying = false;
let room6PreviousMusicVolume = 0.2;
let room6PreviousMusicPaused = true;

function loadYouTubeIframeAPI() {
    if (window.YT?.Player) return Promise.resolve();
    if (youtubeApiPromise) return youtubeApiPromise;

    youtubeApiPromise = new Promise((resolve, reject) => {
        const previousCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            if (typeof previousCallback === 'function') previousCallback();
            resolve();
        };
        const apiScript = document.createElement('script');
        apiScript.src = 'https://www.youtube.com/iframe_api';
        apiScript.async = true;
        apiScript.onerror = () => reject(new Error('Không thể tải YouTube IFrame Player API'));
        document.head.appendChild(apiScript);
    });
    return youtubeApiPromise;
}

function onYouTubePlayerReady(event) {
    // The enter transition calls startRoom6YoutubeAudio once the API promise
    // resolves; keep the player muted until that controlled transition.
    event.target.mute();
    event.target.setVolume(0);
}

function showRoom6AudioFallback() {
    room6AudioFallbackVisible = true;
    room6AudioFallback.classList.remove('hidden');
}

function hideRoom6AudioFallback() {
    room6AudioFallbackVisible = false;
    room6AudioFallback.classList.add('hidden');
}

function startRoom6YoutubeAudio(player) {
    if (!player) return;
    player.playVideo();
    // Try the requested audible mode once on room entry. Browser policy may
    // reject it; the muted fallback below remains the supported path.
    try {
        player.unMute();
        player.setVolume(80);
        room6AudioMuted = false;
        hideRoom6AudioFallback();
        bgmAudio.setVolume(0);
    } catch (error) {
        player.mute();
        player.playVideo();
        room6AudioMuted = true;
        showRoom6AudioFallback();
    }
}

function createYouTubePlayer() {
    if (youtubePlayer) return Promise.resolve(youtubePlayerReady);
    youtubePlayerReady = new Promise(resolve => {
        youtubePlayer = new window.YT.Player(youtubeIframe, {
            events: {
                onReady: event => { onYouTubePlayerReady(event); resolve(event.target); },
                onAutoplayBlocked: () => {
                    youtubePlayer?.mute();
                    youtubePlayer?.playVideo();
                    room6AudioMuted = true;
                    showRoom6AudioFallback();
                },
                onError: event => console.warn('YouTube Room 06 error:', event.data)
            }
        });
    });
    return youtubePlayerReady;
}

function createRoom6YoutubeScreen() {
    if (youtubeScreen) {
        youtubeScreen.visible = true;
        screenMesh.material.opacity = 0;
        return;
    }
    youtubeIframe = document.createElement('iframe');
    youtubeIframe.src = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&controls=1&rel=0&playsinline=1&enablejsapi=1`;
    youtubeIframe.title = 'Phim tư liệu Hồ Chí Minh – Cuộc đời và di sản tư tưởng';
    youtubeIframe.allow = 'autoplay; encrypted-media; picture-in-picture';
    youtubeIframe.allowFullscreen = true;
    youtubeIframe.frameBorder = '0';
    youtubeIframe.style.width = '960px';
    youtubeIframe.style.height = '540px';
    youtubeIframe.style.border = '0';
    youtubeIframe.style.background = '#000';
    youtubeIframe.style.pointerEvents = 'none';
    youtubeScreen = new CSS3DObject(youtubeIframe);
    youtubeScreen.name = 'room6-youtube-css3d-screen';
    youtubeScreen.position.copy(screenMesh.position);
    youtubeScreen.rotation.copy(screenMesh.rotation);
    const screenScale = screenWidth / 960;
    youtubeScreen.scale.set(screenScale, screenScale, screenScale);
    // Screen normal points toward -X; offset only a few centimetres in front.
    youtubeScreen.position.x -= 0.025;
    cssScene.add(youtubeScreen);
    screenMesh.material.transparent = true;
    screenMesh.material.opacity = 0;
}

function enterRoom6Video() {
    stopNarration();
    room6PlaybackActive = true;
    room6PreviousMusicVolume = bgmAudio.getVolume();
    room6PreviousMusicPaused = bgmElement.paused;
    room6MusicWasPlaying = !room6PreviousMusicPaused;
    bgmAudio.setVolume(0);
    if (room6MusicWasPlaying) bgmElement.pause();
    createRoom6YoutubeScreen();
    loadYouTubeIframeAPI()
        .then(createYouTubePlayer)
        .then(player => {
            if (!room6PlaybackActive) return;
            startRoom6YoutubeAudio(player);
        })
        .catch(error => {
            console.warn('Room 06 YouTube autoplay unavailable:', error);
            showRoom6PlayFallback();
        });
}

function leaveRoom6Video() {
    room6PlaybackActive = false;
    if (youtubePlayer?.pauseVideo) youtubePlayer.pauseVideo();
    if (youtubePlayer?.mute) youtubePlayer.mute();
    room6AudioMuted = true;
    hideRoom6AudioFallback();
    bgmAudio.setVolume(room6PreviousMusicVolume);
    if (room6MusicWasPlaying && room6PreviousMusicPaused === false) bgmElement.play().catch(() => { });
    if (youtubeScreen) youtubeScreen.visible = false;
    screenMesh.material.opacity = 1;
    disableRoom6Css3dInteraction();
}

function enableRoom6Css3dInteraction() {
    if (!youtubeIframe) return;
    if (!isTouchDevice && controls.isLocked) controls.unlock();
    css3dInteractionEnabled = true;
    cssRenderer.domElement.style.pointerEvents = 'auto';
    youtubeIframe.style.pointerEvents = 'auto';
    room6ContinueBtn.classList.remove('hidden');
}

function disableRoom6Css3dInteraction() {
    css3dInteractionEnabled = false;
    cssRenderer.domElement.style.pointerEvents = 'none';
    if (youtubeIframe) youtubeIframe.style.pointerEvents = 'none';
    room6ContinueBtn.classList.add('hidden');
}

function activateRoom6VideoSurface() {
    enableRoom6Css3dInteraction();
}

room6ContinueBtn.addEventListener('click', event => {
    event.stopPropagation();
    disableRoom6Css3dInteraction();
    enterGameMode();
});

room6AudioFallback.addEventListener('click', event => {
    event.stopPropagation();
    if (!youtubePlayer) return;
    youtubePlayer.unMute();
    youtubePlayer.setVolume(80);
    room6AudioMuted = false;
    hideRoom6AudioFallback();
    bgmAudio.setVolume(0);
});

// --- INTERACTION (RAYCASTING) ---
const raycaster = new THREE.Raycaster();
const centerPoint = new THREE.Vector2(0, 0); // Center of screen
let victoryPending = false;
let selectedRoom = null;

function showVictory() {
    victoryPending = false;
    narrate(TOUR_COMPLETE_TEXT, { force: true });
    updateProgressUI();
    infoPanel.classList.add('closed');
    victoryPopup.classList.remove('hidden');
    if (!isTouchDevice && document.pointerLockElement) document.exitPointerLock();
}

function resumeTour() {
    victoryPopup.classList.add('hidden');
    enterGameMode();
}

function updateInteractionState() {
    const uiIsOpen = !infoPanel.classList.contains('closed') ||
        !entrancePopup.classList.contains('hidden') ||
        !roomPopup.classList.contains('hidden') ||
        !victoryPopup.classList.contains('hidden');

    if (uiIsOpen || (!controls.isLocked && !isTouchDevice)) {
        crosshair.classList.remove('interactive');
        return;
    }

    raycaster.setFromCamera(centerPoint, viewCamera);
    const artifactHits = raycaster.intersectObjects(artifactInteractables, true);
    const roomHits = raycaster.intersectObjects(roomTriggers, true);
    const videoHits = raycaster.intersectObjects(videoInteractables, true);
    const guideHits = raycaster.intersectObjects(guideInteractables, true);
    const hasTarget = artifactHits.length > 0 || roomHits.length > 0 || videoHits.length > 0 || guideHits.length > 0;
    crosshair.classList.toggle('interactive', hasTarget);
    if (interactionHintLabel) {
        if (guideHits.length) interactionHintLabel.textContent = 'Bấm để hỏi hướng dẫn viên';
        else if (roomHits.length) interactionHintLabel.textContent = 'Bấm để vào phòng';
        else interactionHintLabel.textContent = 'Nhấn để khám phá';
    }
}

function findArtifactId(object) {
    let current = object;
    while (current) {
        if (current.userData?.type === 'artifact' && current.userData.id) {
            return current.userData.id;
        }
        if (current.userData?.id && artifactData[current.userData.id]) {
            return current.userData.id;
        }
        current = current.parent;
    }
    return null;
}

function findRoomTrigger(object) {
    let current = object;
    while (current) {
        if (current.userData?.type === 'room-trigger' && current.userData.roomId) {
            return current.userData.roomId;
        }
        current = current.parent;
    }
    return null;
}

function performRaycast() {
    raycaster.setFromCamera(centerPoint, viewCamera);
    const guideHit = raycaster.intersectObjects(guideInteractables, true)[0]?.object;
    if (guideHit) {
        guideContextualTip();
        return;
    }
    const videoHit = raycaster.intersectObjects(videoInteractables, true)[0]?.object;
    if (videoHit) {
        activateRoom6VideoSurface();
        return;
    }
    const artifactHits = raycaster.intersectObjects(artifactInteractables, true);
    const hitObject = artifactHits[0]?.object;
    const artifactId = hitObject ? findArtifactId(hitObject) : null;
    const data = artifactId ? artifactData[artifactId] : null;

    if (artifactId && data) {
        const isNewDiscovery = !discoveredArtifacts.has(artifactId);
        document.getElementById('panel-year').textContent = data.year;
        document.getElementById('panel-title').textContent = data.title;
        document.getElementById('panel-desc').textContent = data.desc;
        discoveredBadge.hidden = !isNewDiscovery;
        infoPanel.classList.remove('closed');
        narrateArtifact(artifactId);
        if (!isTouchDevice) document.exitPointerLock();

        if (isNewDiscovery) {
            discoveredArtifacts.add(artifactId);
            updateProgressUI();
            const material = hitObject.material;
            if (material?.emissive) material.emissive.setHex(0x3a2f08);
            if (discoveredArtifacts.size === totalArtifacts) {
                victoryPending = true;
            }
        }
        return;
    }

    const roomHit = raycaster.intersectObjects(roomTriggers, true)[0]?.object;
    const roomId = roomHit ? findRoomTrigger(roomHit) : null;
    const room = roomId ? museumRooms.find(item => item.id === roomId) : null;

    if (!room) return;

    selectedRoom = room;
    roomPopupTitle.textContent = room.name;
    roomPopupNumber.textContent = `Phòng trưng bày ${room.number}`;
    roomPopup.classList.remove('hidden');
    blocker.style.display = 'none';
    velocity.set(0, 0, 0);
    if (!isTouchDevice && document.pointerLockElement) document.exitPointerLock();
}

// PC Click
document.addEventListener('click', (e) => {
    // Only trigger if locked (playing) and not clicking UI elements
    if (controls.isLocked && e.target !== closePanelBtn && !css3dInteractionEnabled) {
        performRaycast();
    }
});

// Mobile Tap (Always attach, won't fire on PC)
let touchStartTime = 0;
touchLookZone.addEventListener('touchstart', () => {
    touchStartTime = Date.now();
});
touchLookZone.addEventListener('touchend', (e) => {
    // If it's a quick tap (less than 200ms) and no big movement, raycast
    if (Date.now() - touchStartTime < 200) {
        // ensure info panel isn't open
        if (infoPanel.classList.contains('closed') &&
            entrancePopup.classList.contains('hidden') &&
            roomPopup.classList.contains('hidden') &&
            victoryPopup.classList.contains('hidden')) {
            performRaycast();
        }
    }
});

closePanelBtn.addEventListener('click', () => {
    infoPanel.classList.add('closed');
    if (victoryPending) {
        showVictory();
    } else if (!isTouchDevice) {
        // Resume game immediately by locking pointer
        enterGameMode();
    }
});

continueTourBtn.addEventListener('click', resumeTour);
restartTourBtn.addEventListener('click', () => {
    discoveredArtifacts.clear();
    updateProgressUI();
    victoryPending = false;
    resumeTour();
});

// --- MUSEUM ENTRANCE FLOW ---
let entrancePromptArmed = true;

function showEntranceChoice() {
    entrancePromptArmed = false;
    velocity.set(0, 0, 0);
    entrancePopup.classList.remove('hidden');
    blocker.style.display = 'none';
    if (!isTouchDevice && document.pointerLockElement) document.exitPointerLock();
}

function closeEntranceChoice() {
    entrancePopup.classList.add('hidden');
    enterGameMode();
}

enterMuseumBtn.addEventListener('click', () => {
    camera.position.set(0, 1.6, museumLayout.lobby.maxZ - 2.0);
    currentRoomName.textContent = 'Sảnh chính';
    guideTeleportNear(camera.position);
    updateViewCamera(0.016, true);
    narrateArea('lobby');
    closeEntranceChoice();
});

leaveMuseumBtn.addEventListener('click', () => {
    camera.position.set(0, 1.6, roomDepth / 2 + 8);
    currentRoomName.textContent = 'Khuôn viên bảo tàng';
    guideTeleportNear(camera.position);
    updateViewCamera(0.016, true);
    closeEntranceChoice();
});

function closeRoomPopup() {
    roomPopup.classList.add('hidden');
    selectedRoom = null;
    enterGameMode();
}

cancelRoomBtn.addEventListener('click', closeRoomPopup);
enterRoomBtn.addEventListener('click', () => {
    if (!selectedRoom) return;
    const roomToEnter = selectedRoom;
    const door = roomDoors.find(item => item.userData.roomData === roomToEnter);
    if (door) door.userData.targetOpen = 1;
    camera.position.copy(roomToEnter.entryPosition);
    camera.rotation.y = roomToEnter.side < 0 ? Math.PI / 2 : -Math.PI / 2;
    currentRoomName.textContent = `Phòng ${roomToEnter.number} · ${roomToEnter.shortName}`;
    guideTeleportNear(camera.position, 260);
    updateViewCamera(0.016, true);
    narrateRoom(roomToEnter);
    closeRoomPopup();
});


/* =====================================================================
   HƯỚNG DẪN VIÊN "HƯƠNG"
   Nhân vật mặc áo dài, cầm cờ hướng dẫn, đi cùng khách trong suốt chuyến
   tham quan, quay mặt về phía khách khi nói và tự thuyết minh mỗi khi
   khách bước vào một phòng hoặc mở một hiện vật.
   ===================================================================== */

const guideInteractables = [];

const guide = createCharacter({
    name: 'guide-huong',
    style: 'guide',
    skin: 0xf5d0ab,
    hair: 0x1b120d,
    top: 0xfdf8ef,
    bottom: 0xf3ece0,
    shoes: 0x5a3a2c,
    accent: 0x9d1b24,
    goldTrim: 0xd7b45b,
    lashes: true
});
guide.position.set(2.6, 0, entranceZ + 11.5);
guide.rotation.y = Math.PI;
scene.add(guide);

// Vùng bấm chuột của hướng dẫn viên (khối trong suốt bao quanh nhân vật).
const guideHitbox = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 1.9, 8),
    new THREE.MeshBasicMaterial({ visible: false })
);
guideHitbox.position.y = 0.95;
guideHitbox.userData.type = 'guide';
guide.add(guideHitbox);
guideInteractables.push(guideHitbox);

function makeGuideTagTexture(speaking) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = speaking ? 'rgba(143,24,32,0.94)' : 'rgba(24,20,18,0.86)';
    ctx.strokeStyle = '#d7b45b';
    ctx.lineWidth = 5;
    const radius = 26;
    ctx.beginPath();
    ctx.moveTo(radius, 6);
    ctx.lineTo(canvas.width - radius, 6);
    ctx.quadraticCurveTo(canvas.width - 6, 6, canvas.width - 6, radius + 6);
    ctx.lineTo(canvas.width - 6, canvas.height - radius - 18);
    ctx.quadraticCurveTo(canvas.width - 6, canvas.height - 18, canvas.width - radius, canvas.height - 18);
    ctx.lineTo(canvas.width / 2 + 18, canvas.height - 18);
    ctx.lineTo(canvas.width / 2, canvas.height - 2);
    ctx.lineTo(canvas.width / 2 - 18, canvas.height - 18);
    ctx.lineTo(radius, canvas.height - 18);
    ctx.quadraticCurveTo(6, canvas.height - 18, 6, canvas.height - radius - 18);
    ctx.lineTo(6, radius + 6);
    ctx.quadraticCurveTo(6, 6, radius, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffe7a0';
    ctx.font = 'bold 38px Arial';
    ctx.fillText(speaking ? 'HƯƠNG ĐANG THUYẾT MINH' : 'HƯƠNG · HƯỚNG DẪN VIÊN', canvas.width / 2, 62);
    ctx.font = '28px Arial';
    ctx.fillStyle = 'rgba(255,231,160,0.8)';
    ctx.fillText(speaking ? '🔊 . . .' : 'Bấm để hỏi · Phím G', canvas.width / 2, 100);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

const guideTagTextures = { idle: makeGuideTagTexture(false), speaking: makeGuideTagTexture(true) };
const guideTag = new THREE.Sprite(new THREE.SpriteMaterial({
    map: guideTagTextures.idle,
    transparent: true,
    depthTest: false
}));
guideTag.scale.set(1.25, 0.31, 1);
guideTag.position.y = 2.24;
guideTag.renderOrder = 10;
guide.add(guideTag);

const guideState = {
    started: false,
    walk: 0,
    moving: false,
    target: new THREE.Vector3(2.6, 0, entranceZ + 11.5),
    facing: Math.PI,
    lastRoomId: null,
    lastAreaName: null,
    tipIndex: 0
};

const guideTmp = new THREE.Vector3();
const guideForward = new THREE.Vector3();
const guideRight = new THREE.Vector3();

// Các chỗ đứng ưu tiên quanh khách: chếch trước bên phải, rồi bên trái, rồi lùi.
const guideStandOffsets = [
    [2.05, 1.35], [2.05, -1.35], [1.55, 1.85], [1.55, -1.85],
    [2.1, 0], [0.7, 1.75], [0.7, -1.75], [-1.2, 1.45], [-1.2, -1.45],
    [0.2, 2.0], [0.2, -2.0], [2.4, 0.85], [2.4, -0.85], [-1.9, 0]
];

function isGuideWalkable(x, z) {
    guideTmp.set(x, 1.6, z);
    if (z > entranceZ + 0.2) {
        return x > exteriorBounds.minX + 1.2 && x < exteriorBounds.maxX - 1.2 &&
            z < exteriorBounds.maxZ - 1.2 && !isBlockedOutdoors(guideTmp, 0.75);
    }
    if (Math.abs(x) > roomWidth / 2 - 1) return false;
    if (z < -roomDepth / 2 + 1) return false;
    if (isAtMainEntrance(guideTmp) && z >= entranceZ - 2 && z <= entranceZ + 1) return true;
    if (pointInBounds(guideTmp, museumLayout.lobby, 0.7)) return true;
    if (pointInBounds(guideTmp, museumLayout.transition, 0.6)) return true;
    if (pointInBounds(guideTmp, museumLayout.corridor, 0.7)) return true;
    return museumRooms.some(room => pointInBounds(guideTmp, room.bounds, 0.85));
}

/** Hướng đi tới và hướng bên phải của khách, suy ra từ góc xoay camera. */
function refreshPlayerAxes(yaw) {
    guideForward.set(-Math.sin(yaw), 0, -Math.cos(yaw));
    guideRight.set(-guideForward.z, 0, guideForward.x);
}

/** Chọn chỗ đứng hợp lệ gần khách nhất. */
function pickGuideStand(position, yaw) {
    refreshPlayerAxes(yaw);
    for (let i = 0; i < guideStandOffsets.length; i++) {
        const [forwardOffset, rightOffset] = guideStandOffsets[i];
        const x = position.x + guideForward.x * forwardOffset + guideRight.x * rightOffset;
        const z = position.z + guideForward.z * forwardOffset + guideRight.z * rightOffset;
        if (isGuideWalkable(x, z)) return { x, z };
    }
    return null;
}

/**
 * Tìm chỗ đứng hợp lệ gần khách nhất. Nếu mọi chỗ ưu tiên đều vướng (ví dụ
 * khách đứng lọt giữa hồ sen và hàng rào), dò rộng dần theo vòng tròn và
 * chọn điểm gần hướng dẫn viên nhất để cô đi ít bước nhất.
 */
function findGuideSpotNear(position, yaw) {
    const stand = pickGuideStand(position, yaw);
    if (stand) return stand;

    for (let radius = 2.6; radius <= 5.6; radius += 0.7) {
        let best = null;
        let bestDistance = Infinity;
        for (let step = 0; step < 16; step++) {
            const angle = (step / 16) * Math.PI * 2;
            const x = position.x + Math.cos(angle) * radius;
            const z = position.z + Math.sin(angle) * radius;
            if (!isGuideWalkable(x, z)) continue;
            const distance = Math.hypot(x - guide.position.x, z - guide.position.z);
            if (distance < bestDistance) {
                bestDistance = distance;
                best = { x, z };
            }
        }
        if (best) return best;
    }
    return null;
}

function guideTeleportNear(position, delay = 0) {
    const place = () => {
        const stand = findGuideSpotNear(position, getPlayerYaw());
        // Không tìm được chỗ trống thì giữ nguyên chỗ cũ, không bước vào vật cản.
        if (!stand) return;
        guide.position.set(stand.x, 0, stand.z);
        guideState.target.copy(guide.position);
        guideState.walk = 0;
    };
    if (delay > 0) setTimeout(place, delay);
    else place();
}

function updateGuide(delta) {
    const yaw = getPlayerYaw();
    const playerDistance = Math.hypot(camera.position.x - guide.position.x, camera.position.z - guide.position.z);

    // Bị bỏ lại quá xa hoặc đang kẹt trong vật cản thì bắt kịp khách ngay.
    if (playerDistance > 13 || !isGuideWalkable(guide.position.x, guide.position.z)) {
        guideTeleportNear(camera.position);
    }

    const stand = findGuideSpotNear(camera.position, yaw);
    if (stand) guideState.target.set(stand.x, 0, stand.z);

    const dx = guideState.target.x - guide.position.x;
    const dz = guideState.target.z - guide.position.z;
    const distance = Math.hypot(dx, dz);

    // Trễ hai ngưỡng để hướng dẫn viên không rung khi khách xoay chuột.
    if (distance > 1.05) guideState.moving = true;
    else if (distance < 0.4) guideState.moving = false;

    if (guideState.moving && distance > 0.01) {
        const speed = THREE.MathUtils.clamp(1.8 + distance * 1.1, 1.8, 6.2);
        const stepX = (dx / distance) * speed * delta;
        const stepZ = (dz / distance) * speed * delta;
        const nextX = guide.position.x + stepX;
        const nextZ = guide.position.z + stepZ;
        if (isGuideWalkable(nextX, nextZ)) guide.position.set(nextX, 0, nextZ);
        else if (isGuideWalkable(nextX, guide.position.z)) guide.position.x = nextX;
        else if (isGuideWalkable(guide.position.x, nextZ)) guide.position.z = nextZ;
        guideState.walk = 1;
        guideState.facing = Math.atan2(stepX, stepZ);
    } else {
        guideState.walk = 0;
        // Đứng yên thì quay mặt về phía khách.
        guideState.facing = Math.atan2(camera.position.x - guide.position.x, camera.position.z - guide.position.z);
    }

    // Không đứng chặn ngay trước mặt khách.
    if (playerDistance < 0.95) {
        const pushX = (guide.position.x - camera.position.x) || 0.2;
        const pushZ = (guide.position.z - camera.position.z) || 0.2;
        const pushLength = Math.hypot(pushX, pushZ) || 1;
        const nx = guide.position.x + (pushX / pushLength) * delta * 2.6;
        const nz = guide.position.z + (pushZ / pushLength) * delta * 2.6;
        if (isGuideWalkable(nx, nz)) guide.position.set(nx, 0, nz);
    }

    const turn = Math.atan2(Math.sin(guideState.facing - guide.rotation.y), Math.cos(guideState.facing - guide.rotation.y));
    guide.rotation.y += turn * Math.min(1, delta * 8);
    guide.userData.update(delta, guideState.walk);

    // Bảng tên chỉ hiện khi khách ở gần.
    const tagVisible = playerDistance < 13;
    guideTag.visible = tagVisible;
    if (tagVisible) {
        const scale = THREE.MathUtils.clamp(playerDistance * 0.105, 0.95, 1.85);
        guideTag.scale.set(scale, scale * 0.247, 1);
    }
}

function onNarrationStateChange(isSpeaking) {
    if (!guideTag) return;
    guideTag.material.map = isSpeaking ? guideTagTextures.speaking : guideTagTextures.idle;
    guideTag.material.needsUpdate = true;
}

/** Gợi ý theo bối cảnh khi khách bấm vào hướng dẫn viên hoặc nhấn phím G. */
function guideContextualTip() {
    const position = camera.position;
    const room = museumRooms.find(item => pointInBounds(position, item.bounds, 0.1));
    if (room) {
        const remaining = room.artifacts.filter(id => artifactData[id] && !discoveredArtifacts.has(id));
        if (remaining.length) {
            narrate(remainingArtifactTipText(remaining[0]), { force: true });
        } else {
            narrate(roomCompleteTipText(room), { force: true });
        }
        return;
    }

    if (position.z > entranceZ) {
        narrate(areaNarration.courtyard, { force: true });
        return;
    }

    const nextRoom = museumRooms.find(item => item.artifacts.some(id => artifactData[id] && !discoveredArtifacts.has(id)));
    if (nextRoom) {
        narrate(nextRoomTipText(nextRoom), { force: true });
    } else {
        narrate(ALL_DONE_TEXT, { force: true });
    }
}

function startGuideTour() {
    if (guideState.started) return;
    guideState.started = true;
    guideTeleportNear(camera.position);
    setTimeout(() => narrate(areaNarration.welcome, { key: 'area-welcome', force: true }), 450);
    narrationState.spokenAreas.add('welcome');
}

const guideCallBtn = document.getElementById('guide-call-btn');
if (guideCallBtn) {
    guideCallBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        guideTeleportNear(camera.position);
        guideContextualTip();
    });
}

function handleAreaChange(areaName, room) {
    if (room) {
        narrateRoom(room);
        return;
    }
    if (areaName === 'Sảnh chính') narrateArea('lobby');
    else if (areaName === 'Hành lang triển lãm') narrateArea('corridor');
    else if (areaName === 'Khuôn viên bảo tàng') narrateArea('courtyard');
}

// --- ANIMATION LOOP ---
const collisionDistance = 1.0; // Distance to keep from walls
const previousPlayerPosition = new THREE.Vector3();
let lastAutomaticExit = 0;
let previousActiveRoomId = null;

function isAtMainEntrance(position) {
    return Math.abs(position.x) <= entrancePassageHalfWidth;
}

function pointInBounds(position, bounds, padding = 0) {
    return position.x >= bounds.minX + padding && position.x <= bounds.maxX - padding &&
        position.z >= bounds.minZ + padding && position.z <= bounds.maxZ - padding;
}

function getCurrentAreaName(position) {
    if (position.z > roomDepth / 2) return 'Khuôn viên bảo tàng';
    const activeRoom = museumRooms.find(room => pointInBounds(position, room.bounds));
    if (activeRoom) return `Phòng ${activeRoom.number} · ${activeRoom.shortName}`;
    if (pointInBounds(position, museumLayout.lobby) || pointInBounds(position, museumLayout.transition)) return 'Sảnh chính';
    if (pointInBounds(position, museumLayout.corridor)) return 'Hành lang triển lãm';
    return 'Không gian chuyển tiếp';
}

function updateRoom6VideoTransition(activeRoomId) {
    if (activeRoomId === previousActiveRoomId) return;
    if (activeRoomId === 'room6') enterRoom6Video();
    else if (previousActiveRoomId === 'room6') leaveRoom6Video();
    previousActiveRoomId = activeRoomId;
}

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    const frameDelta = Math.min((time - prevTime) / 1000, 0.05);
    updateFireworkSprites(frameDelta);
    updateCourtyard(frameDelta);

    // Smooth automatic museum doors. They lift silently and close after the visitor moves away.
    roomDoors.forEach(door => {
        door.userData.openAmount = THREE.MathUtils.lerp(
            door.userData.openAmount,
            door.userData.targetOpen,
            0.12
        );
        door.position.y = door.userData.closedY + door.userData.openAmount * 4.2;
        const distanceToDoor = Math.hypot(camera.position.x - door.position.x, camera.position.z - door.position.z);
        if (distanceToDoor > 4.5 && door.userData.openAmount > 0.02) door.userData.targetOpen = 0;
    });

    // Run movement logic if on PC and locked, or if on Mobile (always active)
    if (controls.isLocked === true || (
        isTouchDevice &&
        infoPanel.classList.contains('closed') &&
        entrancePopup.classList.contains('hidden') &&
        roomPopup.classList.contains('hidden') &&
        victoryPopup.classList.contains('hidden')
    )) {
        const delta = (time - prevTime) / 1000;
        previousPlayerPosition.copy(camera.position);

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // Ensure consistent movement in all directions

        const speed = 40.0;
        if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

        // Apply movement relative to camera orientation
        if (isTouchDevice) {
            // Manual movement relative to camera for mobile
            const euler = new THREE.Euler(0, camera.rotation.y, 0, 'YXZ');
            const vec = new THREE.Vector3(velocity.x * delta, 0, velocity.z * delta);
            vec.applyEuler(euler);
            camera.position.add(vec);
        } else {
            // Use PointerLock Controls native methods for PC
            controls.moveRight(-velocity.x * delta);
            controls.moveForward(-velocity.z * delta);
        }

        // Keep the two facade side walls solid even when one movement step
        // crosses the front-wall plane. The doorway is the only passage
        // through that plane; without this crossing guard, x=+/-2 could
        // tunnel from the courtyard into the lobby before the bounds branch
        // had a chance to reject it.
        const crossedFrontWall =
            (previousPlayerPosition.z > entranceZ && camera.position.z <= entranceZ) ||
            (previousPlayerPosition.z <= entranceZ && camera.position.z > entranceZ);
        if (crossedFrontWall && !isAtMainEntrance(camera.position)) {
            camera.position.copy(previousPlayerPosition);
            velocity.set(0, 0, 0);
        }

        // Exterior and data-driven interior movement bounds.
        if (camera.position.z > roomDepth / 2) {
            camera.position.x = THREE.MathUtils.clamp(camera.position.x, exteriorBounds.minX, exteriorBounds.maxX);
            // Match the interior doorway allowance so the passage is
            // traversable in both directions. Outside the opening, the
            // facade remains a hard boundary at the front wall.
            const exteriorMinZ = isAtMainEntrance(camera.position)
                ? entranceZ - 0.35
                : entranceZ + 0.25;
            camera.position.z = THREE.MathUtils.clamp(camera.position.z, exteriorMinZ, exteriorBounds.maxZ);
            // Hồ sen, bồn hoa, ghế đá, cột đèn và tường bao đều là vật cản thật.
            if (isBlockedOutdoors(camera.position)) {
                camera.position.copy(previousPlayerPosition);
                velocity.set(0, 0, 0);
            }
        } else {
            camera.position.x = THREE.MathUtils.clamp(camera.position.x, -roomWidth / 2 + collisionDistance, roomWidth / 2 - collisionDistance);
            // The old upper clamp (roomDepth / 2 - 0.2) made the front facade
            // an invisible wall: the player could stop at z=20.8 but never
            // reach the doorway at z=21. Allow passage only in the opening;
            // the front wall segments still remain protected by this bound.
            const interiorMaxZ = isAtMainEntrance(camera.position)
                ? entranceZ + 0.35
                : entranceZ - 0.2;
            camera.position.z = THREE.MathUtils.clamp(camera.position.z, -roomDepth / 2 + collisionDistance, interiorMaxZ);

            const inLobby = pointInBounds(camera.position, museumLayout.lobby, 0.35);
            const inTransition = pointInBounds(camera.position, museumLayout.transition, 0.25);
            const inCorridor = pointInBounds(camera.position, museumLayout.corridor, 0.45);
            const inMainEntranceCorridor = isAtMainEntrance(camera.position) &&
                camera.position.z >= entranceZ - 1.5 && camera.position.z <= entranceZ + 2.5;
            const inRoom = museumRooms.some(room => pointInBounds(camera.position, room.bounds, 0.65));
            const inOpenDoorway = roomDoors.some(door => {
                const room = door.userData.roomData;
                const minX = Math.min(room.entryPosition.x, room.exitPosition.x);
                const maxX = Math.max(room.entryPosition.x, room.exitPosition.x);
                return door.userData.openAmount > 0.55 &&
                    camera.position.x >= minX && camera.position.x <= maxX &&
                    Math.abs(camera.position.z - room.centerZ) <= 1.35;
            });

            if (!inLobby && !inTransition && !inCorridor && !inMainEntranceCorridor && !inRoom && !inOpenDoorway) {
                camera.position.copy(previousPlayerPosition);
                velocity.set(0, 0, 0);
            }
        }

        // From inside a room, approaching its door opens it and returns the visitor to the corridor.
        const activeRoom = museumRooms.find(room => pointInBounds(camera.position, room.bounds, 0.35));
        if (
            activeRoom &&
            Math.abs(camera.position.x - activeRoom.side * (corridorHalfWidth + 1.0)) < 0.55 &&
            Math.abs(camera.position.z - activeRoom.centerZ) < 1.4 &&
            time - lastAutomaticExit > 900
        ) {
            const exitDoor = roomDoors.find(door => door.userData.roomData === activeRoom);
            if (exitDoor) exitDoor.userData.targetOpen = 1;
            camera.position.copy(activeRoom.exitPosition);
            velocity.set(0, 0, 0);
            lastAutomaticExit = time;
            currentRoomName.textContent = 'Hành lang triển lãm';
        }

        const detectedRoom = museumRooms.find(room => pointInBounds(camera.position, room.bounds, 0.1));
        updateRoom6VideoTransition(detectedRoom?.id || null);
        const areaName = getCurrentAreaName(camera.position);
        currentRoomName.textContent = areaName;
        const isOutside = camera.position.z > roomDepth / 2;
        document.body.classList.toggle('outside-mode', isOutside);
        updateFogRange(isOutside);

        // Hướng dẫn viên tự giới thiệu mỗi khi khách bước sang không gian mới.
        if (areaName !== guideState.lastAreaName) {
            guideState.lastAreaName = areaName;
            handleAreaChange(areaName, detectedRoom);
        }

        // Re-arm the entrance prompt after the visitor walks away from the door.
        if (camera.position.z > roomDepth / 2 + 5) entrancePromptArmed = true;

        // The entrance is a walkable doorway. Do not open the entrance modal
        // from this threshold: it exits pointer lock and turns a normal WASD
        // crossing into a hard stop. The two-sided bounds above already keep
        // the facade walls solid outside the passage (|x| > passage half-width).

        // Bench collision (rough bounding box for the 3 central benches)
        if (camera.position.x > -1.8 && camera.position.x < 1.8) {
            benchPositions.forEach(zPos => {
                if (camera.position.z > zPos - 1.0 && camera.position.z < zPos + 1.0) {
                    // Block movement by pushing back
                    camera.position.z += Math.sign(velocity.z) * Math.abs(velocity.z) * delta;
                    camera.position.x += Math.sign(velocity.x) * Math.abs(velocity.x) * delta;
                }
            });
        }

    }

    prevTime = time;
    updatePlayerAvatar(frameDelta);
    updateGuide(frameDelta);
    updateViewCamera(frameDelta);
    updateInteractionState();
    renderer.render(scene, viewCamera);
    cssRenderer.render(cssScene, viewCamera);
}

// Window resize handling
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    viewCamera.aspect = camera.aspect;
    viewCamera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
}

/* =====================================================================
   NÂNG CẤP HÌNH ẢNH TOÀN CẢNH
   Ánh sáng môi trường, bóng nắng tĩnh, mặt tiền có hàng cột, cây hoa Việt
   (mai, ban, phượng, tre, hoa giấy), đồi xa; bên trong: sàn đá cẩm thạch,
   sàn gỗ, trần ô kén, chân tường gỗ, đèn chùm và chậu cây.
   Tất cả là hình khối thủ tục + CanvasTexture: không tải thêm tài nguyên.
   ===================================================================== */

// --- 1. Ánh sáng: nắng có bóng, ánh sáng bầu trời, phản chiếu môi trường ---
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const roomEnvironmentMap = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;
scene.environment = roomEnvironmentMap;

// Bản đồ phản chiếu bầu trời riêng cho mặt nước và kính (ngày / đêm).
const skyEnvironmentScene = new THREE.Scene();
const skyEnvironmentDome = new THREE.Mesh(skyDome.geometry, skyDome.material);
skyEnvironmentScene.add(skyEnvironmentDome);
skyUniforms.uNight.value = 0;
const skyEnvironmentDay = pmremGenerator.fromScene(skyEnvironmentScene, 0.02, 0.1, 1000).texture;
skyUniforms.uNight.value = 1;
const skyEnvironmentNight = pmremGenerator.fromScene(skyEnvironmentScene, 0.02, 0.1, 1000).texture;
skyUniforms.uNight.value = 0;

ambientLight.intensity = 0.34;
const skyFillLight = new THREE.HemisphereLight(0xcfe3ff, 0x6f7d52, 0.62);
skyFillLight.name = 'sky-fill-light';
scene.add(skyFillLight);

exteriorLight.color.setHex(0xfff0d8);
exteriorLight.intensity = 2.1;
exteriorLight.target.position.set(0, 0, entranceZ - 2);
exteriorLight.position.copy(exteriorLight.target.position).addScaledVector(SUN_DIRECTION, 90);
scene.add(exteriorLight.target);
exteriorLight.castShadow = true;
exteriorLight.shadow.mapSize.set(2048, 2048);
exteriorLight.shadow.camera.left = -56;
exteriorLight.shadow.camera.right = 56;
exteriorLight.shadow.camera.top = 58;
exteriorLight.shadow.camera.bottom = -58;
exteriorLight.shadow.camera.near = 10;
exteriorLight.shadow.camera.far = 220;
exteriorLight.shadow.bias = -0.0004;
exteriorLight.shadow.normalBias = 0.035;
exteriorLight.shadow.radius = 3;
exteriorLight.shadow.camera.updateProjectionMatrix();

// Mái và tường "vô hình" chỉ dùng để chắn nắng: bên trong bảo tàng không bị
// nắng xuyên qua mái như trước, chỉ còn ánh đèn trưng bày ấm áp.
const sunBlockerMaterial = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
[
    [roomWidth + 0.4, 0.4, roomDepth + 0.4, 0, wallHeight + 0.2, 0],
    [0.2, wallHeight, roomDepth, -roomWidth / 2 + 0.15, wallHeight / 2, 0],
    [0.2, wallHeight, roomDepth, roomWidth / 2 - 0.15, wallHeight / 2, 0],
    [roomWidth, wallHeight, 0.3, 0, wallHeight / 2, -roomDepth / 2 - 0.15],
    [roomWidth / 2 - entranceWidth / 2, wallHeight, 0.2, -(roomWidth / 4 + entranceWidth / 4), wallHeight / 2, entranceZ - 0.12],
    [roomWidth / 2 - entranceWidth / 2, wallHeight, 0.2, roomWidth / 4 + entranceWidth / 4, wallHeight / 2, entranceZ - 0.12],
    [entranceWidth, wallHeight - entranceHeight, 0.2, 0, entranceHeight + (wallHeight - entranceHeight) / 2, entranceZ - 0.12]
].forEach(([w, h, d, x, y, z]) => {
    const blocker = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), sunBlockerMaterial);
    blocker.position.set(x, y, z);
    blocker.castShadow = true;
    blocker.receiveShadow = false;
    blocker.renderOrder = -20;
    blocker.userData.shadowRole = true;
    blocker.userData.refined = true;
    blocker.name = 'sun-blocker';
    scene.add(blocker);
});

// --- 2. Vật liệu dùng chung cho phần nâng cấp ---
const upgradeMaterials = {
    marbleColumn: new THREE.MeshStandardMaterial({ color: 0xf4efe6, roughness: 0.38, metalness: 0.02 }),
    stoneTrim: new THREE.MeshStandardMaterial({ color: 0xe6dccb, roughness: 0.62 }),
    plinthStone: new THREE.MeshStandardMaterial({ color: 0x8a8175, roughness: 0.7 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xd4a843, roughness: 0.28, metalness: 0.92 }),
    darkWood: new THREE.MeshStandardMaterial({ color: 0x3a2418, roughness: 0.48, metalness: 0.02 }),
    creamMoulding: new THREE.MeshStandardMaterial({ color: 0xefe6d4, roughness: 0.55 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x1b2833, roughness: 0.06, metalness: 0.75, emissive: 0xffc983, emissiveIntensity: 0 }),
    warmBulb: new THREE.MeshBasicMaterial({ color: 0xffe2a8, toneMapped: false })
};
upgradeMaterials.glass.envMap = skyEnvironmentDay;

function upgradeMesh(geometry, material, x, y, z, parent = scene) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
}

// --- 3. Mặt tiền: tường ốp đá, hàng cột, diềm mái, bảng tên và ngôi sao ---
const ashlarTexture = makeCanvasTexture(512, 512, (ctx, canvas) => {
    ctx.fillStyle = '#e9e1d2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const rowH = 64;
    for (let row = 0; row < canvas.height / rowH; row++) {
        const offset = row % 2 ? 96 : 0;
        for (let x = -192; x < canvas.width + 192; x += 192) {
            const tone = 222 + Math.floor(Math.random() * 16);
            ctx.fillStyle = `rgb(${tone + 4}, ${tone - 2}, ${tone - 16})`;
            ctx.fillRect(x + offset + 2, row * rowH + 2, 188, rowH - 4);
            for (let i = 0; i < 40; i++) {
                ctx.fillStyle = `rgba(150,138,118,${Math.random() * 0.08})`;
                ctx.fillRect(x + offset + Math.random() * 188, row * rowH + Math.random() * rowH, 2 + Math.random() * 6, 1 + Math.random() * 2);
            }
        }
    }
    ctx.fillStyle = 'rgba(160,148,128,0.55)';
    for (let y = 0; y <= canvas.height; y += rowH) ctx.fillRect(0, y - 1, canvas.width, 2);
}, 1, 1);

function addCladding(width, height, x, y, z, rotationY, name) {
    const texture = ashlarTexture.clone();
    texture.needsUpdate = true;
    texture.repeat.set(width / 4.2, height / 4.2);
    const cladding = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshStandardMaterial({ map: texture, roughness: 0.78 }));
    cladding.name = name;
    cladding.position.set(x, y, z);
    cladding.rotation.y = rotationY;
    cladding.userData.forceExterior = true;
    scene.add(cladding);
    return cladding;
}

const facadeGroup = new THREE.Group();
facadeGroup.name = 'museum-facade-portico';
scene.add(facadeGroup);

// Ốp đá mặt tiền (một mặt, chỉ nhìn thấy từ bên ngoài).
const doorHalf = entranceWidth / 2;
[-1, 1].forEach(side => {
    const width = roomWidth / 2 - doorHalf;
    addCladding(width, wallHeight, side * (doorHalf + width / 2), wallHeight / 2, entranceZ + 0.015, 0, 'facade-cladding');
    // Ốp đá hai tường hông phía trước.
    addCladding(entranceZ + 2, wallHeight, side * (roomWidth / 2 + 0.015), wallHeight / 2, entranceZ / 2 - 1, side * Math.PI / 2, 'facade-side-cladding');
});
addCladding(entranceWidth, wallHeight - entranceHeight, 0, entranceHeight + (wallHeight - entranceHeight) / 2, entranceZ + 0.015, 0, 'facade-cladding-over-door');

// Chân tường đá sẫm.
[-1, 1].forEach(side => {
    const width = roomWidth / 2 - doorHalf;
    upgradeMesh(new THREE.BoxGeometry(width, 0.7, 0.12), upgradeMaterials.plinthStone, side * (doorHalf + width / 2), 0.35, entranceZ + 0.07, facadeGroup);
    const sidePlinth = upgradeMesh(new THREE.BoxGeometry(0.12, 0.7, entranceZ + 2), upgradeMaterials.plinthStone, side * (roomWidth / 2 + 0.07), 0.35, entranceZ / 2 - 1, facadeGroup);
    sidePlinth.name = 'facade-side-plinth';
    // Gờ mái chạy dọc hai tường hông.
    upgradeMesh(new THREE.BoxGeometry(0.5, 0.34, entranceZ + 2), upgradeMaterials.stoneTrim, side * (roomWidth / 2 + 0.2), wallHeight - 0.05, entranceZ / 2 - 1, facadeGroup);
});

// Khung cửa chính mạ vàng.
[-1, 1].forEach(side => upgradeMesh(new THREE.BoxGeometry(0.26, entranceHeight + 0.3, 0.16), upgradeMaterials.gold, side * (doorHalf + 0.13), (entranceHeight + 0.3) / 2, entranceZ + 0.09, facadeGroup));
upgradeMesh(new THREE.BoxGeometry(entranceWidth + 0.52, 0.32, 0.18), upgradeMaterials.gold, 0, entranceHeight + 0.16, entranceZ + 0.1, facadeGroup);
upgradeMesh(new THREE.BoxGeometry(entranceWidth + 1.2, 0.2, 0.5), upgradeMaterials.stoneTrim, 0, entranceHeight + 0.45, entranceZ + 0.25, facadeGroup);

// Cửa sổ kính cao giữa các cột, ban đêm sáng ấm.
const facadeWindowXs = [5.1, 8.5, 11.9];
[-1, 1].forEach(side => {
    facadeWindowXs.forEach(x => {
        const wx = side * x;
        const pane = upgradeMesh(new THREE.PlaneGeometry(1.5, 3.7), upgradeMaterials.glass, wx, 3.15, entranceZ + 0.03, facadeGroup);
        pane.name = 'facade-window';
        upgradeMesh(new THREE.BoxGeometry(1.72, 0.12, 0.1), upgradeMaterials.gold, wx, 5.06, entranceZ + 0.06, facadeGroup);
        upgradeMesh(new THREE.BoxGeometry(1.8, 0.14, 0.26), upgradeMaterials.stoneTrim, wx, 1.24, entranceZ + 0.13, facadeGroup);
        [-0.8, 0.8].forEach(dx => upgradeMesh(new THREE.BoxGeometry(0.1, 3.9, 0.1), upgradeMaterials.gold, wx + dx, 3.15, entranceZ + 0.06, facadeGroup));
        upgradeMesh(new THREE.BoxGeometry(0.05, 3.7, 0.06), upgradeMaterials.gold, wx, 3.15, entranceZ + 0.05, facadeGroup);
        upgradeMesh(new THREE.BoxGeometry(1.5, 0.05, 0.06), upgradeMaterials.gold, wx, 4.1, entranceZ + 0.05, facadeGroup);
    });
});

// Hàng cột trắng (8 cột + 2 trụ góc) và diềm mái.
const porticoFrontZ = entranceZ + 3.0;
const columnZ = entranceZ + 2.9;
const columnXs = [3.4, 6.8, 10.2, 13.6];
const columnShaft = new THREE.CylinderGeometry(0.33, 0.37, 5.9, 28);
const columnRing = new THREE.TorusGeometry(0.4, 0.07, 8, 28);
[-1, 1].forEach(side => {
    columnXs.forEach(x => {
        const cx = side * x;
        upgradeMesh(new THREE.BoxGeometry(1.0, 0.36, 1.0), upgradeMaterials.stoneTrim, cx, 0.18, columnZ, facadeGroup);
        const ring = upgradeMesh(columnRing, upgradeMaterials.marbleColumn, cx, 0.44, columnZ, facadeGroup);
        ring.rotation.x = Math.PI / 2;
        upgradeMesh(columnShaft, upgradeMaterials.marbleColumn, cx, 0.36 + 2.95, columnZ, facadeGroup);
        const topRing = upgradeMesh(columnRing, upgradeMaterials.gold, cx, 6.28, columnZ, facadeGroup);
        topRing.rotation.x = Math.PI / 2;
        topRing.scale.setScalar(0.9);
        upgradeMesh(new THREE.BoxGeometry(0.9, 0.2, 0.9), upgradeMaterials.marbleColumn, cx, 6.42, columnZ, facadeGroup);
        upgradeMesh(new THREE.BoxGeometry(1.08, 0.18, 1.08), upgradeMaterials.stoneTrim, cx, 6.61, columnZ, facadeGroup);
        addBlocker(cx - 0.55, cx + 0.55, columnZ - 0.55, columnZ + 0.55);
        // Đèn hắt chân cột (chỉ sáng ban đêm).
        const uplight = upgradeMesh(new THREE.BoxGeometry(0.34, 0.05, 0.2), upgradeMaterials.warmBulb, cx, 0.39, columnZ + 0.62, facadeGroup);
        uplight.name = 'facade-uplight';
    });
    // Trụ góc áp tường.
    upgradeMesh(new THREE.BoxGeometry(1.1, 6.7, 0.55), upgradeMaterials.marbleColumn, side * 15.45, 3.35, entranceZ + 0.28, facadeGroup);
});

const entablatureDepth = porticoFrontZ - entranceZ + 0.4;
const entablatureZ = entranceZ + entablatureDepth / 2 - 0.1;
upgradeMesh(new THREE.BoxGeometry(roomWidth + 0.3, 0.55, entablatureDepth), upgradeMaterials.stoneTrim, 0, 6.97, entablatureZ, facadeGroup);
upgradeMesh(new THREE.BoxGeometry(roomWidth + 0.3, 0.62, entablatureDepth + 0.1), upgradeMaterials.marbleColumn, 0, 7.55, entablatureZ, facadeGroup);
upgradeMesh(new THREE.BoxGeometry(roomWidth + 0.34, 0.07, 0.04), upgradeMaterials.gold, 0, 7.26, entablatureZ + entablatureDepth / 2 + 0.06, facadeGroup);
upgradeMesh(new THREE.BoxGeometry(roomWidth + 0.9, 0.26, entablatureDepth + 0.6), upgradeMaterials.stoneTrim, 0, 7.99, entablatureZ + 0.1, facadeGroup);
// Trần hiên có đèn âm trần.
for (let x = -12; x <= 12; x += 4) {
    const downlight = upgradeMesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 16), upgradeMaterials.warmBulb, x + 2, 6.68, entranceZ + 1.5, facadeGroup);
    downlight.name = 'facade-downlight';
}

// Bảng tên trên tầng mái (attic) và ngôi sao vàng.
const atticZ = porticoFrontZ - 0.1;
upgradeMesh(new THREE.BoxGeometry(14.2, 1.95, 0.8), upgradeMaterials.marbleColumn, 0, 9.08, atticZ, facadeGroup);
upgradeMesh(new THREE.BoxGeometry(14.8, 0.22, 1.0), upgradeMaterials.stoneTrim, 0, 10.15, atticZ, facadeGroup);
upgradeMesh(new THREE.BoxGeometry(14.8, 0.16, 1.0), upgradeMaterials.stoneTrim, 0, 8.18, atticZ, facadeGroup);
const facadeSign = scene.getObjectByName('museum-facade-sign');
if (facadeSign) {
    facadeSign.position.set(0, 9.08, atticZ + 0.41);
    facadeSign.scale.set(1.26, 1.05, 1);
}
canopy.visible = false;

function createStarShape(outer, inner) {
    const shape = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? outer : inner;
        const angle = Math.PI / 2 + (i * Math.PI) / 5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
}
const facadeStar = new THREE.Mesh(
    new THREE.ExtrudeGeometry(createStarShape(0.62, 0.25), { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 }),
    new THREE.MeshStandardMaterial({ color: 0xffd23a, roughness: 0.25, metalness: 0.75, emissive: 0x7a4a00, emissiveIntensity: 0.25 })
);
facadeStar.position.set(0, 10.95, atticZ);
facadeStar.name = 'facade-star';
facadeGroup.add(facadeStar);
upgradeMesh(new THREE.BoxGeometry(1.8, 0.28, 0.6), upgradeMaterials.stoneTrim, 0, 10.4, atticZ, facadeGroup);

// Hai chậu cây lớn hai bên bậc tam cấp và bồn hoa giữa các cột.
const ceramicMaterial = new THREE.MeshStandardMaterial({ color: 0x7c1f24, roughness: 0.3, metalness: 0.05 });
function createVaseGeometry(scale = 1) {
    const points = [
        [0.0, 0.0], [0.26, 0.0], [0.3, 0.06], [0.24, 0.12], [0.34, 0.3], [0.44, 0.55], [0.42, 0.78], [0.34, 0.9], [0.38, 0.96], [0.36, 1.0]
    ].map(([r, y]) => new THREE.Vector2(r * scale, y * scale));
    return new THREE.LatheGeometry(points, 28);
}

// --- 4. Chậu cây cau cảnh (dùng cả trong và ngoài) ---
const frondTexture = makeCanvasTexture(128, 512, (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#5d7a2f';
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(64, 512); ctx.lineTo(64, 6); ctx.stroke();
    for (let y = 30; y < 500; y += 15) {
        const len = 58 * Math.sin((y / 512) * Math.PI) + 6;
        const tone = 70 + Math.floor(Math.random() * 40);
        ctx.strokeStyle = `rgb(${tone - 30}, ${tone + 70}, ${tone - 36})`;
        ctx.lineWidth = 6;
        [-1, 1].forEach(side => {
            ctx.beginPath();
            ctx.moveTo(64, y);
            ctx.quadraticCurveTo(64 + side * len * 0.5, y - 4, 64 + side * len, y + 22);
            ctx.stroke();
        });
    }
}, 1, 1);
frondTexture.wrapS = frondTexture.wrapT = THREE.ClampToEdgeWrapping;
const frondMaterial = new THREE.MeshStandardMaterial({ map: frondTexture, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.75 });
const frondGeometry = (() => {
    const geometry = new THREE.PlaneGeometry(0.62, 1.7, 1, 10);
    geometry.translate(0, 0.85, 0);
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const t = pos.getY(i) / 1.7;
        pos.setZ(i, t * t * 0.9);
    }
    geometry.computeVertexNormals();
    return geometry;
})();

function createPottedPalm(x, z, scale = 1, parent = scene) {
    const plant = new THREE.Group();
    plant.name = 'potted-palm';
    const vase = new THREE.Mesh(createVaseGeometry(0.95), ceramicMaterial);
    plant.add(vase);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.025, 8, 28), upgradeMaterials.gold);
    band.rotation.x = Math.PI / 2;
    band.position.y = 0.72;
    plant.add(band);
    const soil = new THREE.Mesh(new THREE.CircleGeometry(0.33, 20), courtyardMaterials.soil);
    soil.rotation.x = -Math.PI / 2;
    soil.position.y = 0.9;
    plant.add(soil);
    for (let i = 0; i < 11; i++) {
        const frond = new THREE.Mesh(frondGeometry, frondMaterial);
        const angle = (i / 11) * Math.PI * 2 + Math.random() * 0.3;
        frond.position.y = 0.88;
        frond.rotation.set(0, angle, 0);
        frond.rotateX(0.18 + (i % 3) * 0.16);
        frond.scale.setScalar(0.85 + Math.random() * 0.35);
        plant.add(frond);
    }
    plant.position.set(x, 0, z);
    plant.scale.setScalar(scale);
    parent.add(plant);
    return plant;
}

[-1, 1].forEach(side => {
    createPottedPalm(side * 2.35, entranceZ + 3.9, 1.15, facadeGroup);
    addBlocker(side * 2.35 - 0.55, side * 2.35 + 0.55, entranceZ + 3.35, entranceZ + 4.45);
    // Bồn hoa đá giữa các cột bên ngoài.
    const planterX = side * 8.5;
    upgradeMesh(new THREE.BoxGeometry(2.4, 0.55, 0.85), upgradeMaterials.stoneTrim, planterX, 0.275, entranceZ + 4.3, facadeGroup);
    upgradeMesh(new THREE.BoxGeometry(2.2, 0.3, 0.65), courtyardMaterials.hedge, planterX, 0.66, entranceZ + 4.3, facadeGroup);
    addBlocker(planterX - 1.3, planterX + 1.3, entranceZ + 3.8, entranceZ + 4.8);
});
const planterBlooms = [];
[-1, 1].forEach(side => {
    for (let i = 0; i < 22; i++) {
        planterBlooms.push({ x: side * 8.5 + (Math.random() - 0.5) * 2.0, y: 0.84, z: entranceZ + 4.3 + (Math.random() - 0.5) * 0.5, scale: 0.9 + Math.random() * 0.5, color: i % 3 === 0 ? 0xf1c232 : 0xc8202b });
    }
});
buildInstanced(new THREE.SphereGeometry(0.09, 8, 6), courtyardMaterials.bloom, planterBlooms, 'planter-blooms');

// --- 5. Cây hoa Việt: mai vàng trong bồn hoa, tre, hoa giấy, đồi xa ---
const blossomTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3222, roughness: 0.9 });
const maiTrunkItems = [];
const maiBlossomItems = [];
const maiLeafItems = [];
function addMaiTree(x, z, scale = 1) {
    // Thân uốn lượn gồm ba đoạn.
    maiTrunkItems.push({ x, y: 0.55 * scale, z, sx: scale, sy: scale, sz: scale, rz: 0.1 });
    maiTrunkItems.push({ x: x + 0.12 * scale, y: 1.35 * scale, z, sx: 0.8 * scale, sy: scale, sz: 0.8 * scale, rz: -0.35 });
    maiTrunkItems.push({ x: x - 0.1 * scale, y: 1.3 * scale, z: z + 0.12 * scale, sx: 0.7 * scale, sy: 0.9 * scale, sz: 0.7 * scale, rx: 0.4, rz: 0.45 });
    for (let i = 0; i < 70; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * 1.15 * scale;
        const height = (1.7 + Math.random() * 0.95 - radius * 0.35) * scale;
        const item = { x: x + Math.cos(angle) * radius, y: height, z: z + Math.sin(angle) * radius, scale: (0.8 + Math.random() * 0.6) * scale };
        if (i % 5 === 0) maiLeafItems.push(item);
        else maiBlossomItems.push({ ...item, color: [0xffd23f, 0xf7c52b, 0xffe06b][i % 3] });
    }
}
[-1, 1].forEach(side => {
    addMaiTree(side * 13.2, entranceZ + 6.4, 1.0);
    addMaiTree(side * 13.2, entranceZ + 11.4, 0.95);
});
buildInstanced(new THREE.CylinderGeometry(0.07, 0.12, 1.1, 7), blossomTrunkMaterial, maiTrunkItems, 'mai-trunks');
buildInstanced(new THREE.IcosahedronGeometry(0.13, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, emissive: 0x3a2800, emissiveIntensity: 0.25 }), maiBlossomItems, 'mai-blossoms');
buildInstanced(new THREE.IcosahedronGeometry(0.12, 0), courtyardMaterials.leafGreen, maiLeafItems, 'mai-leaves');

// Khóm tre dọc tường bao hai bên.
const bambooCulmItems = [];
const bambooLeafItems = [];
function addBambooClump(x, z) {
    for (let i = 0; i < 11; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.55;
        const height = 6 + Math.random() * 3;
        const lean = (Math.random() - 0.5) * 0.18;
        const bx = x + Math.cos(angle) * radius;
        const bz = z + Math.sin(angle) * radius;
        bambooCulmItems.push({ x: bx, y: height / 2, z: bz, sy: height, rx: lean, rz: lean * 0.7, color: Math.random() > 0.5 ? 0x7e9a45 : 0x94a854 });
        for (let j = 0; j < 7; j++) {
            const t = 0.45 + Math.random() * 0.55;
            bambooLeafItems.push({
                x: bx + (Math.random() - 0.5) * 1.5 + Math.sin(lean) * height * t,
                y: height * t,
                z: bz + (Math.random() - 0.5) * 1.5,
                sx: 0.8 + Math.random() * 0.6, sy: 0.45, sz: 0.8 + Math.random() * 0.6,
                ry: Math.random() * Math.PI,
                color: [0x4f7a34, 0x628c3c, 0x3f6a2c][j % 3]
            });
        }
    }
    addBlocker(x - 0.8, x + 0.8, z - 0.8, z + 0.8);
}
[-1, 1].forEach(side => {
    [entranceZ + 5.2, entranceZ + 12.2, entranceZ + 19, entranceZ + 26.2].forEach(z => addBambooClump(side * 23.7, z));
});
buildInstanced(new THREE.CylinderGeometry(0.055, 0.065, 1, 6), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 }), bambooCulmItems, 'bamboo-culms');
buildInstanced(new THREE.IcosahedronGeometry(0.75, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true }), bambooLeafItems, 'bamboo-leaves');

// Hoa giấy (bông giấy) hồng tím dọc tường bao phía trước.
const bougainvilleaItems = [];
[-1, 1].forEach(side => {
    for (let x = 7.5; x <= 24; x += 0.9) {
        const bx = side * x;
        bougainvilleaItems.push({ x: bx, y: 0.7 + Math.random() * 0.4, z: entranceZ + 33.1 + Math.random() * 0.2, sx: 0.8, sy: 0.7, sz: 0.55, color: Math.random() > 0.3 ? 0xd12f7c : 0x5b8a3c });
        bougainvilleaItems.push({ x: bx + 0.4, y: 1.1 + Math.random() * 0.5, z: entranceZ + 33.35, sx: 0.55, sy: 0.5, sz: 0.4, color: Math.random() > 0.4 ? 0xe0489a : 0x4f7d34 });
    }
});
buildInstanced(new THREE.IcosahedronGeometry(0.62, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 }), bougainvilleaItems, 'bougainvillea');

// Đồi núi xa mờ trong sương, tạo chiều sâu cho đường chân trời.
const hillMaterial = new THREE.MeshStandardMaterial({ color: 0x6f8c6a, roughness: 1, flatShading: true });
const hillGroup = new THREE.Group();
hillGroup.name = 'distant-hills';
for (let i = 0; i < 26; i++) {
    const angle = (i / 26) * Math.PI * 2 + Math.random() * 0.1;
    const distance = 175 + Math.random() * 60;
    const hill = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), hillMaterial);
    hill.scale.set(38 + Math.random() * 30, 14 + Math.random() * 22, 30 + Math.random() * 20);
    hill.position.set(Math.cos(angle) * distance, -4, entranceZ + Math.sin(angle) * distance);
    hill.rotation.y = Math.random() * Math.PI;
    hillGroup.add(hill);
}
scene.add(hillGroup);

// Cỏ tự nhiên hơn: nhiều tầng nhiễu màu và ngọn cỏ.
const richGrassTexture = makeCanvasTexture(512, 512, (ctx, canvas) => {
    ctx.fillStyle = '#688b43';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 90; i++) {
        const gx = Math.random() * canvas.width;
        const gy = Math.random() * canvas.height;
        const r = 20 + Math.random() * 70;
        const gradient = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
        const tone = Math.random() > 0.5 ? '120,156,74' : '84,118,52';
        gradient.addColorStop(0, `rgba(${tone},0.35)`);
        gradient.addColorStop(1, `rgba(${tone},0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(gx - r, gy - r, r * 2, r * 2);
    }
    for (let i = 0; i < 9000; i++) {
        const tone = ['#7fa356', '#5d8238', '#8cad5f', '#4f7331', '#6f9447'][i % 5];
        ctx.strokeStyle = tone;
        ctx.lineWidth = 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (Math.random() - 0.5) * 3, y - 2 - Math.random() * 5);
        ctx.stroke();
    }
}, 13, 12);
courtyardMaterials.grass.map = richGrassTexture;
courtyardMaterials.grass.needsUpdate = true;

// Mặt hồ phản chiếu bầu trời.
const calmWaterTexture = makeCanvasTexture(256, 256, (ctx, canvas) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(120,150,160,0.25)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 14; i++) {
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= canvas.width; x += 16) ctx.lineTo(x, y + Math.sin((x / canvas.width) * Math.PI * 4 + i) * 3);
        ctx.stroke();
    }
}, 2, 2);
pondWaterMeshes.forEach(water => {
    const material = water.material;
    material.map = calmWaterTexture.clone();
    material.map.needsUpdate = true;
    material.color.setHex(0x3f6f78);
    material.roughness = 0.06;
    material.metalness = 0.35;
    material.envMap = skyEnvironmentDay;
    material.envMapIntensity = 1.1;
    material.opacity = 0.94;
    material.userData.fixedEnv = true;
    material.needsUpdate = true;
});

// --- 6. Nội thất: sàn, trần, chân tường, đèn chùm, chậu cây ---
function drawMarbleTiles(ctx, size, tile, base, vein, height = size) {
    for (let y = 0; y < height; y += tile) {
        for (let x = 0; x < size; x += tile) {
            const shade = Math.floor(Math.random() * 10) - 5;
            ctx.fillStyle = `rgb(${base[0] + shade}, ${base[1] + shade}, ${base[2] + shade})`;
            ctx.fillRect(x, y, tile, tile);
            for (let v = 0; v < 3; v++) {
                ctx.strokeStyle = `rgba(${vein},${0.06 + Math.random() * 0.1})`;
                ctx.lineWidth = 0.6 + Math.random() * 1.6;
                ctx.beginPath();
                let vx = x + Math.random() * tile;
                let vy = y;
                ctx.moveTo(vx, vy);
                while (vy < y + tile) {
                    vx += (Math.random() - 0.5) * 18;
                    vy += 6 + Math.random() * 10;
                    ctx.lineTo(Math.min(x + tile, Math.max(x, vx)), Math.min(y + tile, vy));
                }
                ctx.stroke();
            }
        }
    }
    ctx.strokeStyle = 'rgba(120,108,92,0.45)';
    ctx.lineWidth = 2;
    for (let p = 0; p <= size; p += tile) {
        ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, height); ctx.stroke();
    }
    for (let p = 0; p <= height; p += tile) {
        ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(size, p); ctx.stroke();
    }
}

const marbleFloorTexture = makeCanvasTexture(512, 512, (ctx) => drawMarbleTiles(ctx, 512, 256, [218, 208, 192], '110,98,82'), roomWidth / 2.4, roomDepth / 2.4);
floorMaterial.map = marbleFloorTexture;
floorMaterial.color.setHex(0xffffff);
floorMaterial.roughness = 0.24;
floorMaterial.metalness = 0.0;
floorMaterial.needsUpdate = true;

// Sàn sảnh: đá cẩm thạch có đường viền đỏ sẫm và hoa văn ngôi sao ở giữa.
const lobbyWidth = museumLayout.lobby.maxX - museumLayout.lobby.minX;
const lobbyDepth = museumLayout.lobby.maxZ - museumLayout.lobby.minZ;
const lobbyFloorTexture = makeCanvasTexture(1024, Math.round(1024 * lobbyDepth / lobbyWidth), (ctx, canvas) => {
    drawMarbleTiles(ctx, 1024, 142, [226, 218, 203], '115,100,84', canvas.height);
    const w = canvas.width;
    const hgt = canvas.height;
    ctx.strokeStyle = '#6d1a1e';
    ctx.lineWidth = 34;
    ctx.strokeRect(46, 46, w - 92, hgt - 92);
    ctx.strokeStyle = '#c9a44c';
    ctx.lineWidth = 6;
    ctx.strokeRect(22, 22, w - 44, hgt - 44);
    ctx.strokeRect(72, 72, w - 144, hgt - 144);
    const cx = w / 2;
    const cy = hgt / 2;
    ctx.fillStyle = '#6d1a1e';
    ctx.beginPath(); ctx.arc(cx, cy, 160, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#c9a44c';
    ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(cx, cy, 160, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(cx, cy, 138, 0, Math.PI * 2); ctx.stroke();
    // Tám cánh sen cách điệu quanh ngôi sao.
    ctx.fillStyle = 'rgba(214,180,94,0.9)';
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.save();
        ctx.translate(cx + Math.cos(a) * 98, cy + Math.sin(a) * 98);
        ctx.rotate(a + Math.PI / 2);
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 33, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    ctx.fillStyle = '#e8c257';
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? 76 : 30;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const x = cx + Math.cos(a) * radius;
        const y = cy + Math.sin(a) * radius;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
}, 1, 1);
lobbyFloorTexture.wrapS = lobbyFloorTexture.wrapT = THREE.ClampToEdgeWrapping;
lobbyFloor.material.map = lobbyFloorTexture;
lobbyFloor.material.color.setHex(0xffffff);
lobbyFloor.material.roughness = 0.2;
lobbyFloor.material.needsUpdate = true;
// Vật liệu sàn sảnh là hình vuông: kéo giãn nhẹ theo tỉ lệ thật của sảnh.
lobbyFloorTexture.repeat.set(1, 1);

// Sàn gỗ ghép cho các phòng trưng bày.
const parquetTexture = makeCanvasTexture(512, 512, (ctx) => {
    const plankW = 128;
    const plankH = 32;
    for (let row = 0; row < 512 / plankH; row++) {
        const offset = (row % 4) * 32;
        for (let x = -plankW; x < 512 + plankW; x += plankW) {
            const tone = 140 + Math.floor(Math.random() * 34);
            ctx.fillStyle = `rgb(${tone}, ${Math.floor(tone * 0.68)}, ${Math.floor(tone * 0.42)})`;
            ctx.fillRect(x + offset, row * plankH, plankW, plankH);
            ctx.strokeStyle = 'rgba(70,40,20,0.18)';
            ctx.lineWidth = 1;
            for (let g = 0; g < 4; g++) {
                const gy = row * plankH + 4 + Math.random() * (plankH - 8);
                ctx.beginPath();
                ctx.moveTo(x + offset, gy);
                ctx.bezierCurveTo(x + offset + 40, gy + 3, x + offset + 80, gy - 3, x + offset + plankW, gy + 1);
                ctx.stroke();
            }
            ctx.fillStyle = 'rgba(40,22,12,0.55)';
            ctx.fillRect(x + offset, row * plankH, 2, plankH);
        }
        ctx.fillStyle = 'rgba(40,22,12,0.45)';
        ctx.fillRect(0, row * plankH, 512, 1.5);
    }
}, 1, 1);
const cinemaCarpetTexture = makeCanvasTexture(256, 256, (ctx, canvas) => {
    ctx.fillStyle = '#3b1d22';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 3000; i++) {
        ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '90,40,48' : '30,12,16'},0.35)`;
        ctx.fillRect(Math.random() * 256, Math.random() * 256, 1.5, 1.5);
    }
    ctx.strokeStyle = 'rgba(190,150,80,0.25)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(i * 64 + 32, 0); ctx.lineTo(i * 64, 32); ctx.lineTo(i * 64 + 32, 64); ctx.lineTo(i * 64 + 64, 32); ctx.closePath(); ctx.stroke();
    }
}, 1, 1);
museumRooms.forEach(room => {
    const roomFloorMesh = scene.getObjectByName(`room-floor-${room.id}`);
    if (!roomFloorMesh) return;
    const texture = (room.screeningRoom ? cinemaCarpetTexture : parquetTexture).clone();
    texture.needsUpdate = true;
    texture.repeat.set(room.width / (room.screeningRoom ? 2.2 : 3.2), room.depth / (room.screeningRoom ? 2.2 : 3.2));
    roomFloorMesh.material.map = texture;
    roomFloorMesh.material.color.setHex(0xffffff);
    roomFloorMesh.material.roughness = room.screeningRoom ? 0.95 : 0.38;
    roomFloorMesh.material.needsUpdate = true;
});

// Thảm đỏ hành lang có viền hoa văn vàng.
const runnerTexture = makeCanvasTexture(256, 512, (ctx, canvas) => {
    ctx.fillStyle = '#7a1519';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 4000; i++) {
        ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '150,40,44' : '70,10,14'},0.28)`;
        ctx.fillRect(Math.random() * 256, Math.random() * 512, 1.5, 1.5);
    }
    ctx.fillStyle = '#c9a44c';
    ctx.fillRect(10, 0, 6, 512);
    ctx.fillRect(240, 0, 6, 512);
    ctx.fillRect(26, 0, 2, 512);
    ctx.fillRect(228, 0, 2, 512);
    ctx.strokeStyle = 'rgba(201,164,76,0.55)';
    ctx.lineWidth = 2;
    for (let y = 0; y < 512; y += 128) {
        ctx.beginPath();
        ctx.moveTo(128, y + 24); ctx.lineTo(168, y + 64); ctx.lineTo(128, y + 104); ctx.lineTo(88, y + 64); ctx.closePath();
        ctx.stroke();
        ctx.beginPath(); ctx.arc(128, y + 64, 10, 0, Math.PI * 2); ctx.stroke();
    }
}, 1, 7);
corridorRunner.material.map = runnerTexture;
corridorRunner.material.color.setHex(0xffffff);
corridorRunner.material.needsUpdate = true;

// Trần ô kén (coffered ceiling).
const cofferTexture = makeCanvasTexture(512, 512, (ctx) => {
    const cell = 256;
    for (let y = 0; y < 512; y += cell) {
        for (let x = 0; x < 512; x += cell) {
            ctx.fillStyle = '#e9e1d2';
            ctx.fillRect(x, y, cell, cell);
            const inset = 26;
            const gradient = ctx.createLinearGradient(x, y, x + cell, y + cell);
            gradient.addColorStop(0, '#d6ccb9');
            gradient.addColorStop(1, '#f6f0e4');
            ctx.fillStyle = gradient;
            ctx.fillRect(x + inset, y + inset, cell - inset * 2, cell - inset * 2);
            ctx.fillStyle = '#f7f2e8';
            ctx.fillRect(x + inset + 16, y + inset + 16, cell - (inset + 16) * 2, cell - (inset + 16) * 2);
            ctx.strokeStyle = 'rgba(190,150,70,0.7)';
            ctx.lineWidth = 3;
            ctx.strokeRect(x + inset + 16, y + inset + 16, cell - (inset + 16) * 2, cell - (inset + 16) * 2);
        }
    }
}, roomWidth / 3, roomDepth / 3);
ceiling.material = new THREE.MeshStandardMaterial({ map: cofferTexture, roughness: 0.85, emissive: 0x3b342a, emissiveIntensity: 0.55 });

// Tường trát vữa mịn.
const plasterTexture = makeCanvasTexture(256, 256, (ctx, canvas) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 2600; i++) {
        ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '255,250,240' : '200,190,172'},${Math.random() * 0.12})`;
        ctx.fillRect(Math.random() * 256, Math.random() * 256, 2 + Math.random() * 4, 2 + Math.random() * 4);
    }
}, 6, 3);
partitionMaterial.map = plasterTexture;
partitionMaterial.needsUpdate = true;
wallMaterial.map = plasterTexture;
wallMaterial.needsUpdate = true;

// Chân tường gỗ và phào trần cho các phòng và hành lang.
const baseboardItems = [];
const crownItems = [];
function addWallTrim(x, z, length, alongX) {
    baseboardItems.push(alongX ? { x, y: 0.13, z, sx: length, sy: 0.26, sz: 0.04 } : { x, y: 0.13, z, sx: 0.04, sy: 0.26, sz: length });
    crownItems.push(alongX ? { x, y: wallHeight - 0.14, z, sx: length, sy: 0.22, sz: 0.1 } : { x, y: wallHeight - 0.14, z, sx: 0.1, sy: 0.22, sz: length });
}
museumRooms.forEach(room => {
    const segmentDepth = (room.depth - 3.2) / 2;
    [-1, 1].forEach(direction => {
        const z = room.centerZ + direction * (1.6 + segmentDepth / 2);
        addWallTrim(room.side * (corridorHalfWidth - 0.11), z, segmentDepth, false);
        addWallTrim(room.side * (corridorHalfWidth + 0.11), z, segmentDepth, false);
    });
    addWallTrim(room.centerX, room.bounds.minZ + 0.11, room.width - 0.3, true);
    addWallTrim(room.centerX, room.bounds.maxZ - 0.11, room.width - 0.3, true);
    addWallTrim(room.side * (roomWidth / 2 - 0.03), room.centerZ, room.depth - 0.2, false);
});
const interiorTrimGroup = new THREE.Group();
interiorTrimGroup.name = 'interior-trim';
scene.add(interiorTrimGroup);
function buildInteriorInstanced(geometry, material, items, name) {
    const mesh = new THREE.InstancedMesh(geometry, material, items.length);
    mesh.name = name;
    items.forEach((item, index) => {
        instancePosition.set(item.x, item.y, item.z);
        instanceQuaternion.identity();
        instanceScale.set(item.sx, item.sy, item.sz);
        instanceMatrix.compose(instancePosition, instanceQuaternion, instanceScale);
        mesh.setMatrixAt(index, instanceMatrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;
    interiorTrimGroup.add(mesh);
    return mesh;
}
buildInteriorInstanced(unitBox, upgradeMaterials.darkWood, baseboardItems, 'interior-baseboards');
buildInteriorInstanced(unitBox, upgradeMaterials.creamMoulding, crownItems, 'interior-crown-moulding');

// Loa trần cũ (một đĩa đen lớn) thành hoa văn trần bằng đồng; âm thanh giữ nguyên.
speakerMesh.material = upgradeMaterials.gold;
speakerMesh.scale.set(0.42, 0.14, 0.42);
speakerMesh.position.y = wallHeight - 0.04;

// Đèn chùm vòng đồng ở sảnh chính.
function createChandelier(x, y, z, radius = 1.15) {
    const chandelier = new THREE.Group();
    chandelier.name = 'lobby-chandelier';
    const outer = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.05, 10, 48), upgradeMaterials.gold);
    outer.rotation.x = Math.PI / 2;
    chandelier.add(outer);
    const inner = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.55, 0.04, 10, 36), upgradeMaterials.gold);
    inner.rotation.x = Math.PI / 2;
    inner.position.y = 0.45;
    chandelier.add(inner);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, wallHeight - y, 8), upgradeMaterials.gold);
    stem.position.y = (wallHeight - y) / 2;
    chandelier.add(stem);
    const bulbGeometry = new THREE.SphereGeometry(0.085, 12, 10);
    for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        const bulb = new THREE.Mesh(bulbGeometry, upgradeMaterials.warmBulb);
        bulb.position.set(Math.cos(a) * radius, 0.1, Math.sin(a) * radius);
        chandelier.add(bulb);
    }
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const bulb = new THREE.Mesh(bulbGeometry, upgradeMaterials.warmBulb);
        bulb.position.set(Math.cos(a) * radius * 0.55, 0.55, Math.sin(a) * radius * 0.55);
        chandelier.add(bulb);
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, radius, 6), upgradeMaterials.gold);
        spoke.rotation.z = Math.PI / 2;
        spoke.rotation.y = -a;
        spoke.position.set(Math.cos(a) * radius / 2, 0.02, Math.sin(a) * radius / 2);
        chandelier.add(spoke);
    }
    chandelier.position.set(x, y, z);
    scene.add(chandelier);
    return chandelier;
}
createChandelier(0, 6.1, 15.8);

// Chậu cây trong sảnh và cuối hành lang.
createPottedPalm(-6.2, 20.0, 1.05);
createPottedPalm(6.2, 20.0, 1.05);
createPottedPalm(-2.55, -19.9, 0.95);
createPottedPalm(2.55, -19.9, 0.95);

// --- 7. Đêm: cửa sổ và đèn hắt sáng lên, phản chiếu bầu trời đổi theo ---
const facadeNightLights = [
    new THREE.PointLight(0xffd6a0, 1.3, 16, 2),
    new THREE.PointLight(0xffd6a0, 1.3, 16, 2)
];
facadeNightLights[0].position.set(-8.5, 1.2, entranceZ + 5.5);
facadeNightLights[1].position.set(8.5, 1.2, entranceZ + 5.5);
facadeNightLights.forEach(light => nightLightsGroup.add(light));

function applyVisualNightMode(night) {
    skyFillLight.intensity = night ? 0.2 : 0.62;
    skyFillLight.color.setHex(night ? 0x6f86b8 : 0xcfe3ff);
    upgradeMaterials.glass.emissiveIntensity = night ? 0.85 : 0;
    upgradeMaterials.glass.envMap = night ? skyEnvironmentNight : skyEnvironmentDay;
    upgradeMaterials.warmBulb.color.setHex(night ? 0xffe0a0 : 0xf2e6cf);
    facadeStar.material.emissiveIntensity = night ? 0.9 : 0.25;
    pondWaterMeshes.forEach(water => { water.material.envMap = night ? skyEnvironmentNight : skyEnvironmentDay; });
    renderer.toneMappingExposure = night ? 1.15 : 1.0;
    scene.traverse(object => {
        if (!object.isMesh) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(material => {
            if (material && material.userData.baseEnvIntensity !== undefined) {
                material.envMapIntensity = material.userData.baseEnvIntensity * (night ? 0.45 : 1);
            }
        });
    });
    renderer.shadowMap.needsUpdate = true;
}

// Hàng rào cây xanh tươi hơn, có vân lá.
courtyardMaterials.hedge.map = makeCanvasTexture(256, 256, (ctx, canvas) => {
    ctx.fillStyle = '#5b8a3d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 1800; i++) {
        ctx.fillStyle = ['#6f9d4b', '#4a7631', '#7fae57', '#3f6a2b'][i % 4];
        ctx.beginPath();
        ctx.ellipse(Math.random() * 256, Math.random() * 256, 2 + Math.random() * 3, 1 + Math.random() * 2, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }
}, 3, 1);
courtyardMaterials.hedge.color.setHex(0xffffff);
courtyardMaterials.hedge.needsUpdate = true;

// Gộp các chi tiết tĩnh cùng vật liệu thành một lệnh vẽ để giữ khung hình mượt.
function mergeStaticMeshes(roots, name) {
    const buckets = new Map();
    const doomed = [];
    roots.forEach(root => {
        root.updateMatrixWorld(true);
        root.traverse(object => {
            if (!object.isMesh || object.isInstancedMesh) return;
            const material = object.material;
            if (Array.isArray(material)) return;
            let geometry = object.geometry.index ? object.geometry.toNonIndexed() : object.geometry.clone();
            geometry.applyMatrix4(object.matrixWorld);
            ['position', 'normal', 'uv'].forEach(attribute => {
                if (!geometry.getAttribute(attribute)) geometry = null;
            });
            if (!geometry) return;
            Object.keys(geometry.attributes).forEach(key => { if (!['position', 'normal', 'uv'].includes(key)) geometry.deleteAttribute(key); });
            geometry.morphAttributes = {};
            if (!buckets.has(material)) buckets.set(material, { geometries: [], renderOrder: object.renderOrder });
            buckets.get(material).geometries.push(geometry);
            doomed.push(object);
        });
    });
    doomed.forEach(object => object.parent && object.parent.remove(object));
    roots.forEach(root => { if (root.parent && root.children.length === 0 && root !== scene) root.parent.remove(root); });
    const merged = new THREE.Group();
    merged.name = name;
    buckets.forEach(({ geometries, renderOrder }, material) => {
        const geometry = mergeGeometries(geometries, false);
        if (!geometry) return;
        geometry.computeBoundingSphere();
        const mesh = new THREE.Mesh(geometry, material);
        mesh.renderOrder = renderOrder;
        mesh.userData.forceExterior = name.startsWith('exterior');
        merged.add(mesh);
    });
    scene.add(merged);
    return merged;
}
mergeStaticMeshes([facadeGroup], 'exterior-facade-merged');
mergeStaticMeshes([statue], 'exterior-memorial-merged');
mergeStaticMeshes([hillGroup], 'exterior-hills-merged');
mergeStaticMeshes(scene.children.filter(object => object.name === 'picture-light'), 'interior-picture-lights-merged');
mergeStaticMeshes(scene.children.filter(object => object.name === 'lobby-chandelier' || object.name === 'potted-palm'), 'interior-decor-merged');

// --- 8. Rà soát vật liệu: không gian màu, phản chiếu, vai trò bóng đổ ---
const shadowProbeBox = new THREE.Box3();
const shadowProbeCenter = new THREE.Vector3();
const shadowFreeRoots = new Set([playerAvatar, guide, skyDome, scene.getObjectByName('exterior-hills-merged')]);
function isUnder(object, roots) {
    let current = object;
    while (current) {
        if (roots.has(current)) return true;
        current = current.parent;
    }
    return false;
}

function refineSceneMaterials() {
    const nightFactor = isNightMode ? 0.45 : 1;
    scene.traverse(object => {
        if (!object.isMesh) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(material => {
            if (!material || material.userData.refined) return;
            material.userData.refined = true;
            ['map', 'emissiveMap'].forEach(slot => {
                const texture = material[slot];
                if (texture && texture.colorSpace === THREE.NoColorSpace && !texture.isRenderTargetTexture) {
                    texture.colorSpace = THREE.SRGBColorSpace;
                    const image = texture.image;
                    if (image && (image.width || image.videoWidth)) texture.needsUpdate = true;
                }
            });
            if (material.isMeshBasicMaterial && material.map) material.toneMapped = false;
            if ((material.isMeshStandardMaterial || material.isMeshPhysicalMaterial) && !material.userData.fixedEnv) {
                const base = material.metalness > 0.3 ? 0.8 : 0.24;
                material.userData.baseEnvIntensity = base;
                material.envMapIntensity = base * nightFactor;
            }
        });

        // Bóng nắng chỉ dành cho khuôn viên; bên trong bảo tàng giữ ánh sáng đèn.
        if (object.userData.shadowRole) return;
        object.userData.shadowRole = true;
        if (isUnder(object, shadowFreeRoots)) {
            object.castShadow = false;
            object.receiveShadow = false;
            return;
        }
        let outside;
        if (object.isInstancedMesh) {
            outside = isUnder(object, new Set([courtyard]));
        } else {
            shadowProbeBox.setFromObject(object);
            shadowProbeBox.getCenter(shadowProbeCenter);
            outside = object.userData.forceExterior || shadowProbeCenter.z > entranceZ + 0.05;
        }
        const isGround = object === lawn || object === plaza || object === mainPath || object.name === 'pond-water' ||
            (object.geometry && object.geometry.type === 'PlaneGeometry' && Math.abs(object.rotation.x + Math.PI / 2) < 0.01);
        object.castShadow = outside && !isGround && !(object.material && object.material.transparent && object.material.depthWrite === false);
        object.receiveShadow = true;
    });
    renderer.shadowMap.needsUpdate = true;
}
refineSceneMaterials();
// Mô hình GLB và ảnh tải xong sau: rà lại vài lần rồi dừng.
[600, 1800, 4000, 8000, 15000].forEach(delay => setTimeout(refineSceneMaterials, delay));

// Start
applyLightingMode();
applyMusicVolume();
document.body.classList.add('outside-mode');
updateViewCamera(0.016, true);
animate();
