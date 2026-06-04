function showSection(sectionId) {

    const selectedSection =
    document.getElementById(sectionId);

    if (!selectedSection) {
        return;
    }

    document.querySelectorAll(".section").forEach(section => {
        section.style.display = "none";
    });

    selectedSection.style.display = "block";
}

window.onload = function () {

    if (document.getElementById("homeSection")) {
        showSection("homeSection");
    }

    if (document.getElementById("studentHome")) {
        showSection("studentHome");
    }

};
// DEFAULT PAGE
window.onload = function () {
    showSection("homeSection");
};

// LOGOUT
function logout() {
    window.location.href = "index.html";
}

// VIEW STUDENTS
async function loadStudents() {
    const response = await fetch("https://smart-fee-management-system.onrender.com/students");
    const students = await response.json();

    let output = `
        <table border="1" cellpadding="10">
            <tr>
                <th>Name</th>
                <th>Hallticket</th>
                <th>Mobile</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Tuition Fee</th>
                <th>Library Fee</th>
                <th>Bus Fee</th>
                <th>Total Fee</th>
                <th>Paid Fee</th>
                <th>Due Fee</th>
            </tr>
    `;

    students.forEach(student => {
        output += `
            <tr>
                <td>${student.student_name}</td>
                <td>${student.hallticket_no}</td>
                <td>${student.mobile_number}</td>
                <td>${student.branch}</td>
                <td>${student.year}</td>
                <td>${student.tuition_fee}</td>
                <td>${student.library_fee}</td>
                <td>${student.bus_fee}</td>
                <td>${student.total_fee}</td>
                <td>${student.paid_fee}</td>
                <td>${student.due_fee}</td>
            </tr>
        `;
    });

    output += `</table>`;
    document.getElementById("studentsList").innerHTML = output;
}

// SEARCH STUDENT
async function searchStudent() {
    const hallticket = document.getElementById("searchHallticket").value;

    const response = await fetch(`https://smart-fee-management-system.onrender.com/student/${hallticket}`);
    const data = await response.json();

    if (data.length === 0) {
        document.getElementById("searchResult").innerHTML =
            "<h3>Student Not Found</h3>";
        return;
    }

    const student = data[0];

    document.getElementById("searchResult").innerHTML = `
        <h3>Student Details</h3>
        <p><b>Name:</b> ${student.student_name}</p>
        <p><b>Hallticket:</b> ${student.hallticket_no}</p>
        <p><b>Mobile:</b> ${student.mobile_number}</p>
        <p><b>Branch:</b> ${student.branch}</p>
        <p><b>Year:</b> ${student.year}</p>
        <p><b>Tuition Fee:</b> ${student.tuition_fee}</p>
        <p><b>Library Fee:</b> ${student.library_fee}</p>
        <p><b>Bus Fee:</b> ${student.bus_fee}</p>
        <p><b>Total Fee:</b> ${student.total_fee}</p>
        <p><b>Paid Fee:</b> ${student.paid_fee}</p>
        <p><b>Due Fee:</b> ${student.due_fee}</p>
    `;
}

// ADD STUDENT
async function addStudent() {
    const student_name = document.getElementById("studentName").value;
    const hallticket_no = document.getElementById("hallticketNo").value;
    const mobile_number = document.getElementById("mobileNumber").value;
    const branch = document.getElementById("branch").value;
    const year = document.getElementById("year").value;
    const tuition_fee = document.getElementById("tuitionFee").value || 0;
    const library_fee = document.getElementById("libraryFee").value || 0;
    const bus_fee = document.getElementById("busFee").value || 0;

    const response = await fetch("https://smart-fee-management-system.onrender.com/add-student", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            student_name,
            hallticket_no,
            mobile_number,
            branch,
            year,
            tuition_fee,
            library_fee,
            bus_fee
        })
    });

    const data = await response.json();
    alert(data.message);
}

// CREATE STUDENT ACCOUNT
async function createStudentAccount() {

    const hallticket_no =
        document.getElementById("accountHallticket").value;

    const username =
        document.getElementById("accountUsername").value;

    const password =
        document.getElementById("accountPassword").value;

    const response = await fetch(
        "https://smart-fee-management-system.onrender.com/create-student-account",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                hallticket_no,
                username,
                password
            })
        }
    );

    const data = await response.json();

    alert(data.message);
}

// ADD FEE
async function addFee() {
    const hallticket_no = document.getElementById("feeHallticket").value;
    const tuition_fee = document.getElementById("addTuitionFee").value || 0;
    const library_fee = document.getElementById("addLibraryFee").value || 0;
    const bus_fee = document.getElementById("addBusFee").value || 0;

    const response = await fetch("https://smart-fee-management-system.onrender.com/add-fee", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            hallticket_no,
            tuition_fee,
            library_fee,
            bus_fee
        })
    });

    const data = await response.json();
    alert(data.message);
}

// SEARCH HISTORY
async function searchHistory() {
    const hallticket = document.getElementById("historyHallticket").value;

    const response = await fetch(`https://smart-fee-management-system.onrender.com/history/${hallticket}`);
    const history = await response.json();

    if (history.length === 0) {
        document.getElementById("historyResult").innerHTML =
            "<h3>No History Found</h3>";
        return;
    }

    let output = `
        <table border="1" cellpadding="10">
            <tr>
                <th>Hallticket</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Paid Fee</th>
            </tr>
    `;

    history.forEach(item => {
        output += `
            <tr>
                <td>${item.hallticket_no}</td>
                <td>${item.student_name}</td>
                <td>${item.branch}</td>
                <td>${item.year}</td>
                <td>${item.amount}</td>
            </tr>
        `;
    });

    output += `</table>`;
    document.getElementById("historyResult").innerHTML = output;
}

