let oldXHROpen = window.XMLHttpRequest.prototype.open;

let twitterBlues = [];

const waitForTimeline = async () => {
  let root = [];
  while (root.length === 0) {
    await new Promise((r) => setTimeout(r, 100));
    root = document.querySelectorAll('[data-testid*="cellInnerDiv"]');
  }
  return root;
};

const replaceBlue = (blueUsers, userElements) => {
  const img = document.createElement("img");
  img.src =
    "https://pbs.twimg.com/media/FhTQn0dWIAAd7lk?format=png&name=240x240";
  img.style.width = "16px";
  img.style.marginLeft = "5px";
  userElements.forEach((user) => {
    const usernameElement =
      user.children[0]?.children[0]?.children[0]?.children[0]?.children[0]
        ?.children[0]?.children[0]?.children[1]?.children[1]?.children[0]
        ?.children[0]?.children[0]?.children[0]?.children[0]?.children[0]
        ?.children[0]?.children[0]?.children[0]?.children[0]?.children[0]
        ?.children[0]?.children[0];
    let badge = usernameElement.parentNode.parentNode.parentNode.children[1];
    if (usernameElement) {
      blueUsers.forEach((blue) => {
        if (blue.includes(usernameElement.textContent)) {
          badge.replaceWith(img);
        }
      });
    }
  });
};

(function () {
  window.XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", () => {
      const timelineData = this.responseText;
      if (timelineData.includes("home_timeline_urt")) {
        const parsedTimelineData = JSON.parse(timelineData);
        const tweets =
          parsedTimelineData.data.home.home_timeline_urt.instructions[0]
            .entries;
        tweets.forEach((tweet) => {
          if (
            tweet.content.itemContent?.tweet_results?.result.core?.user_results
          ) {
            const tweetRes =
              tweet.content.itemContent.tweet_results.result.core.user_results
                .result;
            tweetRes.is_blue_verified && !tweetRes.legacy.verified
              ? twitterBlues.push(tweetRes.legacy.name)
              : null;
          }
        });
        waitForTimeline()
          .then((root) => {
            replaceBlue(twitterBlues, root);
          })
          .catch((err) => console.error(err));
      }
    });
    return oldXHROpen.apply(this, arguments);
  };
})();
