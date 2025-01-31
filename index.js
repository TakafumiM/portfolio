import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

(async function () {
    try {
        // Fetch all projects
        const projects = await fetchJSON('./lib/projects.json');

        // Filter the first three projects
        const latestProjects = projects.slice(0, 3);

        // Select the projects container
        const projectsContainer = document.querySelector('.projects');

        // Render the latest projects or display a message if no projects are found
        if (latestProjects && latestProjects.length > 0) {
            renderProjects(latestProjects, projectsContainer, 'h2');
        } else {
            projectsContainer.innerHTML = '<p>No latest projects found.</p>';
        }
    } catch (error) {
        console.error('Error loading latest projects:', error);
        const projectsContainer = document.querySelector('.projects');
        projectsContainer.innerHTML = '<p>Failed to load latest projects. Please try again later.</p>';
    }
})();

const githubData = await fetchGitHubData('TakafumiM');
const profileStats = document.querySelector('#profile-stats');
if (profileStats) {
    profileStats.innerHTML = `
        <dl class = github-stats>
            <h2>My GitHub Status<\h2>
            <dt>My GitHub ID:</dt><dd>${githubData.login}</dd>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
        </dl>
    `;
    console.log('Profile Stats Content:', profileStats.innerHTML); // Debugging
} else {
    console.error('#profile-stats element not found');
}