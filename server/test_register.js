const axios = require('axios');
axios.post('http://localhost:8000/api/auth/register', {
  name: "Vilasita Y R",
  usn: "1GA23IS183",
  mobile: "9380604532",
  username: "vyr",
  password: "123456"
}).then(res => console.log(res.data)).catch(err => {
  console.log("Status:", err.response?.status);
  console.log("Data:", err.response?.data);
  console.log("Message:", err.message);
});
