//自定义loading


let loadingShow = ({message='loading...'}={})=>{
  let myLoading = document.querySelector('.my-loading');
  let isMenu = false;
  if(window._user_menuList_obj && window._user_menuList_obj[window.location.pathname]){
    isMenu = true;
  }
  if(myLoading){//如果已有loading的dom，直接显示，避免频繁渲染
    myLoading.style.display = 'flex';
    myLoading.className = isMenu ? 'my-loading with-menu' : 'my-loading';
  }else{
    let cover = document.createElement('div');
    let loadingClass = isMenu ? 'my-loading with-menu' : 'my-loading';
    cover.setAttribute('class', loadingClass);
    let spine = `
    <div class="spin">
      <div class="column">
        <span></span>
        <span></span>
      </div>
      <div class="column">
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="message">${message}</div>`;
    cover.innerHTML = spine;
    document.body.appendChild(cover);
  }
}
let loadingHide = ()=>{
  document.querySelector('.my-loading').style.display = 'none';
}
export {
  loadingShow,
  loadingHide
};