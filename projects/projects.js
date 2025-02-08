import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// Move chart creation into a reusable function
function createPieChart(projects) {
    const arcGenerator = d3.arc().innerRadius(25).outerRadius(50);
    const rolledData = d3.rollups(
        projects,
        (v) => v.length,
        (d) => d.year,
    );
    const data = rolledData.map(([year, count]) => ({ value: count, label: year }));
    const sliceGenerator = d3.pie().value((d) => d.value);
    const arcData = sliceGenerator(data);
    const colors = d3.scaleOrdinal(d3.schemeTableau10);

    // Clear existing chart
    let selectedIndex = -1;
    let svg = d3.select('svg');
    svg.selectAll('path').remove();

    // Helper function to update the displayed projects based on the selection.
    function updateDisplayedProjects() {
        // Get container elements from the DOM
        const projectsContainer = document.querySelector('.projects');
        const projectsTitle = document.querySelector('.projects-title');

        // If nothing is selected, show all projects; otherwise, filter by selected year.
        const filteredProjects = (selectedIndex === -1)
            ? projects
            : projects.filter(project => project.year === data[selectedIndex].label);

        renderProjects(filteredProjects, projectsContainer, 'h2');
        projectsTitle.textContent = `Projects: ${filteredProjects.length} in Total`;
    }

    // Draw new arcs with updated click events
    arcData.forEach((arc, i) => {
        svg.append('path')
            .attr('d', arcGenerator(arc))
            .attr('fill', colors(i))
            .attr('class', `pie-slice slice-${i}`)
            .on('click', () => {
                // Toggle selection: if the same slice is clicked, deselect it.
                selectedIndex = (selectedIndex === i) ? -1 : i;

                // Update wedge highlighting
                svg.selectAll('path')
                    .attr('class', (_, idx) => idx === selectedIndex
                        ? `pie-slice slice-${idx} selected`
                        : `pie-slice slice-${idx}`);

                // Update legend highlighting
                d3.select('.legend')
                    .selectAll('li')
                    .attr('class', (_, idx) => idx === selectedIndex
                        ? `legend-item legend-${idx} selected`
                        : `legend-item legend-${idx}`);

                // Update the displayed projects
                updateDisplayedProjects();
            })
            .on('mouseover', () => {
                svg.selectAll('.pie-slice').classed('dimmed', true);
                d3.selectAll('.legend-item').classed('dimmed', true);
                d3.select(`.slice-${i}`).classed('dimmed', false);
                d3.select(`.legend-${i}`).classed('dimmed', false);
            })
            .on('mouseout', () => {
                svg.selectAll('.pie-slice').classed('dimmed', false);
                d3.selectAll('.legend-item').classed('dimmed', false);
            });
    });

    // Update legend
    const legend = d3.select('.legend');
    legend.selectAll('*').remove(); // Clear existing legend

    data.forEach((d, idx) => {
        legend.append('li')
            .attr('class', `legend-item legend-${idx}`)
            .html(`<span class="swatch" style="background-color: ${colors(idx)}"></span> ${d.label} <em>(${d.value})</em>`)
            .on('click', () => {
                // Toggle selection for legend item
                selectedIndex = (selectedIndex === idx) ? -1 : idx;

                // Update wedge highlighting
                svg.selectAll('path')
                    .attr('class', (_, i) => i === selectedIndex
                        ? `pie-slice slice-${i} selected`
                        : `pie-slice slice-${i}`);

                // Update legend highlighting
                legend.selectAll('li')
                    .attr('class', (_, i) => i === selectedIndex
                        ? `legend-item legend-${i} selected`
                        : `legend-item legend-${i}`);

                // Update the displayed projects
                updateDisplayedProjects();
            })
            .on('mouseover', () => {
                svg.selectAll('.pie-slice').classed('dimmed', true);
                d3.selectAll('.legend-item').classed('dimmed', true);
                d3.select(`.slice-${idx}`).classed('dimmed', false);
                d3.select(`.legend-${idx}`).classed('dimmed', false);
            })
            .on('mouseout', () => {
                svg.selectAll('.pie-slice').classed('dimmed', false);
                d3.selectAll('.legend-item').classed('dimmed', false);
            });
    });
}

// Main code
(async function () {
    try {
        const projects = await fetchJSON('../lib/projects.json');
        const projectsContainer = document.querySelector('.projects');
        const projectsTitle = document.querySelector('.projects-title');

        if (projects && projects.length > 0) {
            projectsTitle.textContent = `Projects: ${projects.length} in Total`;
            renderProjects(projects, projectsContainer, 'h2');
            createPieChart(projects); // Initial chart creation
        } else {
            projectsTitle.textContent = 'Projects: 0 in Total';
            projectsContainer.innerHTML = '<p>No projects found.</p>';
        }

        // Search functionality (if needed, you might want to combine search and pie filtering)
        let query = '';
        const searchInput = document.querySelector('.searchBar');
        
        searchInput.addEventListener('change', (event) => {
            query = event.target.value;
            const filteredProjects = projects.filter((project) => {
                const values = Object.values(project).join('\n').toLowerCase();
                return values.includes(query.toLowerCase());
            });
            
            // Update projects display and title
            renderProjects(filteredProjects, projectsContainer, 'h2');
            projectsTitle.textContent = `Projects: ${filteredProjects.length} in Total`;
            
            // Update chart with filtered data
            createPieChart(filteredProjects);
        });

    } catch (error) {
        console.error('Error loading projects:', error);
        const projectsContainer = document.querySelector('.projects');
        const projectsTitle = document.querySelector('.projects-title');

        projectsTitle.textContent = 'Projects (Error)';
        projectsContainer.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
    }
})();
