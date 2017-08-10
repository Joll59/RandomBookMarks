"use strict";

let wrapper = document.createElement('div');
wrapper.setAttribute('class', "container");
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
                createFolderButton(bookmark)
                fetchBookmarks(bookmark.children)
            }
        });

    // console.log("check");
    (document.getElementById('container') || document.body.appendChild(wrapper));
    createList(allBookMarks)
}

const createFolderButton= (bookmark)=>{
    let folderButton = document.createElement("button");
        folderButton.setAttribute('class', 'btn btn-outline-primary');
        folderButton.setAttribute('data-toggle', 'collapse');
        folderButton.setAttribute('id', 'collapse');
    let collapseUl = document.createElement("ul");
        collapseUl.setAttribute('class', 'list-group');
        wrapper.appendChild(folderButton);
        wrapper.appendChild(collapseUl);
        collapseUl.setAttribute('id', bookmark.id);
        folderButton.setAttribute('data-target', "#" + bookmark.id);
        folderButton.innerHTML = bookmark.title;
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
            list.setAttribute('class', 'list-group-item');
            list.setAttribute('id', singleBookMark.id);
        let url = document.createElement("a");
            url.setAttribute('href', singleBookMark.url);
            url.innerHTML = `${singleBookMark.title}`;
            list.appendChild(url);
            document.getElementById(singleBookMark.parentId).appendChild(list);
            createdBookMarks.push(singleBookMark.id)
}
start();
