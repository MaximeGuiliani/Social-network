// code :
fetch('http://localhost:3000/users/signup', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
        "username":"maxime", 
        "email":"maxime.guiliani@gmail.com", 
        "bio":"ceci est une bio",
        "password":"maxime"
        }
    )
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.log(err))

          