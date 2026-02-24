const axios = require('axios');

async function testEnroll() {
    try {
        const res = await axios.post('http://localhost:5000/api/volunteer/enroll', {
            fullName: "Test User",
            email: "aravindkumar23567@gmail.com",
            contactNumber: "1234567890",
            age: "25",
            gender: "Male",
            bloodGroup: "O+",
            state: "Tamil Nadu",
            district: "Chennai",
            collegeName: "Test College",
            education: "B.Tech",
            preferredWings: "Social Wing",
            willingToContribute: 'no'
        });
        console.log("Enrollment Success:", res.data);
    } catch (err) {
        console.error("Enrollment Failed:", err.response ? err.response.data : err.message);
    }
}

testEnroll();
