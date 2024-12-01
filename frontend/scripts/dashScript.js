const addSemesterButton = document.getElementById('addSemesterButton');
const semesterPopup = document.getElementById('semesterPopup');
const searchPopup = document.getElementById('searchPopup');
const semestersContainer = document.getElementById('semestersContainer');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const creditCounter = document.querySelector('.counter');
let currentSemesterTable = null;
const categoryFilter = document.getElementById('categoryFilter');

addSemesterButton.addEventListener('click', function() {
    addSemesterButton.style.display = 'none';
    semesterPopup.style.display = 'block';
});

function createSemester() {
    const semesterName = document.getElementById('semesterName').value;
    if (!semesterName) return;

    const tableContainer = createSemesterTable(semesterName);
    semestersContainer.appendChild(tableContainer);
    
    // Set the current semester table to the new container
    currentSemesterTable = tableContainer;
    
    // Hide/show popups
    semesterPopup.style.display = 'none';
    searchPopup.style.display = 'block';
    document.getElementById('semesterName').value = '';
    
    // Immediately fetch and display all courses
    fetchAndDisplayCourses();
}

function closeSearchPopup() {
    searchPopup.style.display = 'none';
    addSemesterButton.style.display = 'flex';
    searchInput.value = '';
    searchResults.innerHTML = '';
}

function updateTotalCredits() {
    let totalCredits = 0;
    let inProgressCredits = 0;
    let plannedCredits = 0;
    const tables = document.getElementsByClassName('semester-table');
    
    Array.from(tables).forEach(table => {
        let semesterCredits = 0;
        // Skip the header row, start from index 1
        for (let i = 1; i < table.rows.length; i++) {
            const row = table.rows[i];
            const creditsText = row.cells[1].textContent;
            const credits = parseInt(creditsText);
            
            // Get status
            const completedTag = row.querySelector('.status-tag.completed.active');
            const inProgressTag = row.querySelector('.status-tag.in-progress.active');
            const plannedTag = row.querySelector('.status-tag.planned.active');
            
            // Only add to total credits if completed or in progress
            if (completedTag || inProgressTag) {
                totalCredits += credits;
            }
            
            // Track in-progress credits separately
            if (inProgressTag) {
                inProgressCredits += credits;
            }
            
            // Track planned credits separately
            if (plannedTag) {
                plannedCredits += credits;
            }
            
            // Always add to semester credits (including planned)
            semesterCredits += credits;
        }
        
        // Update semester credits counter
        const creditsCounter = table.parentElement.querySelector('.semester-credits span');
        creditsCounter.textContent = `Total Semester Credits: ${semesterCredits}`;
    });
    
    // Update the main credit counter
    creditCounter.textContent = `Total Credits: ${totalCredits} / 128`;
    
    // Update the in-progress counter
    document.querySelector('.in-progress-counter').textContent = `In Progress Credits: ${inProgressCredits} / 128`;
    
    // Update the planned counter
    document.querySelector('.planned-counter').textContent = `Planned Credits: ${plannedCredits} / 128`;
}

