const hamburger = document.querySelector('.hamburger')
const navLinks = document.querySelector('.nav-links')

if (hamburger && navLinks) {
  hamburger.addEventListener('click', (event) => {
    event.stopPropagation()
    navLinks.classList.toggle('expanded')
  })

  navLinks.addEventListener('click', (event) => {
    const target = event.target
    if (target instanceof HTMLElement && target.tagName.toLowerCase() === 'a') {
      navLinks.classList.remove('expanded')
    }
  })

  document.addEventListener('click', (event) => {
    if (!navLinks.classList.contains('expanded')) return

    const target = event.target
    if (
      target instanceof Node &&
      !navLinks.contains(target) &&
      !hamburger.contains(target)
    ) {
      navLinks.classList.remove('expanded')
    }
  })
}
