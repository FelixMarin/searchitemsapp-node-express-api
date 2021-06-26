jQuery(document).ready(function ($) {
 let tab = $(".tabs h3 a");
  
 tab.on("click", function (event) {
    event.preventDefault();
    tab.removeClass("active");
    $(this).addClass("active");

    let tab_content = $(this).attr("href");
    $('div[id$="tab-content"]').removeClass("active");
    $(tab_content).addClass("active");
  });
});

$( ".inclass").on("click", function(event) {
  event.preventDefault();

  if(mailExists()) {
    alert('Usuario o contraseña no validos');
    return;
  }

  let user = {
    "username": $('#user_name').val(),
    "password": $('#user_pass_signup').val(),
    "email": $('#user_email').val(),
    "role": "USER"
  };

  $.ajax({
		contentType: 'application/json',
		data: JSON.stringify(user),
		async: false,
    cache: false,
    timeout: 30000,
		success: function(data){
      console.log(data);
      alert('New user added');
		},
		error: function(xhr, textStatus, error){
            console.log(xhr.responseText);
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
    },
		processData: false,
		url: 'http://localhost:3000/user/',
		type: 'POST'
  });
});

function mailExists() {

  let isEmail = false;

  $.ajax({
    url : "/user/" + $('#user_email').val(),
    type: "GET",    
    async: false,
    success: function(data, textStatus, xhr) {
      isEmail = (data == true);
    },
    error: function(xhr) {      
      alert('Error al consultar el email');
    }
});  

return isEmail;
}

