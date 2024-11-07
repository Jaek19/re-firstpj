let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

const intro = document.getElementById('intro');
const header = document.getElementById('header');
const scrollBtn = document.getElementById('scroll-btn');
const sections = [
  'intro',
  'home',
  'introduce',
  'animals',
  'volunteer',
  'contact',
];

const mMenuIcon = document.querySelector('.material-icons');
const navMenuList = document.querySelector('nav ul');

const headerUpdate = () => {
  const { bottom } = intro.getBoundingClientRect();
  bottom <= 0 ? header.classList.add('visible') : header.classList.remove('visible');
};

const btnUpdate = () => {
  const { innerHeight, scrollY } = window;
  const currentSectionIndex = Math.floor(scrollY / innerHeight);
  const isLastSection = currentSectionIndex >= sections.length - 1;

  const arrowElement = scrollBtn.querySelector('.arrow');
  
  if (isLastSection) {
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    arrowElement.classList.add('up');
  } else {
    scrollBtn.setAttribute('aria-label', 'Scroll to next section');
    arrowElement.classList.remove('up');
  }
};

const btnClick = () => {
  const { innerHeight, scrollY } = window;
  const currentSectionIndex = Math.floor(scrollY / innerHeight);

  if (currentSectionIndex >= sections.length - 1) {
    window.scrollTo({
      top: 0
    });
  } else {
    const nextSection = document.getElementById(
      sections[currentSectionIndex + 1]
    );
    nextSection.scrollIntoView();
  }
};

const toggleMenu = () => {
  navMenuList.classList.toggle('show');
  mMenuIcon.textContent = navMenuList.classList.contains('show') ? 'close' : 'menu';
};

window.addEventListener('scroll', () => {
  headerUpdate();
  btnUpdate();
});

scrollBtn.addEventListener('click', btnClick);

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  if (window.innerWidth > 768) {
    navMenuList.classList.remove('show');
    mMenuIcon.textContent = 'menu';
  }
});

mMenuIcon.addEventListener('click', toggleMenu);

headerUpdate();
btnUpdate();

const text = document.getElementById('quoteText').textContent;
const quoteElement = document.getElementById('quoteText');
quoteElement.textContent = '';
let index = 0;

const typeUpdate = () => {
  if (index < text.length) {
    quoteElement.textContent += text.charAt(index);
    index++;
    setTimeout(typeUpdate, 150);
  }
};

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      typeUpdate();
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

observer.observe(document.getElementById('quoteContainer')); 