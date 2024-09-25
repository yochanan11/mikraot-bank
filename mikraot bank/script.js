const apiKey = 'AIzaSyDtDryKKBIuxvSeBwYHuK05vz5fJlYb6Ts';
const spreadsheetId = '19kz7GjHAjwMAAxnwBlUpAUnGYiYKjSQmXdbxeedvrEY';
const range = 'רשימה!A1:E'; 
let studentsData = [];
let originalContent = ''; // משתנה לשמירת התוכן המקורי

// שליפת נתונים מהגיליון
fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        studentsData = data.values.slice(2); // דילוג על הכותרת
        showStudentList(); // הצגת כל התלמידים כברירת מחדל
        const branchFilter = document.getElementById('branchFilter');
        const branches = new Set();

        studentsData.forEach(row => {
            branches.add(row[3]);
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
    });

// פונקציה להצגת רשימת התלמידים
function showStudentList() {
    const contentDiv = document.getElementById('content');
    if (!originalContent) {
        originalContent = `
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
    }
    contentDiv.innerHTML = originalContent; // שחזור התוכן המקורי
    showAllStudents(); // הצגת כל התלמידים כברירת מחדל
}

// פונקציה להצגת טופס Google Forms
function showForm() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <iframe src="https://docs.google.com/forms/d/e/1FAIpQLScMKhtDRu225DCiu49D_jYajD-AIDNZFHTz3rRIgLyaZo5ELQ/viewform?embedded=true" width="100%" height="800" frameborder="0" marginheight="0" marginwidth="0">בטעינה…</iframe>
    `;
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

    const found = studentsData.find(row => row[0] === searchValue);
    if (found) {
        studentCard.appendChild(createStudentCard(found));
        studentCard.style.display = 'flex';
    } else {
        studentCard.innerHTML = '<div class="text-center">לא נמצא תלמיד</div>';
    }
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

// יצירת כרטיסיה עבור תוצאות החיפוש
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

// הצגת תלמידים מסוננים לפי סניף
function showFilteredStudents(branch) {
    const tableBody = document.querySelector('#studentsTable tbody');
    tableBody.innerHTML = ''; 
    document.getElementById('studentCard').style.display = 'none'; 

    studentsData.forEach(row => {
        if (branch === '' || row[3] === branch) {
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

// פונקציה לסגירת התפריט במובייל לאחר לחיצה על קישור
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

