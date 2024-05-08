
// script.js

// GitHub repository details
const owner = "sanjay7178";
const repo = "vRevamp";

async function fetchContributors() {
  try {
    chrome.storage.local.get("contributors", async function (data) {
      let contributors = data.contributors;
      if (!contributors) {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contributors`
        );
        contributors = await response.json();
        chrome.storage.local.set({ contributors: contributors });
      }
      displayContributors(contributors);
    });
  } catch (error) {
    console.error("Error fetching contributors:", error);
  }
}

// Function to display contributors on the webpage
function displayContributors(contributors) {
  const contributorsList = document.getElementById("contributors-list");

  contributors.forEach((contributor) => {
    const listItem = document.createElement("li");

    const profileLink = document.createElement("a");
    profileLink.href = contributor.html_url;
    profileLink.target = "_blank"; // Open link in new tab
    profileLink.textContent = contributor.login;

    const profileImage = document.createElement("img");
    profileImage.src = contributor.avatar_url;
    profileImage.alt = `${contributor.login}'s GitHub Profile Picture`;
    profileImage.width = 20;
    profileImage.height = 20;
    profileImage.style.borderRadius = "50%";
    profileImage.style.marginLeft = "10px";

    profileLink.appendChild(profileImage);
    listItem.appendChild(profileLink);

    contributorsList.appendChild(listItem);
  });
}

// Fetch contributors when the page loads
fetchContributors();