// SEARCH STUDENT FOR DELETE FEE
async function searchDeleteFeeStudent() {
    const hallticket = document.getElementById("deleteFeeHallticket").value;

    const response = await fetch(`https://smart-fee-management-system.onrender.com/student/${hallticket}`);
    const data = await response.json();

    if (data.length === 0) {
        document.getElementById("deleteFeeStudentDetails").innerHTML =
            "<h3>Student Not Found</h3>";
        return;
    }

    const student = data[0];

    document.getElementById("deleteFeeStudentDetails").innerHTML = `
        <h3>Student Details</h3>
        <p><b>Name:</b> ${student.student_name}</p>
        <p><b>Hallticket:</b> ${student.hallticket_no}</p>
        <p><b>Branch:</b> ${student.branch}</p>
        <p><b>Year:</b> ${student.year}</p>
        <p><b>Tuition Fee:</b> ${student.tuition_fee}</p>
        <p><b>Library Fee:</b> ${student.library_fee}</p>
        <p><b>Bus Fee:</b> ${student.bus_fee}</p>
        <p><b>Total Fee:</b> ${student.total_fee}</p>
    `;
}

// DELETE FEE
async function deleteFee() {
    const hallticket_no = document.getElementById("deleteFeeHallticket").value;
    const feeType = document.getElementById("feeType").value;
    const amount = document.getElementById("deleteFeeAmount").value;

    const response = await fetch("https://smart-fee-management-system.onrender.com/delete-fee", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            hallticket_no,
            feeType,
            amount
        })
    });

    const data = await response.json();
    alert(data.message);
}

// DELETE STUDENT
async function deleteStudent() {
    const hallticket_no = document.getElementById("deleteStudentHallticket").value;

    const response = await fetch(
        `https://smart-fee-management-system.onrender.com/delete-student/${hallticket_no}`,
        {
            method: "DELETE"
        }
    );

    const data = await response.json();
    alert(data.message);
}

// LOAD TOTALS
async function loadTotals() {
    const response = await fetch("https://smart-fee-management-system.onrender.com/totals");
    const data = await response.json();

    document.getElementById("totalStudents").innerText = data.totalStudents;
    document.getElementById("paidFee").innerText = data.paidFee;
    document.getElementById("dueFee").innerText = data.dueFee;
}

function studentPayFee(){

    const amount =
    document.getElementById("payAmount").value;

    alert("Payment Successful ₹" + amount);

}

function downloadReceipt(){

    alert("Receipt Downloaded Successfully");

}

function adminLogin(){

    const username =
    document.getElementById("adminUsername").value;

    const password =
    document.getElementById("adminPassword").value;

    if(username === "admin" && password === "admin123"){

        window.location.href = "admin.html";

    } else {

        alert("Invalid Admin Login");

    }
}

async function studentLogin() {

    const username =
    document.getElementById("studentUsername").value.trim();

    const password =
    document.getElementById("studentPassword").value.trim();

    const response = await fetch(
        "https://smart-fee-management-system.onrender.com/student-login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }
    );

    const data = await response.json();

    console.log(data);

    if (data.success) {

        localStorage.setItem(
            "hallticket_no",
            data.hallticket_no
        );

        window.location.href = "student.html";

    } else {

        alert(data.message);

    }
}
async function loadStudentDetails() {
    const hallticket_no = localStorage.getItem("hallticket_no");

    const response = await fetch(
        `https://smart-fee-management-system.onrender.com/student/${hallticket_no}`
    );

    const data = await response.json();

    if (data.length === 0) {
        return;
    }

    const student = data[0];

    document.getElementById("studentDetails").innerHTML = `
        <p><b>Name:</b> ${student.student_name}</p>
        <p><b>Hallticket:</b> ${student.hallticket_no}</p>
        <p><b>Branch:</b> ${student.branch}</p>
        <p><b>Year:</b> ${student.year}</p>
        <p><b>Mobile:</b> ${student.mobile_number}</p>
    `;

    document.getElementById("studentFeeDetails").innerHTML = `
        <p><b>Tuition Fee:</b> ${student.tuition_fee}</p>
        <p><b>Library Fee:</b> ${student.library_fee}</p>
        <p><b>Bus Fee:</b> ${student.bus_fee}</p>
        <p><b>Total Fee:</b> ${student.total_fee}</p>
        <p><b>Paid Fee:</b> ${student.paid_fee}</p>
        <p><b>Due Fee:</b> ${student.due_fee}</p>
    `;

    document.getElementById("studentHistory").innerHTML = `
        <table border="1" cellpadding="10">
            <tr>
                <th>Hallticket</th>
                <th>Name</th>
                <th>Paid Fee</th>
                <th>Due Fee</th>
            </tr>
            <tr>
                <td>${student.hallticket_no}</td>
                <td>${student.student_name}</td>
                <td>${student.paid_fee}</td>
                <td>${student.due_fee}</td>
            </tr>
        </table>
    `;
}

window.addEventListener("load", function () {
    if (document.getElementById("studentDetails")) {
        loadStudentDetails();
    }
});