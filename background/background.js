
// function install_notice() {
//     if (localStorage.getItem('install_time'))
//         return;

//     var now = new Date().getTime();
//     localStorage.setItem('install_time', now);
//     chrome.tabs.create({url: "installed.html"});
// }
install_notice();

// chrome.runtime.onInstalled.addListener(details => {
//     if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
//       chrome.runtime.setUninstallURL('https://example.com/extension-survey');
//     }
//   });

