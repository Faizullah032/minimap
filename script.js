// const container = document.querySelector('.container');
// const items = document.querySelector('.items');
// const indicator = document.querySelector('.indicator');
// const itemElements = document.querySelectorAll('.item');
// const preveiwImage = document.querySelector('.image-preview img');
// const itemImages = document.querySelectorAll('.item img');

// let isHorizontal = window.innerWidth < 900;
// let dimensions = {
//     itemsSize: 0,
//     containerSize: 0,
//     indicatorSize: 0,
// };

// let maxTrnaslate = 0;
// let currentTranslate = 0;
// let targetTranslate = 0;
// let isClickMove = false;
// let currentImageIndex = 0;
// const activeItemOpacity = 0.3;

// function lerp(start, end, factor) {
//     return start + (end - start) * factor;
// }

// function updateDimensions() {
//     isHorizontal = window.innerWidth < 900;
//     if(isHorizontal) {
//         dimensions = {
//             itemsSize: itemElements[0].getBoundingClientRect().width,
//             containerSize: items.scrollWidth,
//             indicatorSize: indicator.getBoundingClientRect().width,
//         }
//     } else {
//         dimensions = {
//             itemsSize: itemElements[0].getBoundingClientRect().height,
//             containerSize: items.getBoundingClientRect().height,
//             indicatorSize: indicator.getBoundingClientRect().height,
//         }
//     }
//     return dimensions;
// }

// dimensions = updateDimensions();
// maxTrnaslate = dimensions.containerSize - dimensions.indicatorSize;

// function getItemInIndicator() {
//     itemImages.forEach((img) => (img.style.opacity = 1));

//     const indicatorStart = -currentTranslate;
//     const indicatorEnd = indicatorStart + dimensions.indicatorSize;

//     let maxOverlap = 0;
//     let selectedIndex = 0;

//     itemElements.forEach((item, index) => {
//         const itemStart = index * dimensions.itemsSize;
//         const itemEnd = itemStart + dimensions.itemsSize;

//         const overlapStart = Math.max(indicatorStart, itemStart);
//         const overlapEnd = Math.min(indicatorEnd, itemEnd);
//         const overlap = Math.max(0, overlapEnd - overlapStart);

//         if(overlap > maxOverlap) {
//             maxOverlap = overlap;
//             selectedIndex = index;
//         }
//     });
//     itemImages[selectedIndex].style.opacity = activeItemOpacity;
//     return selectedIndex;
// }

// function updateImagePreview(index) {
//     if(currentImageIndex !== index) {
//         currentImageIndex = index;
//         const targetItem = itemElements[index].querySelector('img');
//         const targetSrc = targetItem.getAttribute('src');
//         preveiwImage.setAttribute('src', targetSrc);
//     }
// }

// function animate() {
//     const lerpFactor = isClickMove ? 0.05 : 0.075;
//     currentTranslate = lerp(currentTranslate, targetTranslate, lerpFactor);
//     if (Math.abs(currentTranslate - targetTranslate) < 0.01) {
//         const transform = isHorizontal ? `translateX(${currentTranslate}px)` : `translateY(${currentTranslate}px)`;
//         items.style.transform = transform;
//         const activeIndex = getItemInIndicator();
//         updateImagePreview(activeIndex);
//     } else {
//         isClickMove = false;
//     }
//     requestAnimationFrame(animate);
// }


// container.addEventListener('wheel', (e) => {
//     e.preventDefault();
//     isClickMove = false;

//     let delta;
//     delta = e.deltaY;

//     const scrollVelocity = Math.min(Math.max(delta * 0.5, -20), 20);
//     targetTranslate = Math.min(Math.max(targetTranslate - scrollVelocity, -maxTrnaslate), 0);
// },
// {
//     passive: false,
// });

// let touchStartY = 0;
// container.addEventListener('touchstart', (e) => {
//     if(isHorizontal) {
//         touchStartY = e.touches[0].clientY;
//     }
// });

// container.addEventListener('touchmove', (e) => {
//     if(isHorizontal) {
//         const touchY = e.touches[0].clientY;
//         const deltaY = touchStartY - touchY;

//         const delta = deltaY;
//         const scrollVelocity = Math.min(Math.max(delta * 0.5, -20), 20);
//         targetTranslate = Math.min(Math.max(targetTranslate - scrollVelocity, -maxTrnaslate), 0);
//         touchStartY = touchY;
//         e.preventDefault();
//     }
// } , {
//     passive: false,
// });


// itemElements.forEach((item, index) => {
//     item.addEventListener('click', () => {
//         isClickMove = true;
//         targetTranslate = -index * dimensions.itemsSize + (dimensions.indicatorSize - dimensions.itemsSize) / 2;
//         targetTranslate = Math.max(Math.min(targetTranslate, 0), -maxTrnaslate);
//     });
// }
// );

// window.addEventListener('resize', () => {
//     dimensions = updateDimensions();
//     const newMaxTranslate = dimensions.containerSize - dimensions.indicatorSize;
//     targetTranslate = Math.min(Math.max(targetTranslate, -newMaxTranslate), 0);
//     currentTranslate = targetTranslate;

