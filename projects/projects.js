import { fetchJSON, renderProjects } from '../global.js';

(async function () {
    try {
        const projects = await fetchJSON('../lib/projects.json');
        const projectsContainer = document.querySelector('.projects');
        const projectsTitle = document.querySelector('.projects-title');

        if (projects && projects.length > 0) {
            projectsTitle.textContent = `Projects: ${projects.length} in Total`;

            renderProjects(projects, projectsContainer, 'h2');
        } else {
            projectsTitle.textContent = 'Projects: 0 in Total';
            projectsContainer.innerHTML = '<p>No projects found.</p>';
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        const projectsContainer = document.querySelector('.projects');
        const projectsTitle = document.querySelector('.projects-title');

        projectsTitle.textContent = 'Projects (Error)';
        projectsContainer.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
    }
})();