function addCourseToSemester(code, name, credits) {
    if (!currentSemesterTable) return;
    
    // Check credit limit
    const table = currentSemesterTable.querySelector('.semester-table');
    const currentCredits = Array.from(table.rows)
        .slice(1)
        .reduce((sum, row) => sum + parseInt(row.cells[1].textContent), 0);
    
    if (currentCredits + credits > 23) {
        closeSearchPopup();
        showWarningPopup();
        return;
    }
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="course-cell">
                <span class="course-code">${code}</span>
                <span class="course-name">${name}</span>
            </div>
        </td>
        <td class="course-credits">${credits}</td>
        <td>
            <div class="status-tags">
                <span class="status-tag completed" data-status="completed">Completed</span>
                <span class="status-tag in-progress" data-status="in-progress">In Progress</span>
                <span class="status-tag planned" data-status="planned">Planned</span>
            </div>
        </td>
        <td><button class="delete-course-btn" onclick="removeCourse(this)">×</button></td>
    `;
    
    // click handlers for status tags
    const statusTags = row.querySelectorAll('.status-tag');
    statusTags.forEach(tag => {
        tag.addEventListener('click', function() {
            statusTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            updateProgressBar();
            updateTotalCredits();
        });
    });
    
    table.appendChild(row);
    updateTotalCredits();
}

function removeCourse(button) {
    button.closest('tr').remove();
    updateTotalCredits();
    updateProgressBar();
    
    // Refresh search results if search popup is open
    if (searchPopup.style.display === 'block') {
        const searchTerm = searchInput.value.trim();
        const selectedCategory = categoryFilter.value;
        if (searchTerm.length >= 2 || selectedCategory !== 'all') {
            searchCourses(searchTerm, selectedCategory);
        }
    }
}

// search funtionality
searchInput.addEventListener('input', function() {
    performSearch();
});

categoryFilter.addEventListener('change', function() {
    performSearch();
});

function performSearch() {
    const searchTerm = searchInput.value.trim();
    const selectedCategory = categoryFilter.value;
    
    if (searchTerm.length >= 2 || selectedCategory !== 'all') {
        searchCourses(searchTerm, selectedCategory);
    } else {
        // If no search term and category is 'all', show all courses
        fetchAndDisplayCourses();
    }
}

async function searchCourses(searchTerm, category) {
    try {
        const response = await fetch(`http://localhost:3000/api/courses/search-courses?term=${searchTerm}`);
        const courses = await response.json();
        
        let filteredCourses = courses;
        
        // Only apply filters if search term is 2 or more characters
        if (searchTerm.length >= 2) {
            filteredCourses = courses.filter(course => 
                course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply category filter if selected
        if (category !== 'all') {
            filteredCourses = filteredCourses.filter(course => course.category === category);
        }
        
        // Filter out existing courses
        filteredCourses = filterOutExistingCourses(filteredCourses);
        
        displaySearchResults(filteredCourses);
    } catch (error) {
        console.error('Error searching courses:', error);
        searchResults.innerHTML = '<div class="search-item">Error searching courses</div>';
    }
}

function filterOutExistingCourses(courses) {
    // Get all course codes from all semesters
    const existingCodes = new Set();
    const allTables = document.querySelectorAll('.semester-table');
    
    allTables.forEach(table => {
        const tableCells = table.querySelectorAll('.course-code');
        tableCells.forEach(cell => {
            existingCodes.add(cell.textContent.trim());
        });
    });
    
    // Filter out courses that are already in any semester
    return courses.filter(course => !existingCodes.has(course.course_code));
}

function displaySearchResults(courses) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    
    // If no courses found, display message
    if (courses.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results-message';
        noResults.innerHTML = `
            <p>No courses found...</p>
        `;
        searchResults.appendChild(noResults);
        return;
    }
    
    const table = document.createElement('table');
    table.className = 'search-table';
    
    // Create header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <td>
            <div class="course-header">
                <span class="header-code">Course</span>
                <span class="header-name">Course Name</span>
            </div>
        </td>
        <td class="credits-header">Credits</td>
        <td></td>
    `;
    table.appendChild(headerRow);

    // Create course rows
    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="course-cell">
                    <span class="course-code">${course.course_code}</span>
                    <span class="course-name">${course.course_name}</span>
                </div>
            </td>
            <td class="course-credits">${course.credits}</td>
            <td class="button-cell">
                <button class="circle-button" onclick="handleSearchResult('${course.course_code}', '${course.course_name}', ${course.credits})">+</button>
            </td>
        `;
        table.appendChild(row);
    });
    
    searchResults.appendChild(table);
}

function createSemesterTable(semesterName) {
    const container = document.createElement('div');
    container.className = 'semester-container';

    // Create semester header with name and buttons
    const header = document.createElement('div');
    header.className = 'semester-header';
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = semesterName;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'semester-buttons';
    
    const searchButton = document.createElement('button');
    searchButton.className = 'search-classes-btn';
    searchButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" 
                fill="currentColor"/>
        </svg>
    `;
    searchButton.onclick = () => showSearchPopup(container);
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '×';
    deleteButton.className = 'delete-semester-btn';
    deleteButton.onclick = () => {
        container.remove();
        updateTotalCredits();
        
        // Reset progress bar completely
        const progressBar = document.querySelector('.progress-bar');
        progressBar.innerHTML = `
            <div class="progress-fill completed" style="width: 0%"></div>
            <div class="progress-fill in-progress" style="width: 0%"></div>
            <div class="progress-fill planned" style="width: 0%"></div>
        `;
        
        // Only update progress bar if there are remaining semesters
        if (document.querySelectorAll('.semester-table').length > 0) {
            updateProgressBar();
        }
    };
    
    buttonContainer.appendChild(searchButton);
    buttonContainer.appendChild(deleteButton);
    header.appendChild(nameSpan);
    header.appendChild(buttonContainer);
    
    // Create the table
    const table = document.createElement('table');
    table.className = 'semester-table';
    
    // Create header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <td class="header-cell">
            <div class="course-header">
                <span class="header-code">Course</span>
                <span class="header-name">Course Name</span>
            </div>
        </td>
        <td class="credits-header">Credits</td>
        <td class="status-header">Status</td>
        <td></td>
    `;
    
    table.appendChild(headerRow);
    
    container.appendChild(header);
    container.appendChild(table);
    
    // Add semester credits counter
    const creditsCounter = document.createElement('div');
    creditsCounter.className = 'semester-credits';
    creditsCounter.innerHTML = '<span>Total Semester Credits: 0</span>';
    container.appendChild(creditsCounter);
    
    return container;
}

