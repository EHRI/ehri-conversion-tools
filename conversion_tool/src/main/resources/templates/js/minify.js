$(document).ready(function(){function a(){$("#submit_transform").prop("disabled",!0)}function b(){$("#submit_transform").prop("disabled",!1)}function c(){var a=$("#main-inner").innerHeight(),b=a/2-50;$(".loader").css({height:a+"px"}),$(".loader_img").css({"margin-top":b+"px"}),$(".loader").show()}function d(){var a=$("#incomesource").val(),c=$("#outcomesource").val();""!=a&&""!=c&&b()}$("#google").click(function(){$(".google, #submit_transform").slideDown(300),$(".local").slideUp(300),a()}),$("#local").click(function(){$(".google").slideUp(300),$(".local , #submit_transform").slideDown(300),a()}),$("#spreadsheet_link").change(function(){var a=$("#spreadsheet_link").val();""!=a&&b()}),$("#submit_transform").click(function(){event.preventDefault(),c(),setTimeout(function(){if($(".source, .google, .local, #submit_transform, .loader").hide(),$(".success_notes").slideToggle("fast"),$("#google").is(":checked")){var a=$("#spreadsheet_link").val();$("<iframe />",{name:"google-iframe",id:"google-iframe",src:a}).appendTo("#iframe_holder"),$("#google-iframe").slideDown(300)}},3e3)}),$("#income_location_btn").click(function(){$("#incomesource").click()}),$("#incomesource").change(function(){var a=$("#incomesource").val();document.getElementById("fakeincomesource").value=a,d()}),$("#outcome_location_btn").click(function(){$("#outcomesource").click()}),$("#outcomesource").change(function(){var a=$("#outcomesource").val();document.getElementById("fakeoutcomesource").value=a,d()})});