$(".add-remove-friend").on("click",(function(){let e=$(this).attr("id").slice(4),t=$(this);$.ajax({type:"post",url:`/friends/toggle/?profile=${e}`,data:"",success:function(e){e.data.add?t.text("Remove from friend list"):t.text("Add to friend list")},error:function(e){console.log(e.responseText),new Noty({theme:"relax",text:"Error in toggling friend",type:"error",layout:"topCenter",timeout:1500}).show()}})}));