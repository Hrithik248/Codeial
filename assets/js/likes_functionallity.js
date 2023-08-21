//likes for posts
$('.post-like').on('click',likePost)
function likePost(){
    let postId =$(this).attr('id').slice(3);
    //console.log(postId);
    $.ajax({
        type:'post',
        url:`/likes/toggle/?id=${postId}&type=Post`,
        data:'',
        success:function(data){
            console.log(data);
            addOrRemoveLike(data,postId);
        },
        error:function(error){
            console.log(error.responseText);
            new Noty({
                theme:'relax',
                text: 'Error in liking post',
                type:'error',
                layout:'topCenter',
                timeout:1500
            }).show();
        }
    })
}
//liking or disliking based on data
function addOrRemoveLike(data,postId){
    let likesDisplay=$(`#pld-${postId}`);
    let likesDisplayContent=likesDisplay.text().trim();
    //console.log(data);
    if(data.data.deleted){
        if(likesDisplayContent=='1'){
            likesDisplay.text('');
        }
        else{
            likesDisplay.text(`${Number(likesDisplayContent)-1}`);
        }

    }else{
        if(likesDisplayContent==''){
            likesDisplay.text('1');
        }
        else{
            likesDisplay.text(`${Number(likesDisplayContent)+1}`);
        }
    }
}
//likes for comments
$('.comment-like').on('click',likeComment);
function likeComment(){
    let commentId =$(this).attr('id').slice(3);
    //console.log(postId);
    $.ajax({
        type:'post',
        url:`/likes/toggle/?id=${commentId}&type=Comment`,
        data:'',
        success:function(data){
            console.log(data);
            addOrRemoveCommentLike(data,commentId);
        },
        error:function(error){
            console.log(error.responseText);
            new Noty({
                theme:'relax',
                text: 'Error in liking comment',
                type:'error',
                layout:'topCenter',
                timeout:1500
            }).show();
        }
    })
}
//liking comment or disliking
function addOrRemoveCommentLike(data,commentId){
    let likesDisplay=$(`#cld-${commentId}`);
    let likesDisplayContent=likesDisplay.text().trim();
    console.log(data);
    if(data.data.deleted){
        if(likesDisplayContent=='1'){
            likesDisplay.text('');
        }
        else{
            likesDisplay.text(`${Number(likesDisplayContent)-1}`);
        }

    }else{
        if(likesDisplayContent==''){
            likesDisplay.text('1');
        }
        else{
            likesDisplay.text(`${Number(likesDisplayContent)+1}`);
        }
    }
}