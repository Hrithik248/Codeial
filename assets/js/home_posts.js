{
    //method to submit form data for new post using ajax
    let createPost=function(){
        let newPostForm=$('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type:'post',
                url:'/posts/create',
                data:newPostForm.serialize(),
                success:function(data){
                    console.log(data);
                    let newPost=newPostDom(data.data.post,data.data.userName);
                    $('#created-posts>ul').prepend(newPost);
                    //deletePost($(`#post-${data.data.post._id} .delete-post-button`)); or
                    deletePost($(' .delete-post-button',newPost));
                    createComment($(' .new-comment-form',newPost));
                    $('.post-like',newPost).on('click',likePost);
                    new Noty({
                        theme:'relax',
                        text: 'Post created',
                        type:'success',
                        layout:'topCenter',
                        timeout:1500
                    }).show();
                },
                error:function(error){
                    console.log(error.responseText);
                    new Noty({
                        theme:'relax',
                        text: 'Error in adding post',
                        type:'error',
                        layout:'topCenter',
                        timeout:1500
                    }).show();
                }
            });
        });
    };
    //method to create or display a new post in DOM
    let newPostDom=function(post,userName){
        return $(`<li id="post-${post._id}">
            <a class="delete-post-button" href="posts/destroy/${post._id}">X</a> 
        <h4>${post.content}</h4>
        <p>${userName}</p>
        <p class="post-likes-display" id="pld-${post._id}">
        </p>
        <button class="post-like" id="pl-${post._id}">Like</button>  
        <div id="post-comments">
            <form action="/comment/create" method="post"  class="new-comment-form">
                <input type="text" name="content" placeholder="write your comment here...">
                <input type="hidden" name="post_id" value="${post._id}" >
                <input type="submit" value="post commment">
            </form>
            <div id="post-comments-list">
                <ul id="post-comments-${post._id}">
                </ul>
            </div>
        </div>
    </li>`);
    };
    //method to delete a post from DOM
    let deletePost=function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success:function(data){
                    console.log(data);
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme:'relax',
                        text: 'Post deleted',
                        type:'success',
                        layout:'topCenter',
                        timeout:1500
                    }).show();
                },
                error:function(error){
                    console.log(error.responseText);
                    new Noty({
                        theme:'relax',
                        text: 'Error in deleting post',
                        type:'error',
                        layout:'topCenter',
                        timeout:1500
                    }).show();
                }
            });
        });
    }
    createPost();
    let delPostArr=$('.delete-post-button');
    //console.log(typeof delPostArr);
    for(dl of delPostArr){
        deletePost(dl);
    }
    /*for comments
    let createComment=function(){

    }*/
}