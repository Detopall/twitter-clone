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
			displayPost(jsonData);
		} catch (err) {
			console.error("Something went wrong: ", err);
		}
		
		// manually clearing text will not trigger the keyup event, so manually setting button disabled
		textarea.value = "";
		submitButton.disabled = true;

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


function displayPost(postData){
	console.log(postData);
	const html = createPostHtml(postData);
	const postContainer = document.querySelector(".post-container");
	if (!postContainer) return;

	postContainer.insertAdjacentHTML("afterbegin", html);
}

function createPostHtml(postData){
	const displayName = `${postData.postedBy.firstname} ${postData.postedBy.lastname}`;
	const timestamp = "TO DO LATER";

	return `
			<div class="post">
				<div class="main-content-container">
					<div class="user-img-container">
						<img src="../${postData.postedBy.profilePic}" alt='profile-pic'>
					</div>
					<div class="post-content-container">
						<div class="header">
							<a href="/profile/${postData.postedBy.username}" class="display-name">
								${displayName}
							</a>
							<span class="username">@${postData.postedBy.username}</span>
							<span class="date">${timestamp}</span>
						</div>
						<div class="post-body">
							<span>${postData.content}</span>
						</div>
						<div class="post-footer">
							<div class="post-button-container">
								<button>
									<i class="far fa-heart"></i>
								</button>
							</div>

							<div class="post-button-container">
								<button>
									<i class='fas fa-retweet'></i>
								</button>
							</div>

							<div class="post-button-container">
								<button>
									<i class="far fa-comment"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			`
}
