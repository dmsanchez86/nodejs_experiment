$('#form_register').unbind('submit').submit(function(e){
    e.preventDefault();
    
    var $username = $('#name').val();
    var $email = $('#email').val();
    var $password = $('#password').val();
    
    $.ajax({
        url: "add_user",
        type: "POST",
        data: {
            username: $username,
            email: $email,
            password: $password
        },
        success: function(res){
            var $response = (res);
            
            if($response.status){
                $('#name').val("");
                $('#email').val("");
                $('#password').val("");
            }
            
            alert($response.message);
        }
    });
});