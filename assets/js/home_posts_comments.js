
    //Assuming jQuery is already loaded
/*$(document).ready(function(){
    //Select all the forms with class .new-comment-form
    var forms = $(".new-comment-form");
    //Add a submit function to each form
    forms.submit(function(event){
      //Prevent the default form submission behavior
      event.preventDefault();
      //Get the form data as an object
      var data = $(this).serialize();
      //Make an ajax post request to the server
      $.ajax({
        type: "POST",
        url: '/comment/create', //Change this to your desired endpoint
        data: data,
        success: function(data){
          //Do something with the response, such as appending the new comment to the page
          let newComment=newCommentDom(data.data.comment,data.data.userName);
          $(`#post-comments-${data.data.comment.post}`).prepend(newComment);
        },
        error: function(error){
          //Handle any errors, such as displaying an alert message
          console.log(error.responseText);
        }
      });
    });
  });
 */ 

    //method to submit form data for new comment using ajax
    let createComment=function(newCommentForm){
        newCommentForm.submit(function(e){
            console.log('im here');
            e.preventDefault();
            $.ajax({
                type:'post',
                url:'/comment/create',
                data:newCommentForm.serialize(),
                success:function(data){
                    console.log(data);
                    let newComment=newCommentDom(data.data.comment,data.data.userName);
                    $(`#post-comments-${data.data.comment.post}`).prepend(newComment);
                    deleteComment($(' .com-del',newComment));
                    new Noty({
                        theme:'relax',
                        text: 'comment created',
                        type:'success',
                        layout:'topCenter',
                        timeout:1500
                    }).show();
                },
                error:function(error){
                    console.log(error.responseText);
                    new Noty({
                        theme:'relax',
                        text: 'Error in adding comment',
                        type:'error',
                        layout:'topCenter',
                        timeout:1500
                    }).show();
                }
            });
        });
    };
    //displaying the new post in dom
    let newCommentDom=function(comment,userName){
        return $(`<li id="comment-${comment._id}">
            <a class="com-del" href="comment/destroy/${comment._id}">X</a>
        <p>${comment.content}</p>
        <small>${userName}</small>
        </li>`);
    }
    //delete comments dynamically
    let deleteComment=function(del_Link){
        $(del_Link).click(function(e){
            e.preventDefault();
            console.log('in del com');
            $.ajax({
                type:'get',
                url:$(del_Link).prop('href'),
                success:function(data){
                    console.log(data);
                    $(`#comment-${data.data.comment_id}`).remove();
                    new Noty({
                        theme:'relax',
                        text: 'comment deleted',
                        type:'success',
                        layout:'topCenter',
                        timeout:1500
                    }).show();
                },
                error:function(error){
                    console.log(error.responseText);
                    new Noty({
                        theme:'relax',
                        text: 'Error in deleting comment',
                        type:'error',
                        layout:'topCenter',
                        timeout:1500
                    }).show();
                }
            });
        });
    };
    //adding comment form method for all forms under posts
    let commentFormList=$('.new-comment-form');
    for(cf of commentFormList){
        //console.log(cf,typeof cf);
        createComment($(cf));
    }
    let commentDelLinks=$('.com-del');
    for(cmdl of commentDelLinks){
        deleteComment(cmdl);
    }
