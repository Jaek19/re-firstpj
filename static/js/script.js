let animals = [];

const fetchData = async () => {
  const response = await fetch('/animals');
  animals = await response.json();
  displayAnimals(animals);
  addEventListeners();
};

const displayAnimals = (animals) => {
  const container = document.getElementById('animals');
  const fragment = document.createDocumentFragment();

  animals.forEach((animal, index) => {
    const animalElement = document.createElement('div');
    animalElement.className = 'animal-card';

    const imageSlider = createImageSlider(
      animal.THUMBNAIL_URL,
      animal.IMAGE_URLS,
      index
    );

    const videoSection = animal.VIDEO_URL
      ? `
          <div class="video-link">
              <a href="${animal.VIDEO_URL}" target="_blank" class="youtube-link">
                  <span class="youtube-icon">▶</span> 영상보기
              </a>
          </div>
        `
      : '';

    animalElement.innerHTML = `
      <h4>${animal.NM}</h4>
      ${imageSlider}
      <p><span class="animal-info">번호:</span> ${animal.ANIMAL_NO}</p>
      <p><span class="animal-info">품종:</span> ${animal.BREEDS}</p>
      <p><span class="animal-info">성별:</span> ${animal.SEXDSTN}</p>
      <p><span class="animal-info">나이:</span> ${animal.AGE}</p>
      <p><span class="animal-info">체중:</span> ${animal.BDWGH}kg</p>
      <div class="button-container">
          ${videoSection}
          <button class="toggle-button" data-index="${index}">
              상세정보 보기
          </button>
      </div>
    `;

    fragment.appendChild(animalElement);
  });

  container.innerHTML = '';
  container.appendChild(fragment);

  addEventListeners();
};

const createImageSlider = (thumbnailUrl, imageUrls, animalIndex) => {
  const validUrls = [thumbnailUrl, ...imageUrls].filter(url => url && url.trim() !== '');
  
  if (validUrls.length === 0) {
    validUrls.push('/static/default-animal.jpg');
  }

  const createImageElement = (url, index) => `
    <img 
      src="${url}" 
      alt="동물 이미지 ${index + 1}"
      class="slider-image${index === 0 ? ' active' : ''}"
      onerror="this.src='/static/default-animal.jpg'"
    >
  `;

  const createNavigationButtons = () => `
    <button class="slider-prev" data-index="${animalIndex}">&#10094;</button>
    <button class="slider-next" data-index="${animalIndex}">&#10095;</button>
  `;

  return `
    <div class="image-slider" id="slider-${animalIndex}">
      <div class="slider-images">
        ${validUrls.map(createImageElement).join('')}
      </div>
      ${validUrls.length > 1 ? createNavigationButtons() : ''}
    </div>
  `;
};

const addEventListeners = () => {
  const toggleButtons = document.querySelectorAll('.toggle-button');
  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      toggleDetails(index);
    });
  });

  const sliderButtons = document.querySelectorAll('.slider-prev, .slider-next');
  sliderButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      const direction = e.target.classList.contains('slider-prev') ? -1 : 1;
      changeImage(index, direction);
    });
  });
};

const changeImage = (animalIndex, direction) => {
  const slider = document.getElementById(`slider-${animalIndex}`);
  const images = [...slider.getElementsByClassName('slider-image')];
  let currentIndex = images.findIndex(img => img.classList.contains('active'));

  images[currentIndex].classList.remove('active');

  currentIndex = (currentIndex + direction + images.length) % images.length;

  images[currentIndex].classList.add('active');
};

const toggleDetails = (index) => {
  if (index < 0 || index >= animals.length) {
    console.error('Invalid index:', index);
    return;
  }

  document.querySelector('.popup')?.remove();

  const popup = document.createElement('div');
  popup.className = 'popup';

  popup.innerHTML = `
    <div class="popup-content">
      <button class="close-button">닫기</button>
      <div class="detail-info">
        ${animals[index].INTRCN_CN}
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  popup.querySelector('.close-button').addEventListener('click', () => popup.remove());

  popup.style.display = 'flex';
};

const adjustLayout = () => {
  const animalsContainer = document.getElementById('animals');
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  animalsContainer.style.maxHeight = `calc(var(--vh) * 100)`;
};

window.addEventListener('resize', adjustLayout);
adjustLayout();

fetchData().then(() => {
  adjustLayout();
});