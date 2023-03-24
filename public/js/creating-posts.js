"use strict";

const DURATION_IN_SECONDS = {
	epochs: ['year', 'month', 'day', 'hour', 'minute'],
	year: 31536000,
	month: 2592000,
	day: 86400,
	hour: 3600,
	minute: 60
};

document.addEventListener("click", async (e) => {
	if (e.target.matches("#submit-post-button")){
		const submitButton = document.querySelector("#submit-post-button");
		const textarea = document.querySelector("#post-textarea");
		const data = { content: textarea.value.trim() };

		const jsonData = await createPost(textarea, submitButton, data);
		displayPost(jsonData);
	}
});

function displayPost(postData){
	console.log(postData);
	const html = createPostHtml(postData);
	const postContainer = document.querySelector(".post-container");
	if (!postContainer) return;

	postContainer.insertAdjacentHTML("afterbegin", html);
}

function createPostHtml(postData, largeFont=false){
	if (!postData) return;

	const displayName = `${postData.postedBy.firstname} ${postData.postedBy.lastname}`;
	const timestamp = timeSince(postData.createdAt);

	const likedBtnActiveClass = postData.likes.includes(USER_LOGGED_IN._id) ? "active" : "";
	const retweetBtnActiveClass = postData.retweetUsers.includes(USER_LOGGED_IN._id) ? "active": "";

	const isRetweet = postData.retweetData !== undefined;
	const retweetedBy = isRetweet ? postData.postedBy.username : null;
	postData = isRetweet ? postData.retweetData : postData;

	let retweetText = "";
	if (isRetweet){
		retweetText = `<span>Retweeted by: <a href="/profile/${retweetedBy}">@${retweetedBy}</a></span>`;
	}

	let replyFlag = "";

	if (postData.replyTo){
		const replyToUsername = postData.replyTo.postedBy.username;
		replyFlag = `<div class="reply-flag">Replying to
						<a href="/profile/${replyToUsername}"> @${replyToUsername}</a>
					</div>`;	
	}

	const largeFontClass = largeFont ? "largeFont" : "";

	return renderHtml(postData, displayName, timestamp, likedBtnActiveClass, retweetBtnActiveClass, retweetText, replyFlag, largeFontClass);
}

function renderHtml(postData, displayName, timestamp, likedBtnActiveClass, retweetBtnActiveClass, retweetText, replyFlag, largeFontClass){
	return `
	<div class="post ${largeFontClass}" data-id='${postData._id}'>
		<div class="post-action-container">${retweetText}</div>
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
				${replyFlag}
				<div class="post-body">
					<span>${postData.content}</span>
				</div>
				<div class="post-footer">
					<div class="post-button-container like">
						<button class="like-button ${likedBtnActiveClass}">
							<i class="far fa-heart"></i>
							<span>${postData.likes.length || ""}</span>
						</button>
					</div>

					<div class="post-button-container retweet">
						<button class="retweet-button ${retweetBtnActiveClass}">
							<i class='fas fa-retweet'></i>
							<span>${postData.retweetUsers.length || ""}</span>
						</button>
					</div>

					<div class="post-button-container">
						<button class="reply-button" data-bs-toggle="modal" data-bs-target="#reply-modal">
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

function getOptionsPost(data, method){
	return {
		method: method,
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	}
}
