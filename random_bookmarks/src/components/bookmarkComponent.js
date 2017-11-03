import React, { Component } from 'react';

export default class Bookmark extends Component {
constructor(){
  super()

  this.state = {
    allBookMarks:{ },
    createdBookMarks:[],
    bookMarkFolder:[ ]
  }
}

start = () => {
  debugger
  chrome.bookmarks.getTree((data)=> {this.fetchBookmarks(data) });
}

fetchBookmarks = ( bookmarks ) => {
      bookmarks.forEach(function(bookmark) {
              if (!bookmark.children && bookmark.url) {
                ((this.state.allBookMarks[bookmark.parentId]) || (this.state.allBookMarks[bookmark.parentId] = [])).push(bookmark)
              }
              else if(bookmark.children){
                  bookmark.parentId ? ((this.state.allBookMarks[bookmark.parentId]) || (this.state.allBookMarks[bookmark.parentId] = [])) : null;
                  this.state.bookMarkFolder.push({title:bookmark.title,id:bookmark.id,parentId:bookmark.parentId || null});
                  bookmark.title ? this.createFolderButton(bookmark) : null
                  this.fetchBookmarks(bookmark.children)
              }
          });
      // document.getElementById('topContainer').appendChild(wrapper);
      this.createList(this.state.allBookMarks)
  }

createList = ( allBookMarks )=> {
      Object.values(this.state.allBookMarks).forEach(
          (value)=>{ value.forEach(
              (singleBookMark)=>{
                  !this.state.createdBookMarks.includes(singleBookMark.id) ? this.createBookMarkLink(singleBookMark) : null ;
              })
          }
      )
  }

createBookMarkLink = (singleBookMark)=> {
          let list = document.createElement("li");
              list.setAttribute('class', 'list-group-item align-items-start');
              list.setAttribute('id', singleBookMark.id);
          let url = document.createElement("a");
              url.setAttribute('href', singleBookMark.url);
              url.innerHTML = `${singleBookMark.title}`;
              list.appendChild(url);
              document.getElementById(singleBookMark.parentId).appendChild(list);
              this.state.createdBookMarks.push(singleBookMark.id)
  }


createFolderButton= (bookmark)=>{
  let folderButton = document.createElement("button");
      // wrapper.appendChild(folderButton);
          folderButton.setAttribute('class', 'btn btn-lg btn-outline-primary');
          folderButton.setAttribute('data-toggle', 'collapse');
          folderButton.setAttribute('data-target', `#${bookmark.id}`);
          folderButton.innerText = bookmark.title;
          // folderButton.setAttribute('id', 'collapse');
          // folderButton.setAttribute('aria-controls', `#${bookmark.id}`);
          // folderButton.setAttribute('aria-expanded', 'false');
      let collapseUl = document.createElement("div");
      // wrapper.appendChild(collapseUl);
          collapseUl.setAttribute('id', `${bookmark.id}`);
          collapseUl.setAttribute('class', 'list-group collapse');
  }

render(){
  return(
    <div className="row" id="container">

    </div>
  )
}

}
