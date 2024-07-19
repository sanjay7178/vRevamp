const policyIframe = document.getElementById("policy-iframe");
const scrollIndicator = document.getElementById("scroll-indicator");
const scrollMessage = document.getElementById("scroll-message");
const checkboxContainer = document.getElementById("checkbox-container");
const agreeCheckbox = document.getElementById("agree");
const submitButton = document.getElementById("submit");

let hasScrolledToBottom = false;

const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting && !hasScrolledToBottom) {
      hasScrolledToBottom = true;
      scrollMessage.style.display = "none";
      checkboxContainer.style.display = "flex";
    }
  },
  {
    root: null,
    threshold: 1.0,
  }
);

observer.observe(scrollIndicator);

agreeCheckbox.addEventListener("change", function () {
  submitButton.disabled = !this.checked;
});

// Helper function to promisify chrome.storage.local.set
function setChromeStorage(obj) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(obj, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError));
      } else {
        resolve();
      }
    });
  });
}

submitButton.addEventListener("click", function () {
  // console.log("click event");

  if (checkboxContainer.style.display) {
    // console.log("agree event");
    let now = new Date().getTime();
    // chrome.storage.local.set({ "install_time_3": now });
    setChromeStorage({ "install_time": now }) 
    alert("Thank you for agreeing to our Privacy Policy!");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.remove(tabs[0].id);
      } );
  }
});