//     const transform = isHorizontal ? `translateX(${currentTranslate}px)` : `translateY(${currentTranslate}px)`;
//     items.style.transform = transform;
// });

// itemImages[0].style.opacity = activeItemOpacity;
// updateImagePreview(0);
// animate();












const container = document.querySelector('.container');
const items = document.querySelector('.items');
const indicator = document.querySelector('.indicator');
const itemElements = document.querySelectorAll('.item');
const previewImage = document.querySelector('.image-preview img');
const itemImages = document.querySelectorAll('.item img');

let isHorizontal = window.innerWidth < 900;
let dimensions = { itemsSize: 0, containerSize: 0, indicatorSize: 0 };
let maxTranslate = 0;
let currentTranslate = 0;
let targetTranslate = 0;
let isClickMove = false;
let currentImageIndex = 0;
let rafId = null;
const activeItemOpacity = 0.3;

const lerp = (start, end, factor) => start + (end - start) * factor;

function updateDimensions() {
    isHorizontal = window.innerWidth < 900;
    dimensions = isHorizontal ? {
        itemsSize: itemElements[0].getBoundingClientRect().width,
        containerSize: items.scrollWidth,
        indicatorSize: indicator.getBoundingClientRect().width,
    } : {
        itemsSize: itemElements[0].getBoundingClientRect().height,
        containerSize: items.scrollHeight,
        indicatorSize: indicator.getBoundingClientRect().height,
    };
    maxTranslate = dimensions.containerSize - dimensions.indicatorSize;
    return dimensions;
}

function getItemInIndicator() {
    itemImages.forEach(img => img.style.opacity = 1);
    const indicatorStart = -currentTranslate;
    const indicatorEnd = indicatorStart + dimensions.indicatorSize;

    let maxOverlap = 0;
    let selectedIndex = 0;

    itemElements.forEach((item, index) => {
        const itemStart = index * dimensions.itemsSize;
        const itemEnd = itemStart + dimensions.itemsSize;
        const overlap = Math.max(0, Math.min(indicatorEnd, itemEnd) - Math.max(indicatorStart, itemStart));
        
        if (overlap > maxOverlap) {
            maxOverlap = overlap;
            selectedIndex = index;
        }
    });
    
    itemImages[selectedIndex].style.opacity = activeItemOpacity;
    return selectedIndex;
}

function updateImagePreview(index) {
    if (currentImageIndex !== index) {
        currentImageIndex = index;
        const targetSrc = itemElements[index].querySelector('img').src;
        previewImage.src = targetSrc;
    }
}

function animate() {
    const lerpFactor = isClickMove ? 0.1 : 0.15;
    currentTranslate = lerp(currentTranslate, targetTranslate, lerpFactor);
    
    const transform = isHorizontal 
        ? `translateX(${currentTranslate}px)` 
        : `translateY(${currentTranslate}px)`;
    items.style.transform = transform;
    
    const activeIndex = getItemInIndicator();
    updateImagePreview(activeIndex);
    
    if (Math.abs(currentTranslate - targetTranslate) > 0.1) {
        rafId = requestAnimationFrame(animate);
    } else {
        isClickMove = false;
    }
}

container.addEventListener('wheel', (e) => {
    e.preventDefault();
    isClickMove = false;
    cancelAnimationFrame(rafId);
    
    const delta = Math.sign(e.deltaY) * 30;
    targetTranslate = Math.min(Math.max(targetTranslate - delta, -maxTranslate), 0);
    rafId = requestAnimationFrame(animate);
}, { passive: false });

let touchStart = 0;
container.addEventListener('touchstart', (e) => {
    touchStart = isHorizontal ? e.touches[0].clientX : e.touches[0].clientY;
    cancelAnimationFrame(rafId);
});

container.addEventListener('touchmove', (e) => {
    const touchCurrent = isHorizontal ? e.touches[0].clientX : e.touches[0].clientY;
    const delta = (touchStart - touchCurrent) * 1.5;
    targetTranslate = Math.min(Math.max(targetTranslate + delta, -maxTranslate), 0);
    touchStart = touchCurrent;
    rafId = requestAnimationFrame(animate);
    e.preventDefault();
}, { passive: false });

itemElements.forEach((item, index) => {
    item.addEventListener('click', () => {
        cancelAnimationFrame(rafId);
        isClickMove = true;
        targetTranslate = -index * dimensions.itemsSize + (dimensions.indicatorSize - dimensions.itemsSize) / 2;
        targetTranslate = Math.max(Math.min(targetTranslate, 0), -maxTranslate);
        rafId = requestAnimationFrame(animate);
    });
});

const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

window.addEventListener('resize', debounce(() => {
    cancelAnimationFrame(rafId);
    updateDimensions();
    targetTranslate = Math.min(Math.max(targetTranslate, -maxTranslate), 0);
    currentTranslate = targetTranslate;
    items.style.transform = isHorizontal 
        ? `translateX(${currentTranslate}px)` 
        : `translateY(${currentTranslate}px)`;
    rafId = requestAnimationFrame(animate);
}, 150));

// Initialize
updateDimensions();
itemImages[0].style.opacity = activeItemOpacity;
updateImagePreview(0);
rafId = requestAnimationFrame(animate);