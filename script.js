const apiKey = 'AIzaSyDtDryKKBIuxvSeBwYHuK05vz5fJlYb6Ts';
const spreadsheetId = '19kz7GjHAjwMAAxnwBlUpAUnGYiYKjSQmXdbxeedvrEY';
const range = 'רשימה!A1:E'; 
let studentsData = [];
let originalContent = ''; // משתנה לשמירת התוכן המקורי

// פונקציה לטעינת נתונים מהגיליון
function loadStudentData() {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        studentsData = data.values.slice(2); // דילוג על הכותרת
        showStudentList(); // הצגת רשימת התלמידים לאחר טעינת הנתונים
        const branchFilter = document.getElementById('branchFilter');
        const branches = new Set();

        studentsData.forEach(row => {
            branches.add(row[3]); // הנחה שסניף נמצא בעמודה הרביעית
        });

        branches.forEach(branch => {
            const option = document.createElement('option');
            option.value = branch;
            option.textContent = branch;
            branchFilter.appendChild(option);
        });

        branchFilter.addEventListener('change', function() {
            const selectedBranch = this.value;
            showFilteredStudents(selectedBranch);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

// פונקציה להצגת רשימת התלמידים
function showStudentList() {

    const contentDiv = document.getElementById('content');
    
    // הצגת תוכן ברירת מחדל
    contentDiv.innerHTML = `
        <h2 class="text-center mb-4">רשימת תלמידים</h2>

        <div id="filterSection" class="mb-4">
            <label for="branchFilter" class="form-label">סנן לפי סניף:</label>
            <select id="branchFilter" class="form-select" aria-label="Filter by Branch">
                <option value="">בחר סניף</option>
            </select>
        </div>

        <!-- טבלה להצגת כל התלמידים -->
        <div class="table-responsive">
            <table class="table table-striped table-hover" id="studentsTable">
                <thead>
                    <tr>
                        <th>קוד זיהוי</th>
                        <th>שם התלמיד</th>
                        <th>שם משפחה</th>
                        <th>סניף</th>
                        <th>ניקוד</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>

        <!-- הצגת כרטיסיית תוצאות חיפוש -->
        <div id="studentCard" class="row justify-content-center" style="display: none;"></div>
    `;

    // הצגת כל התלמידים
    showAllStudents();
}

// פונקציה להצגת כל התלמידים בטבלה
function showAllStudents() {

    const tableBody = document.querySelector('#studentsTable tbody');
    const filterSection = document.getElementById('filterSection');
    const tableContainer = document.querySelector('.table-responsive');
    
    filterSection.style.display = 'block';
    tableContainer.style.display = 'block';
    
    tableBody.innerHTML = ''; // ריקון הטבלה
    document.getElementById('studentCard').style.display = 'none'; // הסתרת כרטיס חיפוש

    studentsData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row[0]}</td>
            <td>${row[1]}</td>
            <td>${row[2]}</td>
            <td>${row[3]}</td>
            <td>${row[4]}</td>
        `;
        tableBody.appendChild(tr);

    });
}

// פונקציה להצגת תלמידים מסוננים לפי סניף
function showFilteredStudents(branch) {
    const tableBody = document.querySelector('#studentsTable tbody');
    tableBody.innerHTML = ''; 
    document.getElementById('studentCard').style.display = 'none'; 

    studentsData.forEach(row => {
        if (branch === '' || row[3] === branch) { // סינון לפי סניף בעמודה הרביעית
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
                <td>${row[3]}</td>
                <td>${row[4]}</td>
            `;
            tableBody.appendChild(tr);
        }
    });
}

// פונקציה להצגת כרטיסיית תוצאות חיפוש
function createStudentCard(row) {
    const div = document.createElement('div');
    div.className = 'student-card';
    div.innerHTML = `
        <img src="img/e.png" class="card-img-left" alt="תמונה">
        <div>
            <h5 class="card-title">קוד זיהוי: ${row[0]}</h5>
            <p class="card-text">שם: ${row[1]} ${row[2]}</p>
            <p class="card-text">סניף: ${row[3]}</p>
            <p class="card-text">ניקוד: ${row[4]}</p>
        </div>
    `;
    return div;
}

// פונקציה לחיפוש תלמיד לפי קוד זיהוי והצגת הפרטים
function searchStudent() {
    const searchValue = document.getElementById('searchInput').value.trim();
    const studentCard = document.getElementById('studentCard');
    const table = document.querySelector('#studentsTable tbody');
    const filterSection = document.getElementById('filterSection');
    const tableContainer = document.querySelector('.table-responsive');
    
    filterSection.style.display = 'none';
    tableContainer.style.display = 'none';
    
    table.innerHTML = ''; 
    studentCard.innerHTML = ''; 
    studentCard.style.display = 'none';

    const found = studentsData.find(row => row[0] === searchValue); // הנחה שמספר התלמיד בעמודה הראשונה
    if (found) {
        studentCard.appendChild(createStudentCard(found));
        studentCard.style.display = 'flex';
    } else {
        studentCard.innerHTML = '<div class="text-center">לא נמצא תלמיד</div>';
    }
}

// פונקציה לסגירת תפריט במובייל
function closeMobileMenu() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
    }
}

// סגירת התפריט במובייל לאחר לחיצה על קישור
document.querySelectorAll('.navbar-nav>li>a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// סגירת התפריט במובייל לאחר לחיצה על כפתור החיפוש
document.querySelector('#searchForm button[onclick="searchStudent()"]').addEventListener('click', closeMobileMenu);

// סגירת התפריט במובייל לאחר לחיצה על כפתור "הצג הכל"
document.querySelector('#searchForm button[onclick="showAllStudents()"]').addEventListener('click', closeMobileMenu);

// אפשרות: סגירת התפריט במובייל לאחר לחיצה מחוץ לתפריט
document.addEventListener('click', function(event) {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (!navbarCollapse.contains(event.target) && !navbarToggler.contains(event.target) && navbarCollapse.classList.contains('show')) {
        closeMobileMenu();
    }
});

// פונקציה להעלאת ניקוד לתלמיד
function showAddPointsForm() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <h2 class="text-center mb-4">העלאת ניקוד לתלמיד</h2>
        <form id="update-score-form">
            <label for="student-id">מספר תלמיד:</label>
            <input type="text" id="student-id" name="student-id" required><br><br>

            <label for="points">ניקוד להעלאה:</label>
            <input type="number" id="points" name="points" required><br><br>

            <button type="submit">שלח</button>
        </form>
        <br>
        <button onclick="showStudentList()">חזרה לרשימת התלמידים</button> <!-- כפתור חזרה -->
    `;

    // הוספת אירוע שליחה לטופס לאחר שהוא נטען
    const form = document.getElementById('update-score-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form); // איסוף הנתונים מהטופס

        fetch('https://script.google.com/macros/s/AKfycbwX7mpSWW5kHWO4JNnSZlb8Td544k8ZCdTLAmOw5RFMjbKA95dLnAMOq30CkVLekfm4jg/exec', { 
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.text();
        })
        .then(result => {
            alert(result); // הצגת התוצאה מהשרת לאחר השליחה
            form.reset(); // איפוס הטופס לאחר שליחה מוצלחת
        })
        .catch(error => {
            alert('Error: ' + error.message); // הצגת השגיאה למשתמש במקרה של בעיה
        });
    });
}

// קריאה לטעינת הנתונים עם הפעלת האתר
loadStudentData();
