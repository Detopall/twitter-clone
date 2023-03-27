"use strict";

const IMG_NAMES = ["car", "crow", "fish", "skater", "profilePic"];

const mainProfilePic = document.querySelector(".profile-header-container img");
const imgPickerContainer = document.querySelector("#img-picker-container");

const h5Modal = document.querySelector("#img-picker-modal-label");

mainProfilePic.addEventListener("click", (e) => {
	if (PROFILE_USER._id !== USER._id) {changeModalUnauthorized("add"); return;};

	changeModalUnauthorized("remove");

	imgPickerContainer.innerHTML = "";
	let html = "";
	IMG_NAMES.forEach(img => {
		html += `<img src="../images/${img}.png" alt="${img}-profile">`;
	});
	imgPickerContainer.insertAdjacentHTML("beforeend", html);
});


imgPickerContainer.addEventListener("click", (e) => {
	const img = e.target;
	if (!img.matches("img")) return;
	
	const changeImgButton = document.querySelector("#submit-img-picker-button");
	if (!changeImgButton) return;

	changeImgButton.disabled = false;
	changeImgButton.setAttribute("img-uri", img.getAttribute("src").slice(3)); //remove '../'
});

function changeModalUnauthorized(action){
	if (action === "add"){
		imgPickerContainer.classList.add("unauthorized");
		h5Modal.innerHTML = "Unauthorized to change profile image!";
	} else {
		imgPickerContainer.classList.remove("unauthorized");
		h5Modal.innerHTML = "Choose an image";
	}
	
}

document.addEventListener("click", async (e) => {
	const changeImgButton = document.querySelector("#submit-img-picker-button");

	if (!changeImgButton) return;
	if (!e.target.matches("#submit-img-picker-button")) return;

	await sendImgRequest(changeImgButton.getAttribute("img-uri"));
	location.reload();
});

async function sendImgRequest(imgUri){
	try {
		const response = await fetch(`/api/profile/image`, getOptionsPost({image: imgUri}, "PUT"));
		return response;
	} catch (err) {
		console.error("Something went wrong: ", err);
	}
}

