let menu = document.getElementById('menu');
let content = document.getElementById('content');

function createMenu() {
  let items = content.children;
  let menuItemData = [];

  itr(items, (item) => {
    menuItemData.push({
      id: item.id,
      name: item.getAttribute('data-name')
    });
  });

  menuItemData.forEach((label) => {
    let li = document.createElement('li');
    li.textContent = label.name;
    li.classList.add('menu-item');
    li.addEventListener('click', () => {
      closeAll(items);
      let liItems = document.getElementsByClassName('menu-item');
      itr(liItems, (liItem) => {
        liItem.classList.remove('active');
      });
      document.getElementById(label.id).style.display = 'block';
      li.classList.add('active');
    });
    menu.appendChild(li);
  });
}

function closeAll(items) {
  itr(items, (item) => {
    document.getElementById(item.id).style.display = 'none';
  });

}

function itr(items, callback) {
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    callback(item);
  }
}

createMenu();
closeAll(content.children);
