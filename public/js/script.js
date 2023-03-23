"use strict";

document.addEventListener("keyup", (e) => {
	if (e.target.matches("#post-textarea")){
		const textarea = document.querySelector("#post-textarea");
		if (!textarea) return;
		const value = textarea.value.trim();

		const submitButton = document.querySelector("#submit-post-button");
		if (!submitButton) return;

		if (value === ""){
			submitButton.disabled = true;
			submitButton.style.cursor = null;
		} else {
			submitButton.disabled = false;
			submitButton.style.cursor = "pointer";
		}
	}
});

document.addEventListener("click", async (e) => {
	if (e.target.matches("#submit-post-button")){
		const submitButton = document.querySelector("#submit-post-button");
		const textarea = document.querySelector("#post-textarea");
		if (!textarea || !submitButton) return;
		
		const value = textarea.value.trim();

		const data = {
			content: value
		}

		try {
			const response = await fetch("/api/posts", getOptionsPost(data));
			const jsonData = await response.json();
			console.log(jsonData);
		} catch (err) {
			console.error("Something went wrong: ", err);
		}
	}
});


function getOptionsPost(data){
	return {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	}
}
