let pages = [
    {url: 'portfolio/', title: 'Home'},
    {url: 'portfolio/projects/', title: 'Projects'},
    {url: 'portfolio/contact/', title: 'Contact'},
    {url: 'portfolio/resume/', title: 'Resume'},
    {url: 'https://github.com/TakafumiM', title: 'GitHub', target: '_blank'}
  ];
  
  let nav = document.createElement('nav');
  document.body.prepend(nav);
  
  for (let p of pages) {
    let {url, title, target} = p;
    const ARE_WE_HOME = document.documentElement.classList.contains('home');
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
  
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    if (target) 
        a.target = target;
  
    if (a.host === location.host && a.pathname === location.pathname) {
      a.classList.add('current');
    }
  
    nav.append(a);
  }
  
  document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
      Theme:
      <select id="theme-switch">
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
  );
  
  const themeSwitch = document.getElementById('theme-switch');
  themeSwitch.addEventListener('change', (event) => {
    const theme = event.target.value;
    document.documentElement.style.setProperty('color-scheme', theme);
  });

  
  
  