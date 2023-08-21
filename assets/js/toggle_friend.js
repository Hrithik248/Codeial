$('.add-remove-friend').on('click',function(){
    let profileId=$(this).attr('id').slice(4);
    //console.log(profileId);
    let crThis=$(this);
    $.ajax({
        type:'post',
        url:`/friends/toggle/?profile=${profileId}`,
        data:'',
        success:function(data){
            //console.log(data,$(this),crThis);
            if(data.data.add){
                crThis.text('Remove from friend list');
            }
            else{
                crThis.text('Add to friend list');
            }
        },
        error:function(error){
            console.log(error.responseText);
            new Noty({
                theme:'relax',
                text: 'Error in toggling friend',
                type:'error',
                layout:'topCenter',
                timeout:1500
            }).show();
        }
    });
});