"use strict";

function retweetHtml(postData){
	const retweetBtnActiveClass = postData.retweetUsers.includes(USER_LOGGED_IN._id) ? "active": "";

	const isRetweet = postData.retweetData !== undefined;
	const retweetedBy = isRetweet ? postData.postedBy.username : null;
	postData = isRetweet ? postData.retweetData : postData;

	let retweetText = "";
	if (isRetweet){
		retweetText = `<span>Retweeted by: <a href="/profile/${retweetedBy}">@${retweetedBy}</a></span>`;
	}

	return {retweetBtnActiveClass, retweetText};
}

function replyHtml(postData){
	let replyFlag = "";

	if (postData.replyTo){
		const replyToUsername = postData.replyTo.postedBy.username;
		replyFlag = `<div class="reply-flag">Replying to
						<a href="/profile/${replyToUsername}"> @${replyToUsername}</a>
					</div>`;	
	}

	return replyFlag;
}

function deleteButtonHtml(postData){
	let deleteButton = "";
	if (postData.postedBy._id === USER_LOGGED_IN._id){
		deleteButton = `
			<button data-id="${postData._id}" data-bs-toggle="modal" data-bs-target="#delete-post-modal">
				<i class="fa-regular fa-trash-can"></i>
			</button>`;
	}
	return deleteButton;
}


function createPostHtml(postData, largeFont=false){
	if (!postData) return;

	const displayName = `${postData.postedBy.firstname} ${postData.postedBy.lastname}`;
	const timestamp = timeSince(postData.createdAt);
	const likedBtnActiveClass = postData.likes.includes(USER_LOGGED_IN._id) ? "active" : "";
	const largeFontClass = largeFont ? "largeFont" : "";

	return renderHtml(postData, displayName, timestamp, likedBtnActiveClass, largeFontClass);
}

function renderHtml(postData, displayName, timestamp, likedBtnActiveClass, largeFontClass){
	const retweetObject = retweetHtml(postData);
	const replyFlag = replyHtml(postData);
	const deleteButton = deleteButtonHtml(postData);

	return `
	<div class="post ${largeFontClass}" data-id='${postData._id}'>
		<div class="post-action-container">${retweetObject.retweetText}</div>
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
					${deleteButton}
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
						<button class="retweet-button ${retweetObject.retweetBtnActiveClass}">
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
