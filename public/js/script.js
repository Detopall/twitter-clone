"use strict";

const DURATION_IN_SECONDS = {
	epochs: ['year', 'month', 'day', 'hour', 'minute'],
	year: 31536000,
	month: 2592000,
	day: 86400,
	hour: 3600,
	minute: 60
};

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
			const response = await fetch("/api/posts", getOptionsPost(data, "POST"));
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

document.addEventListener("click", async (e) => {
	if (!e.target.closest(".like-button")) return;
	const likeButton = e.target.closest(".like-button");
	const postId = getRootIdElement(likeButton);
	if (!postId) return;
	const postData = await sendLike(postId);
	likeButton.querySelector("span").innerHTML = `${postData.likes.length}` || "";
});

async function sendLike(postId){
	try {
		const response = await fetch(`/api/posts/${postId}/like`, getOptionsPost({}, "PUT"));
		const jsonData = await response.json();
		return jsonData;
	} catch (err) {
		console.error("Something went wrong: ", err);
	}
}

function getRootIdElement(element){
	const isRoot = element.classList.contains("post");
	const root = isRoot ? element : element.closest(".post");
	return root.getAttribute("data-id");
}

function getOptionsPost(data, method){
	return {
		method: method,
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
	const displayName = `${postData.postedBy.firstname}_${postData.postedBy.lastname}`;
	const timestamp = timeSince(postData.createdAt);

	return `
			<div class="post" data-id='${postData._id}'>
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
								<button class="like-button">
									<i class="far fa-heart"></i>
									<span>${postData.likes.length || ""}</span>
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
			`;
}


function timeSince(date) {
	let seconds = Math.floor((new Date() - new Date(date)) / 1000);
	let duration = getDuration(seconds);
	if (duration === undefined){
		return "just now";
	}
	let suffix = (duration.interval > 1 || duration.interval === 0) ? 's' : '';
	return duration.interval + ' ' + duration.epoch + suffix + " ago";
}


function getDuration(seconds) {
	let epoch, interval;
	for (let i = 0; i < DURATION_IN_SECONDS.epochs.length; i++) {
	  epoch = DURATION_IN_SECONDS.epochs[i];
	  interval = Math.floor(seconds / DURATION_IN_SECONDS[epoch]);
	  if (interval >= 1) {
		return {
		  interval: interval,
		  epoch: epoch
		};
	  }
	}
}
