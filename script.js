const jsonUrl = 'foxbooks.json';

function loadCourses() {
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (document.getElementById('course-list')) {
                displayCourses(data.courses);
            } else if (document.getElementById('course-detail')) {
                displayCourseDetail(data.courses);
            }
        })
        .catch(error => {
            console.error('Error fetching the data:', error);
            const courseList = document.getElementById('course-list');
            const courseDetail = document.getElementById('course-detail');
            if (courseList) {
                courseList.innerHTML = '<p>Error loading courses.</p>';
            } else if (courseDetail) {
                courseDetail.innerHTML = '<p>Error loading course details.</p>';
            }
        });
}

function displayCourses(courses) {
    const courseList = document.getElementById('course-list');
    courses.forEach(course => {
        const courseLink = document.createElement('a');
        courseLink.href = `course-detail.html?courseId=${course.CourseID}`;
        courseLink.textContent = course.Title;

        const courseElement = document.createElement('div');
        courseElement.classList.add('course');
        courseElement.appendChild(courseLink);
        courseElement.innerHTML += `
            <p>Professor: ${course.Professor}</p>
            <p>Semester: ${course.Semester}</p>
        `;
        courseList.appendChild(courseElement);
    });
}

function displayCourseDetail(courses) {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('courseId');
    const course = courses.find(c => c.CourseID === courseId);

    const courseDetail = document.getElementById('course-detail');
    if (course) {
        courseDetail.innerHTML = `<h2>${course.Title}</h2>`;
        course.Books.forEach(book => {
            courseDetail.innerHTML += `
                <div>
                    <h3>${book.Title}</h3>
                    <p><strong>Author:</strong> ${book.Author}</p>
                    <p><strong>ISBN:</strong> ${book.ISBN}</p>
                    <p><strong>Publisher:</strong> ${book.Publisher}</p>
                    <p><strong>Year:</strong> ${book.Year}</p>
                    <p><strong>Course ID:</strong> ${book.CourseID}</p>
                </div>
            `;
        });
    } else {
        courseDetail.innerHTML = '<p>Course not found.</p>';
    }
}


document.addEventListener("DOMContentLoaded", () => {
    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            if (document.getElementById('course-list')) {
                loadCourses();
            } else if (document.getElementById('course-detail')) {
                displayCourseDetail(data.courses);
            }
        });
});
