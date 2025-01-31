let pages = [
    {url: '/portfolio/', title: 'Home'},
    {url: '/portfolio/projects/', title: 'Projects'},
    {url: '/portfolio/contact/', title: 'Contact'},
    {url: '/portfolio/resume/', title: 'Resume'},
    {url: 'https://github.com/TakafumiM', title: 'GitHub', target: '_blank'}
  ];
  
  let nav = document.createElement('nav');
  document.body.prepend(nav);
  
  for (let p of pages) {
    let {url, title, target} = p;
    const ARE_WE_HOME = document.documentElement.classList.contains('home');
    
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
    localStorage.colorScheme = theme;
    
  })

  if ("colorScheme" in localStorage) {
    const savedTheme = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', savedTheme);
    themeSwitch.value = savedTheme; 
  };
  
export async function fetchJSON(url) {
  try {
      const response = await fetch(url);
      console.log(response);
      if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      return data;

  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }
}


export function renderProjects(projects, containerElement, headingLevel = 'h2') {

  if (!containerElement || !(containerElement instanceof HTMLElement)) {
      console.error('Invalid container element');
      return;
  }

  containerElement.innerHTML = '';

  if (!projects || projects.length === 0) {
      containerElement.innerHTML = '<p>No projects to display.</p>';
      return;
  }

  const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  if (!validHeadings.includes(headingLevel)) {
      console.error('Invalid heading level');
      headingLevel = 'h2';
  }

  projects.forEach(project => {
      const article = document.createElement('article');
      article.innerHTML = `
          <${headingLevel}>${project.title || 'No Title'}</${headingLevel}>
          ${project.image ? `<img src="${project.image}" alt="${project.title}">` : ''}
          <p>${project.description || 'No description available.'}</p>
      `;
      containerElement.appendChild(article);
  });
}

export async function fetchGitHubData(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  console.log(response);
  if (!response.ok) {
      throw new Error(`Failed to fetch GitHub data: ${response.statusText}`);
  }
  return response.json();
}