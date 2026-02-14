const gradeValues = {
    "A+": 4.0, "A": 4.0, "A-": 3.75, "B+": 3.5, "B": 3.0, 
    "B-": 2.75, "C+": 2.5, "C": 2.0, "C-": 1.5, "D": 1.0, "F": 0.0
};

function generateCurrentSemesterRows(input) {
    const numCourses = parseInt(input.value);
    let rowsHtml = '';
    if (numCourses > 0) {
        for (let j = 1; j <= numCourses; j++) {
            rowsHtml += `
                <div class="course-row" style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <input type="text" class="course-name" placeholder="Course Name" style="flex: 2; padding: 8px;">
                    <select class="grade-input" style="flex: 1; padding: 8px;">
                        <option value="">Grade</option>
                        ${Object.keys(gradeValues).map(g => `<option value="${g}">${g}</option>`).join('')}
                    </select>
                    <input type="number" class="credit-input" placeholder="Cr" style="flex: 1; padding: 8px;">
                </div>`;
        }
    }
    document.getElementById('current-semester-rows').innerHTML = rowsHtml;
}
function calculateOverallCGPA() {
    // 1. የድሮውን መረጃ መቀበል
    const prevCGPA = parseFloat(document.getElementById('prevCGPA').value) || 0;
    const prevCredits = parseFloat(document.getElementById('prevCredits').value) || 0;
    let prevTotalPoints = prevCGPA * prevCredits;

    // 2. የአሁኑን ሴሚስተር ውጤት ለብቻ ማስላት
    let currentPoints = 0;
    let currentCredits = 0;

    const grades = document.querySelectorAll('.grade-input');
    const credits = document.querySelectorAll('.credit-input');

    grades.forEach((gradeSelect, index) => {
        const grade = gradeSelect.value;
        const credit = parseFloat(credits[index].value);

        if (grade !== "" && !isNaN(credit)) {
            currentPoints += (gradeValues[grade] * credit);
            currentCredits += credit;
        }
    });

    // 3. አጠቃላይ ውጤቱን ማውጣት
    const totalPoints = prevTotalPoints + currentPoints;
    const totalCredits = prevCredits + currentCredits;

    const resultsDiv = document.getElementById('results');
    
    if (totalCredits > 0) {
        // የሴሚስተር GPA ስሌት
        const semGPA = currentCredits > 0 ? (currentPoints / currentCredits).toFixed(2) : "0.00";
        // ጠቅላላ CGPA ስሌት
        const finalCGPA = (totalPoints / totalCredits).toFixed(2);

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <div style="background: #e8f0fe; padding: 15px; border-radius: 10px; border-left: 5px solid #1a73e8;">
                <p style="margin: 5px 0; font-size: 16px;">Current Semester GPA: <strong>${semGPA}</strong></p>
                <h3 style="margin: 10px 0; color: #1a73e8;">Overall Cumulative CGPA: ${finalCGPA}</h3>
            </div>`;
        
        // Download በተኑን ማሳየት
        document.getElementById('downloadBtn').style.display = 'block';
    } else {
        alert("Please enter valid data to calculate!");
    }
}
function clearAll() {
    if (confirm("Are you sure you want to clear all?")) {
        location.reload(); // ገጹን እንደ አዲስ በመክፈት ሁሉንም ያጠፋል
    }
}

function downloadReport() {
    const cgpaResult = document.getElementById('results').innerText;
    let content = "ACADEMIC REPORT\n" + "===============\n" + cgpaResult;
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "CGPA_Report.txt";
    a.click();
}