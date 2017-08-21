"use strict";
$(document).ready(function(){
    $('div#topContainer [data-toggle="collapse"]').click(function(){
      // e.preventDefault();
      let target_element= $(this).attr("data-target");
      $(`div${target_element}`).toggle();
      return false;
    });
})

let wrapper = document.createElement('div');
wrapper.setAttribute('class', "row");
wrapper.setAttribute('id', "container");

const allBookMarks = {};
const createdBookMarks = [ ];
const bookMarkFolder = [ ];

const start= ()=> {
  chrome.bookmarks.getTree((data)=> {fetchBookmarks(data) });
}

const fetchBookmarks = ( bookmarks ) => {
    bookmarks.forEach(function(bookmark) {
            if (!bookmark.children && bookmark.url) {
              ((allBookMarks[bookmark.parentId]) || (allBookMarks[bookmark.parentId] = [])).push(bookmark)
            }else if(bookmark.children){
                bookmark.parentId ? ((allBookMarks[bookmark.parentId]) || (allBookMarks[bookmark.parentId] = [])) : null;
                bookMarkFolder.push({title:bookmark.title,id:bookmark.id,parentId:bookmark.parentId || null});
                bookmark.title ? createFolderButton(bookmark) : null
                fetchBookmarks(bookmark.children)
            }
        });
    document.getElementById('topContainer').appendChild(wrapper);
    createList(allBookMarks)
}

const createFolderButton= (bookmark)=>{
    let folderButton = document.createElement("button");
    wrapper.appendChild(folderButton);
        folderButton.setAttribute('class', 'btn btn-lg btn-outline-primary');
        folderButton.setAttribute('data-toggle', 'collapse');
        folderButton.setAttribute('data-target', `#${bookmark.id}`);
        folderButton.insertAdjacentHTML('afterbegin','<span class="glyphicon glyphicon-folder-open"></span>')
        folderButton.innerText = bookmark.title;
        // folderButton.setAttribute('id', 'collapse');
        // folderButton.setAttribute('aria-controls', `#${bookmark.id}`);
        // folderButton.setAttribute('aria-expanded', 'false');
    let collapseUl = document.createElement("div");
    wrapper.appendChild(collapseUl);
        collapseUl.setAttribute('id', `${bookmark.id}`);
        collapseUl.setAttribute('class', 'list-group collapse');
}

const createList = ( allBookMarks )=> {
    Object.values(allBookMarks).forEach(
        (value)=>{ value.forEach(
            (singleBookMark)=>{
                !createdBookMarks.includes(singleBookMark.id) ? createBookMarkLink(singleBookMark) : null ;
            })
        }
    )
}

const createBookMarkLink = (singleBookMark)=> {
        let list = document.createElement("li");
            list.setAttribute('class', 'list-group-item align-items-start');
            list.setAttribute('id', singleBookMark.id);
        let url = document.createElement("a");
            url.setAttribute('href', singleBookMark.url);
            url.innerHTML = `${singleBookMark.title}`;
            list.appendChild(url);
            document.getElementById(singleBookMark.parentId).appendChild(list);
            createdBookMarks.push(singleBookMark.id)
}

start()
