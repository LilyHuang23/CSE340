const pswdBtn = document.querySelector("#pswdBtn");
pswdBtn.addEventListener("click", function () {
    const pswdInput = document.getElementById("accountPassword");
    const type = document.getAttribute("type");
    if (type == "password") {
        pswdInput.setAttribute("type", "text");
        pswdBtn.innerHTML = "Hide Password";
    } else {
        pswdInput.setAttribute("type", "password");
        pswdBtn.innerHTML = "Show Password";
    }
});

const changeText = document.querySelector("#changeText");
changeText.addEventListener("click", function() {
    changeText.textContent = "Logout";
  });