async function showSearchPopup(semesterContainer) {
    currentSemesterTable = semesterContainer;
    
    // Reset filters and search
    const searchInput = document.getElementById('searchInput');
    const searchPopup = document.getElementById('searchPopup');
    categoryFilter.value = 'all';
    searchInput.value = '';
    
    // Hide both elements initially
    searchPopup.style.display = 'none';
    searchResults.style.visibility = 'hidden';
    
    try {
        // Fetch courses
        const response = await fetch('http://localhost:3000/api/courses/search-courses?term=');
        const courses = await response.json();
        const availableCourses = filterOutExistingCourses(courses);
        
        // Prepare the results HTML but don't show it yet
        displaySearchResults(availableCourses);
        
        // Show both elements simultaneously
        searchPopup.style.display = 'block';
        searchResults.style.visibility = 'visible';
        searchInput.focus();
    } catch (error) {
        console.error('Error loading courses:', error);
        searchResults.innerHTML = '<div class="search-item">Error loading courses</div>';
    }
}

async function fetchAndDisplayCourses() {
    try {
        const response = await fetch('http://localhost:3000/api/courses/search-courses?term=');
        const courses = await response.json();
        
        // Filter out existing courses and display results
        const availableCourses = filterOutExistingCourses(courses);
        displaySearchResults(availableCourses);
    } catch (error) {
        console.error('Error loading courses:', error);
        searchResults.innerHTML = '<div class="search-item">Error searching courses</div>';
    }
}

function handleSearchResult(code, name, credits) {
    // Add the course to the semester
    addCourseToSemester(code, name, credits);
    
    // Get the current search term and category
    const searchTerm = searchInput.value.trim();
    const selectedCategory = categoryFilter.value;
    
    // Refresh search results maintaining both search term and category
    if (searchTerm.length >= 2 || selectedCategory !== 'all') {
        searchCourses(searchTerm, selectedCategory);
    }
}

// Make sure the Done button calls closeSearchPopup
document.querySelector('.done-button').addEventListener('click', closeSearchPopup);

function showWarningPopup() {
    document.getElementById('warningPopup').style.display = 'block';
}

function closeWarningPopup() {
    document.getElementById('warningPopup').style.display = 'none';
}

function updateProgressBar() {
    const totalCredits = 128; // Total credits needed
    const courses = document.querySelectorAll('.semester-table tr:not(:first-child)');
    let completedCredits = 0;
    let inProgressCredits = 0;
    let plannedCredits = 0;

    courses.forEach(course => {
        const credits = parseInt(course.querySelector('.course-credits').textContent);
        const statusTags = course.querySelectorAll('.status-tag');
        
        // Check which status is active
        statusTags.forEach(tag => {
            if (tag.classList.contains('active')) {
                if (tag.classList.contains('completed')) {
                    completedCredits += credits;
                } else if (tag.classList.contains('in-progress')) {
                    inProgressCredits += credits;
                } else if (tag.classList.contains('planned')) {
                    plannedCredits += credits;
                }
            }
        });
    });

    // Calculate percentages
    const completedPercentage = (completedCredits / totalCredits) * 100;
    const inProgressPercentage = (inProgressCredits / totalCredits) * 100;
    const plannedPercentage = (plannedCredits / totalCredits) * 100;

    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    progressBar.innerHTML = `
        <div class="progress-fill completed" style="width: ${completedPercentage}%"></div>
        <div class="progress-fill in-progress" style="width: ${inProgressPercentage}%"></div>
        <div class="progress-fill planned" style="width: ${plannedPercentage}%"></div>
    `;

    // Update counter
    const totalCurrentCredits = completedCredits + inProgressCredits + plannedCredits;
    document.querySelector('.counter').textContent = `${totalCurrentCredits} / ${totalCredits}`;
}
